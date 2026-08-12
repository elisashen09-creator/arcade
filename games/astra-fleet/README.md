# ASTRA SECTOR — 2D SPACE COMBAT & FLEET HANGAR

**ASTRA SECTOR** is a high-octane 2D Sci-Fi Space Combat Web Game built with Canvas 2D and Web Audio API. Control your customizable spaceship, fight through linear Sector Levels, battle aggressive Void fleets & colossal Dreadnought Bosses, earn Starlight Ore currency, and unlock upgradeable spaceship models in the Fleet Hangar!

---

## 🎮 Pilot Command Controls
- `W` / `A` / `S` / `D` or `Arrow Keys` — Smooth 360-Degree Vector Thrust & Movement
- `Mouse Movement` — Precision Aiming & Ship Rotation
- `Left Click` / `SPACE` — Primary Laser/Plasma Cannon Attack
- `Right Click` / `SHIFT` / `E` — Ship-Specific Special Ability / Secondary Weapon
- `P` / `ESC` — Pause Game

---

## 🚀 Game Features

### 1. Core Gameplay Loop
`Start Level` ➔ `Fight Hostile Void Ships` ➔ `Collect Ore & Pickups` ➔ `Earn Currency` ➔ `Upgrade & Buy Ships in Hangar` ➔ `Progress to Next Sector`

### 2. Linear Level Progression System
- **15 Sector Levels** with unlockable progression.
- **Boss Levels (Level 5, 10, 15...)**: Battle massive **Void Dreadnought Leviathans** featuring multi-phase bullet hell attacks and custom HUD health bars!
- **Sector Map (Level Select)**: Interactively view unlocked levels, level goals, enemy counts, boss targets, and reward bonuses.

### 3. Unlockable Spaceships & Hangar Shop
- **Vanguard Strike Vector** (Default Scout Fighter): Balanced maneuverability + Triple Photon Torpedo Salvo.
- **Aegis Sentinel** (Cost: 500 Ore): Heavy Shield Cruiser + Barrier Field (Invulnerability for 4s & instant shield recharge).
- **Phantom Interceptor** (Cost: 1,200 Ore): High-speed Stealth Craft + Rapid Pulse Cannons + EMP Shockwave.
- **Supernova Dreadnought** (Cost: 2,500 Ore): Colossal Capital Flagship + Dual Plasma Cannons + Devastator Beam Sweep.

### 4. 7 Upgradeable Ship Statistics
- **Max Hull HP** (+25 HP per tier)
- **Force Shield Matrix** (+20 Shield HP per tier)
- **Shield Generator** (+0.15 Shield Regen/sec per tier)
- **Plasma Cannon Power** (+4 Base Damage per tier)
- **Rapid Fire Coils** (+15% Fire Speed per tier)
- **Ion Thrusters** (+10% Engine Speed per tier)
- **Ability Overclock** (-15% Cooldown per tier)

### 5. Combat Systems & FX
- **Dynamic Shields & Hull**: Forcefield bubble visual FX absorb enemy laser hits first and auto-recharge out of combat.
- **Enemy AI**: Scouts, Gunships (3-way spread shots), Cruisers, and Bosses aim, chase, and shoot projectiles at the player.
- **Pickups & Drops**: Enemy ships drop Starlight Ore Crystals, Hull Repair Kits (+35 HP), and Shield Boosters (+Full Shield).
- **Sensory Polish**: Floating damage numbers, screen shake, Web Audio API procedural sound synthesizer (plasma shots, enemy lasers, shield hums, torpedo detonations, boss sirens), and glassmorphism UI.

---

## 🛠️ Main Code Structure
- `index.html` — Sci-Fi HUD layout, Sector Level Map modal, Fleet Hangar Shop modal, Boss HUD overlay, Victory/Game Over screens.
- `styles.css` — Cyberpunk dark glassmorphism styling, CRT scanlines, neon glows, responsive modals.
- `audio.js` — Procedural Web Audio API sound synthesizer engine & ambient space soundtrack.
- `game.js` — 60 FPS spatial physics engine, 4 player ship systems, enemy AI shooting, level progression manager, radar minimap, and local storage persistence.

---

## 🌐 How to Run
Simply open `index.html` in any web browser or serve locally using an HTTP server (`python -m http.server` or `npx serve .`).
