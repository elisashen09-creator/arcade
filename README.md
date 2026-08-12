# NAVAL ARCADE

**NAVAL ARCADE** is a modular web arcade platform featuring naval warfare-themed games, JWT-based user authentication, and high-score leaderboards.

## Features
- **Sea-Themed Military UI**: High-tech naval warfare aesthetic featuring Deep Navy Blue (`#0a192f`), Battleship Steel Gray (`#3a4a58`), Dark Sea Green (`#1b4332`), and Pure Black (`#050a14`) with dynamic radar sweeps and wave effects.
- **JWT Authentication Engine**: JSON Web Token user login/signup with LocalStorage session persistence and guest profile fallback.
- **High Score Leaderboards**: Global and personal high-score tracking per game.
- **Modular Game Architecture**: Easily add new games into `games/<game-id>/`.

## Featured Games
1. **Battleship** ([games/battleship/](games/battleship/index.html)) — Tactical fleet placement & turn-based naval target firing against AI.
2. **Ship Attackers** ([games/ship-attackers/](games/ship-attackers/index.html)) — 2D top-down retro arcade shooter defending sea barricades against enemy bomber waves.

## How to Run
Simply open `index.html` in any web browser or serve locally using any HTTP server:
```powershell
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

## Architecture & Files
- `index.html` — Arcade Homepage with game selection grid, leaderboards modal, and JWT auth modal.
- `styles.css` — Global naval design tokens, glassmorphism cards, and wave/radar animations.
- `auth.js` — Client-side JWT auth engine (encoding, validation, token storage, user profiles).
- `leaderboard.js` — Leaderboard management and score recording.
- `games/battleship/` — Battleship game section.
- `games/ship-attackers/` — Ship Attackers 2D shooter section.

## Skills Applied
- `docs-generator` — Documentation & milestone specifications
- `uiux-designer` — Naval sea design system & glassmorphism HUDs
- `auth-implementation-patterns` — JWT authentication & session handling
- `security-auditor` — Input sanitization & secret protection
- `api-integrator` — Data structures & state sync
