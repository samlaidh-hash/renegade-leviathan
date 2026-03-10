# Renegade Legion: Leviathan

A browser-based computer implementation of **Renegade Legion: Leviathan**, the classic FASA tabletop space naval wargame. Command fleets of capital ships through tactical combat across 6-phase turns.

## Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Click **New Battle** to start a fleet engagement
3. Select ships and issue orders during the Planning Phase
4. Click **Next Phase** to advance through Movement, Fighter, Firing, and Resolution phases

## Game Overview

### 6-Phase Turn Structure

1. **Planning Phase** – Issue movement orders to all ships, configure sensors
2. **Movement Phase** – Ships execute movement orders
3. **Fighter Phase** – Launch/recall fighter squadrons
4. **Fighter Movement Phase** – Fighters execute movement
5. **Firing Phase** – Weapons fire, missile salvos, point defense
6. **Resolution Phase** – Damage resolved, status updated

### Features

- **Fleet Management** – Shiva Superdreadnought, cruisers, battleships with authentic stats
- **Ship Orders** – Speed changes, course changes, flip/roll maneuvers
- **Combat Systems** – Energy weapons, missiles, point defense, boarding
- **Fighter Operations** – Configure and launch fighter squadrons
- **Scenarios** – Fleet Engagement, Asteroid Ambush, Convoy Escort, Nebula Patrol
- **Terrain** – Open space, asteroid fields, dust storms, nebulae

### Controls

- **Left-click ship** – Select ship and view orders panel
- **Mouse wheel** – Zoom in/out
- **C key** – Reset camera
- **D key** – Debug info

## Technical

- Single-file HTML5 application (no build step)
- Canvas-based 2D rendering
- Vanilla JavaScript (no framework dependencies)
- Procedural audio via Web Audio API

## Credits

Based on *Renegade Legion: Leviathan* by FASA Corporation. This is an independent fan implementation.

## Recent Fixes (2025)

- Resolved duplicate `GAME_PHASES` declaration causing potential parse errors
- Synchronized `gameState.phase` and `gameState.currentPhase` for consistent panel visibility
- Consolidated `startNewBattle()` into single implementation with proper phase initialization
- Fixed phase display to use `displayName` from phase objects
- Aligned `executePhaseLogic` with canonical 6-phase order
