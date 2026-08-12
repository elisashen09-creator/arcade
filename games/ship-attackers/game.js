/* SHIP ATTACKERS 2D — Space Invaders-Style Retro Naval Shooter Engine
   Features: 8 Buyable Warships (Multiplied x7.5), Stat Upgrades (Multiplied x3), Significantly Reduced Enemy Firing, Rare Powerup Drops, & Wave 5 Boss Spawning Behind Bomber Fleet! */

class ShipAttackersEngine {
    constructor() {
        this.canvas = document.getElementById('attackersCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.isRunning = false;
        this.isPaused = false;

        this.score = 0;
        this.sessionCoins = 0;
        this.level = 1;

        // Default Garage Storage Data
        this.garageData = {
            coins: 0,
            equippedShip: 'dreadnought',
            ownedShips: ['dreadnought'],
            upgrades: {
                fireRate: 0,
                damage: 0,
                speed: 0,
                maxLives: 0,
                magnet: 0
            }
        };

        this.loadGarageData();

        // 8 Warships Catalog (Prices Multiplied by 7.5x)
        this.shipsConfig = {
            dreadnought: {
                id: 'dreadnought',
                name: 'Vanguard Dreadnought',
                icon: '🛳️',
                cost: 0,
                desc: 'Standard fleet warship. Well balanced with reliable dual AA cannons.'
            },
            gatling: {
                id: 'gatling',
                name: 'Gatling Interceptor',
                icon: '⚡',
                cost: 1350, // 180 * 7.5
                desc: 'Machine Gun Ship: Fires a rapid secondary auto-turret shooting down enemy bombs & lasers in mid-air!'
            },
            midas: {
                id: 'midas',
                name: 'Midas Cruiser',
                icon: '🪙',
                cost: 2250, // 300 * 7.5
                desc: 'Money Ship: Earns +50% BONUS COINS on all kills + drops floating gold coin crates (+15 🪙)!'
            },
            aegis: {
                id: 'aegis',
                name: 'Aegis Citadel',
                icon: '🛡️',
                cost: 3375, // 450 * 7.5
                desc: 'Shield Guardian: Starts every wave with an active Force Shield bubble for 10 seconds!'
            },
            plasma: {
                id: 'plasma',
                name: 'Plasma Obliterator',
                icon: '💥',
                cost: 4950, // 660 * 7.5
                desc: 'EMP Titan: Fires dual plasma beams + auto-triggers an EMP blast clearing screen bombs every 18 seconds!'
            },
            subzero: {
                id: 'subzero',
                name: 'Sub-Zero Frigate',
                icon: '❄️',
                cost: 6750, // 900 * 7.5
                desc: 'Cryo Freeze Ship: Fires Frost Cannons that slow enemy bomber movement speed by 35%!'
            },
            valkyrie: {
                id: 'valkyrie',
                name: 'Valkyrie Destroyer',
                icon: '🚀',
                cost: 9000, // 1200 * 7.5
                desc: 'Homing Missile Ship: Launches micro-missiles every 4 seconds that auto-target incoming bombers!'
            },
            leviathan: {
                id: 'leviathan',
                name: 'Leviathan Flagship',
                icon: '👑',
                cost: 13500, // 1800 * 7.5
                desc: 'Ultimate Superwarship: 4 Heavy Cannon Barrels, +2 Starting Bonus Lives, & Built-in Magnet!'
            }
        };

        // Upgrades Catalog (Costs Multiplied by 3x)
        this.upgradesConfig = {
            fireRate: {
                id: 'fireRate',
                name: '⚡ Fire Rate',
                desc: 'Decreases AA cannon firing delay for faster shooting.',
                costs: [180, 405, 810, 1620],
                maxLevel: 4
            },
            damage: {
                id: 'damage',
                name: '💥 Cannon Damage',
                desc: 'Increases shell impact damage to shred armored gunships faster.',
                costs: [225, 540, 1080, 2160],
                maxLevel: 4
            },
            speed: {
                id: 'speed',
                name: '⏩ Steering Velocity',
                desc: 'Increases warship left/right movement speed for swift evasion.',
                costs: [180, 405, 810, 1620],
                maxLevel: 4
            },
            maxLives: {
                id: 'maxLives',
                name: '🛡️ Reinforced Hull (Lives)',
                desc: 'Increases starting warship lives up to 6 max lives.',
                costs: [315, 720, 1440, 2880],
                maxLevel: 4
            },
            magnet: {
                id: 'magnet',
                name: '🧲 Powerup Magnet',
                desc: 'Draws falling powerup crates towards your warship automatically.',
                costs: [270, 675, 1350],
                maxLevel: 3
            }
        };

        // Player Warship State
        this.player = {
            x: this.width / 2 - 25,
            y: this.height - 50,
            width: 50,
            height: 25,
            speed: 7.5,
            lastFire: 0,
            lastGatling: 0,
            lastEmpTimer: 0,
            lastMissileTimer: 0,
            shieldTimer: 0,
            spreadTimer: 0
        };

        // Entity Arrays
        this.keys = {};
        this.projectiles = []; // Player AA Shells
        this.gatlingBullets = []; // Gatling Bullets
        this.homingMissiles = []; // Valkyrie Homing Missiles
        this.enemyBombs = []; // Enemy Bombs / Lasers / Torpedoes
        this.bombers = []; // Enemy Bomber Grid
        this.totalInitialBombers = 32;
        this.barricades = [];
        this.powerups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.mothership = null;
        this.boss = null;

        this.bomberDir = 1;
        this.bomberSpeed = 0.85;

        this.waveBannerTimer = 0;
        this.waveBannerText = '';

        this.initDOM();
        this.updateUserBadge();
        this.updateCoinsDisplay();
    }

    loadGarageData() {
        try {
            const saved = localStorage.getItem('naval_ship_attackers_garage');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.garageData = { ...this.garageData, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load garage data:', e);
        }
    }

    saveGarageData() {
        try {
            localStorage.setItem('naval_ship_attackers_garage', JSON.stringify(this.garageData));
        } catch (e) {
            console.error('Failed to save garage data:', e);
        }
        this.updateCoinsDisplay();
    }

    updateCoinsDisplay() {
        const total = this.garageData.coins;
        const hCoins = document.getElementById('header-coins');
        const gCoins = document.getElementById('garage-coins-display');
        if (hCoins) hCoins.innerText = total.toLocaleString();
        if (gCoins) gCoins.innerText = `🪙 ${total.toLocaleString()} COINS`;
    }

    updateUserBadge() {
        if (window.navalAuth) {
            const user = window.navalAuth.getCurrentUser();
            document.getElementById('user-name').innerText = user.username;
        }
    }

    initDOM() {
        document.getElementById('btn-start-game').onclick = () => this.startGame();
        document.getElementById('btn-pause').onclick = () => this.togglePause();
        document.getElementById('btn-restart').onclick = () => this.startGame();

        document.getElementById('btn-open-garage').onclick = () => this.openGarage();
        document.getElementById('btn-hud-garage').onclick = () => this.openGarage();
        document.getElementById('btn-gameover-garage').onclick = () => this.openGarage();
        document.getElementById('btn-close-garage').onclick = () => this.closeGarage();

        document.getElementById('tab-btn-upgrades').onclick = () => this.switchGarageTab('upgrades');
        document.getElementById('tab-btn-ships').onclick = () => this.switchGarageTab('ships');

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.fireAACannon();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.fireAACannon();
        });
    }

    openGarage() {
        if (this.isRunning) this.isPaused = true;

        const goModal = document.getElementById('gameover-modal');
        if (goModal) goModal.classList.add('hidden');

        this.renderUpgradesUI();
        this.renderShipsUI();
        document.getElementById('garage-modal').classList.remove('hidden');
    }

    closeGarage() {
        document.getElementById('garage-modal').classList.add('hidden');

        if (!this.isRunning) {
            document.getElementById('gameplay-screen').classList.add('hidden');
            document.getElementById('gameover-modal').classList.add('hidden');
            document.getElementById('title-screen').classList.remove('hidden');
        }
    }

    switchGarageTab(tab) {
        const uBtn = document.getElementById('tab-btn-upgrades');
        const sBtn = document.getElementById('tab-btn-ships');
        const uCont = document.getElementById('tab-upgrades-content');
        const sCont = document.getElementById('tab-ships-content');

        if (tab === 'upgrades') {
            uBtn.classList.add('active');
            sBtn.classList.remove('active');
            uCont.classList.remove('hidden');
            sCont.classList.add('hidden');
        } else {
            sBtn.classList.add('active');
            uBtn.classList.remove('active');
            sCont.classList.remove('hidden');
            uCont.classList.add('hidden');
        }
    }

    renderUpgradesUI() {
        const container = document.getElementById('upgrades-container');
        container.innerHTML = '';

        Object.keys(this.upgradesConfig).forEach(key => {
            const config = this.upgradesConfig[key];
            const currentLevel = this.garageData.upgrades[key] || 0;
            const isMax = currentLevel >= config.maxLevel;
            const cost = isMax ? 0 : config.costs[currentLevel];
            const canAfford = this.garageData.coins >= cost;

            const card = document.createElement('div');
            card.className = 'upgrade-card';

            let pips = '';
            for (let i = 0; i < config.maxLevel; i++) {
                pips += `<div class="level-pip ${i < currentLevel ? 'filled' : ''}"></div>`;
            }

            card.innerHTML = `
                <div class="upgrade-info">
                    <h4>${config.name} (LVL ${currentLevel}/${config.maxLevel})</h4>
                    <p>${config.desc}</p>
                    <div class="level-bars">${pips}</div>
                </div>
                <button class="btn-buy-upgrade ${isMax || !canAfford ? 'disabled' : ''}" data-key="${key}">
                    ${isMax ? 'MAXED OUT' : `UPGRADE (${cost.toLocaleString()} 🪙)`}
                </button>
            `;

            const btn = card.querySelector('.btn-buy-upgrade');
            if (!isMax && canAfford) {
                btn.onclick = () => this.buyUpgrade(key, cost);
            }

            container.appendChild(card);
        });
    }

    buyUpgrade(key, cost) {
        if (this.garageData.coins >= cost) {
            this.garageData.coins -= cost;
            this.garageData.upgrades[key] = (this.garageData.upgrades[key] || 0) + 1;
            this.saveGarageData();
            this.renderUpgradesUI();
        }
    }

    renderShipsUI() {
        const container = document.getElementById('ships-container');
        container.innerHTML = '';

        Object.keys(this.shipsConfig).forEach(id => {
            const ship = this.shipsConfig[id];
            const isOwned = this.garageData.ownedShips.includes(id);
            const isEquipped = this.garageData.equippedShip === id;
            const canAfford = this.garageData.coins >= ship.cost;

            const card = document.createElement('div');
            card.className = `ship-card ${isEquipped ? 'equipped' : ''}`;

            let badgeHtml = '';
            let btnHtml = '';

            if (isEquipped) {
                badgeHtml = `<span class="ship-status-badge equipped">⚡ EQUIPPED</span>`;
                btnHtml = `<button class="btn-ship-action equip" disabled style="opacity:0.6;">CURRENT SHIP</button>`;
            } else if (isOwned) {
                badgeHtml = `<span class="ship-status-badge owned">✔ OWNED</span>`;
                btnHtml = `<button class="btn-ship-action equip" data-id="${id}">EQUIP SHIP</button>`;
            } else {
                badgeHtml = `<span class="ship-status-badge" style="color:var(--amber-gold); border:1px solid var(--amber-gold);">🔒 LOCKED</span>`;
                btnHtml = `<button class="btn-ship-action buy ${!canAfford ? 'disabled' : ''}" data-id="${id}">BUY (${ship.cost.toLocaleString()} 🪙)</button>`;
            }

            card.innerHTML = `
                ${badgeHtml}
                <div class="ship-card-icon">${ship.icon}</div>
                <div class="ship-card-name">${ship.name}</div>
                <div class="ship-card-desc">${ship.desc}</div>
                ${btnHtml}
            `;

            const actionBtn = card.querySelector('.btn-ship-action');
            if (actionBtn) {
                if (!isOwned && canAfford) {
                    actionBtn.onclick = () => this.buyShip(id, ship.cost);
                } else if (isOwned && !isEquipped) {
                    actionBtn.onclick = () => this.equipShip(id);
                }
            }

            container.appendChild(card);
        });
    }

    buyShip(id, cost) {
        if (this.garageData.coins >= cost && !this.garageData.ownedShips.includes(id)) {
            this.garageData.coins -= cost;
            this.garageData.ownedShips.push(id);
            this.garageData.equippedShip = id;
            this.saveGarageData();
            this.renderShipsUI();
        }
    }

    equipShip(id) {
        if (this.garageData.ownedShips.includes(id)) {
            this.garageData.equippedShip = id;
            this.saveGarageData();
            this.renderShipsUI();
        }
    }

    applyGarageUpgradesToPlayer() {
        const u = this.garageData.upgrades;
        const currentShipId = this.garageData.equippedShip;

        this.player.speed = 7.5 + (u.speed * 1.0);

        let baseLives = 3 + (u.maxLives * 1);
        if (currentShipId === 'leviathan') baseLives += 2;

        this.lives = baseLives;
        this.maxLives = baseLives;

        if (currentShipId === 'aegis') {
            this.player.shieldTimer = 10;
        } else {
            this.player.shieldTimer = 0;
        }

        this.player.spreadTimer = 0;
        this.player.lastEmpTimer = 0;
        this.player.lastMissileTimer = 0;
    }

    startGame() {
        this.score = 0;
        this.sessionCoins = 0;
        this.level = 1;

        this.player.x = this.width / 2 - 25;
        this.applyGarageUpgradesToPlayer();

        this.projectiles = [];
        this.gatlingBullets = [];
        this.homingMissiles = [];
        this.enemyBombs = [];
        this.powerups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.mothership = null;
        this.boss = null;

        this.initBarricades();
        this.initBomberGrid();

        document.getElementById('title-screen').classList.add('hidden');
        document.getElementById('gameplay-screen').classList.remove('hidden');
        document.getElementById('gameover-modal').classList.add('hidden');

        const activeShip = this.shipsConfig[this.garageData.equippedShip];
        this.showWaveBanner(`WAVE 1 — ${activeShip.name} deployed!`);

        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    showWaveBanner(text) {
        this.waveBannerText = text;
        this.waveBannerTimer = 2.5;
    }

    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        document.getElementById('btn-pause').innerText = this.isPaused ? 'RESUME' : 'PAUSE';
        if (!this.isPaused) {
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    initBarricades() {
        this.barricades = [];
        const count = 4;
        const width = 75;
        const height = 35;
        const spacing = (this.width - (count * width)) / (count + 1);

        for (let i = 0; i < count; i++) {
            const x = spacing + i * (width + spacing);
            const y = this.height - 120;

            this.barricades.push({
                x: x,
                y: y,
                width: width,
                height: height,
                health: 18,
                maxHealth: 18
            });
        }
    }

    initBomberGrid() {
        this.bombers = [];
        
        // WAVE 5 BOSS: Spawns BEHIND/TOGETHER WITH Wave 5 Bomber Fleet!
        if (this.level % 5 === 0) {
            this.spawnWaveBoss();
        }

        const rows = this.level >= 3 ? 5 : 4;
        const cols = 8;
        this.bomberSpeed = 0.85 + (this.level * 0.40);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let type, points, coinsVal, width, height, hp, color, attackType;

                if (r === 0 || (rows === 5 && r === 1)) {
                    type = 'scout';
                    points = 400;
                    coinsVal = 1;
                    width = 30;
                    height = 18;
                    hp = 1;
                    color = '#ff0055';
                    attackType = 'laser';
                } else if (r === 1 || r === 2) {
                    type = 'dive_bomber';
                    points = 250;
                    coinsVal = 2;
                    width = 36;
                    height = 22;
                    hp = 1;
                    color = '#ffb700';
                    attackType = 'gravity_bomb';
                } else {
                    type = 'heavy_gunship';
                    points = 150;
                    coinsVal = 4;
                    width = 44;
                    height = 26;
                    hp = this.level >= 5 ? 3 : 2;
                    color = '#00ff66';
                    attackType = 'dual_torpedo';
                }

                // If Boss is active behind wave 5, push formation down slightly (y: 65 + r*42)
                const startY = (this.level % 5 === 0) ? 75 : 40;

                this.bombers.push({
                    x: 55 + c * 72,
                    y: startY + r * 42,
                    width: width,
                    height: height,
                    type: type,
                    points: points,
                    coinsVal: coinsVal,
                    health: hp,
                    maxHealth: hp,
                    color: color,
                    attackType: attackType
                });
            }
        }

        this.totalInitialBombers = this.bombers.length;
    }

    // Spawn Wave 5 Dreadnought Boss (Stationed BEHIND the bomber fleet!)
    spawnWaveBoss() {
        this.boss = {
            x: this.width / 2 - 60,
            y: 20, // Positioned at top BEHIND the bomber fleet!
            width: 120,
            height: 40,
            health: 20,
            maxHealth: 20,
            dir: 1,
            speed: 1.6,
            lastFire: 0,
            points: 5000,
            coinsVal: 150,
            color: '#ff0055'
        };

        this.showWaveBanner(`⚠️ WAVE 5 BOSS DETECTED BEHIND FLEET! (20 HP — INSTA-KILL BULLETS)`);
    }

    spawnMothership() {
        if (!this.mothership && Math.random() < 0.0012 + (this.level * 0.0008)) {
            this.mothership = {
                x: -70,
                y: 20,
                width: 65,
                height: 26,
                speed: 3.0 + (this.level * 0.35),
                points: 1000,
                coinsVal: 20,
                color: '#00f0ff'
            };
        }
    }

    // Powerup Upgrade drops significantly more rare!
    tryDropPowerup(x, y, isMothership = false) {
        const r = Math.random();
        const shipId = this.garageData.equippedShip;

        if (shipId === 'midas' && Math.random() < 0.20) {
            this.powerups.push({ x, y, width: 24, height: 24, type: 'gold_coin', speed: 2.2 });
        }

        if (isMothership) {
            const type = Math.random() < 0.5 ? 'extra_life' : (Math.random() < 0.5 ? 'spread' : 'shield');
            this.powerups.push({ x, y, width: 24, height: 24, type, speed: 2.2 });
            return;
        }

        // Significantly more rare upgrade drops!
        if (r < 0.008) {
            this.powerups.push({ x, y, width: 24, height: 24, type: 'extra_life', speed: 2.2 });
        } else if (r < 0.025) {
            this.powerups.push({ x, y, width: 24, height: 24, type: 'spread', speed: 2.2 });
        } else if (r < 0.040) {
            this.powerups.push({ x, y, width: 24, height: 24, type: 'shield', speed: 2.2 });
        } else if (r < 0.055) {
            this.powerups.push({ x, y, width: 24, height: 24, type: 'emp', speed: 2.2 });
        }
    }

    addCoins(amount, x, y) {
        if (this.garageData.equippedShip === 'midas') {
            amount = Math.ceil(amount * 1.5);
        }

        this.sessionCoins += amount;
        this.garageData.coins += amount;
        this.saveGarageData();

        if (x !== undefined && y !== undefined) {
            this.floatingTexts.push({
                x: x,
                y: y,
                text: `+${amount} 🪙`,
                color: '#ffb700',
                opacity: 1.0,
                vy: -1.5
            });
        }
    }

    fireAACannon() {
        if (!this.isRunning || this.isPaused) return;
        const now = performance.now();
        const fireRateLvl = this.garageData.upgrades.fireRate || 0;
        const fireDelay = Math.max(70, 170 - (fireRateLvl * 22));

        const shipId = this.garageData.equippedShip;
        const dmgLvl = this.garageData.upgrades.damage || 0;
        const shellDamage = 1 + (dmgLvl * 1);

        if (now - this.player.lastFire > fireDelay) {
            this.player.lastFire = now;

            if (this.player.spreadTimer > 0 || shipId === 'plasma') {
                this.projectiles.push({ x: this.player.x + 10, y: this.player.y - 10, vx: -2, vy: -12, damage: shellDamage, width: 5, height: 14, color: '#ffb700' });
                this.projectiles.push({ x: this.player.x + 22, y: this.player.y - 10, vx: 0, vy: -12, damage: shellDamage, width: 6, height: 14, color: '#00f0ff' });
                this.projectiles.push({ x: this.player.x + 35, y: this.player.y - 10, vx: 2, vy: -12, damage: shellDamage, width: 5, height: 14, color: '#ffb700' });
            } else if (shipId === 'leviathan') {
                this.projectiles.push({ x: this.player.x + 5, y: this.player.y - 10, vx: -1.5, vy: -12, damage: shellDamage, width: 5, height: 14, color: '#ff3366' });
                this.projectiles.push({ x: this.player.x + 18, y: this.player.y - 10, vx: -0.5, vy: -12, damage: shellDamage, width: 5, height: 14, color: '#00f0ff' });
                this.projectiles.push({ x: this.player.x + 30, y: this.player.y - 10, vx: 0.5, vy: -12, damage: shellDamage, width: 5, height: 14, color: '#00f0ff' });
                this.projectiles.push({ x: this.player.x + 42, y: this.player.y - 10, vx: 1.5, vy: -12, damage: shellDamage, width: 5, height: 14, color: '#ff3366' });
            } else {
                this.projectiles.push({
                    x: this.player.x + this.player.width / 2 - 3,
                    y: this.player.y - 10,
                    vx: 0,
                    vy: -12,
                    damage: shellDamage,
                    width: 6,
                    height: 14,
                    color: '#00f0ff'
                });
            }
        }
    }

    gameLoop(timestamp) {
        if (!this.isRunning || this.isPaused) return;
        const dt = (timestamp - this.lastTime) / 1000 || 0.016;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.waveBannerTimer > 0) {
            this.waveBannerTimer -= dt;
        }

        if (this.player.shieldTimer > 0) this.player.shieldTimer -= dt;
        if (this.player.spreadTimer > 0) this.player.spreadTimer -= dt;

        const shipId = this.garageData.equippedShip;

        if (shipId === 'gatling') {
            const now = performance.now();
            if (now - this.player.lastGatling > 120) {
                this.player.lastGatling = now;
                this.gatlingBullets.push({
                    x: this.player.x + (Math.random() < 0.5 ? 10 : 38),
                    y: this.player.y - 5,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -14,
                    width: 3,
                    height: 8,
                    color: '#ff8800'
                });
            }
        }

        if (shipId === 'plasma') {
            this.player.lastEmpTimer += dt;
            if (this.player.lastEmpTimer >= 18) {
                this.player.lastEmpTimer = 0;
                this.enemyBombs = [];
                this.showWaveBanner(`💥 PLASMA OBLITERATOR EMP BLAST — All bombs wiped!`);
            }
        }

        if (shipId === 'valkyrie') {
            this.player.lastMissileTimer += dt;
            if (this.player.lastMissileTimer >= 4.0 && (this.bombers.length > 0 || this.boss)) {
                this.player.lastMissileTimer = 0;
                this.homingMissiles.push({
                    x: this.player.x + 25,
                    y: this.player.y - 10,
                    speed: 8,
                    color: '#ff3366'
                });
            }
        }

        // Player Controls
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.x += this.player.speed;
        }
        this.player.x = Math.max(10, Math.min(this.width - this.player.width - 10, this.player.x));

        // Spawn Mothership
        this.spawnMothership();
        if (this.mothership) {
            this.mothership.x += this.mothership.speed;
            if (this.mothership.x > this.width + 80) {
                this.mothership = null;
            }
        }

        // Update Dreadnought Boss (Moving behind bomber fleet)
        if (this.boss) {
            this.boss.x += this.boss.dir * this.boss.speed;
            if (this.boss.x <= 20 || this.boss.x + this.boss.width >= this.width - 20) {
                this.boss.dir *= -1;
            }

            const now = performance.now();
            if (now - this.boss.lastFire > 1700) {
                this.boss.lastFire = now;
                this.enemyBombs.push({
                    x: this.boss.x + 20,
                    y: this.boss.y + this.boss.height,
                    vx: 0,
                    vy: 2.2,
                    width: 14,
                    height: 24,
                    color: '#ff0055',
                    isInstaKill: true
                });
                this.enemyBombs.push({
                    x: this.boss.x + 86,
                    y: this.boss.y + this.boss.height,
                    vx: 0,
                    vy: 2.2,
                    width: 14,
                    height: 24,
                    color: '#ff0055',
                    isInstaKill: true
                });
            }
        }

        // Update Valkyrie Homing Missiles
        this.homingMissiles.forEach(m => {
            if (this.boss) {
                const angle = Math.atan2((this.boss.y + 20) - m.y, (this.boss.x + 60) - m.x);
                m.x += Math.cos(angle) * m.speed;
                m.y += Math.sin(angle) * m.speed;

                if (m.x < this.boss.x + this.boss.width && m.x + 8 > this.boss.x && m.y < this.boss.y + this.boss.height && m.y + 8 > this.boss.y) {
                    this.boss.health -= 2;
                    m.toRemove = true;
                    if (this.boss.health <= 0) {
                        this.destroyBoss();
                    }
                }
            } else if (this.bombers.length > 0) {
                let target = this.bombers[0];
                this.bombers.forEach(b => { if (b.y > target.y) target = b; });

                const angle = Math.atan2((target.y + 10) - m.y, (target.x + target.width / 2) - m.x);
                m.x += Math.cos(angle) * m.speed;
                m.y += Math.sin(angle) * m.speed;

                if (m.x < target.x + target.width && m.x + 8 > target.x && m.y < target.y + target.height && m.y + 8 > target.y) {
                    target.health -= 2;
                    m.toRemove = true;
                    if (target.health <= 0) {
                        target.destroyed = true;
                        this.score += target.points;
                        this.addCoins(target.coinsVal, target.x, target.y);
                    }
                }
            } else {
                m.y -= m.speed;
            }
        });
        this.homingMissiles = this.homingMissiles.filter(m => !m.toRemove && m.y > -20);

        // Update Gatling Bullets
        this.gatlingBullets.forEach(gb => {
            gb.x += gb.vx;
            gb.y += gb.vy;

            this.enemyBombs.forEach(b => {
                if (gb.x < b.x + b.width && gb.x + gb.width > b.x && gb.y < b.y + b.height && gb.y + gb.height > b.y) {
                    b.toRemove = true;
                    gb.toRemove = true;
                    for (let i = 0; i < 4; i++) {
                        this.particles.push({
                            x: b.x, y: b.y,
                            vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                            radius: 2, color: '#ff8800', life: 0.25
                        });
                    }
                }
            });
        });
        this.gatlingBullets = this.gatlingBullets.filter(gb => !gb.toRemove && gb.y > -20);

        // Update Player Projectiles
        this.projectiles.forEach(p => {
            p.x += (p.vx || 0);
            p.y += (p.vy || -12);

            // Hit Boss
            if (this.boss && p.x < this.boss.x + this.boss.width && p.x + p.width > this.boss.x &&
                p.y < this.boss.y + this.boss.height && p.y + p.height > this.boss.y) {
                p.toRemove = true;
                this.boss.health -= (p.damage || 1);

                for (let i = 0; i < 5; i++) {
                    this.particles.push({
                        x: p.x, y: p.y,
                        vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                        radius: 2.5, color: '#ff0055', life: 0.25
                    });
                }

                if (this.boss.health <= 0) {
                    this.destroyBoss();
                }
            }

            // Hit Mothership
            if (this.mothership && p.x < this.mothership.x + this.mothership.width && p.x + p.width > this.mothership.x &&
                p.y < this.mothership.y + this.mothership.height && p.y + p.height > this.mothership.y) {
                p.toRemove = true;
                this.score += this.mothership.points;
                this.addCoins(this.mothership.coinsVal, this.mothership.x, this.mothership.y);
                this.tryDropPowerup(this.mothership.x + 20, this.mothership.y + 10, true);
                this.showWaveBanner(`🎯 MOTHERSHIP DESTROYED! +${this.mothership.points} PTS!`);

                for (let i = 0; i < 16; i++) {
                    this.particles.push({
                        x: this.mothership.x + 30, y: this.mothership.y + 13,
                        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
                        radius: 4, color: '#00f0ff', life: 0.5
                    });
                }
                this.mothership = null;
            }

            // Hit Bombers
            this.bombers.forEach(b => {
                if (p.x < b.x + b.width && p.x + p.width > b.x && p.y < b.y + b.height && p.y + p.height > b.y) {
                    b.health -= (p.damage || 1);
                    p.toRemove = true;

                    if (b.health <= 0) {
                        b.destroyed = true;
                        this.score += b.points;
                        this.addCoins(b.coinsVal, b.x + b.width / 2, b.y + b.height / 2);
                        this.tryDropPowerup(b.x + b.width / 2, b.y + b.height / 2, false);

                        for (let i = 0; i < 10; i++) {
                            this.particles.push({
                                x: b.x + b.width / 2, y: b.y + b.height / 2,
                                vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                                radius: 3.5, color: b.color, life: 0.35
                            });
                        }
                    } else {
                        for (let i = 0; i < 4; i++) {
                            this.particles.push({
                                x: p.x, y: p.y,
                                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                                radius: 2, color: '#ffffff', life: 0.2
                            });
                        }
                    }
                }
            });

            this.barricades.forEach(bar => {
                if (bar.health > 0 && p.x < bar.x + bar.width && p.x + p.width > bar.x && p.y < bar.y + bar.height && p.y + p.height > bar.y) {
                    p.toRemove = true;
                }
            });
        });
        this.projectiles = this.projectiles.filter(p => !p.toRemove && p.y > -20);

        this.bombers = this.bombers.filter(b => !b.destroyed);

        // Level Wave Clear
        if (this.bombers.length === 0 && !this.boss) {
            this.level++;
            this.barricades.forEach(b => b.health = Math.min(b.maxHealth, b.health + 6));
            this.showWaveBanner(`WAVE ${this.level} INCOMING — Hostile air speed & fire rate increased!`);
            this.initBomberGrid();
        }

        const freezeFactor = shipId === 'subzero' ? 0.65 : 1.0;
        const countRatio = Math.max(0.15, this.bombers.length / Math.max(1, this.totalInitialBombers));
        const currentSpeed = (0.85 + (this.level * 0.40)) * Math.pow(1 / countRatio, 0.45) * freezeFactor;

        let edgeHit = false;
        
        // Significantly reduced enemy bullet firing rate!
        const fireChance = 0.0004 + (this.level * 0.0003);

        this.bombers.forEach(b => {
            b.x += this.bomberDir * currentSpeed;
            if (b.x <= 15 || b.x + b.width >= this.width - 15) {
                edgeHit = true;
            }

            if (Math.random() < fireChance) {
                if (b.attackType === 'laser') {
                    const angle = Math.atan2(this.player.y - b.y, (this.player.x + 25) - b.x);
                    const laserSpeed = (4.5 + (this.level * 0.5)) * freezeFactor;
                    this.enemyBombs.push({
                        x: b.x + b.width / 2, y: b.y + b.height,
                        vx: Math.cos(angle) * laserSpeed, vy: Math.sin(angle) * laserSpeed,
                        width: 4, height: 14, color: '#ff0055', type: 'laser'
                    });
                } else if (b.attackType === 'gravity_bomb') {
                    const bombSpeed = (4.0 + (this.level * 0.55)) * freezeFactor;
                    this.enemyBombs.push({
                        x: b.x + b.width / 2 - 4, y: b.y + b.height,
                        vx: 0, vy: bombSpeed,
                        width: 8, height: 12, color: '#ffb700', type: 'bomb'
                    });
                } else if (b.attackType === 'dual_torpedo') {
                    const torpedoSpeed = (3.6 + (this.level * 0.45)) * freezeFactor;
                    this.enemyBombs.push({
                        x: b.x + b.width / 2 - 6, y: b.y + b.height,
                        vx: -1.2, vy: torpedoSpeed, width: 6, height: 10, color: '#00ff66', type: 'torpedo'
                    });
                    this.enemyBombs.push({
                        x: b.x + b.width / 2 + 6, y: b.y + b.height,
                        vx: 1.2, vy: torpedoSpeed, width: 6, height: 10, color: '#00ff66', type: 'torpedo'
                    });
                }
            }

            if (b.y + b.height >= this.height - 130) {
                this.gameOver();
            }
        });

        if (edgeHit) {
            this.bomberDir *= -1;
            const dropStep = 16 + Math.min(10, Math.floor(this.level * 1.5));
            this.bombers.forEach(b => b.y += dropStep);
        }

        const magnetLvl = (this.garageData.upgrades.magnet || 0) + (shipId === 'leviathan' ? 2 : 0);
        const magnetStrength = magnetLvl * 2.0;

        // Update Falling Powerups
        this.powerups.forEach(pw => {
            pw.y += pw.speed;

            if (magnetLvl > 0) {
                const dx = (this.player.x + 25) - pw.x;
                pw.x += Math.sign(dx) * Math.min(Math.abs(dx), magnetStrength);
            }

            if (pw.x < this.player.x + this.player.width && pw.x + pw.width > this.player.x &&
                pw.y < this.player.y + this.player.height && pw.y + pw.height > this.player.y) {
                pw.toRemove = true;

                if (pw.type === 'extra_life') {
                    if (this.lives < this.maxLives) {
                        this.lives++;
                        this.showWaveBanner(`❤️ EXTRA LIFE ACQUIRED! (+1 Warship Life)`);
                    } else {
                        this.addCoins(15, pw.x, pw.y);
                        this.showWaveBanner(`❤️ MAX LIVES! +15 COINS BONUS!`);
                    }
                } else if (pw.type === 'gold_coin') {
                    this.addCoins(15, pw.x, pw.y);
                    this.showWaveBanner(`🪙 GOLD COIN CRATE COLLECTED! +15 COINS!`);
                } else if (pw.type === 'spread') {
                    this.player.spreadTimer = 10;
                    this.showWaveBanner(`⚡ TRIPLE CANNON ACTIVE (10 Seconds)!`);
                } else if (pw.type === 'shield') {
                    this.player.shieldTimer = shipId === 'aegis' ? 16 : 8;
                    this.showWaveBanner(`🛡️ FORCE SHIELD ACTIVE (${this.player.shieldTimer} Seconds)!`);
                } else if (pw.type === 'emp') {
                    this.enemyBombs = [];
                    this.showWaveBanner(`💥 EMP BLAST TRIGGERED — All enemy bombs cleared!`);
                }
            }
        });
        this.powerups = this.powerups.filter(pw => !pw.toRemove && pw.y < this.height + 20);

        // Update Enemy Bombs & Torpedoes
        this.enemyBombs.forEach(bomb => {
            bomb.x += (bomb.vx || 0);
            bomb.y += (bomb.vy || 4);

            if (bomb.x < this.player.x + this.player.width && bomb.x + bomb.width > this.player.x &&
                bomb.y < this.player.y + this.player.height && bomb.y + bomb.height > this.player.y) {
                bomb.toRemove = true;

                if (bomb.isInstaKill) {
                    // BOSS INSTA-KILL BULLET PENETRATES FORCE SHIELD DIRECTLY!
                    this.lives = 0;
                    this.showWaveBanner('💀 INSTA-KILL BULLET PENETRATED FORCE FIELD — WARSHIP DESTROYED!');
                    this.gameOver();
                } else if (this.player.shieldTimer > 0) {
                    for (let i = 0; i < 6; i++) {
                        this.particles.push({
                            x: bomb.x, y: bomb.y,
                            vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                            radius: 3, color: '#00f0ff', life: 0.3
                        });
                    }
                } else {
                    this.lives--;
                    for (let i = 0; i < 18; i++) {
                        this.particles.push({
                            x: this.player.x + 25, y: this.player.y + 12,
                            vx: (Math.random() - 0.5) * 9, vy: (Math.random() - 0.5) * 9,
                            radius: 4, color: '#ff3366', life: 0.45
                        });
                    }

                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }

            this.barricades.forEach(bar => {
                if (bar.health > 0 && bomb.x < bar.x + bar.width && bomb.x + bomb.width > bar.x &&
                    bomb.y < bar.y + bar.height && bomb.y + bomb.height > bar.y) {
                    bomb.toRemove = true;
                    bar.health--;
                }
            });
        });
        this.enemyBombs = this.enemyBombs.filter(b => !b.toRemove && b.y < this.height + 20 && b.x > -20 && b.x < this.width + 20);

        // Update Floating Coin Text Popups
        this.floatingTexts.forEach(ft => {
            ft.y += ft.vy;
            ft.opacity -= dt * 0.8;
        });
        this.floatingTexts = this.floatingTexts.filter(ft => ft.opacity > 0);

        // Update Particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;
        });
        this.particles = this.particles.filter(p => p.life > 0);

        // Update HUD Stats
        document.getElementById('hud-score').innerText = this.score.toLocaleString();
        document.getElementById('hud-coins').innerText = `🪙 ${this.sessionCoins.toLocaleString()}`;
        document.getElementById('hud-level').innerText = `WAVE ${this.level}`;
        document.getElementById('hud-lives').innerText = '❤️ '.repeat(Math.max(0, this.lives));
    }

    destroyBoss() {
        if (!this.boss) return;
        this.score += this.boss.points;
        this.addCoins(this.boss.coinsVal, this.boss.x + 60, this.boss.y + 20);

        this.tryDropPowerup(this.boss.x + 20, this.boss.y + 20, true);
        this.tryDropPowerup(this.boss.x + 60, this.boss.y + 20, true);
        this.tryDropPowerup(this.boss.x + 100, this.boss.y + 20, true);

        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.boss.x + 60, y: this.boss.y + 20,
                vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12,
                radius: 5, color: '#ff0055', life: 0.6
            });
        }

        this.showWaveBanner(`🎉 DREADNOUGHT BOSS DESTROYED! +5,000 PTS & +150 COINS!`);
        this.boss = null;
    }

    gameOver() {
        this.isRunning = false;
        const modal = document.getElementById('gameover-modal');
        document.getElementById('gameover-score').innerText = `${this.score.toLocaleString()} PTS (${this.sessionCoins} 🪙 EARNED)`;

        if (window.navalLeaderboard) {
            window.navalLeaderboard.recordScore('ship_attackers', this.score);
        }

        modal.classList.remove('hidden');
    }

    render() {
        this.ctx.fillStyle = '#050a14';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for (let y = 0; y < this.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        this.barricades.forEach(bar => {
            if (bar.health > 0) {
                const alpha = bar.health / bar.maxHealth;
                this.ctx.fillStyle = `rgba(27, 67, 50, ${alpha})`;
                this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                this.ctx.lineWidth = 2;

                this.ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
                this.ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
            }
        });

        // Draw Dreadnought Boss (Rendered behind bomber fleet)
        if (this.boss) {
            this.ctx.save();
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#ff0055';
            this.ctx.fillStyle = '#1e293b';
            this.ctx.strokeStyle = '#ff0055';
            this.ctx.lineWidth = 3;

            this.ctx.fillRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);
            this.ctx.strokeRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);

            this.ctx.fillStyle = '#ff0055';
            this.ctx.fillRect(this.boss.x + 15, this.boss.y + this.boss.height, 12, 8);
            this.ctx.fillRect(this.boss.x + 93, this.boss.y + this.boss.height, 12, 8);

            const hpRatio = Math.max(0, this.boss.health / this.boss.maxHealth);
            this.ctx.fillStyle = 'rgba(5, 10, 20, 0.8)';
            this.ctx.fillRect(this.boss.x, this.boss.y - 14, this.boss.width, 8);
            this.ctx.fillStyle = '#ff0055';
            this.ctx.fillRect(this.boss.x, this.boss.y - 14, hpRatio * this.boss.width, 8);
            this.ctx.strokeStyle = '#00f0ff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(this.boss.x, this.boss.y - 14, this.boss.width, 8);

            this.ctx.restore();
        }

        // Draw Player Warship
        const currentShipId = this.garageData.equippedShip;
        const shipColor = currentShipId === 'midas' ? '#ffb700' :
                         (currentShipId === 'aegis' ? '#00ff66' :
                         (currentShipId === 'plasma' ? '#ff0055' :
                         (currentShipId === 'gatling' ? '#ff8800' :
                         (currentShipId === 'subzero' ? '#00f0ff' :
                         (currentShipId === 'valkyrie' ? '#e0e7ff' :
                         (currentShipId === 'leviathan' ? '#f43f5e' : '#3a4a58'))))));

        this.ctx.save();
        this.ctx.shadowBlur = 14;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fillStyle = shipColor;
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 2;

        if (this.player.shieldTimer > 0) {
            this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 35, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
        this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(this.player.x + this.player.width / 2 - 3, this.player.y - 8, 6, 8);

        if (currentShipId === 'gatling') {
            this.ctx.fillStyle = '#ff8800';
            this.ctx.fillRect(this.player.x + 8, this.player.y + 2, 4, 6);
            this.ctx.fillRect(this.player.x + 38, this.player.y + 2, 4, 6);
        } else if (currentShipId === 'leviathan') {
            this.ctx.fillStyle = '#f43f5e';
            this.ctx.fillRect(this.player.x + 4, this.player.y - 4, 4, 8);
            this.ctx.fillRect(this.player.x + 16, this.player.y - 6, 4, 8);
            this.ctx.fillRect(this.player.x + 30, this.player.y - 6, 4, 8);
            this.ctx.fillRect(this.player.x + 42, this.player.y - 4, 4, 8);
        }

        this.ctx.restore();

        // Draw Mothership Zeppelin
        if (this.mothership) {
            this.ctx.save();
            this.ctx.shadowBlur = 18;
            this.ctx.shadowColor = this.mothership.color;
            this.ctx.fillStyle = this.mothership.color;
            this.ctx.fillRect(this.mothership.x, this.mothership.y, this.mothership.width, this.mothership.height);
            this.ctx.restore();
        }

        // Draw Valkyrie Homing Missiles
        this.homingMissiles.forEach(m => {
            this.ctx.save();
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = m.color;
            this.ctx.fillStyle = m.color;
            this.ctx.beginPath();
            this.ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw Powerup Crates
        this.powerups.forEach(pw => {
            this.ctx.save();
            this.ctx.shadowBlur = 12;
            const c = pw.type === 'gold_coin' ? '#ffb700' : (pw.type === 'extra_life' ? '#ff3366' : (pw.type === 'spread' ? '#ffb700' : '#00f0ff'));
            this.ctx.shadowColor = c;
            this.ctx.fillStyle = c;
            this.ctx.fillRect(pw.x, pw.y, pw.width, pw.height);

            this.ctx.font = '12px "Inter", sans-serif';
            this.ctx.fillStyle = '#000';
            this.ctx.textAlign = 'center';
            const icon = pw.type === 'gold_coin' ? '🪙' : (pw.type === 'extra_life' ? '❤️' : (pw.type === 'spread' ? '⚡' : (pw.type === 'shield' ? '🛡️' : '💥')));
            this.ctx.fillText(icon, pw.x + pw.width / 2, pw.y + pw.height / 2 + 4);
            this.ctx.restore();
        });

        // Draw Gatling Bullets
        this.gatlingBullets.forEach(gb => {
            this.ctx.save();
            this.ctx.fillStyle = gb.color;
            this.ctx.fillRect(gb.x, gb.y, gb.width, gb.height);
            this.ctx.restore();
        });

        // Draw Player Projectiles (AA Shells)
        this.projectiles.forEach(p => {
            this.ctx.save();
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = p.color;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
            this.ctx.restore();
        });

        // Draw Enemy Bombs / Lasers / Torpedoes / Boss Insta-Kill Bullets
        this.enemyBombs.forEach(b => {
            this.ctx.save();
            this.ctx.shadowBlur = b.isInstaKill ? 16 : 10;
            this.ctx.shadowColor = b.isInstaKill ? '#ff0055' : b.color;
            this.ctx.fillStyle = b.color;
            this.ctx.fillRect(b.x, b.y, b.width, b.height);
            this.ctx.restore();
        });

        // Draw Enemy Bombers
        this.bombers.forEach(b => {
            this.ctx.save();
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = b.color;
            this.ctx.fillStyle = b.color;

            this.ctx.beginPath();
            this.ctx.moveTo(b.x + b.width / 2, b.y + b.height);
            this.ctx.lineTo(b.x + b.width, b.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.closePath();
            this.ctx.fill();

            if (b.maxHealth > 1 && b.health < b.maxHealth) {
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(b.x + 5, b.y + 5);
                this.ctx.lineTo(b.x + b.width - 5, b.y + b.height - 5);
                this.ctx.stroke();
            }

            this.ctx.restore();
        });

        // Draw Floating Text Popups
        this.floatingTexts.forEach(ft => {
            this.ctx.save();
            this.ctx.font = '700 0.85rem "Fira Code", monospace';
            this.ctx.fillStyle = `rgba(255, 183, 0, ${ft.opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(ft.text, ft.x, ft.y);
            this.ctx.restore();
        });

        // Draw Particles
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw Wave Banner Overlay
        if (this.waveBannerTimer > 0) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(10, 25, 47, 0.88)';
            this.ctx.fillRect(0, this.height / 2 - 35, this.width, 70);
            this.ctx.strokeStyle = '#00f0ff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(0, this.height / 2 - 35, this.width, 70);

            this.ctx.font = '700 1.15rem "Orbitron", sans-serif';
            this.ctx.fillStyle = '#ffb700';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.waveBannerText, this.width / 2, this.height / 2 + 8);
            this.ctx.restore();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.shipAttackers = new ShipAttackersEngine();
});
