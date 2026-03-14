# Renegade Legion: Leviathan
## Detailed Features and Rules Summary

> **Canonical turn structure for this build:** The game uses the **dual-phase** model from **GameDesign.md** (Planning → 5s Execution, then Replay or Advance). This document's §1 (6-phase system) is legacy/reference; the implementation follows GameDesign.

---

## 1. Turn Structure (6-Phase System — legacy reference)

Each turn is divided into six phases, executed in order:

| Phase | Name | Purpose |
|-------|------|---------|
| 0 | **Planning Phase** | Issue movement orders to all ships, configure sensors, set speed/course changes |
| 1 | **Movement Phase** | All ships execute their confirmed movement orders simultaneously |
| 2 | **Fighter Phase** | Issue fighter squadron orders (launch/recall) |
| 3 | **Fighter Movement Phase** | Fighters execute movement (thrust RU/turn) |
| 4 | **Firing Phase** | Energy weapons, missile salvos, and point defense fire |
| 5 | **Resolution Phase** | Damage applied, critical hits resolved, status updates, ship recovery |

**Command Points:** Players receive Command Points each turn (typically 3). These govern special actions and coordination.

---

## 2. Movement System

### Units
- **RU (Range Units):** Standard distance measure on the tactical map
- **Facing:** Ship orientation in degrees (0° = up, 90° = right, 180° = down, 270° = left)

### Movement Orders (Planning Phase)
- **Speed Change:** -2, -1, +1, +2 (thrust points per turn)
- **Course Change:** -45°, -15°, +15°, +45°
- **Special Maneuvers:**
  - **Flip Ship:** Reverse heading 180°
  - **Roll Ship:** Evasive maneuver (temporary defense bonus until next turn)

### Execution
- Movement uses `Coordinates.toCartesian(speed, facing)` to convert thrust + bearing into position delta
- All player ships must have **confirmed orders** before advancing from Planning
- Orders are executed **simultaneously** for all ships in Movement Phase

---

## 3. Ship Classes and Factions

### Commonwealth Fleet (Renegade Legion)
| Class | Size | Thrust | Max Speed | Turn Rate | Fighters | Role |
|-------|------|--------|-----------|-----------|----------|------|
| Shiva Superdreadnought | 15 | 1 | 4 | 15° | 72 | Fleet flagship, massive broadside firepower |
| Leviathan Battleship | 8 | 3 | 9 | 30° | 24 | Heavy assault |
| Excalibur Battle Cruiser | 7 | 5 | 15 | 45° | 18 | Fast heavy combat |
| Centurion Heavy Cruiser | 5 | 8 | 24 | 90° | 6 | Line cruiser |
| Ranger Light Cruiser | 4 | 10 | 30 | 120° | 0 | Scout/interceptor |
| Javelin Destroyer | 3 | 12 | 36 | 150° | 0 | Escort |
| Falcon Frigate | 2 | 15 | 45 | 180° | 0 | Light escort |
| Viper Corvette | 1 | 18 | 54 | 240° | 0 | Patrol |

### TOG Empire Fleet
| Class | Size | Thrust | Max Speed | Fighters | Notes |
|-------|------|--------|-----------|----------|------|
| Imperator Superdreadnought | 16 | 1 | 3 | 96 | Twin Type E spinal mounts |
| Devastator Battleship | 8 | 2 | 6 | 24 | Heavy armor |
| Marauder Battle Cruiser | 7 | 4 | 12 | 18 | Strike cruiser |
| Oppressor Heavy Cruiser | 5 | 8 | 24 | 6 | TOG line cruiser |
| Subjugator Light Cruiser | 4 | 10 | 30 | 0 | Light cruiser |
| Reaper Destroyer | 3 | 12 | 36 | 0 | Destroyer |
| Scorpion Frigate | 2 | 15 | 45 | 0 | Frigate |
| Venom Corvette | 1 | 18 | 54 | 0 | Corvette |

### Ship Statistics (per class)
- **Size:** Affects hull points (≈ size × 5), target profile, detection
- **Shields:** Fore and aft flicker shield ratings
- **Turrets:** Port and starboard point defense / anti-missile
- **EW:** Electronic warfare rating (ECM/ECCM)
- **Armor:** Front and rear armor values (X/Y format)
- **Crew Quality:** Elite (+20%), Veteran (+10%), Regular (0%), Green (-10%)
- **Marines:** 15% of total crew for boarding actions

---

## 4. Weapon Systems

### Laser Weapons (X/Y Format)
X = Range factor, Y = Damage factor. Converted to game values:

| X Value | Max Range (RU) | Y Value | Damage |
|---------|----------------|---------|--------|
| 37.5 | 20 | 25 | 5 |
| 30 | 16 | 20 | 4 |
| 22.5 | 12 | 15 | 3 |
| 15 | 8 | 10 | 2 |
| 7.5 | 4 | 5 | 1 |

### Laser Range Bands (To Hit % / Damage %)
| Range | To Hit | Damage |
|-------|--------|--------|
| 0–25% of max | 90% | 100% |
| 26–50% | 70% | 75% |
| 51–75% | 50% | 50% |
| 76–100% | 30% | 25% |
| Out of range | 0% | 0% |

### Spinal Mounts
- **Ignore shields** completely
- **No range damage modifier** (always full damage)
- **Range bands (To Hit only):** 0–25%: 70%, 26–50%: 50%, 51–75%: 30%, 76–100%: 10%

| Type | Range (RU) | Damage |
|------|------------|--------|
| Type A | 80 | 120 |
| Type B | 120 | 160 |
| Type C | 160 | 200 |
| Type D | 200 | 220 |
| Type E | 16 | 240 |

### Missiles (To Hit % / Range / Damage)
| Type | To Hit | Range (RU) | Damage |
|------|--------|------------|--------|
| Standard | 90% | 25 | 3 |
| Type E | 90% | 35 | 6 |
| Hunter-Killer | 95% | 30 | 3 |

### Weapon Arcs
| Arc | Angle | Direction |
|-----|-------|-----------|
| Spinal | 30° | Forward cone |
| Fore | 90° | Forward |
| Aft | 90° | Rear |
| Port Broadside | 90° | Left |
| Starboard Broadside | 90° | Right |
| Port Turrets | 180° | Left hemisphere |
| Starboard Turrets | 180° | Right hemisphere |

---

## 5. Combat Modifiers

| Modifier | Effect |
|----------|--------|
| **Target Size** | +(target size − 5) × 3% to hit |
| **Shields** | −1% per shield point (lasers only; spinal ignores) |
| **Course Angle** | Tailing +10%, Beam +0%, Bow −20%, Head-on −10% |
| **Crew Quality** | Green −5%, Regular 0%, Veteran +5%, Elite +10%, Legendary +15% |
| **Jinking** | Target jinking −20%, Attacker jinking −10% |
| **Ace Gunnery** | +10% |
| **ECM/ECCM** | −target ECM + attacker ECCM |
| **Dust Clouds** | −10% hit and damage per RU |
| **Asteroid Fields** | −10% hit per RU (no damage penalty) |
| **Missiles:** | Same jinking, turret, ECM/ECCM, terrain rules as lasers |

### Critical Hits
- Roll ≤ 1/5 of target number = **double damage**
- Critical Hit Table (1–20): Effects include crew casualties, shield damage, engine damage, weapon loss, fires, catastrophic damage, hull breach, magazine explosion, bridge hit, comms failure, life support, gravity loss, chain reaction, ship destroyed

### Shield Degradation
- Flicker shields reduce effectiveness each time they absorb damage

---

## 6. Energy Management

- **Energy Generation:** Per ship (e.g., Shiva: 150,000)
- **Power Banks:** Stored reserve (e.g., 15,000)
- **Energy Demand:** Sum of weapons, shields, engines, sensors
- **Allocation:** Sliders for fore/aft shields, port/starboard turrets
- **Weapon Costs:** Per shot (e.g., Type E Spinal: 200, 37.5/25 Laser: 8 per gun)

---

## 7. Missile Systems

### Loadout
- Configure missile types before battle (Standard, Type E, etc.)
- **Salvo Limit:** Max missiles per salvo (varies by ship)
- **Allocation:** Assign missiles to salvo vs. reserve

### Defense
- **Laser Defense:** Allocate port/starboard lasers vs. incoming missiles
- **Turret Score:** Target’s facing turrets reduce missile hit chance

---

## 8. Fighter Operations

### Fighter Classes
| Type | Role | Squadron Size | Max Speed | Armor | Weapons |
|------|------|---------------|-----------|-------|---------|
| Avenger | Heavy Fighter | 12 | 40 | 2 | 2 light, 4 missiles |
| BumbleBee | Interceptor | 16 | 50 | 1 | 1 light, 2 missiles |
| Gladius | Strike | 8 | 35 | 3 | 1 medium, 6 missiles, 2 torpedoes |

### Rules
- **Movement:** Thrust RU per turn
- **Dogfight:** Within 2 RU
- **Anti-Ship:** 90% effectiveness = Turrets + Pilot (degradation after combat)
- **Landing:** Must be within 2 RU of carrier
- **Auto-Return:** When ineffective (damage threshold)
- **Formations:** Combat Spread, Line Ahead, Defensive Ball, Attack Formation
- **Launch Rate:** Per turn (e.g., Shiva: 6 squadrons/turn = 36 fighters)

### Ace Pilot Abilities
- **TOP_GUN:** +40% effectiveness
- **BOMBER_ACE:** +50% for strike/bomber types
- **FLIGHT_LEADER:** +20% effectiveness

---

## 9. Sensors and Detection

### Sensor Modes
- **Active:** Best range, reveals position to enemy
- **Passive:** Medium range, stealthier
- **Silent:** Shortest range, minimal signature

### Detection Formula
- **Sensor Range:** Base × size modifier × (1 + EW modifier) × crew quality modifier
- **Signature:** Base (size × 2) × speed modifier × EW masking × stealth modifier
- **Detection:** Sensor range × (target signature / 10) ≥ range to target

### Sensor Operations
- **Sensor Sweep:** Refresh contacts
- **Stealth Toggle:** Reduce signature (slower, less detectable)
- **EW Jam:** Disrupt enemy sensors in range

---

## 10. Terrain

| Terrain | Features | Effects |
|---------|----------|---------|
| **Open Space** | None | None |
| **Asteroid Field** | Large asteroids | −10% hit per RU (no damage penalty) |
| **Dust Storm** | Cosmic dust | −10% hit and damage per RU |
| **Ion Nebula** | Gas clouds, storms | Reduced visibility, EW effects |
| **Gravitational Maelstrom** | Multiple black holes | Gravity wells, pull effects |
| **Event Horizon** | Supermassive black hole | Extreme gravity, debris |
| **Void Hunters** | Micro singularity, wreckage | Mixed effects |

---

## 11. Battle Scenarios

| Scenario | Terrain | Time Limit | Focus |
|----------|---------|------------|-------|
| **Fleet Engagement** | Open Space | 12 | Head-to-head fleet battle |
| **Asteroid Ambush** | Asteroid Field | 10 | Ambush in asteroids |
| **Convoy Escort** | Dust Storm | 8 | Protect transports |
| **Nebula Patrol** | Nebula | 15 | Search and destroy |
| **The Maelstrom Incident** | Maelstrom | 12 | Survive black holes |
| **Event Horizon** | Event Horizon | 10 | Combat near singularity |
| **Void Hunters** | Void Hunters | 15 | Secure artifact |

### TOG vs. Commonwealth Scenarios
- Pre-built fleet matchups for TOG vs. Commonwealth
- Faction-specific tactical notes (e.g., Commonwealth: use shields and long range; TOG: close and use armor)

---

## 12. Boarding System

- **Engagement Range:** Ships must be within 2 RU
- **Marines:** 15% of crew available for boarding
- **Assault Shuttles:** Can deliver marines to adjacent ships
- **Withdraw:** Option to break off boarding action
- **Remote Boarding:** Marines from assault shuttles counted separately

---

## 13. Damage and Critical Hits

### Hull Points
- **Max Hull:** Typically size × 5
- **Status:** READY → ORDERS_SET → MOVED → FIRED → DESTROYED

### Critical Hit Table (20 results)
- Minor: Superficial, crew casualties, shield damage, maneuvering
- Moderate: Engine, weapons, fire control, sensors, comms, gravity
- Major: Shield overload, fire/overheat, hull breach, bridge, life support
- Critical: Catastrophic, magazine explosion, secondary explosion, ship destroyed

### System Damage
- **Ship System Manager:** Tracks damage to bridge, weapons, engines, shields, sensors
- **Effectiveness Loss:** Damaged systems reduce output (e.g., thrust, weapons)
- **Repair:** Chance each turn based on critical type

---

## 14. UI Controls Summary

| Control | Action |
|---------|--------|
| **Next Phase** | Advance to next phase |
| **New Battle** | Start new scenario (Fleet Engagement default) |
| **Reset Camera (C)** | Center and reset zoom |
| **Combat Rules** | Open rules reference window |
| **Left-click ship** | Select ship, show orders/weapons panel |
| **Mouse wheel** | Zoom in/out |
| **D** | Debug info |
| **V** | Force render |

### Phase-Dependent Panels
- **Planning:** Ship orders, sensor config, order progress
- **Fighter:** Fighter setup, launch/recall
- **Firing:** Weapons, targets, missiles, point defense

---

## 15. Game State

- **Turn / Current Turn:** Kept in sync
- **Phase / Current Phase:** Phase name (string) and index (0–5) synchronized
- **Command Points:** Refreshed each turn
- **Ship Orders:** Map of ship ID → orders (speed, facing, maneuvers)
- **Order Confirmation:** Each ship must confirm before phase advance

---

*Based on the Renegade Legion: Leviathan tabletop game by FASA Corporation. This document describes the implementation in the browser-based computer game.*
