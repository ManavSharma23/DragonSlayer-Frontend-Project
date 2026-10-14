// Audio synthesis using Web Audio API (zero external asset loading issues, works 100% offline & GitHub Pages)
class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.init();
    }

    init() {
        // Load mute state from localStorage if available
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                const savedMute = window.localStorage.getItem("dragonslayer_muted");
                if (savedMute !== null) {
                    this.muted = savedMute === "true";
                }
            }
        } catch (e) {
            console.warn("Storage access failed for sound:", e);
        }
    }

    getAudioContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
        return this.ctx;
    }

    toggleMute() {
        this.muted = !this.muted;
        try {
            localStorage.setItem("dragonslayer_muted", this.muted);
        } catch (e) {}
        if (this.muted && this.bgmPlaying) {
            this.stopBGM();
        }
        return this.muted;
    }

    playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1, freqSlide = null) {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (freqSlide) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(10, freqSlide), ctx.currentTime + duration);
        }

        gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    playSwordHit() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        // White noise slash + low impact punch
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1400;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        this.playTone(180, "triangle", 0.18, 0.2, 50);
    }

    playCritHit() {
        this.playSwordHit();
        setTimeout(() => this.playTone(587.33, "square", 0.25, 0.2, 880), 50);
    }

    playDefend() {
        this.playTone(280, "triangle", 0.2, 0.2, 110);
    }

    playCoin() {
        if (this.muted) return;
        this.playTone(987.77, "sine", 0.08, 0.12);
        setTimeout(() => this.playTone(1318.51, "sine", 0.25, 0.15), 70);
    }

    playPotion() {
        if (this.muted) return;
        const freqs = [330, 440, 550, 660, 880];
        freqs.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, "sine", 0.12, 0.12), idx * 45);
        });
    }

    playLevelUp() {
        if (this.muted) return;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, "triangle", 0.35, 0.18), idx * 80);
        });
    }

    playVictory() {
        if (this.muted) return;
        const notes = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
        const times = [0, 120, 240, 380, 540, 720];
        notes.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, "triangle", 0.45, 0.2), times[idx]);
        });
    }

    playGameOver() {
        if (this.muted) return;
        const notes = [440, 415.3, 392, 349.23, 293.66];
        notes.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, "sawtooth", 0.5, 0.15, f * 0.8), idx * 180);
        });
    }

    playBossRoar() {
        if (this.muted) return;
        this.playTone(90, "sawtooth", 0.9, 0.3, 40);
        setTimeout(() => this.playTone(130, "sawtooth", 0.7, 0.25, 55), 150);
    }

    playButtonClick() {
        this.playTone(520, "sine", 0.05, 0.04, 300);
    }

    playFlee() {
        this.playTone(400, "triangle", 0.15, 0.12, 200);
    }
}

export const sounds = new SoundManager();
