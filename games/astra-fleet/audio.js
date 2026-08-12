/* Web Audio API Procedural Deep-Space Sound Synthesizer & Music Engine */

class SpaceSoundSynthesizer {
    constructor() {
        this.ctx = null;
        const isMuted = localStorage.getItem('astra_audio_muted') === 'true';
        this.enabled = !isMuted;
        this.musicPlaying = false;
        this.musicInterval = null;
        this.noteStep = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('astra_audio_muted', (!this.enabled).toString());

        if (!this.enabled && this.musicPlaying) {
            this.stopSpaceMusic();
        } else if (this.enabled && !this.musicPlaying) {
            this.startSpaceMusic();
        }

        this.updateAudioUI();
        return this.enabled;
    }

    updateAudioUI() {
        document.querySelectorAll('.btn-toggle-audio').forEach(btn => {
            const label = btn.querySelector('.audio-label');
            const icon = btn.querySelector('.icon');
            if (this.enabled) {
                if (label) label.innerText = 'SOUND: ON';
                if (icon) icon.innerText = '🔊';
            } else {
                if (label) label.innerText = 'SOUND: OFF';
                if (icon) icon.innerText = '🔇';
            }
        });
    }

    // Play Player Plasma Cannon Shot
    playPlasmaShot(freq = 950, duration = 0.12) {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    }

    // Play Enemy Laser Shot (lower pitch, square wave)
    playEnemyLaser() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(450, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch(e) {}
    }

    // Play Shield Hit Sound (Resonant hum)
    playShieldHit() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.18);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
        } catch(e) {}
    }

    // Play Hull Damage Hit Sound
    playHullHit() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.2);
        } catch(e) {}
    }

    // Play Pickup Collection Sound (ascending chime)
    playPickupSound() {
        if (!this.enabled) return;
        this.init();
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

                gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.1);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + idx * 0.04);
                osc.stop(this.ctx.currentTime + idx * 0.04 + 0.1);
            });
        } catch(e) {}
    }

    // Play Torpedo Launch Sound
    playTorpedoSound() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.35);

            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.35);
        } catch(e) {}
    }

    // Play Special Ability Blast
    playSpecialAbility() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } catch(e) {}
    }

    // Play Explosion Boom
    playExplosion() {
        if (!this.enabled) return;
        this.init();
        try {
            const bufferSize = this.ctx.sampleRate * 0.35;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.35);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch(e) {}
    }

    // Boss Warning Siren
    playBossWarning() {
        if (!this.enabled) return;
        this.init();
        try {
            for (let i = 0; i < 3; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, this.ctx.currentTime + i * 0.25);
                osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + i * 0.25 + 0.18);

                gain.gain.setValueAtTime(0.25, this.ctx.currentTime + i * 0.25);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.25 + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + i * 0.25);
                osc.stop(this.ctx.currentTime + i * 0.25 + 0.18);
            }
        } catch(e) {}
    }

    // Ambient Deep-Space Ambient Synth Music
    startSpaceMusic() {
        if (this.musicPlaying || !this.enabled) return;
        this.init();
        this.musicPlaying = true;
        this.noteStep = 0;

        const bassScale = [55.00, 55.00, 65.41, 73.42, 82.41, 73.42, 65.41, 55.00];
        const arpScale = [220.00, 277.18, 329.63, 440.00, 329.63, 277.18];

        this.musicInterval = setInterval(() => {
            if (!this.enabled || !this.ctx) return;
            try {
                const bassFreq = bassScale[this.noteStep % bassScale.length];
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(bassFreq, this.ctx.currentTime);

                gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.22);

                if (this.noteStep % 2 === 0) {
                    const arpFreq = arpScale[(this.noteStep / 2) % arpScale.length];
                    const arpOsc = this.ctx.createOscillator();
                    const arpGain = this.ctx.createGain();

                    arpOsc.type = 'sine';
                    arpOsc.frequency.setValueAtTime(arpFreq, this.ctx.currentTime);

                    arpGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
                    arpGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

                    arpOsc.connect(arpGain);
                    arpGain.connect(this.ctx.destination);

                    arpOsc.start();
                    arpOsc.stop(this.ctx.currentTime + 0.18);
                }

                this.noteStep++;
            } catch(e) {}
        }, 160);
    }

    stopSpaceMusic() {
        this.musicPlaying = false;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }
}

window.soundSynth = new SpaceSoundSynthesizer();
window.addEventListener('DOMContentLoaded', () => {
    window.soundSynth.updateAudioUI();
});
