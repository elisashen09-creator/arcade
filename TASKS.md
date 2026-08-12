# TASKS.md — NAVAL ARCADE

## Milestone 1: Arcade Core Infrastructure & JWT Auth
- [x] Create project documentation (README, TASKS, STATUS, CHANGELOG)
- [x] Build JWT authentication engine in `auth.js`
- [x] Build Leaderboard manager in `leaderboard.js`
- [x] Implement sea-themed Arcade Hub UI (`index.html`, `styles.css`)

## Milestone 2: Game 1 — Battleship
- [x] Create `games/battleship/` scaffolding (`index.html`, `style.css`, `game.js`)
- [x] Implement Ship Placement Grid (Carrier, Battleship, Cruiser, Submarine, Destroyer)
- [x] Implement AI Tactical Target Firing logic & hit/miss indicators
- [x] Connect game completion to JWT user leaderboard

## Milestone 3: Game 2 — Ship Attackers
- [x] Create `games/ship-attackers/` scaffolding (`index.html`, `style.css`, `game.js`)
- [x] Implement 2D Top-Down Shooter physics, Warship movement & AA Cannons
- [x] Add enemy bomber waves, 4 destructible sea barricades, 3 lives system
- [x] Connect high score system to JWT user leaderboard

## Milestone 4: Polish & Verification
- [x] Verify sea aesthetic (Blue, Gray, Dark Green, Black) and animations
- [x] Verify JWT token lifecycle and login modal
- [x] Perform QA walkthrough and document in `STATUS.md`
