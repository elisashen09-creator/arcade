/* Leaderboard Manager for High Score Tracking across Naval Games */

class NavalLeaderboard {
    constructor() {
        this.storageKey = 'naval_arcade_leaderboards';
        this.initLeaderboards();
    }

    initLeaderboards() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialScores = {
                battleship: [
                    { username: 'admiral', score: 950, date: '2026-08-11' },
                    { username: 'captain', score: 720, date: '2026-08-11' },
                    { username: 'Cadet_Guest', score: 450, date: '2026-08-11' }
                ],
                ship_attackers: [
                    { username: 'admiral', score: 14500, date: '2026-08-11' },
                    { username: 'captain', score: 9800, date: '2026-08-11' },
                    { username: 'Cadet_Guest', score: 5200, date: '2026-08-11' }
                ]
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialScores));
        }
    }

    getScores(gameId) {
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        return data[gameId] || [];
    }

    recordScore(gameId, score) {
        const user = window.navalAuth ? window.navalAuth.getCurrentUser() : { username: 'Cadet_Guest' };
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');

        if (!data[gameId]) {
            data[gameId] = [];
        }

        data[gameId].push({
            username: user.username,
            score: score,
            date: new Date().toISOString().split('T')[0]
        });

        // Sort descending by score and keep top 10
        data[gameId].sort((a, b) => b.score - a.score);
        data[gameId] = data[gameId].slice(0, 10);

        localStorage.setItem(this.storageKey, JSON.stringify(data));
        return data[gameId];
    }
}

window.navalLeaderboard = new NavalLeaderboard();
