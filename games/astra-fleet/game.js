/* ASTRA SECTOR — 2D Space Combat & Fleet Hangar Engine */

class SpaceCombatEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.radarCanvas = document.getElementById('radarCanvas');
        this.radarCtx = this.radarCanvas ? this.radarCanvas.getContext('2d') : null;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.isRunning = false;
        this.isPaused = false;
        this.difficulty = localStorage.getItem('astra_difficulty') || 'normal';

        // Player Account Data
        this.credits = parseInt(localStorage.getItem('astra_credits') || '100');
        this.purchasedShips = JSON.parse(localStorage.getItem('astra_purchased_ships') || JSON.stringify(['ship1']));
        this.selectedShipId = localStorage.getItem('astra_selected_ship') || 'ship1';

        this.missionNames = {
            1: "OUTER RIM PERIMETER",
            2: "ASTEROID MINING BELT",
            3: "VOID NEBULA PATROL",
            4: "PIRATE HAVEN SIEGE",
            5: "LEVIATHAN DREADNOUGHT FORTRESS",
            6: "CORSAIR OUTPOST RAID",
            7: "BLACK HOLE ECLIPSE",
            8: "CYBERNETIC BLOCKADE",
            9: "QUANTUM STORM SURGE",
            10: "VOID TITAN SUPERSTAR",
            11: "PLASMA RIFT STRIKE",
            12: "DARK MATTER GRAVEYARD",
            13: "HYPERION CHRONO GATE",
            14: "NEBULA PRIME APEX",
            15: "OMEGA VOID GOD DREADNOUGHT",
            16: "SINGULARITY EVENT HORIZON",
            17: "CYBERNETIC CORE INVASION",
            18: "ABYSSAL VOID NEXUS",
            19: "QUANTUM RIFT ANOMALY",
            20: "HYPERION CHRONO OVERLORD",
            21: "SUPERNOVA BLAST ZONE",
            22: "NEBULA PRIME RUINS",
            23: "VOID CORSAIR FLOTILLA",
            24: "DARK STEALTH CITADEL",
            25: "DARK MATTER GRAVEYARD ARCHON",
            26: "PULSAR SHADOW REALM",
            27: "COSMIC CATACLYSM CORRIDOR",
            28: "TITANIC SIEGE BATTALION",
            29: "APOCALYPSE PRELUDE GATE",
            30: "VOID GOD APOCALYPSE PRIME"
        };

        // Load Mode-Specific Data (Map Progress & Hangar Upgrades per mode)
        this.loadModeData();

        // Definitions of Player Ships (7 Unique Fleet Warships)
        this.shipDefinitions = {
            ship1: {
                id: 'ship1',
                name: 'Vanguard Vector',
                class: 'SCOUT STRIKE FIGHTER',
                price: 0,
                speed: 4.4,
                hull: 130,
                shield: 70,
                shieldRegen: 0.08,
                hullRegen: 0.03,
                damage: 38,
                fireRateDelay: 0.55,
                specialName: 'PHOTON TORPEDO',
                specialSub: 'Explosive Area Salvo',
                specialIcon: '💣',
                specialCdMax: 6.0,
                color: '#00f0ff'
            },
            ship1_5: {
                id: 'ship1_5',
                name: 'Valkyrie Gunship',
                class: 'TACTICAL GUNSHIP',
                price: 4500,
                speed: 4.8,
                hull: 170,
                shield: 100,
                shieldRegen: 0.11,
                hullRegen: 0.04,
                damage: 46,
                fireRateDelay: 0.48,
                specialName: 'QUAD BARRAGE',
                specialSub: '5-Shot Spreading Salvo',
                specialIcon: '⚡',
                specialCdMax: 7.0,
                color: '#00ffcc'
            },
            ship2: {
                id: 'ship2',
                name: 'Aegis Sentinel',
                class: 'HEAVY SHIELD CRUISER',
                price: 9000,
                speed: 3.2,
                hull: 230,
                shield: 150,
                shieldRegen: 0.18,
                hullRegen: 0.05,
                damage: 55,
                fireRateDelay: 0.68,
                specialName: 'BARRIER FIELD',
                specialSub: '4s Invulnerability',
                specialIcon: '🛡️',
                specialCdMax: 12.0,
                color: '#9d00ff'
            },
            ship2_5: {
                id: 'ship2_5',
                name: 'Hyperion Battlecruiser',
                class: 'PLASMA BATTALION CRUISER',
                price: 15000,
                speed: 3.8,
                hull: 280,
                shield: 180,
                shieldRegen: 0.14,
                hullRegen: 0.045,
                damage: 64,
                fireRateDelay: 0.45,
                specialName: 'ION PULSE SURGE',
                specialSub: '450px EMP Stasis Wave',
                specialIcon: '🌊',
                specialCdMax: 9.0,
                color: '#ff0055'
            },
            ship3: {
                id: 'ship3',
                name: 'Phantom Interceptor',
                class: 'STEALTH STRIKE CRAFT',
                price: 22500,
                speed: 5.4,
                hull: 110,
                shield: 60,
                shieldRegen: 0.06,
                hullRegen: 0.02,
                damage: 32,
                fireRateDelay: 0.38,
                specialName: 'EMP SHOCKWAVE',
                specialSub: 'Stun & Damage Radius',
                specialIcon: '⚡',
                specialCdMax: 8.0,
                color: '#00ff66'
            },
            ship3_5: {
                id: 'ship3_5',
                name: 'Eclipse Voidbringer',
                class: 'VOID STEALTH WARSHIP',
                price: 35000,
                speed: 4.6,
                hull: 310,
                shield: 220,
                shieldRegen: 0.16,
                hullRegen: 0.04,
                damage: 78,
                fireRateDelay: 0.34,
                specialName: 'QUANTUM WINGMEN',
                specialSub: 'Deploy Decoy Drones',
                specialIcon: '🛸',
                specialCdMax: 11.0,
                color: '#ff3399'
            },
            ship4: {
                id: 'ship4',
                name: 'Supernova Dreadnought',
                class: 'CAPITAL DREADNOUGHT',
                price: 50000,
                speed: 2.6,
                hull: 360,
                shield: 240,
                shieldRegen: 0.15,
                hullRegen: 0.04,
                damage: 70,
                fireRateDelay: 0.58,
                specialName: 'DEVASTATOR BEAM',
                specialSub: 'Continuous Beam Sweep',
                specialIcon: '💥',
                specialCdMax: 10.0,
                color: '#ffb700'
            },
            ship_secret: {
                id: 'ship_secret',
                name: 'Astra Prime Celestia',
                class: 'CELESTIAL ANCIENT WARSHIP',
                price: 0,
                isSecret: true,
                speed: 5.2,
                hull: 420,
                shield: 300,
                shieldRegen: 0.25,
                hullRegen: 0.06,
                damage: 115,
                fireRateDelay: 0.26,
                specialName: 'CELESTIAL BARRAGE',
                specialSub: '8-Way Screen Vaporizer',
                specialIcon: '🌟',
                specialCdMax: 8.0,
                color: '#00ffff'
            }
        };

        // Player Entity State
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            vx: 0,
            vy: 0,
            radius: 24,
            angle: 0,
            hull: 100,
            maxHull: 100,
            shield: 50,
            maxShield: 50,
            shieldRegen: 0.25,
            lastDamageTime: 0,
            shieldHitTimer: 0,
            specialCdTimer: 0,
            invulnerableTimer: 0,
            beamActiveTimer: 0
        };

        // Inputs
        this.keys = {};
        this.mouse = { x: this.width / 2, y: this.height / 2, down: false, rightDown: false };

        // Entity Containers
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.enemies = [];
        this.asteroids = [];
        this.particles = [];
        this.pickups = [];
        this.damageTextFx = [];
        this.starfield = [];
        this.nebulaClouds = [];

        // Screen Shake FX
        this.shakeTimer = 0;
        this.shakeIntensity = 0;

        // Level Objective Tracker
        this.levelTargetKills = 0;
        this.enemiesKilledCurrentLevel = 0;
        this.levelOreEarned = 0;
        this.bossActive = false;
        this.bossEntity = null;

        this.initCosmos();
        this.initEvents();
        this.initSectorMap();
        this.renderHangarShop();
    }

    hideAllModals() {
        ['start-overlay', 'map-modal', 'hangar-modal', 'victory-modal', 'gameover-overlay', 'pause-overlay', 'boss-hud'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('active');
            }
        });
    }

    initCosmos() {
        this.starfield = [];
        for (let i = 0; i < 220; i++) {
            this.starfield.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2.2 + 0.5,
                alpha: Math.random() * 0.85 + 0.15,
                speed: Math.random() * 0.4 + 0.1,
                color: Math.random() < 0.2 ? '#00f0ff' : (Math.random() < 0.2 ? '#9d00ff' : '#ffffff')
            });
        }

        this.nebulaClouds = [];
        for (let i = 0; i < 6; i++) {
            this.nebulaClouds.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 260 + 140,
                color: i % 3 === 0 ? 'rgba(0, 240, 255, 0.04)' : (i % 3 === 1 ? 'rgba(157, 0, 255, 0.05)' : 'rgba(255, 0, 85, 0.03)'),
                speed: Math.random() * 0.1 + 0.04
            });
        }
    }

    updateDiffUI() {
        const btnNormal = document.getElementById('diff-btn-normal');
        const btnHard = document.getElementById('diff-btn-hard');
        const btnImpossible = document.getElementById('diff-btn-impossible');
        const hudBadge = document.getElementById('hud-diff-badge');

        const resetBtn = (btn) => {
            if (!btn) return;
            btn.style.border = '2px solid #555';
            btn.style.background = 'rgba(255, 255, 255, 0.03)';
            btn.style.color = '#888';
            btn.style.boxShadow = 'none';
        };

        resetBtn(btnNormal);
        resetBtn(btnHard);
        resetBtn(btnImpossible);

        if (this.difficulty === 'impossible') {
            if (btnImpossible) {
                btnImpossible.style.border = '2px solid #9d00ff';
                btnImpossible.style.background = 'rgba(157, 0, 255, 0.35)';
                btnImpossible.style.color = '#ff0055';
                btnImpossible.style.boxShadow = '0 0 20px rgba(157, 0, 255, 0.8)';
            }
            if (hudBadge) {
                hudBadge.innerText = '☠️ IMPOSSIBLE';
                hudBadge.style.color = '#ff0055';
            }
        } else if (this.difficulty === 'hard') {
            if (btnHard) {
                btnHard.style.border = '2px solid #ff0055';
                btnHard.style.background = 'rgba(255, 0, 85, 0.3)';
                btnHard.style.color = '#ff0055';
                btnHard.style.boxShadow = '0 0 18px rgba(255, 0, 85, 0.6)';
            }
            if (hudBadge) {
                hudBadge.innerText = '🔥 HARD MODE';
                hudBadge.style.color = '#ff0055';
            }
        } else {
            if (btnNormal) {
                btnNormal.style.border = '2px solid #00f0ff';
                btnNormal.style.background = 'rgba(0, 240, 255, 0.3)';
                btnNormal.style.color = '#00f0ff';
                btnNormal.style.boxShadow = '0 0 18px rgba(0, 240, 255, 0.6)';
            }
            if (hudBadge) {
                hudBadge.innerText = '🟢 NORMAL';
                hudBadge.style.color = '#00f0ff';
            }
        }
    }

    loadModeData() {
        const mode = this.difficulty || 'normal';
        let unlockedKey = `astra_unlocked_level_${mode}`;
        let completedKey = `astra_completed_levels_${mode}`;
        let upgradesKey = `astra_upgrades_${mode}`;

        // Backward compatibility migration for normal mode
        if (!localStorage.getItem(unlockedKey) && mode === 'normal' && localStorage.getItem('astra_unlocked_level')) {
            localStorage.setItem(unlockedKey, localStorage.getItem('astra_unlocked_level'));
        }
        if (!localStorage.getItem(completedKey) && mode === 'normal' && localStorage.getItem('astra_completed_levels')) {
            localStorage.setItem(completedKey, localStorage.getItem('astra_completed_levels'));
        }
        if (!localStorage.getItem(upgradesKey) && mode === 'normal' && localStorage.getItem('astra_upgrades')) {
            localStorage.setItem(upgradesKey, localStorage.getItem('astra_upgrades'));
        }

        this.unlockedLevel = parseInt(localStorage.getItem(unlockedKey) || '1');
        this.completedLevels = JSON.parse(localStorage.getItem(completedKey) || '[]');
        this.currentLevel = this.unlockedLevel;

        const defaultUpgrades = {
            maxHull: 0,
            shieldCapacity: 0,
            shieldRecharge: 0,
            damage: 0,
            fireRate: 0,
            engineSpeed: 0,
            cooldown: 0
        };
        this.upgrades = JSON.parse(localStorage.getItem(upgradesKey) || JSON.stringify(defaultUpgrades));
    }

    saveModeData() {
        const mode = this.difficulty || 'normal';
        localStorage.setItem(`astra_unlocked_level_${mode}`, this.unlockedLevel.toString());
        localStorage.setItem(`astra_completed_levels_${mode}`, JSON.stringify(this.completedLevels));
        localStorage.setItem(`astra_upgrades_${mode}`, JSON.stringify(this.upgrades));
        localStorage.setItem('astra_credits', this.credits.toString());
        localStorage.setItem('astra_purchased_ships', JSON.stringify(this.purchasedShips));
        localStorage.setItem('astra_selected_ship', this.selectedShipId);
        localStorage.setItem('astra_difficulty', mode);
    }

    setDifficulty(mode) {
        if (this.difficulty !== mode) {
            this.saveModeData();
            this.difficulty = mode;
            this.loadModeData();
            this.updateDiffUI();
            if (window.soundSynth) window.soundSynth.playPickupSound();

            const hangarModal = document.getElementById('hangar-modal');
            if (hangarModal && hangarModal.classList.contains('active')) {
                this.renderHangarShop();
            }
            const mapModal = document.getElementById('map-modal');
            if (mapModal && mapModal.classList.contains('active')) {
                this.initSectorMap();
            }
        }
    }

    initEvents() {
        if (window.navalAuth) {
            const user = window.navalAuth.getCurrentUser();
            const userEl = document.getElementById('user-name');
            if (userEl) userEl.innerText = user.username;
        }

        this.updateDiffUI();

        const btnNormal = document.getElementById('diff-btn-normal');
        const btnHard = document.getElementById('diff-btn-hard');
        const btnImpossible = document.getElementById('diff-btn-impossible');
        if (btnNormal) {
            btnNormal.onclick = (e) => {
                e.stopPropagation();
                this.setDifficulty('normal');
                this.logTerminal('[MODE] Switched to NORMAL COMBAT DIFFICULTY', 'sys');
            };
        }
        if (btnHard) {
            btnHard.onclick = (e) => {
                e.stopPropagation();
                this.setDifficulty('hard');
                this.logTerminal('[MODE] Switched to 🔥 HARD MODE DIFFICULTY!', 'danger');
            };
        }
        if (btnImpossible) {
            btnImpossible.onclick = (e) => {
                e.stopPropagation();
                this.setDifficulty('impossible');
                this.logTerminal('[MODE] Switched to ☠️ IMPOSSIBLE MODE DIFFICULTY!', 'danger');
            };
        }

        const btnSecret = document.getElementById('btn-secret-anomaly');
        if (btnSecret) {
            btnSecret.onclick = (e) => {
                e.stopPropagation();
                window.soundSynth.playBossWarning();
                this.logTerminal('[CLASSIFIED] Secret Anomaly Triggered! Launching Secret Dual Boss Mission!', 'danger');
                this.startSecretMission();
            };
        }

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.initCosmos();
        });

        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ' || e.code === 'Space') {
                if (this.isRunning && !this.isPaused) e.preventDefault();
            }
            if (['ShiftLeft', 'ShiftRight', 'KeyE', 'KeyQ'].includes(e.code) || e.key.toLowerCase() === 'e') {
                if (this.isRunning && !this.isPaused) this.triggerSpecialAbility();
            }
            if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.down = true;
            if (e.button === 2) {
                e.preventDefault();
                this.mouse.rightDown = true;
                if (this.isRunning && !this.isPaused) this.triggerSpecialAbility();
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.down = false;
            if (e.button === 2) this.mouse.rightDown = false;
        });

        window.addEventListener('contextmenu', (e) => e.preventDefault());

        // Sound Toggle Buttons
        document.querySelectorAll('.btn-toggle-audio').forEach(btn => {
            btn.onclick = () => {
                window.soundSynth.toggleSound();
            };
        });

        // Navigation & Modal Buttons
        document.getElementById('btn-start-game').onclick = () => this.startLevel(this.unlockedLevel);
        document.getElementById('btn-open-map').onclick = () => this.openMapModal();
        document.getElementById('btn-start-hangar').onclick = () => this.openHangarModal();
        document.getElementById('btn-map').onclick = () => this.openMapModal();
        document.getElementById('btn-upgrades').onclick = () => this.openHangarModal();
        document.getElementById('btn-pause').onclick = () => this.togglePause();
        document.getElementById('btn-resume').onclick = () => this.togglePause();

        document.getElementById('btn-close-map').onclick = () => this.closeMapModal();
        document.getElementById('btn-close-hangar').onclick = () => this.closeHangarModal();

        document.getElementById('tab-btn-ships').onclick = () => this.switchHangarTab('ships');
        document.getElementById('tab-btn-upgrades').onclick = () => this.switchHangarTab('upgrades');

        document.getElementById('btn-next-level').onclick = () => {
            this.startLevel(this.unlockedLevel);
        };
        document.getElementById('btn-victory-hangar').onclick = () => {
            this.openHangarModal();
        };
        document.getElementById('btn-victory-map').onclick = () => {
            this.openMapModal();
        };

        document.getElementById('btn-restart').onclick = () => {
            this.startLevel(this.currentLevel);
        };
        document.getElementById('btn-go-upgrades').onclick = () => {
            this.openHangarModal();
        };
        document.getElementById('btn-go-map').onclick = () => {
            this.openMapModal();
        };
        document.getElementById('btn-pause-hangar').onclick = () => {
            this.togglePause();
            this.openHangarModal();
        };
        document.getElementById('btn-pause-map').onclick = () => {
            this.togglePause();
            this.openMapModal();
        };

        document.getElementById('btn-launch-selected-level').onclick = () => {
            const selectedLvl = parseInt(document.getElementById('btn-launch-selected-level').getAttribute('data-level') || '1');
            this.startLevel(selectedLvl);
        };
    }

    // --- LEVEL SECTOR MAP SYSTEM ---
    initSectorMap() {
        const container = document.getElementById('sector-nodes-container');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 1; i <= 30; i++) {
            const isBoss = (this.difficulty === 'impossible' ? (i % 3 === 0) : (i % 5 === 0));
            const isDualBoss = (i === 15 || i === 30);
            const isUnlocked = (i <= this.unlockedLevel);
            const isCompleted = this.completedLevels.includes(i);
            const missionName = this.missionNames[i] || `SECTOR ${i}`;

            const node = document.createElement('div');
            let nodeClass = `sector-node-card ${isBoss ? 'boss-node' : ''} ${isCompleted ? 'completed' : ''} ${isUnlocked ? '' : 'locked'}`;
            if (i === this.unlockedLevel) nodeClass += ' active';
            node.className = nodeClass;
            node.setAttribute('data-level', i);

            let statusTag = 'LOCKED';
            let tagClass = 'locked';
            if (isCompleted) { statusTag = 'COMPLETED ✓'; tagClass = 'completed'; }
            else if (isUnlocked) { statusTag = isDualBoss ? '⚔️ DUAL BOSS 👑' : (isBoss ? 'BOSS TARGET 👑' : 'UNLOCKED'); tagClass = isBoss ? 'boss' : 'unlocked'; }

            node.innerHTML = `
                <div class="node-header">
                    <span class="node-number">LEVEL ${i}</span>
                    <span class="node-status-tag ${tagClass}">${statusTag}</span>
                </div>
                <div class="node-title">${isDualBoss ? '⚔️ ' + missionName : (isBoss ? '👑 ' + missionName : missionName)}</div>
            `;

            node.onclick = () => {
                if (!isUnlocked) return;
                document.querySelectorAll('.sector-node-card').forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                this.selectLevelDetails(i);
            };

            container.appendChild(node);
        }

        // Auto select most recently unlocked level
        this.selectLevelDetails(this.unlockedLevel);
    }

    selectLevelDetails(lvl) {
        const isBoss = (lvl % 5 === 0);
        const enemyCount = isBoss ? 1 : Math.min(25, 6 + (lvl * 2));
        const rewardBonus = lvl * 150;
        const missionName = this.missionNames[lvl] || `SECTOR ${lvl}`;

        document.getElementById('sel-level-title').innerText = `LEVEL ${lvl}: ${missionName}`;
        document.getElementById('sel-level-badge').className = `level-badge ${isBoss ? 'boss' : 'normal'}`;
        document.getElementById('sel-level-badge').innerText = isBoss ? '⚠️ BOSS LEVIATHAN' : 'NORMAL COMBAT SECTOR';
        document.getElementById('sel-level-desc').innerText = isBoss ? 
            'Engage colossal Void Dreadnought Leviathan with multi-phase bullet hell attacks!' : 
            `Engage and eliminate ${enemyCount} hostile enemy ships patrolling Sector ${lvl}.`;

        document.getElementById('sel-level-enemies').innerText = isBoss ? '1 (BOSS)' : enemyCount;
        document.getElementById('sel-level-boss').innerText = isBoss ? 'YES (DREADNOUGHT)' : 'NO';
        document.getElementById('sel-level-reward').innerText = `+${rewardBonus} Ore`;

        const btn = document.getElementById('btn-launch-selected-level');
        btn.innerText = `🚀 LAUNCH LEVEL ${lvl}`;
        btn.setAttribute('data-level', lvl);
        btn.disabled = (lvl > this.unlockedLevel);
    }

    hideAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });
        const bossHud = document.getElementById('boss-hud');
        if (bossHud) {
            bossHud.classList.add('hidden');
            bossHud.classList.remove('active');
            bossHud.style.display = 'none';
        }
    }

    openMapModal() {
        this.hideAllModals();
        this.initSectorMap();
        const mapModal = document.getElementById('map-modal');
        if (mapModal) {
            mapModal.classList.remove('hidden');
            mapModal.classList.add('active');
        }
    }

    closeMapModal() {
        this.hideAllModals();
        if (!this.isRunning) {
            const startModal = document.getElementById('start-overlay');
            if (startModal) {
                startModal.classList.remove('hidden');
                startModal.classList.add('active');
            }
        }
    }

    // --- HANGAR & UPGRADES SHOP SYSTEM ---
    openHangarModal() {
        this.hideAllModals();
        this.renderHangarShop();
        const hangarModal = document.getElementById('hangar-modal');
        if (hangarModal) {
            hangarModal.classList.remove('hidden');
            hangarModal.classList.add('active');
        }
    }

    closeHangarModal() {
        this.hideAllModals();
        if (!this.isRunning) {
            const startModal = document.getElementById('start-overlay');
            if (startModal) {
                startModal.classList.remove('hidden');
                startModal.classList.add('active');
            }
        }
    }

    switchHangarTab(tab) {
        document.getElementById('tab-btn-ships').classList.toggle('active', tab === 'ships');
        document.getElementById('tab-btn-upgrades').classList.toggle('active', tab === 'upgrades');

        document.getElementById('tab-ships-content').classList.toggle('active', tab === 'ships');
        document.getElementById('tab-upgrades-content').classList.toggle('active', tab === 'upgrades');
        document.getElementById('tab-ships-content').classList.toggle('hidden', tab !== 'ships');
        document.getElementById('tab-upgrades-content').classList.toggle('hidden', tab !== 'upgrades');
    }

    renderHangarShop() {
        document.getElementById('hangar-credits-display').innerText = `🪙 ${this.credits.toLocaleString()} ORE`;

        // Render Ships
        const shipsContainer = document.getElementById('ships-grid-container');
        if (shipsContainer) {
            shipsContainer.innerHTML = '';
            for (let id in this.shipDefinitions) {
                const def = this.shipDefinitions[id];
                const isPurchased = this.purchasedShips.includes(id);
                const isEquipped = (this.selectedShipId === id);

                const card = document.createElement('div');
                card.className = `ship-card ${isEquipped ? 'equipped' : ''}`;
                card.innerHTML = `
                    <div class="ship-header">
                        <div>
                            <div class="ship-name">${def.name}</div>
                            <div class="ship-class">${def.class}</div>
                        </div>
                        <div style="font-size: 28px;">${def.specialIcon}</div>
                    </div>
                    <div class="ship-stats-list">
                        <div class="ship-stat-row">
                            <span class="stat-label">Hull Strength:</span>
                            <div class="stat-bar-small"><div class="stat-fill-small" style="width: ${(def.hull / 300) * 100}%;"></div></div>
                            <strong>${def.hull} HP</strong>
                        </div>
                        <div class="ship-stat-row">
                            <span class="stat-label">Force Shield:</span>
                            <div class="stat-bar-small"><div class="stat-fill-small" style="width: ${(def.shield / 200) * 100}%; background: var(--neon-cyan);"></div></div>
                            <strong>${def.shield} Shield</strong>
                        </div>
                        <div class="ship-stat-row">
                            <span class="stat-label">Thruster Speed:</span>
                            <div class="stat-bar-small"><div class="stat-fill-small" style="width: ${(def.speed / 8) * 100}%; background: var(--amber-gold);"></div></div>
                            <strong>${def.speed} Mach</strong>
                        </div>
                        <div class="ship-stat-row">
                            <span class="stat-label">Special Ability:</span>
                            <strong style="color: var(--neon-cyan);">${def.specialName} (${def.specialSub})</strong>
                        </div>
                    </div>
                    <button class="btn-primary-large btn-ship-action" data-id="${id}" style="width: 100%; margin-top: 10px;">
                        ${isEquipped ? 'EQUIPPED ✓' : (isPurchased ? 'EQUIP SHIP' : `BUY SHIP (🪙 ${def.price} Ore)`)}
                    </button>
                `;

                const actionBtn = card.querySelector('.btn-ship-action');
                actionBtn.disabled = isEquipped || (!isPurchased && this.credits < def.price);

                actionBtn.onclick = () => {
                    if (isEquipped) return;
                    if (isPurchased) {
                        this.selectedShipId = id;
                        this.saveModeData();
                        this.renderHangarShop();
                    } else if (this.credits >= def.price) {
                        this.credits -= def.price;
                        this.purchasedShips.push(id);
                        this.selectedShipId = id;
                        this.saveModeData();
                        window.soundSynth.playPickupSound();
                        this.renderHangarShop();
                    }
                };

                shipsContainer.appendChild(card);
            }
        }

        // Render Upgrades
        const upgradesContainer = document.getElementById('upgrades-grid-container');
        if (upgradesContainer) {
            upgradesContainer.innerHTML = '';
            const upgradeTypes = [
                { id: 'maxHull', title: 'Max Hull Capacity', desc: '+30 HP to Flagship Hull', icon: '❤️', costBase: 450 },
                { id: 'shieldCapacity', title: 'Force Shield Matrix', desc: '+25 HP to Force Shield', icon: '🛡️', costBase: 550 },
                { id: 'shieldRecharge', title: 'Shield Generator', desc: '+0.15 Shield Regen per sec', icon: '⚡', costBase: 650 },
                { id: 'damage', title: 'Plasma Cannon Power', desc: '+4 Base Damage per laser shot', icon: '🔫', costBase: 600 },
                { id: 'fireRate', title: 'Rapid Fire Coils', desc: '+15% Weapon Firing Speed', icon: '🚀', costBase: 750 },
                { id: 'engineSpeed', title: 'Ion Thrusters', desc: '+10% Engine Movement Speed', icon: '💨', costBase: 500 },
                { id: 'cooldown', title: 'Ability Overclock', desc: '-15% Special Ability Cooldown', icon: '⏱️', costBase: 850 }
            ];

            upgradeTypes.forEach(upg => {
                const currentLvl = this.upgrades[upg.id] || 0;
                const maxLvl = 5;
                const cost = upg.costBase * (currentLvl + 1);

                const card = document.createElement('div');
                card.className = 'upg-card';
                card.innerHTML = `
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span class="upg-icon">${upg.icon}</span>
                        <div>
                            <div class="upg-title">${upg.title}</div>
                            <div class="upg-lvl">LEVEL ${currentLvl} / ${maxLvl}</div>
                        </div>
                    </div>
                    <div class="upg-desc">${upg.desc}</div>
                    <button class="btn-accent-large btn-upg-action" style="width: 100%; font-size: 11px; padding: 8px;">
                        ${currentLvl >= maxLvl ? 'MAXED OUT ✓' : `UPGRADE (🪙 ${cost} Ore)`}
                    </button>
                `;

                const btn = card.querySelector('.btn-upg-action');
                btn.disabled = (currentLvl >= maxLvl || this.credits < cost);

                btn.onclick = () => {
                    if (currentLvl < maxLvl && this.credits >= cost) {
                        this.credits -= cost;
                        this.upgrades[upg.id] = currentLvl + 1;
                        this.saveModeData();
                        window.soundSynth.playPickupSound();
                        this.renderHangarShop();
                    }
                };

                upgradesContainer.appendChild(card);
            });
        }
    }

    // --- GAMEPLAY & LEVEL MANAGEMENT ---
    applyPlayerStats() {
        const shipDef = this.shipDefinitions[this.selectedShipId] || this.shipDefinitions.ship1;

        const maxHull = shipDef.hull + (this.upgrades.maxHull * 30);
        const maxShield = shipDef.shield + (this.upgrades.shieldCapacity * 25);
        const shieldRegen = shipDef.shieldRegen + (this.upgrades.shieldRecharge * 0.04);
        const hullRegen = (shipDef.hullRegen || 0.03) + (this.upgrades.maxHull * 0.01);
        const speed = shipDef.speed * (1 + (this.upgrades.engineSpeed * 0.10));

        this.player.maxHull = maxHull;
        this.player.hull = maxHull;
        this.player.maxShield = maxShield;
        this.player.shield = maxShield;
        this.player.shieldRegen = shieldRegen;
        this.player.hullRegen = hullRegen;
        this.player.speed = speed;
        this.player.specialCdTimer = 0;
        this.player.invulnerableTimer = 0;
        this.player.beamActiveTimer = 0;

        // UI HUD Ability setup
        document.getElementById('ship-weapon-name').innerText = shipDef.name.toUpperCase() + ' CANNON';
        document.getElementById('special-icon').innerText = shipDef.specialIcon;
        document.getElementById('special-name').innerText = shipDef.specialName;
        document.getElementById('special-sub').innerText = shipDef.specialSub;
    }

    startLevel(levelNumber = 1) {
        this.currentLevel = levelNumber;
        this.applyPlayerStats();

        this.player.x = this.width / 2;
        this.player.y = this.height / 2;
        this.player.vx = 0;
        this.player.vy = 0;

        this.projectiles = [];
        this.enemyProjectiles = [];
        this.enemies = [];
        this.asteroids = [];
        this.particles = [];
        this.pickups = [];
        this.damageTextFx = [];

        this.enemiesKilledCurrentLevel = 0;
        this.levelOreEarned = 0;

        // HIDE ALL SCREENS & OVERLAYS COMPLETELY
        this.hideAllModals();

        const isBossLevel = (this.difficulty === 'impossible' ? (levelNumber % 3 === 0) : (levelNumber % 5 === 0));
        const isDualBoss = (levelNumber === 15 || levelNumber === 30);
        this.bossActive = isBossLevel;

        const bossHud = document.getElementById('boss-hud');
        if (bossHud) {
            if (isBossLevel) {
                bossHud.classList.remove('hidden');
                bossHud.classList.add('active');
                bossHud.style.display = 'flex';
            } else {
                bossHud.classList.add('hidden');
                bossHud.classList.remove('active');
                bossHud.style.display = 'none';
            }
        }

        if (isBossLevel) {
            const escortCount = (levelNumber >= 15 ? 6 : (levelNumber >= 10 ? 4 : 2)) * (this.difficulty === 'impossible' ? 3 : (this.difficulty === 'hard' ? 2 : 1));
            const bossCount = isDualBoss ? 2 : 1;
            this.levelTargetKills = bossCount + escortCount;
            const diffTag = this.difficulty === 'impossible' ? '(☠️ IMPOSSIBLE)' : (this.difficulty === 'hard' ? '(🔥 HARD)' : '');
            document.getElementById('obj-text').innerText = `TARGET: Defeat ${isDualBoss ? '2 DUAL BOSSES' : 'Boss'} & Destroy All ${escortCount} Escorts ${diffTag}`;
            this.spawnBoss(levelNumber);
        } else {
            let totalEnemies = Math.min(60, 6 + Math.floor(levelNumber * 2.2));
            if (this.difficulty === 'impossible') {
                totalEnemies = Math.floor(totalEnemies * 2.5); // 150% more ships on Impossible!
            } else if (this.difficulty === 'hard') {
                totalEnemies = Math.floor(totalEnemies * 1.8);
            }
            this.levelTargetKills = totalEnemies;
            const diffTag = this.difficulty === 'impossible' ? '(☠️ IMPOSSIBLE MODE)' : (this.difficulty === 'hard' ? '(🔥 HARD MODE)' : '');
            document.getElementById('obj-text').innerText = `TARGET: Destroy All ${totalEnemies} Hostile Ships ${diffTag}`;
            this.spawnLevelEnemies(levelNumber, totalEnemies);
        }

        // Spawn ambient asteroids
        const asteroidCount = 4 + Math.floor(Math.random() * 4);
        for (let i = 0; i < asteroidCount; i++) {
            this.asteroids.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 24 + 16,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                health: 50,
                maxHealth: 50,
                oreValue: Math.floor(Math.random() * 30) + 20,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.03
            });
        }

        const missionName = this.missionNames[levelNumber] || `SECTOR ${levelNumber}`;
        document.getElementById('wave-text').innerText = `SECTOR ${levelNumber}: ${missionName}`;

        this.isRunning = true;
        this.isPaused = false;

        window.soundSynth.startSpaceMusic();
        this.logTerminal(`[MISSION] Entering Sector ${levelNumber}: ${missionName}. Systems armed!`, 'agent');

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    spawnLevelEnemies(levelNumber, count) {
        for (let i = 0; i < count; i++) {
            let x, y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? -40 : this.width + 40;
                y = Math.random() * this.height;
            } else {
                x = Math.random() * this.width;
                y = Math.random() < 0.5 ? -40 : this.height + 40;
            }

            let type = 'scout';
            const r = Math.random();

            if (this.difficulty === 'impossible') {
                // Impossible mode: 90% high-tier spawns (cruiser, frigate, interceptor, bomber, gunship)!
                if (r > 0.72) type = 'cruiser';
                else if (r > 0.52) type = 'frigate';
                else if (r > 0.35) type = 'interceptor';
                else if (r > 0.20) type = 'bomber';
                else if (r > 0.08) type = 'gunship';
                else type = 'scout';
            } else if (this.difficulty === 'hard') {
                // Hard mode: Stronger ships spawn much more frequently across ALL levels!
                if (r > 0.80) type = 'cruiser';
                else if (r > 0.62) type = 'frigate';
                else if (r > 0.44) type = 'interceptor';
                else if (r > 0.28) type = 'bomber';
                else if (r > 0.14) type = 'gunship';
                else type = 'scout';
            } else {
                if (levelNumber >= 2 && r > 0.7) type = 'gunship';
                if (levelNumber >= 3 && r > 0.75) type = 'bomber';
                if (levelNumber >= 4 && r > 0.8) type = 'interceptor';
                if (levelNumber >= 5 && r > 0.85) type = 'frigate';
                if (levelNumber >= 6 && r > 0.88) type = 'cruiser';
            }

            let hpMultiplier = 1 + (levelNumber * 0.35);
            let dmgMultiplier = 1 + (levelNumber * 0.25);
            if (this.difficulty === 'impossible') {
                hpMultiplier *= 1.75; // 75% extra HP in Impossible mode
                dmgMultiplier *= 1.50; // 50% extra damage in Impossible mode
            } else if (this.difficulty === 'hard') {
                hpMultiplier *= 1.35; // 35% extra HP in Hard mode
                dmgMultiplier *= 1.25; // 25% extra damage in Hard mode
            }

            const hpBase = type === 'cruiser' ? 220 : (type === 'frigate' ? 160 : (type === 'bomber' ? 140 : (type === 'gunship' ? 110 : (type === 'interceptor' ? 90 : 50))));
            const radius = type === 'cruiser' ? 34 : (type === 'frigate' ? 28 : (type === 'gunship' ? 24 : (type === 'bomber' ? 22 : 18)));
            const speed = type === 'scout' ? 1.6 : (type === 'interceptor' ? 2.4 : (type === 'bomber' ? 2.0 : (type === 'gunship' ? 1.2 : 0.8)));

            this.enemies.push({
                id: Math.random(),
                type: type,
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                radius: radius,
                health: hpBase * hpMultiplier,
                maxHealth: hpBase * hpMultiplier,
                shield: type === 'cruiser' || type === 'frigate' ? 80 * hpMultiplier : 0,
                maxShield: type === 'cruiser' || type === 'frigate' ? 80 * hpMultiplier : 0,
                speed: speed,
                color: type === 'cruiser' ? '#ff0055' : (type === 'frigate' ? '#00f0ff' : (type === 'gunship' ? '#ffb700' : (type === 'interceptor' ? '#9d00ff' : (type === 'bomber' ? '#ff3300' : '#00ff66')))),
                fireTimer: Math.random() * 2,
                cloakTimer: 0,
                isCloaked: false,
                fireInterval: type === 'interceptor' ? 2.8 : (type === 'gunship' ? 3.8 : (type === 'cruiser' ? 4.8 : 4.2)),
                damage: 25 * dmgMultiplier
            });
        }
    }

    spawnBoss(levelNumber) {
        window.soundSynth.playBossWarning();
        this.triggerScreenShake(24, 0.8);

        let bossName = "VOID LEVIATHAN";
        let bossColor = "#00f0ff";
        let bossHpMult = this.difficulty === 'impossible' ? 1.5 : (this.difficulty === 'hard' ? 1.25 : 1.0);
        let bossShieldMult = this.difficulty === 'impossible' ? 1.5 : (this.difficulty === 'hard' ? 1.25 : 1.0);
        let baseHp = 2500 * bossHpMult;
        let baseShield = 800 * bossShieldMult;
        let radius = 70;
        let tier = 1;

        if (levelNumber >= 30) {
            bossName = "VOID GOD APOCALYPSE PRIME";
            bossColor = "#ff0055";
            baseHp = 6500 * bossHpMult;
            baseShield = 2200 * bossShieldMult;
            radius = 110;
            tier = 6;
        } else if (levelNumber >= 25) {
            bossName = "DARK MATTER GRAVEYARD ARCHON";
            bossColor = "#e000ff";
            baseHp = 5800 * bossHpMult;
            baseShield = 1800 * bossShieldMult;
            radius = 100;
            tier = 5;
        } else if (levelNumber >= 20) {
            bossName = "HYPERION CHRONO OVERLORD";
            bossColor = "#00ffcc";
            baseHp = 5000 * bossHpMult;
            baseShield = 1500 * bossShieldMult;
            radius = 95;
            tier = 4;
        } else if (levelNumber >= 15) {
            bossName = "OMEGA VOID GOD DREADNOUGHT";
            bossColor = "#ffb700";
            baseHp = 4200 * bossHpMult;
            baseShield = 1200 * bossShieldMult;
            radius = 90;
            tier = 3;
        } else if (levelNumber >= 10) {
            bossName = "CYBERNETIC VOID TITAN";
            bossColor = "#9d00ff";
            baseHp = 3400 * bossHpMult;
            baseShield = 1000 * bossShieldMult;
            radius = 80;
            tier = 2;
        }

        // Enforce maximum 10,000 HP cap for any single boss
        baseHp = Math.min(10000, baseHp);

        const isDualBoss = (levelNumber === 15 || levelNumber === 30);
        const bossCount = isDualBoss ? 2 : 1;

        if (isDualBoss) {
            baseHp = 5000; // Dual/double bosses have exactly 5,000 HP each!
            baseShield = 1200;
        }

        for (let b = 0; b < bossCount; b++) {
            const spawnX = bossCount === 1 ? this.width / 2 : (b === 0 ? this.width * 0.32 : this.width * 0.68);
            const targetY = bossCount === 1 ? 180 : (b === 0 ? 170 : 210);

            const bEntity = {
                id: 'boss_' + b,
                type: 'boss_dreadnought',
                bossTier: tier,
                x: spawnX,
                y: -120 - (b * 60),
                targetY: targetY,
                vx: 0,
                vy: 0,
                radius: radius,
                health: baseHp,
                maxHealth: baseHp,
                shield: baseShield,
                maxShield: baseShield,
                speed: 0.8,
                color: bossColor,
                fireTimer: Math.random() * 2,
                spawnTimer: Math.random() * 2,
                attackIndex: 0,
                phase: 1,
                damage: 35 + (tier * 10)
            };
            this.enemies.push(bEntity);
            if (b === 0) this.bossEntity = bEntity;
        }

        document.getElementById('boss-name').innerText = `${isDualBoss ? '⚔️ DUAL BOSS: ' : ''}${bossName} (LEVEL ${levelNumber})`;
        this.logTerminal(`[WARNING] ${isDualBoss ? 'DUAL DREADNOUGHT BOSSES DETECTED!' : 'BOSS DETECTED!'} ${bossName} INCOMING WITH ESCORT FLEET!`, 'danger');
    }

    // --- CONTROLS & SPECIAL ABILITIES ---
    triggerSpecialAbility() {
        if (!this.isRunning || this.player.specialCdTimer > 0) return;

        const shipDef = this.shipDefinitions[this.selectedShipId] || this.shipDefinitions.ship1;
        const cdMultiplier = 1 - (this.upgrades.cooldown * 0.15);
        this.player.specialCdTimer = shipDef.specialCdMax * cdMultiplier;

        window.soundSynth.playSpecialAbility();

        if (this.selectedShipId === 'ship1') {
            // Photon Torpedo Blast
            const angle = Math.atan2(this.mouse.y - this.player.y, this.mouse.x - this.player.x);
            window.soundSynth.playTorpedoSound();
            for (let i = 0; i < 3; i++) {
                this.projectiles.push({
                    x: this.player.x,
                    y: this.player.y,
                    vx: Math.cos(angle + (i - 1) * 0.25) * 14,
                    vy: Math.sin(angle + (i - 1) * 0.25) * 14,
                    damage: 60,
                    radius: 8,
                    isTorpedo: true,
                    color: '#ffb700'
                });
            }
            this.logTerminal('[ABILITY] Launched Triple Photon Torpedo Salvo!', 'agent');
        } else if (this.selectedShipId === 'ship2') {
            // Aegis Barrier Field (Invulnerability for 4s)
            this.player.invulnerableTimer = 4.0;
            this.player.shield = this.player.maxShield;
            this.triggerScreenShake(8, 0.3);
            this.logTerminal('[ABILITY] Aegis Invulnerability Barrier Field Activated!', 'agent');
        } else if (this.selectedShipId === 'ship3') {
            // EMP Shockwave
            const shockRadius = 320;
            this.enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
                if (dist < shockRadius) {
                    enemy.health -= 80;
                    enemy.vx = (enemy.x - this.player.x) * 0.08;
                    enemy.vy = (enemy.y - this.player.y) * 0.08;
                    this.addDamageText(enemy.x, enemy.y, 'EMP -80', '#00ff66');
                }
            });
            for (let i = 0; i < 40; i++) {
                this.particles.push({
                    x: this.player.x, y: this.player.y,
                    radius: Math.random() * 8 + 3,
                    color: '#00ff66',
                    vx: (Math.random() - 0.5) * 16,
                    vy: (Math.random() - 0.5) * 16,
                    life: 0.45
                });
            }
            this.triggerScreenShake(12, 0.4);
            this.logTerminal('[ABILITY] EMP Shockwave detonated!', 'agent');
        } else if (this.selectedShipId === 'ship1_5') {
            // Quad Laser Barrage (5-shot spreading salvo)
            const angle = Math.atan2(this.mouse.y - this.player.y, this.mouse.x - this.player.x);
            for (let i = -2; i <= 2; i++) {
                this.projectiles.push({
                    x: this.player.x, y: this.player.y,
                    vx: Math.cos(angle + i * 0.15) * 13,
                    vy: Math.sin(angle + i * 0.15) * 13,
                    damage: 55, color: '#00ffcc', radius: 6
                });
            }
            this.logTerminal('[ABILITY] Quad Laser Barrage salvo launched!', 'agent');
        } else if (this.selectedShipId === 'ship2_5') {
            // Ion Pulse Surge (450px EMP wave)
            const shockRadius = 450;
            this.enemies.forEach(enemy => {
                const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
                if (dist < shockRadius) {
                    enemy.health -= 110;
                    enemy.vx = (enemy.x - this.player.x) * 0.12;
                    enemy.vy = (enemy.y - this.player.y) * 0.12;
                    this.addDamageText(enemy.x, enemy.y, 'ION PULSE -110', '#ff0055');
                }
            });
            this.player.shield = Math.min(this.player.maxShield, this.player.shield + (this.player.maxShield * 0.5));
            this.triggerScreenShake(14, 0.5);
            this.logTerminal('[ABILITY] Ion Pulse Surge activated! Shield recharged!', 'agent');
        } else if (this.selectedShipId === 'ship3_5') {
            // Quantum Decoy Wingmen
            this.enemies.slice(0, 4).forEach(e => {
                this.projectiles.push({
                    x: this.player.x, y: this.player.y,
                    vx: Math.cos(Math.atan2(e.y - this.player.y, e.x - this.player.x)) * 15,
                    vy: Math.sin(Math.atan2(e.y - this.player.y, e.x - this.player.x)) * 15,
                    damage: 95, color: '#ff3399', radius: 7
                });
            });
            this.logTerminal('[ABILITY] Quantum Decoy Wingmen engaged target fleet!', 'agent');
        } else if (this.selectedShipId === 'ship_secret') {
            // Celestial Nova Barrage (8-Way Screen Vaporizer)
            const angle = Math.atan2(this.mouse.y - this.player.y, this.mouse.x - this.player.x);
            for (let i = 0; i < 8; i++) {
                const a = angle + (i * Math.PI / 4);
                this.projectiles.push({
                    x: this.player.x, y: this.player.y,
                    vx: Math.cos(a) * 15, vy: Math.sin(a) * 15,
                    damage: 125, color: '#00ffff', radius: 9, isTorpedo: true
                });
            }
            this.triggerScreenShake(18, 0.6);
            this.logTerminal('[ABILITY] Celestial Nova Barrage vaporized target fleet!', 'agent');
        } else if (this.selectedShipId === 'ship4') {
            // Devastator Beam Sweep
            this.player.beamActiveTimer = 2.5;
            this.triggerScreenShake(10, 0.4);
            this.logTerminal('[ABILITY] Devastator Beam Sweep initiated!', 'agent');
        }
    }

    addDamageText(x, y, text, color = '#ffffff') {
        this.damageTextFx.push({
            x: x,
            y: y,
            text: text,
            color: color,
            life: 0.8,
            vy: -1.5
        });
    }

    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        const pauseModal = document.getElementById('pause-overlay');
        if (this.isPaused) {
            if (pauseModal) {
                pauseModal.classList.remove('hidden');
                pauseModal.classList.add('active');
            }
        } else {
            this.hideAllModals();
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    // --- MAIN UPDATE & LOOP ---
    gameLoop(timestamp) {
        if (!this.isRunning || this.isPaused) return;

        const dt = (timestamp - this.lastTime) / 1000 || 0.016;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.shakeTimer > 0) this.shakeTimer -= dt;
        if (this.player.specialCdTimer > 0) this.player.specialCdTimer -= dt;
        if (this.player.invulnerableTimer > 0) this.player.invulnerableTimer -= dt;
        if (this.player.beamActiveTimer > 0) this.player.beamActiveTimer -= dt;

        // Starfield
        this.starfield.forEach(star => {
            star.y += star.speed;
            if (star.y > this.height) star.y = 0;
        });

        // Player Movement & Angle
        let moveX = 0, moveY = 0;
        if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
        if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
        if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

        if (moveX !== 0 && moveY !== 0) { moveX *= 0.7071; moveY *= 0.7071; }

        this.player.vx += moveX * (this.player.speed * 0.11);
        this.player.vy += moveY * (this.player.speed * 0.11);

        this.player.vx *= 0.91;
        this.player.vy *= 0.91;

        this.player.x += this.player.vx;
        this.player.y += this.player.vy;

        const topBoundary = 70 + this.player.radius + 6; // 70px top functions header bar + ship radius + margin offset
        this.player.x = Math.max(this.player.radius, Math.min(this.width - this.player.radius, this.player.x));
        this.player.y = Math.max(topBoundary, Math.min(this.height - this.player.radius, this.player.y));
        if (this.player.y <= topBoundary && this.player.vy < 0) {
            this.player.vy = 0;
        }

        this.player.angle = Math.atan2(this.mouse.y - this.player.y, this.mouse.x - this.player.x);

        // Thruster FX
        if (moveX !== 0 || moveY !== 0) {
            this.particles.push({
                x: this.player.x - Math.cos(this.player.angle) * 18,
                y: this.player.y - Math.sin(this.player.angle) * 18,
                radius: Math.random() * 5 + 2,
                color: Math.random() < 0.5 ? '#00f0ff' : '#ffb700',
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 0.25
            });
        }

        // Passive Shield & Hull Health Regeneration (After 6s out-of-combat without taking damage)
        if (performance.now() - this.player.lastDamageTime > 6000) {
            if (this.player.shield < this.player.maxShield) {
                this.player.shield = Math.min(this.player.maxShield, this.player.shield + (this.player.shieldRegen * 0.4));
            }
            if (this.player.hull < this.player.maxHull) {
                this.player.hull = Math.min(this.player.maxHull, this.player.hull + ((this.player.hullRegen || 0.03) * 0.4));
            }
        }

        // Auto Firing Primary Cannon (Continuous Autofire)
        this.firePlayerCannon();

        // Devastator Beam Damage
        if (this.player.beamActiveTimer > 0) {
            const angle = this.player.angle;
            this.enemies.forEach(enemy => {
                const enemyAngle = Math.atan2(enemy.y - this.player.y, enemy.x - this.player.x);
                let diff = Math.abs(angle - enemyAngle);
                if (diff > Math.PI) diff = Math.PI * 2 - diff;
                if (diff < 0.25) {
                    if (enemy.shield && enemy.shield > 0) {
                        enemy.shield -= 12;
                    } else {
                        enemy.health -= 12;
                    }
                    this.addDamageText(enemy.x, enemy.y, '-12', '#ffb700');
                }
            });
        }

        // Update Player Projectiles
        this.projectiles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            this.enemies.forEach(enemy => {
                if (Math.hypot(enemy.x - p.x, enemy.y - p.y) < enemy.radius + (p.radius || 5)) {
                    p.toRemove = true;
                    if (enemy.shield && enemy.shield > 0) {
                        if (enemy.shield >= p.damage) {
                            enemy.shield -= p.damage;
                            this.addDamageText(enemy.x, enemy.y, `SHIELD -${Math.ceil(p.damage)}`, '#00f0ff');
                        } else {
                            const rem = p.damage - enemy.shield;
                            enemy.shield = 0;
                            enemy.health -= rem;
                            this.addDamageText(enemy.x, enemy.y, `-${Math.ceil(rem)}`, '#ff0055');
                        }
                    } else {
                        enemy.health -= p.damage;
                        this.addDamageText(enemy.x, enemy.y, `-${Math.ceil(p.damage)}`, '#00f0ff');
                    }

                    for (let i = 0; i < 4; i++) {
                        this.particles.push({
                            x: p.x, y: p.y, radius: 2, color: p.color,
                            vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 0.2
                        });
                    }
                }
            });

            this.asteroids.forEach(ast => {
                if (Math.hypot(ast.x - p.x, ast.y - p.y) < ast.radius + 6) {
                    ast.health -= p.damage;
                    p.toRemove = true;
                }
            });
        });
        this.projectiles = this.projectiles.filter(p => !p.toRemove && p.x > 0 && p.x < this.width && p.y > 0 && p.y < this.height);

        // Update Enemies AI & Unique Abilities
        this.enemies.forEach(enemy => {
            if (enemy.type === 'boss_dreadnought') {
                if (enemy.y < enemy.targetY) enemy.y += 0.8;
                else enemy.x += Math.sin(performance.now() * 0.001) * 1.5;

                enemy.fireTimer += dt;
                const attackInterval = enemy.bossTier === 3 ? 2.4 : (enemy.bossTier === 2 ? 2.8 : 3.2);
                if (enemy.fireTimer >= attackInterval) {
                    enemy.fireTimer = 0;
                    enemy.attackIndex = ((enemy.attackIndex || 0) + 1) % (enemy.bossTier === 3 ? 4 : (enemy.bossTier === 2 ? 3 : 2));

                    const angleToPlayer = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);

                    if (enemy.attackIndex === 0) {
                        // ATTACK 1: 360-Degree Orbital Ring Salvo
                        window.soundSynth.playEnemyLaser();
                        const count = enemy.bossTier === 3 ? 20 : (enemy.bossTier === 2 ? 16 : 12);
                        for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / count) {
                            this.enemyProjectiles.push({
                                x: enemy.x, y: enemy.y,
                                vx: Math.cos(a) * 2.2, vy: Math.sin(a) * 2.2,
                                damage: enemy.damage, color: enemy.color, radius: 7
                            });
                        }
                    } else if (enemy.attackIndex === 1) {
                        // ATTACK 2: Targeted Plasma Torpedo Burst
                        window.soundSynth.playTorpedoSound();
                        const torpedoCount = enemy.bossTier === 3 ? 6 : (enemy.bossTier === 2 ? 4 : 3);
                        for (let t = 0; t < torpedoCount; t++) {
                            const spread = (t - (torpedoCount - 1) / 2) * 0.25;
                            this.enemyProjectiles.push({
                                x: enemy.x, y: enemy.y,
                                vx: Math.cos(angleToPlayer + spread) * 3.0, vy: Math.sin(angleToPlayer + spread) * 3.0,
                                damage: enemy.damage * 1.4, color: '#ff0055', radius: 9
                            });
                        }
                    } else if (enemy.attackIndex === 2) {
                        // ATTACK 3: Concentrated Death Beam Barrage
                        window.soundSynth.playEnemyLaser();
                        for (let b = -0.3; b <= 0.3; b += 0.15) {
                            this.enemyProjectiles.push({
                                x: enemy.x, y: enemy.y,
                                vx: Math.cos(angleToPlayer + b) * 4.5, vy: Math.sin(angleToPlayer + b) * 4.5,
                                damage: enemy.damage * 1.2, color: '#9d00ff', radius: 5
                            });
                        }
                    } else if (enemy.attackIndex === 3) {
                        // ATTACK 4: Summon Drone Reinforcements
                        window.soundSynth.playPickupSound();
                        this.addDamageText(enemy.x, enemy.y, 'REINFORCEMENTS SUMMONED!', '#ffb700');
                        for (let s = -1; s <= 1; s += 2) {
                            this.enemies.push({
                                id: Math.random(),
                                type: 'scout',
                                x: enemy.x + (s * 80),
                                y: enemy.y + 20,
                                vx: s * 1.5, vy: 1,
                                radius: 18, health: 60, maxHealth: 60,
                                speed: 1.6, color: '#00ff66',
                                fireTimer: 0, fireInterval: 2.5, damage: 20
                            });
                        }
                    }
                }
                // Continuous Reinforcement Dropship Spawning over time as fight progresses
                const spawnInterval = this.difficulty === 'hard' ? 5.0 : 10.0; // Doubled spawning speed on boss levels (5s vs 10s)!
                enemy.spawnTimer = (enemy.spawnTimer || 0) + dt;
                if (enemy.spawnTimer >= spawnInterval) {
                    enemy.spawnTimer = 0;
                    window.soundSynth.playBossWarning();
                    this.addDamageText(enemy.x, enemy.y, 'WARP DROPSHIP INBOUND! 🛸', '#ffb700');
                    this.logTerminal(`[WARNING] BOSS SUMMONED REINFORCEMENT FLEET!`, 'danger');

                    const spawnCount = (enemy.bossTier === 3 ? 3 : (enemy.bossTier === 2 ? 2 : 1)) * (this.difficulty === 'hard' ? 2 : 1);
                    for (let c = 0; c < spawnCount; c++) {
                        const rType = c % 2 === 0 ? 'gunship' : 'interceptor';
                        const spawnX = Math.random() < 0.5 ? -40 : this.width + 40;
                        const spawnY = Math.random() * (this.height * 0.6);

                        this.enemies.push({
                            id: Math.random(),
                            type: rType,
                            x: spawnX,
                            y: spawnY,
                            vx: 0, vy: 0,
                            radius: rType === 'gunship' ? 24 : 20,
                            health: 140, maxHealth: 140,
                            speed: 1.5,
                            color: rType === 'gunship' ? '#ffb700' : '#9d00ff',
                            fireTimer: 0, fireInterval: 2.8, damage: 25
                        });
                        this.levelTargetKills++;
                    }
                }
            } else {
                const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
                enemy.vx += Math.cos(angle) * 0.08;
                enemy.vy += Math.sin(angle) * 0.08;

                enemy.vx *= 0.92;
                enemy.vy *= 0.92;

                enemy.x += enemy.vx;
                enemy.y += enemy.vy;

                // Stealth Interceptor Cloaking Ability
                if (enemy.type === 'interceptor') {
                    enemy.cloakTimer += dt;
                    if (enemy.cloakTimer >= 4.0) {
                        enemy.cloakTimer = 0;
                        enemy.isCloaked = !enemy.isCloaked;
                    }
                }

                // EMP Bomber Proximity Ability
                if (enemy.type === 'bomber') {
                    const distToPlayer = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
                    if (distToPlayer < 140 && !enemy.empDetonated) {
                        enemy.empDetonated = true;
                        enemy.health = 0; // Detonates
                        this.takePlayerDamage(35);
                        this.addDamageText(this.player.x, this.player.y, 'EMP BLAST -35', '#ff3300');
                        for (let i = 0; i < 30; i++) {
                            this.particles.push({
                                x: enemy.x, y: enemy.y, radius: Math.random() * 6 + 2, color: '#ff3300',
                                vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12, life: 0.5
                            });
                        }
                        this.triggerScreenShake(12, 0.4);
                    }
                }

                // Firing Ability per Enemy Class
                enemy.fireTimer += dt;
                if (enemy.fireTimer >= enemy.fireInterval) {
                    enemy.fireTimer = 0;
                    window.soundSynth.playEnemyLaser();

                    if (enemy.type === 'gunship') {
                        // 3-way spread amber plasma
                        for (let spread = -0.25; spread <= 0.25; spread += 0.25) {
                            this.enemyProjectiles.push({
                                x: enemy.x, y: enemy.y,
                                vx: Math.cos(angle + spread) * 2.2, vy: Math.sin(angle + spread) * 2.2,
                                damage: enemy.damage, color: '#ffb700', radius: 5
                            });
                        }
                    } else if (enemy.type === 'cruiser') {
                        // Heavy explosive plasma orb
                        this.enemyProjectiles.push({
                            x: enemy.x, y: enemy.y,
                            vx: Math.cos(angle) * 1.8, vy: Math.sin(angle) * 1.8,
                            damage: enemy.damage * 1.5, color: '#ff0055', radius: 9
                        });
                    } else if (enemy.type === 'interceptor') {
                        // Sniper beam
                        this.enemyProjectiles.push({
                            x: enemy.x, y: enemy.y,
                            vx: Math.cos(angle) * 3.6, vy: Math.sin(angle) * 3.6,
                            damage: enemy.damage * 1.3, color: '#9d00ff', radius: 4
                        });
                    } else {
                        // Scout standard laser
                        this.enemyProjectiles.push({
                            x: enemy.x, y: enemy.y,
                            vx: Math.cos(angle) * 2.4, vy: Math.sin(angle) * 2.4,
                            damage: enemy.damage, color: '#00ff66', radius: 5
                        });
                    }
                }
            }
        });

        // Update Enemy Projectiles & Collisions with Player
        this.enemyProjectiles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (Math.hypot(this.player.x - p.x, this.player.y - p.y) < this.player.radius + p.radius) {
                p.toRemove = true;
                this.takePlayerDamage(p.damage);
            }
        });
        this.enemyProjectiles = this.enemyProjectiles.filter(p => !p.toRemove && p.x > 0 && p.x < this.width && p.y > 0 && p.y < this.height);

        // Enemy Deaths & Drop Rewards
        this.enemies.forEach(enemy => {
            if (enemy.health <= 0) {
                this.enemiesKilledCurrentLevel++;
                const reward = enemy.type === 'boss_dreadnought' ? 800 : (enemy.type === 'cruiser' ? 60 : 30);
                this.credits += reward;
                this.levelOreEarned += reward;

                window.soundSynth.playExplosion();
                this.triggerScreenShake(enemy.type === 'boss_dreadnought' ? 22 : 8, 0.4);

                const pickupRnd = Math.random();
                if (pickupRnd > 0.4) {
                    this.pickups.push({
                        x: enemy.x, y: enemy.y,
                        type: pickupRnd > 0.85 ? 'repair' : (pickupRnd > 0.7 ? 'shield' : 'ore'),
                        val: reward,
                        radius: 8, life: 12
                    });
                }

                for (let i = 0; i < (enemy.type === 'boss_dreadnought' ? 50 : 16); i++) {
                    this.particles.push({
                        x: enemy.x, y: enemy.y, radius: Math.random() * 5 + 2, color: enemy.color,
                        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 0.6
                    });
                }
            }
        });
        this.enemies = this.enemies.filter(e => e.health > 0);

        // Asteroid Updates
        this.asteroids.forEach(ast => {
            ast.x += ast.vx; ast.y += ast.vy; ast.angle += ast.rotSpeed;
            if (ast.x < -40) ast.x = this.width + 40;
            if (ast.x > this.width + 40) ast.x = -40;
            if (ast.y < -40) ast.y = this.height + 40;
            if (ast.y > this.height + 40) ast.y = -40;

            if (ast.health <= 0) {
                this.credits += ast.oreValue;
                this.levelOreEarned += ast.oreValue;
                window.soundSynth.playExplosion();
                for (let i = 0; i < 4; i++) {
                    this.pickups.push({
                        x: ast.x + (Math.random() - 0.5) * 20, y: ast.y + (Math.random() - 0.5) * 20,
                        type: 'ore', val: 15, radius: 7, life: 10
                    });
                }
            }
        });
        this.asteroids = this.asteroids.filter(a => a.health > 0);

        // Pickups Collection
        this.pickups.forEach(pickup => {
            pickup.life -= dt;
            const dist = Math.hypot(this.player.x - pickup.x, this.player.y - pickup.y);
            if (dist < 160) {
                const angle = Math.atan2(this.player.y - pickup.y, this.player.x - pickup.x);
                pickup.x += Math.cos(angle) * 12;
                pickup.y += Math.sin(angle) * 12;
                if (dist < this.player.radius + pickup.radius) {
                    pickup.collected = true;
                    window.soundSynth.playPickupSound();

                    if (pickup.type === 'repair') {
                        this.player.hull = Math.min(this.player.maxHull, this.player.hull + 15);
                        this.addDamageText(this.player.x, this.player.y, 'HULL REPAIR +15', '#00ff66');
                    } else if (pickup.type === 'shield') {
                        this.player.shield = Math.min(this.player.maxShield, this.player.shield + 25);
                        this.addDamageText(this.player.x, this.player.y, 'SHIELD +25', '#00f0ff');
                    } else {
                        this.addDamageText(this.player.x, this.player.y, `+${pickup.val} ORE`, '#ffb700');
                    }
                }
            }
        });
        this.pickups = this.pickups.filter(p => p.life > 0 && !p.collected);

        // Damage Text FX
        this.damageTextFx.forEach(txt => {
            txt.y += txt.vy;
            txt.life -= dt;
        });
        this.damageTextFx = this.damageTextFx.filter(t => t.life > 0);

        // Particles
        this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= dt; });
        this.particles = this.particles.filter(p => p.life > 0);

        // Check Victory Condition (Requires target kill count AND 0 active enemy ships alive on field!)
        if (this.enemiesKilledCurrentLevel >= this.levelTargetKills && this.enemies.length === 0) {
            this.levelVictory();
        }

        // UI Updates
        this.updateHUD();
    }

    takePlayerDamage(amount) {
        if (this.player.invulnerableTimer > 0) return;

        this.player.lastDamageTime = performance.now();
        this.triggerScreenShake(6, 0.2);

        if (this.player.shield > 0) {
            this.player.shieldHitTimer = 0.25;
            window.soundSynth.playShieldHit();
            if (this.player.shield >= amount) {
                this.player.shield -= amount;
                this.addDamageText(this.player.x, this.player.y, `SHIELD -${Math.ceil(amount)}`, '#00f0ff');
            } else {
                const rem = amount - this.player.shield;
                this.player.shield = 0;
                this.player.hull -= rem;
                window.soundSynth.playHullHit();
                this.addDamageText(this.player.x, this.player.y, `HULL -${Math.ceil(rem)}`, '#ff0055');
            }
        } else {
            this.player.hull -= amount;
            window.soundSynth.playHullHit();
            this.addDamageText(this.player.x, this.player.y, `HULL -${Math.ceil(amount)}`, '#ff0055');
        }

        if (this.player.hull <= 0) {
            this.gameOver();
        }
    }

    firePlayerCannon() {
        const shipDef = this.shipDefinitions[this.selectedShipId] || this.shipDefinitions.ship1;
        const fireRateMultiplier = 1 - (this.upgrades.fireRate * 0.12);
        const actualDelay = shipDef.fireRateDelay * fireRateMultiplier * 1000;

        if (!this.lastShotTime || performance.now() - this.lastShotTime > actualDelay) {
            this.lastShotTime = performance.now();
            window.soundSynth.playPlasmaShot(950, 0.08);

            const damage = shipDef.damage + (this.upgrades.damage * 10);
            const speed = 8.5;

            if (this.selectedShipId === 'ship_secret') {
                for (let a = -1; a <= 1; a++) {
                    this.projectiles.push({
                        x: this.player.x + (a * 14), y: this.player.y,
                        vx: Math.cos(this.player.angle) * speed * 1.25, vy: Math.sin(this.player.angle) * speed * 1.25,
                        damage: damage * 0.75, color: '#00ffff', radius: 5
                    });
                }
            } else if (this.selectedShipId === 'ship4') {
                const perpX = -Math.sin(this.player.angle) * 12;
                const perpY = Math.cos(this.player.angle) * 12;
                this.projectiles.push({
                    x: this.player.x + perpX, y: this.player.y + perpY,
                    vx: Math.cos(this.player.angle) * speed, vy: Math.sin(this.player.angle) * speed,
                    damage: damage, color: shipDef.color
                });
                this.projectiles.push({
                    x: this.player.x - perpX, y: this.player.y - perpY,
                    vx: Math.cos(this.player.angle) * speed, vy: Math.sin(this.player.angle) * speed,
                    damage: damage, color: shipDef.color
                });
            } else {
                this.projectiles.push({
                    x: this.player.x, y: this.player.y,
                    vx: Math.cos(this.player.angle) * speed, vy: Math.sin(this.player.angle) * speed,
                    damage: damage, color: shipDef.color
                });
            }
        }
    }

    startSecretMission() {
        this.currentLevel = 99; // Secret level indicator
        this.applyPlayerStats();

        // Spawn player ship safely at lower center of playing canvas
        this.player.x = this.width / 2;
        this.player.y = Math.min(this.height - 120, this.height * 0.75);
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.hull = this.player.maxHull;
        this.player.shield = this.player.maxShield;

        this.projectiles = [];
        this.enemyProjectiles = [];
        this.enemies = [];
        this.asteroids = [];
        this.particles = [];
        this.pickups = [];
        this.damageTextFx = [];

        this.enemiesKilledCurrentLevel = 0;
        this.levelOreEarned = 0;

        this.hideAllModals();
        this.bossActive = true;

        const bossHud = document.getElementById('boss-hud');
        if (bossHud) {
            bossHud.classList.remove('hidden');
            bossHud.classList.add('active');
            bossHud.style.display = 'flex';
        }

        this.levelTargetKills = 2 + 4; // 2 Secret bosses + 4 escorts
        document.getElementById('obj-text').innerText = 'TARGET: Defeat Both Secret Dual Bosses (3,000 HP Each) & Claim Celestial Warship!';
        document.getElementById('wave-text').innerText = 'SECRET SECTOR: ANCIENT VOID NEXUS';

        this.spawnSecretDualBosses();

        this.isRunning = true;
        this.isPaused = false;
    }

    spawnSecretDualBosses() {
        window.soundSynth.playBossWarning();
        this.triggerScreenShake(26, 1.0);

        const b1 = {
            id: 'secret_boss_1',
            type: 'boss_dreadnought',
            bossTier: 5,
            x: this.width * 0.32,
            y: -120,
            targetY: 180,
            vx: 0,
            vy: 0,
            radius: 95,
            health: 3000,
            maxHealth: 3000,
            shield: 1000,
            maxShield: 1000,
            speed: 0.9,
            color: '#ff00ff',
            fireTimer: 0,
            spawnTimer: 0,
            attackIndex: 0,
            phase: 1,
            damage: 45
        };

        const b2 = {
            id: 'secret_boss_2',
            type: 'boss_dreadnought',
            bossTier: 5,
            x: this.width * 0.68,
            y: -160,
            targetY: 220,
            vx: 0,
            vy: 0,
            radius: 95,
            health: 3000,
            maxHealth: 3000,
            shield: 1000,
            maxShield: 1000,
            speed: 0.9,
            color: '#00ffff',
            fireTimer: 1.0,
            spawnTimer: 1.0,
            attackIndex: 0,
            phase: 1,
            damage: 45
        };

        this.enemies.push(b1);
        this.enemies.push(b2);
        this.bossEntity = b1;

        // Escort Fleet
        for (let i = 0; i < 4; i++) {
            const offsetX = (i - 1.5) * 120;
            this.enemies.push({
                id: Math.random(),
                type: 'frigate',
                x: this.width / 2 + offsetX,
                y: -100 - (i * 25),
                vx: 0, vy: 0,
                radius: 28, health: 150, maxHealth: 150,
                shield: 80, maxShield: 80, speed: 1.2,
                color: '#ff00ff', fireTimer: Math.random() * 2,
                fireInterval: 3.0, damage: 25
            });
        }

        document.getElementById('boss-name').innerText = '⚔️ SECRET DUAL BOSSES (3,000 HP EACH)';
        this.logTerminal('[WARNING] ANCIENT VOID NEXUS DUAL BOSSES ENGAGED!', 'danger');
    }

    levelVictory() {
        this.isRunning = false;
        window.soundSynth.stopSpaceMusic();

        // Unlock secret ship if victorious on secret level 99
        if (this.currentLevel === 99) {
            if (!this.purchasedShips.includes('ship_secret')) {
                this.purchasedShips.push('ship_secret');
                this.selectedShipId = 'ship_secret';
                this.saveModeData();
                this.logTerminal('[UNLOCKED] Astra Prime Celestia Celestial Warship added to your fleet!', 'agent');
            }
        }

        if (this.currentLevel >= this.unlockedLevel) {
            this.unlockedLevel = this.currentLevel + 1;
        }

        if (!this.completedLevels.includes(this.currentLevel)) {
            this.completedLevels.push(this.currentLevel);
        }

        let bonus = this.currentLevel * 150;
        if (this.difficulty === 'impossible') {
            bonus = Math.floor(bonus * 3.0); // 3x Ore Bonus on Impossible mode!
        } else if (this.difficulty === 'hard') {
            bonus = Math.floor(bonus * 2.0); // 2x Ore Bonus on Hard mode!
        }
        this.credits += bonus;

        this.saveModeData();

        const currentMission = this.missionNames[this.currentLevel] || `SECTOR ${this.currentLevel}`;
        const nextMission = this.missionNames[this.unlockedLevel] || `SECTOR ${this.unlockedLevel}`;

        document.getElementById('vic-kills').innerText = this.enemiesKilledCurrentLevel;
        document.getElementById('vic-ore').innerText = `+${this.levelOreEarned + bonus} ORE`;
        document.getElementById('vic-next-lvl').innerText = `LEVEL ${this.unlockedLevel}: ${nextMission}`;
        document.getElementById('victory-level-name').innerText = `${currentMission} CLEARED!`;

        this.hideAllModals();
        const victoryModal = document.getElementById('victory-modal');
        if (victoryModal) {
            victoryModal.classList.remove('hidden');
            victoryModal.classList.add('active');
        }
    }

    gameOver() {
        this.isRunning = false;
        window.soundSynth.stopSpaceMusic();

        document.getElementById('res-score').innerText = (this.enemiesKilledCurrentLevel * 100).toLocaleString();
        document.getElementById('res-kills').innerText = this.enemiesKilledCurrentLevel;
        document.getElementById('res-credits').innerText = `+${this.levelOreEarned} ORE`;

        this.hideAllModals();
        const gameoverModal = document.getElementById('gameover-overlay');
        if (gameoverModal) {
            gameoverModal.classList.remove('hidden');
            gameoverModal.classList.add('active');
        }
    }

    triggerScreenShake(intensity = 10, duration = 0.3) {
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    updateHUD() {
        document.getElementById('health-fill').style.width = `${Math.max(0, (this.player.hull / this.player.maxHull)) * 100}%`;
        document.getElementById('health-text').innerText = `${Math.ceil(Math.max(0, this.player.hull))} / ${this.player.maxHull}`;

        document.getElementById('shield-fill').style.width = `${Math.max(0, (this.player.shield / this.player.maxShield)) * 100}%`;
        document.getElementById('shield-text').innerText = `${Math.ceil(Math.max(0, this.player.shield))} / ${this.player.maxShield}`;

        document.getElementById('score-text').innerText = `🪙 ${this.credits.toLocaleString()}`;

        const cdOverlay = document.getElementById('special-cd-overlay');
        const cdText = document.getElementById('special-cd-text');
        if (this.player.specialCdTimer > 0) {
            cdOverlay.classList.add('active');
            cdText.innerText = Math.ceil(this.player.specialCdTimer) + 's';
        } else {
            cdOverlay.classList.remove('active');
            cdText.innerText = 'READY';
        }

        const bossEntities = this.enemies.filter(e => e.type === 'boss_dreadnought' && e.health > 0);
        if (bossEntities.length > 0) {
            const totalHp = bossEntities.reduce((sum, b) => sum + Math.max(0, b.health), 0);
            const totalMaxHp = bossEntities.reduce((sum, b) => sum + b.maxHealth, 0);
            const pct = Math.max(0, (totalHp / totalMaxHp)) * 100;
            document.getElementById('boss-health-fill').style.width = `${pct}%`;
            document.getElementById('boss-health-text').innerText = `${bossEntities.length > 1 ? '⚔️ DUAL BOSSES: ' : ''}${Math.ceil(totalHp)} / ${totalMaxHp} HP`;
        } else if (this.bossActive) {
            const bossHud = document.getElementById('boss-hud');
            if (bossHud) {
                bossHud.classList.add('hidden');
                bossHud.style.display = 'none';
            }
            this.bossActive = false;
        }

        this.renderRadar();
    }

    renderRadar() {
        if (!this.radarCtx) return;
        const ctx = this.radarCtx;
        const rw = this.radarCanvas.width;
        const rh = this.radarCanvas.height;
        const scale = 0.08;

        ctx.clearRect(0, 0, rw, rh);

        const cx = rw / 2;
        const cy = rh / 2;

        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        this.enemies.forEach(e => {
            const rx = cx + (e.x - this.player.x) * scale;
            const ry = cy + (e.y - this.player.y) * scale;
            if (rx >= 0 && rx <= rw && ry >= 0 && ry <= rh) {
                ctx.fillStyle = e.type === 'boss_dreadnought' ? '#ff0055' : '#ff3300';
                ctx.beginPath();
                ctx.arc(rx, ry, e.type === 'boss_dreadnought' ? 5 : 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        this.pickups.forEach(p => {
            const rx = cx + (p.x - this.player.x) * scale;
            const ry = cy + (p.y - this.player.y) * scale;
            if (rx >= 0 && rx <= rw && ry >= 0 && ry <= rh) {
                ctx.fillStyle = p.type === 'repair' ? '#00ff66' : '#ffb700';
                ctx.beginPath();
                ctx.arc(rx, ry, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    render() {
        this.ctx.save();

        if (this.shakeTimer > 0) {
            const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
            const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(offsetX, offsetY);
        }

        this.ctx.fillStyle = '#02050e';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.nebulaClouds.forEach(cloud => {
            const grad = this.ctx.createRadialGradient(cloud.x, cloud.y, 10, cloud.x, cloud.y, cloud.radius);
            grad.addColorStop(0, cloud.color);
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.starfield.forEach(star => {
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = star.alpha;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        });

        this.asteroids.forEach(ast => {
            this.ctx.save();
            this.ctx.translate(ast.x, ast.y);
            this.ctx.rotate(ast.angle);

            this.ctx.fillStyle = '#1e293b';
            this.ctx.strokeStyle = '#00f0ff';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = '#ffb700';
            this.ctx.beginPath();
            this.ctx.arc(ast.radius * 0.3, -ast.radius * 0.2, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.pickups.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.fillStyle = p.type === 'repair' ? '#00ff66' : (p.type === 'shield' ? '#00f0ff' : '#ffb700');
            this.ctx.shadowColor = this.ctx.fillStyle;
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.renderPlayer();

        if (this.player.beamActiveTimer > 0) {
            this.ctx.save();
            this.ctx.strokeStyle = '#ffb700';
            this.ctx.lineWidth = 14;
            this.ctx.shadowColor = '#ff0055';
            this.ctx.shadowBlur = 25;
            this.ctx.beginPath();
            this.ctx.moveTo(this.player.x, this.player.y);
            this.ctx.lineTo(this.player.x + Math.cos(this.player.angle) * 1200, this.player.y + Math.sin(this.player.angle) * 1200);
            this.ctx.stroke();
            this.ctx.restore();
        }

        this.projectiles.forEach(p => {
            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius || 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.enemyProjectiles.forEach(p => {
            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius || 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.enemies.forEach(enemy => {
            this.renderEnemy(enemy);
        });

        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.damageTextFx.forEach(txt => {
            this.ctx.save();
            this.ctx.font = 'bold 12px Orbitron';
            this.ctx.fillStyle = txt.color;
            this.ctx.globalAlpha = Math.max(0, txt.life);
            this.ctx.fillText(txt.text, txt.x, txt.y);
            this.ctx.restore();
        });

        this.ctx.restore();
    }

    renderPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);

        if (this.player.shield > 0 || this.player.invulnerableTimer > 0) {
            this.ctx.strokeStyle = this.player.invulnerableTimer > 0 ? '#ffb700' : 'rgba(0, 240, 255, 0.6)';
            this.ctx.lineWidth = this.player.shieldHitTimer > 0 ? 4 : 2;
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.player.radius + 8, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.rotate(this.player.angle);

        const shipDef = this.shipDefinitions[this.selectedShipId] || this.shipDefinitions.ship1;
        this.ctx.fillStyle = shipDef.color;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.5;

        this.ctx.beginPath();
        this.ctx.moveTo(22, 0);
        this.ctx.lineTo(-18, -14);
        this.ctx.lineTo(-10, 0);
        this.ctx.lineTo(-18, 14);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(4, 0, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    renderEnemy(enemy) {
        this.ctx.save();

        if (enemy.isCloaked) {
            this.ctx.globalAlpha = 0.25;
        }

        // Enemy Forcefield Shield FX
        if (enemy.shield && enemy.shield > 0) {
            this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, enemy.radius + 6, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.ctx.translate(enemy.x, enemy.y);

        const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
        this.ctx.rotate(angle);

        this.ctx.fillStyle = enemy.color;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.5;
        this.ctx.shadowColor = enemy.color;
        this.ctx.shadowBlur = 10;

        if (enemy.type === 'boss_dreadnought') {
            const rad = enemy.radius || 65;
            this.ctx.beginPath();
            this.ctx.moveTo(rad * 0.7, 0);
            this.ctx.lineTo(-rad * 0.6, -rad * 0.7);
            this.ctx.lineTo(-rad * 0.3, 0);
            this.ctx.lineTo(-rad * 0.6, rad * 0.7);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Glowing Power Core
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, rad * 0.22, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (enemy.type === 'cruiser') {
            this.ctx.beginPath();
            this.ctx.moveTo(30, 0);
            this.ctx.lineTo(-24, -25);
            this.ctx.lineTo(-12, 0);
            this.ctx.lineTo(-24, 25);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else if (enemy.type === 'frigate') {
            this.ctx.beginPath();
            this.ctx.moveTo(22, 0);
            this.ctx.lineTo(-18, -18);
            this.ctx.lineTo(0, 0);
            this.ctx.lineTo(-18, 18);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else if (enemy.type === 'bomber') {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 14, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(16, 0);
            this.ctx.lineTo(-14, -12);
            this.ctx.lineTo(-14, 12);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }

        this.ctx.restore();

        if (enemy.type !== 'boss_dreadnought') {
            this.ctx.save();
            const bw = 32;
            const bh = 4;
            const bx = enemy.x - bw / 2;
            const by = enemy.y - enemy.radius - 10;

            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(bx, by, bw, bh);

            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(bx, by, Math.max(0, (enemy.health / enemy.maxHealth)) * bw, bh);
            this.ctx.restore();
        }
    }

    logTerminal(msg, type = 'sys') {
        const output = document.getElementById('terminal-output');
        if (!output) return;
        const line = document.createElement('p');
        line.className = `log-line ${type}`;
        line.innerText = msg;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }
}

// Instantiate Engine on load
window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new SpaceCombatEngine();
});
