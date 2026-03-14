# Renegade Legion: Leviathan — Logged Design Gaps & Plan

This document lists known simplifications, unimplemented design items, and gaps between **GameDesign.md** / **FEATURES_AND_RULES.md** and the current implementation. Each is tagged so we can track and address them.

---

## Implemented (Phases A → E)

- **Phase A:** Removed dead `RANGE_BANDS_SIMPLE` and `getRangeBand`. Added canonical turn-structure note to FEATURES_AND_RULES.md (dual-phase = GameDesign).
- **Phase B:** Damage Control station multiplies repair chance (auto and manual). Required skill drift applied each turn in `advanceToPlanning` (cap 1.5). Shields, Sensors, EW, Broadsides, Flight Ops stations wired: getEffectiveShieldValue (shields), calculateSensorRange (sensors), ECM/ECCM in laser/spinal/missile to-hit (ew), broadside vs gunnery station for lasers (broadsides), performAntiShipAttack (flightOps). Engineering (Power) and (Drives): 10% per-turn roll in advanceToPlanning, +1 energy in available6(), +1 thrust in getRemainingThrust(). Command station left optional/deferred.
- **Phase C:** PD sorts incoming missiles by distance (closest first). getPointDefenseCapacity includes broadside (+1 per battery) and spinal (+2 each) for PD-mode capacity.
- **Phase D:** Refocus shields: UI (Refocus Fore / Refocus Aft / No Refocus), getEffectiveShieldValue applies +50% one arc / −50% others, saved/loaded with game.
- **Phase E:** Browser test extended: sets PD mode to Area and Refocus Fore, checks state; checks crewStations and _engineeringPowerBonus/_engineeringDrivesBonus. DESIGN_GAPS.md updated.

---

## 1. Combat & Tables

| Gap | Description | Current State | Design Ref |
|-----|-------------|---------------|------------|
| **Combat tables** | Laser/spinal range bands and to-hit are implemented per RL:L (RANGE_BANDS, FEATURES_AND_RULES §4). | Uses percentage-based bands (0–25%, 26–50%, etc.) and damage mods. | GameDesign, FEATURES_AND_RULES §4 |
| **Simplified missile defense** | Missile intercept uses a single formula: `intercepted = floor(totalBonus/3)`. | No per-missile roll or detailed turret/laser defense table. | FEATURES_AND_RULES §7 (Laser Defense, Turret Score) |
| **Dead range code** | ~~`RANGE_BANDS_SIMPLE` and `getRangeBand(distance)` exist but are never used.~~ | **Done:** Removed; combat uses `RANGE_BANDS` only. | — |

---

## 2. Point Defense (PD)

| Gap | Description | Current State | Design Ref |
|-----|-------------|---------------|------------|
| **PD target priority** | Design: “closest enemy first” for PD (and broadside/spinal in PD mode). | **Done:** Incoming missiles sorted by distance to defender before PD resolution. | GameDesign § Point Defense, Weapons |
| **PD mode validation** | Point / Area / Off affect intercept chance (Area = 0.85×, Off = 0). | Not validated in automated test; Area “nearby” scope (which missiles/fighters count) is not strictly defined. | GameDesign § Point Defense |
| **Broadside/spinal in PD mode** | Design: weapons can switch to PD; engage missiles/fighters, closest first. | **Done:** getPointDefenseCapacity adds +1 per broadside battery and +2 per spinal. Same closest-first list used. | GameDesign § Weapons |

---

## 3. Crew & Stations

| Gap | Description | Current State | Design Ref |
|-----|-------------|---------------|------------|
| **Station skill usage** | All 13 stations exist (`initializeCrewStations`). Only some are used in formulas. | **Done:** gunnery, spinalGunnery, broadsides, missileControl, shields, sensors, ew, damageControl, pointDefense, flightOps, power, drives. Command deferred. | GameDesign § Crew skill (stations) |
| **Damage Control** | Design: “Affects repair rate and chance to contain/clear critical hits.” | **Done:** attemptRepairs and advance-turn repair multiply by getStationSkillModifier(ship, 'damageControl'). | GameDesign § Damage Control |
| **Shields station** | Design: “Affects shield strength, refocus efficiency, and regen.” | **Done:** getEffectiveShieldValue × shields station. Refocus implemented (Phase D). Regen optional/deferred. | GameDesign § Tactical (Shields) |
| **Sensors station** | Design: “Affects sensor detection and identification ranges.” | **Done:** calculateSensorRange multiplied by getStationSkillModifier(ship, 'sensors'). | GameDesign § Tactical (Sensors) |
| **EW station** | Design: “Affects ECM/ECCM effectiveness.” | **Done:** ECM/ECCM terms in laser, spinal, missile to-hit scaled by ew station. | GameDesign § Tactical (Electronic Warfare) |
| **Flight Ops station** | Design: “Affects fighter & drone launch/return tempo and retask reliability.” | **Done:** performAntiShipAttack hit chance scaled by motherShip flightOps station. | GameDesign § Tactical (Flight Ops) |
| **Engineering (Power)** | Design: “10% chance each round of generating an extra energy point.” | **Done:** advanceToPlanning rolls 10% × power station; +1 in available6(). | GameDesign § Engineering (Power) |
| **Engineering (Drives)** | Design: “10% chance each round of increasing Thrust by 1 for free.” | **Done:** advanceToPlanning rolls 10% × drives station; +1 in getRemainingThrust(). | GameDesign § Engineering (Drives) |
| **Command & Coordination** | Design: “Small global bonus; improves chances when multiple systems stressed.” | Deferred (optional). | GameDesign § Command & Coordination |
| **Required skill drift** | Design: “Required skill for a station slowly increases over time” (e.g. +0.02/turn). | **Done:** advanceToPlanning increases station.requiredSkill by STATION_SKILL_DRIFT_PER_TURN, cap 1.5. | GameDesign § Crew skill |

---

## 4. Energy & Shields

| Gap | Description | Current State | Design Ref |
|-----|-------------|---------------|------------|
| **Refocus shields** | Design: “+50% one arc, −50% others” (cost TBD or 0). | **Done:** UI (Refocus Fore/Aft/None), getEffectiveShieldValue applies ×1.5 / ×0.5; cost 0. | GameDesign § Shields summary |
| **Shield regen** | Design (Shields station): “regen” affected by crew. | No shield regeneration over time. | GameDesign § Tactical (Shields) |

---

## 5. Fighters & Drones

| Gap | Description | Current State | Design Ref |
|-----|-------------|---------------|------------|
| **Dogfight resolution** | Comment in code: “Check for dogfights (simplified - would need proper engagement detection).” | Any two enemy squadrons within 2 RU trigger a dogfight; no formal “engagement” or initiative. | GameDesign § Fighters, FEATURES_AND_RULES §8 |
| **Fighter phase vs dual-phase** | FEATURES_AND_RULES describes 6 phases (Planning, Movement, Fighter, Fighter Movement, Firing, Resolution). | Game uses dual-phase (Planning → 5s Execution); no separate fighter phase. | GameDesign (authoritative for this build), FEATURES_AND_RULES §1 |

---

## 6. Documentation & Test

| Gap | Description | Current State | Design Ref |
|-----|-------------|---------------|------------|
| **Phase model mismatch** | FEATURES_AND_RULES §1 describes a 6-phase turn. | **Done:** Canonical note added at top of FEATURES_AND_RULES (dual-phase = GameDesign). | Both docs |
| **Test coverage** | Browser test covers: New Battle, Execute Turn, Save/Load, weapons UI, fighter mission assign. | **Done:** Test sets PD Area and Refocus Fore and asserts state; checks crewStations and engineering bonuses. | run-browser-test.js |

---

## Implementation Plan (Priority Order)

### Phase A — Quick wins (code cleanup & single-file consistency) ✅
1. **Done:** Removed RANGE_BANDS_SIMPLE and getRangeBand.
2. **Done:** Note at top of FEATURES_AND_RULES.md (canonical = GameDesign dual-phase).

### Phase B — Crew & stations (high design impact) ✅
3. **Done:** Damage Control in attemptRepairs and advance-turn repair.
4. **Done:** Required skill drift in advanceToPlanning (cap 1.5).
5. **Done:** Shields station in getEffectiveShieldValue.
6. **Done:** Sensors station in calculateSensorRange.
7. **Done:** EW station in laser/spinal/missile ECM/ECCM.
8. **Done:** Flight Ops in performAntiShipAttack.
9. **Done:** Engineering (Power) 10% roll, +1 in available6().
10. **Done:** Engineering (Drives) 10% roll, +1 in getRemainingThrust().
11. **Done:** Broadsides station for broadside-weapon laser hit chance.
12. **Deferred:** Command (optional multi-system stress bonus).

### Phase C — Point defense ✅
13. **Done:** PD sorts incoming by distance (closest first).
14. **Done:** getPointDefenseCapacity includes broadside + spinal slots.

### Phase D — Missile defense & shields ✅ (refocus)
15. **Optional:** Missile defense formula unchanged (per-missile/turret table deferred).
16. **Done:** Refocus shields UI and getEffectiveShieldValue effect.
17. **Optional:** Shield regen deferred.

### Phase E — Validation & tests ✅
18. **Done:** run-browser-test.js sets PD Area + Refocus Fore, checks state and crew/engineering.
19. **Done:** DESIGN_GAPS.md updated with Implemented section and Done/Deferred tags.
---

## Summary Table

| Category        | # Gaps | Priority plan      |
|----------------|--------|--------------------|
| Combat tables  | 2      | A (cleanup)        |
| Point defense  | 3      | C (closest-first, PD mode) |
| Crew/stations  | 10     | B (all station hooks + drift + engineering) |
| Energy/shields| 2      | D (refocus; regen optional) |
| Fighters       | 2      | Optional (dogfight clarity; doc only for phase) |
| Docs & test    | 2      | A + E              |

This file is the single place to track and plan these gaps; update it as items are implemented or deprioritized.
