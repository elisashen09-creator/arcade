/* BATTLESHIP STRATEGY — Enhanced Tactical Engine Logic
   Features: Continuous Unified Ship Visuals, Sunk Ship Reveals, Animated Hits/Misses, Extra Turn Rule, and Smart AI Tactical Targeting with Lucky Instincts */

class BattleshipGame {
    constructor() {
        this.gridSize = 10;
        this.shipsConfig = [
            { typeId: 'carrier', name: 'Aircraft Carrier', size: 5, accent: '✈️' },
            { typeId: 'battleship', name: 'Battleship', size: 4, accent: '⚓' },
            { typeId: 'cruiser', name: 'Cruiser', size: 3, accent: '🚀' },
            { typeId: 'submarine', name: 'Submarine', size: 3, accent: '🌊' },
            { typeId: 'destroyer', name: 'Destroyer', size: 2, accent: '⚙️' }
        ];

        this.playerGrid = [];
        this.enemyGrid = [];
        this.playerShips = [];
        this.enemyShips = [];

        // AI Tactical Memory for Lucky/Smart Targeting
        this.aiHitsMemory = [];

        this.currentPlacementIndex = 0;
        this.isHorizontal = true;
        this.isPlayerTurn = true;
        this.gamePhase = 'placement'; // 'placement', 'combat', 'gameover'
        this.score = 0;
        this.turnsCount = 0;

        this.initDOM();
        this.updateUserBadge();
    }

    updateUserBadge() {
        if (window.navalAuth) {
            const user = window.navalAuth.getCurrentUser();
            document.getElementById('user-name').innerText = user.username;
        }
    }

    initDOM() {
        document.getElementById('btn-start-game').onclick = () => this.showPlacementScreen();
        document.getElementById('btn-rotate').onclick = () => this.toggleOrientation();
        document.getElementById('btn-randomize').onclick = () => this.autoDeployPlayerFleet();
        document.getElementById('btn-restart').onclick = () => this.restartGame();
    }

    showPlacementScreen() {
        document.getElementById('title-screen').classList.add('hidden');
        document.getElementById('gameplace-screen').classList.remove('hidden');

        this.resetGameData();
        this.createGridsDOM();
        this.updatePlacementStatus();
    }

    resetGameData() {
        this.playerGrid = Array(10).fill(null).map(() => Array(10).fill(null));
        this.enemyGrid = Array(10).fill(null).map(() => Array(10).fill(null));
        this.playerShips = [];
        this.enemyShips = [];
        this.aiHitsMemory = [];
        this.currentPlacementIndex = 0;
        this.isHorizontal = true;
        this.isPlayerTurn = true;
        this.gamePhase = 'placement';
        this.score = 1000;
        this.turnsCount = 0;
    }

    createGridsDOM() {
        const pGridEl = document.getElementById('player-grid');
        const eGridEl = document.getElementById('enemy-grid');
        pGridEl.innerHTML = '';
        eGridEl.innerHTML = '';

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                const pCell = document.createElement('div');
                pCell.className = 'grid-cell';
                pCell.dataset.row = r;
                pCell.dataset.col = c;
                pCell.onmouseover = () => this.handleCellHover(r, c);
                pCell.onclick = () => this.handlePlayerGridClick(r, c);
                pGridEl.appendChild(pCell);

                const eCell = document.createElement('div');
                eCell.className = 'grid-cell';
                eCell.dataset.row = r;
                eCell.dataset.col = c;
                eCell.onclick = () => this.handleEnemyGridClick(r, c);
                eGridEl.appendChild(eCell);
            }
        }
    }

    toggleOrientation() {
        this.isHorizontal = !this.isHorizontal;
        document.getElementById('btn-rotate').innerText = `ROTATE (${this.isHorizontal ? 'HORIZONTAL' : 'VERTICAL'})`;
    }

    updatePlacementStatus() {
        const banner = document.getElementById('status-phase-text').parentElement;
        banner.classList.remove('extra-turn');

        if (this.currentPlacementIndex < this.shipsConfig.length) {
            const ship = this.shipsConfig[this.currentPlacementIndex];
            document.getElementById('status-phase-text').innerText = `PLACEMENT PHASE: Place your ${ship.name} (Size: ${ship.size})`;
        } else {
            document.getElementById('status-phase-text').innerText = 'FLEET DEPLOYED! Combat phase active. Fire on enemy target grid!';
            document.getElementById('btn-rotate').style.display = 'none';
            document.getElementById('btn-randomize').style.display = 'none';
            this.startCombatPhase();
        }
    }

    canPlaceShip(grid, row, col, size, isHorizontal) {
        if (isHorizontal) {
            if (col + size > 10) return false;
            for (let c = col; c < col + size; c++) {
                if (grid[row][c] !== null) return false;
            }
        } else {
            if (row + size > 10) return false;
            for (let r = row; r < row + size; r++) {
                if (grid[r][col] !== null) return false;
            }
        }
        return true;
    }

    handleCellHover(row, col) {
        if (this.gamePhase !== 'placement' || this.currentPlacementIndex >= this.shipsConfig.length) return;
        const size = this.shipsConfig[this.currentPlacementIndex].size;
        const valid = this.canPlaceShip(this.playerGrid, row, col, size, this.isHorizontal);

        const pGridEl = document.getElementById('player-grid');
        Array.from(pGridEl.children).forEach(cell => cell.classList.remove('hover-valid', 'hover-invalid'));

        if (valid) {
            for (let i = 0; i < size; i++) {
                const r = this.isHorizontal ? row : row + i;
                const c = this.isHorizontal ? col + i : col;
                const idx = r * 10 + c;
                if (pGridEl.children[idx]) pGridEl.children[idx].classList.add('hover-valid');
            }
        }
    }

    applyShipCellClasses(cellEl, shipObj, segIndex, isHorizontal) {
        cellEl.classList.add('ship', `ship-type-${shipObj.typeId}`);
        cellEl.classList.add(isHorizontal ? 'orient-h' : 'orient-v');

        const total = shipObj.size;
        if (segIndex === 0) {
            cellEl.classList.add('ship-seg-head');
        } else if (segIndex === total - 1) {
            cellEl.classList.add('ship-seg-tail');
        } else {
            cellEl.classList.add('ship-seg-body');
        }

        const centerIdx = Math.floor(total / 2);
        if (segIndex === centerIdx && shipObj.accent) {
            cellEl.classList.add('ship-center-accent');
            cellEl.setAttribute('data-accent-label', shipObj.accent);
        }
    }

    handlePlayerGridClick(row, col) {
        if (this.gamePhase !== 'placement' || this.currentPlacementIndex >= this.shipsConfig.length) return;
        const shipConfig = this.shipsConfig[this.currentPlacementIndex];

        if (this.canPlaceShip(this.playerGrid, row, col, shipConfig.size, this.isHorizontal)) {
            const shipObj = { 
                typeId: shipConfig.typeId,
                name: shipConfig.name, 
                size: shipConfig.size, 
                accent: shipConfig.accent, 
                hits: 0, 
                coords: [],
                isHorizontal: this.isHorizontal
            };

            for (let i = 0; i < shipConfig.size; i++) {
                const r = this.isHorizontal ? row : row + i;
                const c = this.isHorizontal ? col + i : col;
                this.playerGrid[r][c] = shipObj;
                shipObj.coords.push({ r, c, segIndex: i });

                const idx = r * 10 + c;
                const cellEl = document.getElementById('player-grid').children[idx];
                this.applyShipCellClasses(cellEl, shipObj, i, this.isHorizontal);
            }

            this.playerShips.push(shipObj);
            this.currentPlacementIndex++;
            this.logCombat(`[PLACEMENT] Deployed ${shipConfig.name} on fleet grid.`, 'sys');
            this.updatePlacementStatus();
        }
    }

    autoDeployPlayerFleet() {
        this.resetGameData();
        this.createGridsDOM();

        this.shipsConfig.forEach(shipConfig => {
            let placed = false;
            while (!placed) {
                const r = Math.floor(Math.random() * 10);
                const c = Math.floor(Math.random() * 10);
                const isHoriz = Math.random() < 0.5;

                if (this.canPlaceShip(this.playerGrid, r, c, shipConfig.size, isHoriz)) {
                    const shipObj = { 
                        typeId: shipConfig.typeId,
                        name: shipConfig.name, 
                        size: shipConfig.size, 
                        accent: shipConfig.accent, 
                        hits: 0, 
                        coords: [],
                        isHorizontal: isHoriz
                    };

                    for (let i = 0; i < shipConfig.size; i++) {
                        const row = isHoriz ? r : r + i;
                        const col = isHoriz ? c + i : c;
                        this.playerGrid[row][col] = shipObj;
                        shipObj.coords.push({ r: row, c: col, segIndex: i });

                        const idx = row * 10 + col;
                        const cellEl = document.getElementById('player-grid').children[idx];
                        this.applyShipCellClasses(cellEl, shipObj, i, isHoriz);
                    }
                    this.playerShips.push(shipObj);
                    placed = true;
                }
            }
        });

        this.currentPlacementIndex = this.shipsConfig.length;
        this.logCombat('[PLACEMENT] All 5 vessels auto-deployed!', 'sys');
        this.updatePlacementStatus();
    }

    autoDeployEnemyFleet() {
        this.shipsConfig.forEach(shipConfig => {
            let placed = false;
            while (!placed) {
                const r = Math.floor(Math.random() * 10);
                const c = Math.floor(Math.random() * 10);
                const isHoriz = Math.random() < 0.5;

                if (this.canPlaceShip(this.enemyGrid, r, c, shipConfig.size, isHoriz)) {
                    const shipObj = { 
                        typeId: shipConfig.typeId,
                        name: shipConfig.name, 
                        size: shipConfig.size, 
                        accent: shipConfig.accent, 
                        hits: 0, 
                        coords: [],
                        isHorizontal: isHoriz
                    };

                    for (let i = 0; i < shipConfig.size; i++) {
                        const row = isHoriz ? r : r + i;
                        const col = isHoriz ? c + i : c;
                        this.enemyGrid[row][col] = shipObj;
                        shipObj.coords.push({ r: row, c: col, segIndex: i });
                    }
                    this.enemyShips.push(shipObj);
                    placed = true;
                }
            }
        });
    }

    startCombatPhase() {
        this.gamePhase = 'combat';
        this.autoDeployEnemyFleet();
        document.getElementById('enemy-grid').classList.remove('disabled');
        this.logCombat('[ENGAGEMENT] Enemy fleet detected on radar. Target coordinates to fire!', 'hit');
    }

    handleEnemyGridClick(row, col) {
        if (this.gamePhase !== 'combat' || !this.isPlayerTurn) return;

        const idx = row * 10 + col;
        const cellEl = document.getElementById('enemy-grid').children[idx];
        const banner = document.getElementById('status-phase-text').parentElement;

        if (cellEl.classList.contains('hit') || cellEl.classList.contains('miss')) return;

        this.turnsCount++;
        const target = this.enemyGrid[row][col];

        if (target !== null && typeof target === 'object') {
            // --- DIRECT HIT ---
            cellEl.classList.add('hit');
            target.hits++;
            this.logCombat(`💥 [HIT!] Direct impact on enemy vessel at (${row + 1}, ${col + 1})!`, 'hit');

            if (target.hits >= target.size) {
                this.logCombat(`🔥 [SUNK!] Enemy ${target.name} has been completely destroyed!`, 'hit');
                this.revealSunkShipOnEnemyGrid(target);
            }

            if (this.checkWinCondition(this.enemyShips)) {
                this.endGame(true);
                return;
            }

            // --- EXTRA TURN RULE (HIT = GO AGAIN) ---
            this.isPlayerTurn = true;
            banner.classList.add('extra-turn');
            document.getElementById('status-phase-text').innerText = '🎯 DIRECT HIT! EXTRA TURN GRANTED — Fire again!';
            this.logCombat('⚡ [BONUS TURN] Direct hit! You get another turn to fire!', 'hit');

        } else {
            // --- MISS ---
            cellEl.classList.add('miss');
            this.score = Math.max(100, this.score - 15);
            this.logCombat(`💧 [MISS] Shell splash in open water at (${row + 1}, ${col + 1}).`, 'miss');

            banner.classList.remove('extra-turn');
            document.getElementById('status-phase-text').innerText = 'Missed! Enemy tactical counter-fire incoming...';

            this.isPlayerTurn = false;
            setTimeout(() => this.executeAITurn(), 650);
        }
    }

    revealSunkShipOnEnemyGrid(shipObj) {
        const eGridEl = document.getElementById('enemy-grid');
        shipObj.coords.forEach(({ r, c, segIndex }) => {
            const idx = r * 10 + c;
            const cellEl = eGridEl.children[idx];
            this.applyShipCellClasses(cellEl, shipObj, segIndex, shipObj.isHorizontal);
            cellEl.classList.add('sunk-ship');
        });
    }

    // ==========================================================================
    // SMART & LUCKY AI TACTICAL TARGETING ENGINE
    // ==========================================================================
    getAITargetCoordinates() {
        const pGridEl = document.getElementById('player-grid');

        // Check if cell is unshot
        const isUnshot = (r, c) => {
            if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
            const idx = r * 10 + c;
            const cell = pGridEl.children[idx];
            return cell && !cell.classList.contains('hit') && !cell.classList.contains('miss');
        };

        // Priority 1: Hunt adjacent cells (Up, Down, Left, Right) around known un-sunk hits!
        for (let i = this.aiHitsMemory.length - 1; i >= 0; i--) {
            const lastHit = this.aiHitsMemory[i];
            const shipObj = this.playerGrid[lastHit.r][lastHit.c];

            // Only hunt if this ship is not yet fully sunk
            if (shipObj && typeof shipObj === 'object' && shipObj.hits < shipObj.size) {
                const adjacents = [
                    { r: lastHit.r - 1, c: lastHit.c },
                    { r: lastHit.r + 1, c: lastHit.c },
                    { r: lastHit.r, c: lastHit.c - 1 },
                    { r: lastHit.r, c: lastHit.c + 1 }
                ];

                const validAdj = adjacents.filter(pos => isUnshot(pos.r, pos.c));
                if (validAdj.length > 0) {
                    // Pick adjacent target
                    return validAdj[Math.floor(Math.random() * validAdj.length)];
                }
            }
        }

        // Priority 2: Subtle Tactical Instinct (Tuned down to 8% for natural, fair gameplay!)
        if (Math.random() < 0.08) {
            const luckyTargets = [];
            for (let r = 0; r < 10; r++) {
                for (let c = 0; c < 10; c++) {
                    if (isUnshot(r, c)) {
                        const target = this.playerGrid[r][c];
                        if (target !== null && typeof target === 'object' && target.hits < target.size) {
                            luckyTargets.push({ r, c });
                        }
                    }
                }
            }
            if (luckyTargets.length > 0) {
                return luckyTargets[Math.floor(Math.random() * luckyTargets.length)];
            }
        }

        // Priority 3: Checkerboard Parity Search (Scans even-parity cells to efficiently locate vessels)
        const parityCandidates = [];
        const fallbackCandidates = [];

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (isUnshot(r, c)) {
                    fallbackCandidates.push({ r, c });
                    if ((r + c) % 2 === 0) {
                        parityCandidates.push({ r, c });
                    }
                }
            }
        }

        if (parityCandidates.length > 0) {
            return parityCandidates[Math.floor(Math.random() * parityCandidates.length)];
        }

        return fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)];
    }

    executeAITurn() {
        if (this.gamePhase !== 'combat') return;

        const coords = this.getAITargetCoordinates();
        if (!coords) return;

        const { r, c } = coords;
        const idx = r * 10 + c;
        const cellEl = document.getElementById('player-grid').children[idx];
        const target = this.playerGrid[r][c];

        if (target !== null && typeof target === 'object') {
            // AI Hit!
            cellEl.classList.add('hit');
            target.hits++;
            this.aiHitsMemory.push({ r, c });

            this.logCombat(`⚠️ [WARNING] Enemy artillery hit your ${target.name} at (${r + 1}, ${c + 1})!`, 'miss');

            if (target.hits >= target.size) {
                this.logCombat(`💥 [CRITICAL] Your ${target.name} has been completely sunk!`, 'miss');
                // Remove sunk ship coords from memory
                this.aiHitsMemory = this.aiHitsMemory.filter(pos => this.playerGrid[pos.r][pos.c] !== target);
            }

            if (this.checkWinCondition(this.playerShips)) {
                this.endGame(false);
                return;
            }

            this.updateFleetStatusCount();

            // AI Extra Turn Rule on Hit!
            setTimeout(() => this.executeAITurn(), 650);

        } else {
            // AI Miss
            cellEl.classList.add('miss');
            this.updateFleetStatusCount();

            this.isPlayerTurn = true;
            document.getElementById('status-phase-text').innerText = 'Your turn! Select target coordinates on enemy radar grid.';
        }
    }

    updateFleetStatusCount() {
        const pAlive = this.playerShips.filter(s => s.hits < s.size).length;
        const eAlive = this.enemyShips.filter(s => s.hits < s.size).length;

        document.getElementById('player-ships-left').innerText = `${pAlive} SHIPS ALIVE`;
        document.getElementById('enemy-ships-left').innerText = `${eAlive} SHIPS ALIVE`;
    }

    checkWinCondition(shipsList) {
        return shipsList.every(s => s.hits >= s.size);
    }

    endGame(playerWon) {
        this.gamePhase = 'gameover';
        const modal = document.getElementById('gameover-modal');
        const titleEl = document.getElementById('gameover-title');
        const descEl = document.getElementById('gameover-desc');
        const scoreEl = document.getElementById('gameover-score');

        const finalScore = playerWon ? Math.max(300, this.score - (this.turnsCount * 5)) : 100;

        if (playerWon) {
            titleEl.innerText = 'VICTORY AT SEA!';
            titleEl.style.color = 'var(--neon-cyan)';
            descEl.innerText = `You destroyed the enemy fleet in ${this.turnsCount} turns!`;

            if (window.navalLeaderboard) {
                window.navalLeaderboard.recordScore('battleship', finalScore);
            }
        } else {
            titleEl.innerText = 'FLEET DEFEATED';
            titleEl.style.color = 'var(--alert-red)';
            descEl.innerText = 'Your vessels were sunk by enemy naval fire.';
        }

        scoreEl.innerText = `${finalScore.toLocaleString()} PTS`;
        modal.classList.remove('hidden');
    }

    restartGame() {
        document.getElementById('gameover-modal').classList.add('hidden');
        document.getElementById('btn-rotate').style.display = 'inline-block';
        document.getElementById('btn-randomize').style.display = 'inline-block';
        this.showPlacementScreen();
    }

    logCombat(msg, type = 'sys') {
        const output = document.getElementById('log-output');
        const p = document.createElement('p');
        p.className = type;
        p.innerText = msg;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.battleship = new BattleshipGame();
});
