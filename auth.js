/* Client-Side JWT Authentication Engine & User Profile Manager */

class NavalJWTAuth {
    constructor() {
        this.secret = 'NAVAL_ARCADE_SECRET_KEY_2026';
        this.tokenKey = 'naval_arcade_jwt_token';
        this.usersKey = 'naval_arcade_user_db';
        this.initUserDB();
    }

    initUserDB() {
        if (!localStorage.getItem(this.usersKey)) {
            const initialUsers = {
                'admiral': { passwordHash: 'navy123', rank: 'Fleet Admiral', joined: '2026-08-11' },
                'captain': { passwordHash: 'navy123', rank: 'Captain', joined: '2026-08-11' }
            };
            localStorage.setItem(this.usersKey, JSON.stringify(initialUsers));
        }
    }

    // Base64URL Helper
    base64UrlEncode(str) {
        return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    base64UrlDecode(str) {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        return atob(base64);
    }

    // Generate JWT Token (Header.Payload.Signature)
    createJWT(payload) {
        const header = { alg: 'HS256', typ: 'JWT' };
        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify({
            ...payload,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (86400 * 7) // 7 days
        }));

        // Simple HMAC-like Signature Simulation
        const signature = this.base64UrlEncode(`${encodedHeader}.${encodedPayload}.${this.secret}`);
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    // Decode & Verify JWT Token
    verifyJWT(token) {
        if (!token) return null;
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            const [encodedHeader, encodedPayload, signature] = parts;
            const expectedSignature = this.base64UrlEncode(`${encodedHeader}.${encodedPayload}.${this.secret}`);

            if (signature !== expectedSignature) return null;

            const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                return null; // Expired
            }
            return payload;
        } catch (e) {
            return null;
        }
    }

    // Register New User
    signup(username, password) {
        const db = JSON.parse(localStorage.getItem(this.usersKey));
        const cleanUser = username.trim().toLowerCase();

        if (db[cleanUser]) {
            return { success: false, error: 'Callsign / Officer Username already exists!' };
        }

        db[cleanUser] = {
            passwordHash: password,
            rank: 'Commander',
            joined: new Date().toISOString().split('T')[0]
        };

        localStorage.setItem(this.usersKey, JSON.stringify(db));

        const token = this.createJWT({ username: cleanUser, rank: 'Commander' });
        localStorage.setItem(this.tokenKey, token);
        return { success: true, token, username: cleanUser };
    }

    // User Login
    login(username, password) {
        const db = JSON.parse(localStorage.getItem(this.usersKey));
        const cleanUser = username.trim().toLowerCase();

        if (!db[cleanUser] || db[cleanUser].passwordHash !== password) {
            return { success: false, error: 'Invalid Callsign or Password credentials!' };
        }

        const token = this.createJWT({ username: cleanUser, rank: db[cleanUser].rank });
        localStorage.setItem(this.tokenKey, token);
        return { success: true, token, username: cleanUser };
    }

    // Logout Current Session
    logout() {
        localStorage.removeItem(this.tokenKey);
    }

    // Get Active Authenticated User Profile
    getCurrentUser() {
        const token = localStorage.getItem(this.tokenKey);
        const verified = this.verifyJWT(token);

        if (verified && verified.username) {
            return {
                authenticated: true,
                username: verified.username,
                rank: verified.rank || 'Officer',
                token: token
            };
        }

        return {
            authenticated: false,
            username: 'Cadet_Guest',
            rank: 'Guest Recruiter',
            token: null
        };
    }
}

window.navalAuth = new NavalJWTAuth();
