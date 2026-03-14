# Combat Rules — Specification (to implement)

This document captures the agreed combat, shield, spinal, missile, and damage-path rules. Implementation is pending; only ship data (Leviathan/Shiva broadsides) and this spec are in place.

---

## 1. Broadside (lasers)

- **To-hit:** 90% at all ranges (no range band for to-hit). Heavy lasers: 80% base to-hit; standard: 90%.
- **Damage:** Damage % of maximum = **101 − (% of maximum range)**. So at 10% range damage = 91%, at 60% range = 41%, at 100% range = 1%. Heavy lasers: +50% maximum range, +50% damage (vs standard).
- **Shield block:** On each laser hit, roll vs **current shield strength %** on that facing (fore/aft from attacker bearing). Success = block hit entirely; failure = hit goes through to ship.
- **Shield drain (laser):** Each time shields block a laser hit, reduce that facing’s shield strength by **0.1 percentage points** (e.g. 80% → 79.9%).
- **Shield regen:** Starts **5 seconds real time** after last hit on that facing (within the 5s execution window). Regenerates **1 percentage point per second**. Cannot regenerate above **starting value**. Stops when that facing is hit again.
- **Heavy vs standard:** 30-gun bays on Leviathan and 25-gun bays on Shiva are **heavy** (80% hit, +50% range, +50% damage). 70-gun (Leviathan) and 100-gun (Shiva) bays are **standard**.

---

## 2. Shields vs missiles

- Same mechanic as lasers: roll to block. Block chance = **min(95%, 2 × current shield % for that facing)**.
- Each **blocked** missile reduces that facing by **0.3 percentage points**.

---

## 3. Spinal mounts

- **To-hit:** **100 − (% of maximum range to target)**. Minimum from **range** is **1%** at or beyond maximum range. Other modifiers can reduce to-hit below 1% (including to 0%); only the range term does not go below 1%.
- **Size modifier (spinal only):** **(Size − 10) × 3%**. Can be negative (e.g. size 2 → −24%). Lasers keep **(Size − 5) × 3%**.
- **Damage:** Always **100%** regardless of range. Dust has **no effect** on spinal.
- **Resolution:** Hit is resolved **at fire time**. Miss = shot goes wild. Hit = spinal “bullet” is on target; **damage is applied when it reaches the target**.
- **Travel:** Speed such that **maximum range is reached in 2.5 seconds**. If the shot spans **multiple execution phases**, the target may try to **evade**; success turns the hit into a miss.
- **Graphics:** Travel speed = 10× missile speed (visual only).

---

## 4. Missiles (moving entities — to implement)

- **Launch:** Same as now (task in planning, launch in execution). Each missile is a moving entity with position, vector, fuel, thrust.
- **Speed:** X = starting speed at launch (same for all missiles from a given launcher). Y = acceleration per phase (missile’s **thrust** value).
- **Fuel:** Each missile has a **fuel** value. **1 fuel = 1 thrust** (thrust point spent). Maximum fuel spend in one 5s execution phase = missile’s **Thrust** value.
- **AI:** Normal mode: use thrust to **minimize flight time** to target. **ERM (Extended Range Mode):** prioritize reaching target with a **maneuvering reserve** (~20% of starting fuel), enabling much longer range; more vulnerable to AMS (slower approach).
- **Endurance:** When fuel runs out, missile **self-destructs** (no duds, minimal clutter).
- **Intercept:** Missile must reach target to inflict damage (no instant to-hit roll at launch). Target can evade if missile crosses phases.
- **Types (guidance needed):** Current types in code: **Standard, Heavy, Type E, Hunter-Killer, Nuclear.** You indicated: **nukes** = slower; **interceptors** = much faster, lower endurance. Please specify for each type (and for **Interceptor** if added as counter-missile):
  - **Thrust** (acceleration Y)
  - **Fuel** (endurance)
  - **Launch speed X** (or “from launcher”)
  - **Damage**
  - Any special (e.g. Nuclear = area, Interceptor = anti-missile only).

---

## 5. Point defense

- **To-hit (vs missile/fighter):** **95%** initially. Track **individual PD shots**. Each shot fired reduces to-hit by **0.05 percentage points** (heat). Cooling: after **1 second** without firing, recover **1% per second** (to-hit goes back up).
- **Point mode:** Hard range cap **30 RU**; **no modifier** to to-hit within cap.
- **Area mode:** No modifier out to **20 RU**; beyond 20 RU, **−2 percentage points per RU**.
- **Engagement:** One PD “engagement” = fire until target (missile or fighter) is destroyed, then switch to next nearest. PD damage: **one hit = kill missile**; **several hits** to destroy a fighter.
- **Fighters:** Fighters on CAP/defensive missions engage nearby missiles the same way (roll to hit per missile). PD engages fighters like missiles (same to-hit and heat rules).

---

## 6. Damage path (detailed only)

- **Only** the **detailed path** (blow-through / cascade) is used. No simple “hull + critical” path.
- **Per-system “last fired”:** If a system (lasers, missiles, hangars, spinal) has **not** fired/launched within the **last 5 seconds real time** in the execution window, hits on that system on the surface table are **treated as hits on armour** (gunports/hatches closed).
- **Threshold:** Per-system **threshold %** of **starting HP** (e.g. 50% of 1000 HP = 500 damage per hit before cascade). Values to come from hit location table (spreadsheet); add `thresholdPercent` to `DAMAGE_TABLES.systems` when spreadsheet values are available.
- **Cascade:**  
  1. Roll on **surface** hit table; apply damage (up to threshold).  
  2. If damage **cascades** (exceeds threshold), roll on **penetrating** hit table; apply damage.  
  3. If damage cascades again: **d100**  
     - **01–70:** Roll again on **penetrating** table, apply; if cascade again, repeat d100.  
     - **71–100:** Apply damage to **armour on the opposite side**; any further cascade is **ignored** (blast into space).

---

## 7. Ship data (done)

- **Leviathan Battleship:** Left broadside 4 bays (70 + 70 + 30 + 30), Right broadside 4 bays (70 + 70 + 30 + 30). 70-gun = standard, 30-gun = heavy. Total 400 broadside lasers.
- **Shiva Superdreadnought:** Left 4 bays (100 + 100 + 25 + 25), Right 4 bays (100 + 100 + 25 + 25). 100-gun = standard, 25-gun = heavy. Total 500 broadside lasers. `isHeavy: true` on 25-gun bays.

---

## 8. Missile types (specified)

| Type           | Thrust | Fuel | Launch speed | Damage | Special        |
|----------------|--------|------|--------------|--------|----------------|
| Standard       | 12     | 36   | 10           | 3      | —              |
| Heavy          | 8      | 24   | 10           | 5      | —              |
| Hunter-Killer  | 12     | 36   | 10           | 3      | high_accuracy  |
| Nuclear        | 8      | 40   | 10           | 15     | area_effect     |
| Interceptor    | 20     | 30   | 10           | —      | counter-missile; 4 per VLS cell |
| Standoff       | 12     | 36   | 10           | 1.5 (50%) | ¼ PD stop chance |

Type E removed. All missiles use fuel pool; 1 fuel = 1 thrust per phase; max thrust per phase = Thrust value. Self-destruct when fuel exhausted.

---

## 9. VLS launcher groups

- **Cells per group:** 25. Each group fires **1 missile per second** (during execution).
- **Default loadout per group:** 5 interceptor cells (4 interceptors each), 10 standard, 4 heavy, 2 nuke, 2 Hunter-Killer, 2 standoff.
- **At game start:** 25% of ship’s missile cells are loaded with interceptors (interceptor cells as above).
- **Interceptor slot:** One “cell” holds **4** interceptor missiles.

---

## 10. Missile control panel modes

- **Defensive:** Pause normal launches; auto-launch **interceptors at threats** (incoming missiles, or missiles targeting allies within 50 RU). Fire **one interceptor per threat in rotation** (round-robin across threats until one hits or threat is gone). When a threat is killed by an interceptor, resume normal launches.
- **Offensive:** Do not launch interceptors; only fire designated missile types at designated target.
- **Standard:** Alternate: launch one interceptor (at next threat in rotation), then one normal missile at designated target, then interceptor, etc.

**Interceptor vs PD targeting (clarification):**  
- **Interceptors:** One interceptor missile per threat, **in rotation** — e.g. threat A, then threat B, then threat C, then back to A, until a threat is destroyed or missed.  
- **Point defense:** Each PD **turret** is assigned to **one** threat and keeps firing at **that** threat until it is destroyed, then switches to the next untargeted threat (closest first).

---

## 11. Intercept Fighters toggle

- **Missile panel:** “Intercept Fighters? Yes/No”. If **Yes**, the ship will launch interceptors at **fighters** (as well as missiles) when in Defensive or Standard mode. If **No**, interceptors only engage missiles.
- **PD panel:** “Intercept Fighters? Yes/No”. If **Yes**, PD engages fighters like missiles (same to-hit and engagement rules). If **No**, PD ignores fighters.

---

## 12. Torpedo Tubes (future)

- Fixed firing arcs; **launch speed 20**; rate **1 missile per tube per 5 seconds**. To be introduced later.
