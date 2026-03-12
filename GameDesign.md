# Renegade Legion: Leviathan — Game Design (Dual-Phase)

## Phase Structure

### 1. Planning Phase
- Set **movement** by dragging the **ghost** (end position); rotation via wheel or roll.
- **Task ships and missiles**: assign targets, launch orders, special orders for weapons.
- Assign **special orders** to weapons (e.g. broadside/spinal → point defense mode).
- When **all ships have been tasked**, the player advances to the execution phase (no separate Movement/Fighter/Firing sub-phases).

### 2. Execution Phase
- Plays out over **5 seconds** in real time.
- Ships move along their planned paths; all tasked actions resolve (movement, missile launches, broadsides, point defense, etc.).
- At the end of the 5 seconds the game **pauses**.
- Player options: **Replay** (re-run the same 5-second execution) or **Advance** (go to the next planning phase / next turn).

---

## Energy System (per ship)

- **Default:** 6 energy points per ship per turn.
- **Run reactor hot:** +1 energy; 20% chance to **permanently** reduce reactor output (e.g. 6 → 5 the first time).

### Thrust (energy cost)
| Setting      | Energy |
|-------------|--------|
| 0 Thrust    | 0      |
| Half Thrust | 1      |
| Full Thrust | 2      |
| +50% Thrust | 4      |
| Double Thrust | 6    |

### Shields (energy cost)
| Setting    | Energy |
|-----------|--------|
| Zero      | 0      |
| Half      | 1      |
| Full      | 2      |
| +50%      | 4      |
| +100%     | 6      |
| **Refocus** | +50% in one arc, −50% in all others (cost TBD or 0 if reallocation only) |

### Weapons (energy cost)
- **Fore/aft broadsides:** Autofire costs **0 energy** (always available).
- **Broadside or spinal mount fire (activated):** **2 energy** each (e.g. both broadsides = 4 energy).

---

## Point Defense

- **Auto-fires** by default.
- **Modes:**
  - **Point:** Only defends its own ship.
  - **Area:** Prioritizes own ship, but also engages missiles and fighters moving nearby.
  - **Off:** Can be switched off if power is short (e.g. due to damage).

---

## Weapons and Special Options

- **Missiles:** A ship can **always launch missiles** if a target is assigned (no energy cost for launch; may use ammo).
- **Broadsides (fore/aft):** Always autofire at **0 energy**.
- **Broadside or spinal in PD mode:** Weapon is switched to point defense; engages missiles and fighters, **closest enemy first**. Uses normal to-hit chance; typically deals overkill damage.
- **Spinal mount:** Firing costs **2 energy** (same as broadside activation when not in autofire).

---

## Summary Table: Energy Costs

| System        | Option        | Energy |
|--------------|---------------|--------|
| Thrust       | 0 / Half / Full | 0 / 1 / 2 |
| Thrust       | +50% / Double | 4 / 6 |
| Shields      | 0 / Half / Full | 0 / 1 / 2 |
| Shields      | +50% / +100%  | 4 / 6 |
| Broadsides (fore/aft) | Autofire | 0 |
| Broadside / Spinal (fired) | Per activation | 2 each |
| Reactor hot  | +1 energy     | 20% chance permanent −1 max |

---

## Fighters

- **Flights:** Fighters are grouped into **flights** (squadrons). Missions are assigned to the flight.
- **Planning phase:** Select flights from the **hangar** and assign a **mission**. Some missions (e.g. **Attack**, **Intercept**) require a **target** — click **LMB on the enemy ship** to set it.
- **Loadout:** When you select a mission onboard ship, the flight receives the **designated loadout** for that mission. Loadout **cannot be changed in flight**.
- **Execution phase:** Flights with an assigned mission **launch automatically** at the start of the 5-second execution. They follow their mission during the turn.
- **Return:** Flights return to the ship when: **out of ordnance**, **low fuel** (bingo), or **mission objective complete**.
- **Change mission in flight:** You can **click on a deployed flight** (on the map) to select it and **change its mission** (target can be updated). Loadout remains fixed.
- **Pilots/crew:** Each pilot is assigned to a fighter and stays with it. If **their fighter is destroyed**, the pilot has a **50% chance** of surviving and returning to the ship (and being assigned a new fighter later). If **all fighters in the flight are destroyed**, **all crew in that flight are KIA**.

---

## Crew skill (stations)

- Each **crew station** (weapons, engines, sensors, etc.) has a **required skill** level.
- A crew member assigned to that station has a **skill level** (e.g. Green, Regular, Veteran, Ace, Elite).
- **High skill** (above required): small but **non-negligible bonus** to that system.
- **Low skill** (below required): small but **non-negligible penalty**.
- The **required skill for a station** **slowly increases over time** when a crew member is on that station (e.g. +0.02 per turn).
- At scenario start, each station’s crew grade is randomized with a **d100**:
  - **01–70** → Regular
  - **71–90** → Veteran
  - **91–00** → Ace

### Station list (abstracted bridge crew)

- **Tactical (Spinal)**: Affects **spinal mount hit chance** and criticals.
- **Tactical (Broadsides)**: Affects **broadside laser hit chance** and salvo cohesion.
- **Tactical (Missiles)**: Affects **missile hit chance** and salvo composition reliability.
- **Tactical (Shields)**: Affects **shield strength, refocus efficiency, and regen**.
- **Tactical (Point Defense)**: Affects **PD intercept chance** and reaction.
- **Tactical (Sensors)**: Affects **sensor detection and identification ranges**.
- **Tactical (Electronic Warfare)**: Affects **ECM/ECCM effectiveness**, hacking, and EW defense.
- **Tactical (Flight Ops)**: Affects **fighter & drone launch/return tempo** and retask reliability.
- **Damage Control**: Affects **repair rate** and chance to contain/clear critical hits.
- **Engineering (Power)**: Affects the **10% extra energy roll** per turn.
- **Engineering (Drives)**: Affects the **10% free thrust roll** per turn and maneuver safety.
- **Command & Coordination**: Small global bonus; improves chances when multiple systems are stressed in the same turn.

---

## Drones

Drones are **semi-autonomous swarms** that sit between missiles and fighters:

- **General traits:**
  - **Slower than fighters**, but faster than missiles in terms of reaction time.
  - **More endurance than missiles**, less endurance than fighters.
  - Operate as **flights** (like fighters) and are controlled via **Flight Ops** (with control limits).

### Drone types

- **AKV – Autonomous Kill Vehicle**
  - Role: **Strike drone / unmanned fighter**.
  - Medium thrust, medium endurance.
  - Can perform **ATTACK** missions against ships like a light fighter.

- **ASP – Autonomous Sensor Platform (Recon Drone)**
  - Role: **Remote sensor node and target painter**.
  - Lower thrust, higher sensor rating, moderate endurance.
  - When on an ATTACK mission with a target:
    - Acts as a **forward sensor**, improving detection/ID around the target.
    - “**Paints**” the target: each ASP painting a ship gives a small **to-hit bonus** to allied attacks, capped globally.

- **Stinger Drone**
  - Role: **Rapid-fire coilgun PD / harassment**.
  - Short range, high rate of fire.
  - Bolsters **point defense** and can chip light armor on ATTACK missions.

- **Laser Drone**
  - Role: **Light laser platform**.
  - Moderate thrust and endurance.
  - Provides extra **beam fire** (either PD or light anti-ship support).

- **Interceptor Drone**
  - Role: **High-thrust kamikaze unit**.
  - Very fast, low endurance.
  - Executes **ramming attacks** against missiles, fighters, or ships; resolved like a smart missile.

---

## Turn sequence (Dual-Phase)

1. **Planning Phase**
   - Select ships; **drag ghost** to set movement and rotation.
   - Assign:
     - Ship **thrust & shield** settings (6-point energy),
     - **Weapons**, missiles, special orders (PD mode, reactor hot, etc.),
     - **Fighter & drone missions** (from hangar), with targets for missions that need them.
   - Confirm orders per ship; when all are confirmed, click **Execute Turn**.

2. **Execution Phase (5 seconds real-time)**
   - All ships move along their planned paths (with smooth animation).
   - Fighters and drones with missions **launch automatically** and execute those missions.
   - All tasked actions resolve:
     - Missiles, lasers, spinals, PD, EW, fighters, and drones (including ASP painting).
   - Fuel/ordnance consumed; squadrons hitting bingo fuel, out of ordnance, or with destroyed targets are marked **RETURNING**.
   - At the end of 5 seconds, the game **pauses**:
     - You may **Replay** the execution or **Advance** to the next Planning Phase.

3. **Advance to next turn**
   - **RETURNING** flights are brought back to **HANGAR**.
   - Systems may recover (EW-disabled systems re-activate).
   - Reactor-hot ships roll for permanent reactor degradation.
   - The cycle returns to **Planning** for the next turn.
