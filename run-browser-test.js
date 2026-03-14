/**
 * Run the game in a headless browser, perform basic "computer use" actions,
 * capture window.__gameErrors and page errors, write to game-errors.log
 * Requires: npm install (or npm install playwright), then start server (npm run server) in another terminal, then node run-browser-test.js
 */
const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'game-errors.log');

async function main() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('Playwright not installed. Run: npm install');
    process.exit(1);
  }
  const log = [];
  function out(msg) {
    console.log(msg);
    log.push(msg);
  }
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('dialog', (dialog) => { try { dialog.accept(); } catch (_) {} });
  const errors = [];
  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', message: err.message, stack: err.stack });
  });
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || text.includes('[GameError]')) {
      errors.push({ type: 'console', level: type, text });
    }
  });
  try {
    out('Navigating to http://localhost:8765 ...');
    await page.goto('http://localhost:8765', { waitUntil: 'domcontentloaded', timeout: 15000 });
    out('Page loaded. Waiting 2s for scripts...');
    await page.waitForTimeout(2000);
    out('Clicking New Battle...');
    await page.locator('button[data-action="startNewBattle"]').or(page.getByRole('button', { name: /New Battle/i })).first().click().catch(() => {});
    await page.waitForTimeout(1500);
    out('Clicking first ship...');
    await page.locator('.ship-item').first().click().catch(() => {});
    await page.waitForTimeout(800);
    // PD mode and Refocus shields (design-gap validation)
    out('Setting PD mode to Area and Refocus Fore...');
    await page.locator('#pdAreaBtn').click().catch(() => {});
    await page.waitForTimeout(200);
    await page.locator('#refocusForeBtn').click().catch(() => {});
    await page.waitForTimeout(200);
    const pdRefocusOk = await page.evaluate(() => {
      const s = typeof gameState !== 'undefined' && gameState.selectedShip;
      return s ? { pd: s.pointDefenseMode === 'area', refocus: s.refocusShields === 'fore' } : null;
    }).catch(() => null);
    if (pdRefocusOk) out('PD/Refocus state: ' + JSON.stringify(pdRefocusOk));

    // --- Missile panel: set target and salvo BEFORE Execute Turn so VLS can fire during execution ---
    out('Setting missile target and salvo for selected ship...');
    const missileSetup = await page.evaluate(() => {
      try {
        if (typeof gameState === 'undefined' || !gameState.ships) return { ok: false, reason: 'no-gameState' };
        const player = gameState.ships.find(s => s.team === 'player');
        const enemy = gameState.ships.find(s => s.team === 'enemy');
        if (!player || !enemy) return { ok: false, reason: 'no-player-or-enemy' };
        gameState.selectedShip = player;
        if (typeof selectShip === 'function') selectShip(player);
        player.missileTargetId = enemy.id;
        player.missileSalvoType = 'STANDARD';
        player.missilePanelMode = 'standard';
        const hasInterceptor = player.missileManager && (player.missileManager.currentMissiles && player.missileManager.currentMissiles.INTERCEPTOR) > 0;
        return { ok: true, missileTargetId: player.missileTargetId, hasInterceptor };
      } catch (e) {
        return { ok: false, reason: (e && e.message) || 'exception' };
      }
    }).catch(() => ({ ok: false, reason: 'eval-failed' }));
    out('Missile setup: ' + JSON.stringify(missileSetup));

    out('Clicking Execute Turn (first turn)...');
    await page.locator('#nextPhaseBtn').or(page.getByRole('button', { name: /Execute Turn/i })).first().click().catch(() => {});
    // Allow execution phase (nominally 5s) to play out so VLS and inFlightMissiles advance
    await page.waitForTimeout(5500);

    const afterFirstExec = await page.evaluate(() => {
      const g = typeof gameState !== 'undefined' ? gameState : null;
      if (!g) return { inFlight: -1, spinal: -1 };
      return {
        inFlight: Array.isArray(g.inFlightMissiles) ? g.inFlightMissiles.length : -1,
        spinal: Array.isArray(g.spinalProjectiles) ? g.spinalProjectiles.length : -1
      };
    }).catch(() => ({}));
    out('After first execution (inFlightMissiles/spinal): ' + JSON.stringify(afterFirstExec));

    // --- Save / Load flow (includes inFlightMissiles, pdHeat, foreShieldPercent) ---
    out('Saving game after first execution...');
    await page.locator('button[data-action="saveGame"]').or(page.getByRole('button', { name: /Save Game/i })).first().click().catch(() => {});
    await page.waitForTimeout(800);

    out('Reloading page to test load...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    out('Clicking Load Game...');
    await page.locator('button[data-action="loadGame"]').or(page.getByRole('button', { name: /Load Game/i })).first().click().catch(() => {});
    await page.waitForTimeout(1500);

    // --- Post-load: verify inFlightMissiles and ship PD/shield state if present in save ---
    const loadState = await page.evaluate(() => {
      const g = typeof gameState !== 'undefined' ? gameState : null;
      if (!g) return { ok: false };
      const first = (g.ships || [])[0];
      return {
        ok: true,
        inFlightMissilesLength: Array.isArray(g.inFlightMissiles) ? g.inFlightMissiles.length : -1,
        spinalProjectilesLength: Array.isArray(g.spinalProjectiles) ? g.spinalProjectiles.length : -1,
        shipPdHeat: first ? first.pdHeat : null,
        shipForeShield: first ? first.foreShieldPercent : null
      };
    }).catch(() => ({ ok: false }));
    out('After load state: ' + JSON.stringify(loadState));

    // --- Weapons UI flow ---
    out('Selecting first ship after load (if any)...');
    await page.locator('.ship-item').first().click().catch(() => {});
    await page.waitForTimeout(800);

    out('Attempting basic weapons fire UI flow...');
    await page.getByRole('button', { name: /Refresh Targets/i }).click().catch(() => {});
    await page.waitForTimeout(800);
    const hasTarget = await page.locator('.target-item').first().isVisible().catch(() => false);
    if (hasTarget) {
      await page.locator('.target-item').first().click().catch(() => {});
      await page.waitForTimeout(300);
      const hasWeapon = await page.locator('#weaponBatteries .weapon-battery').first().isVisible().catch(() => false);
      if (hasWeapon) {
        await page.locator('#weaponBatteries .weapon-battery').first().click().catch(() => {});
        await page.getByRole('button', { name: /Fire Selected/i }).click().catch(() => {});
      }
    }

    // --- Fighters / drones flow ---
    out('Configuring fighters for a carrier if available...');
    await page.evaluate(() => {
      try {
        if (typeof gameState === 'undefined') return 'no-gameState';
        const ships = Array.isArray(gameState.ships) ? gameState.ships : [];
        const carrier = ships.find(s => s.team === 'player' && s.fighterManager && Array.isArray(s.fighterManager.squadrons) && s.fighterManager.squadrons.length > 0);
        if (!carrier) return 'no-carrier';

        gameState.selectedShip = carrier;
        if (typeof selectShip === 'function') selectShip(carrier);
        if (typeof openFighterSetup === 'function') openFighterSetup();
        if (typeof toggleFighterOps === 'function') toggleFighterOps();

        const manager = carrier.fighterManager;
        if (!manager || !Array.isArray(manager.squadrons) || manager.squadrons.length === 0) return 'no-squadron';
        const sq = manager.squadrons[0];

        const missions = typeof FIGHTER_MISSIONS !== 'undefined' ? Object.keys(FIGHTER_MISSIONS) : [];
        if (!missions.length) return 'no-mission-defs';
        const missionKey = missions.find(k => !FIGHTER_MISSIONS[k].needsTarget) || missions[0];
        if (!missionKey) return 'no-mission';

        if (typeof manager.assignMission === 'function') {
          manager.assignMission(sq.id, missionKey, null);
        }
        return 'ok';
      } catch (e) {
        if (typeof window !== 'undefined' && window.__gameErrorPush) {
          window.__gameErrorPush({ type: 'test-fighter-setup', message: e.message, stack: e.stack });
        }
        return 'error';
      }
    }).catch(() => 'eval-failed');

    // Crew/stations: ensure selected ship has crewStations and engineering bonuses can exist after advance
    out('Checking crew stations and engineering bonuses...');
    const crewCheck = await page.evaluate(() => {
      const s = typeof gameState !== 'undefined' && gameState.ships && gameState.ships[0];
      if (!s) return 'no-ship';
      const hasStations = !!s.crewStations && Object.keys(s.crewStations).length > 0;
      const hasPowerBonus = '_engineeringPowerBonus' in s;
      const hasDrivesBonus = '_engineeringDrivesBonus' in s;
      return { hasStations, hasPowerBonus, hasDrivesBonus };
    }).catch(() => 'eval-fail');
    out('Crew/engineering check: ' + JSON.stringify(crewCheck));

    // Execute another turn so save/load + fighters + weapons paths are exercised
    out('Clicking Execute Turn (second turn after load)...');
    await page.locator('#nextPhaseBtn').or(page.getByRole('button', { name: /Execute Turn/i })).first().click().catch(() => {});
    await page.waitForTimeout(5500);

    out('Collecting errors...');
    const fromWindow = await page.evaluate(() => {
      return typeof window.__gameErrors !== 'undefined' ? JSON.stringify(window.__gameErrors) : '[]';
    }).catch(() => '[]');
    let fromWindowArr = [];
    try {
      fromWindowArr = JSON.parse(fromWindow);
    } catch (_) {}
    const allErrors = [...errors, ...fromWindowArr.map(e => ({ type: 'window.__gameErrors', ...e }))];
    out('');
    out('--- Captured errors ---');
    if (allErrors.length === 0) {
      out('No errors captured.');
    } else {
      allErrors.forEach((e, i) => out(JSON.stringify(e, null, 2)));
    }
    out('');
    out('--- Summary ---');
    out(allErrors.length === 0 ? 'PASS: No errors.' : 'FAIL: ' + allErrors.length + ' error(s) captured.');
  } catch (e) {
    out('Run error: ' + e.message);
    out(e.stack);
  } finally {
    await browser.close();
  }
  fs.writeFileSync(LOG_FILE, log.join('\n'), 'utf8');
  console.log('\nLog written to ' + LOG_FILE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
