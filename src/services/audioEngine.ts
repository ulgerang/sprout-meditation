export class AudioEngine {
    private context: AudioContext | null = null;
    private ambientSource: AudioBufferSourceNode | null = null;
    private ambientGain: GainNode | null = null;
    private masterGain: GainNode | null = null;
    private buffers: Map<string, AudioBuffer> = new Map();

    constructor() {
        // Context is created on first interaction to comply with browser policies
    }

    private initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);

            this.ambientGain = this.context.createGain();
            this.ambientGain.connect(this.masterGain);
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    async loadSound(name: string, url: string) {
        this.initContext();
        if (this.buffers.has(name)) return;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context!.decodeAudioData(arrayBuffer);
            this.buffers.set(name, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound: ${name}`, error);
        }
    }

    playAmbient(name: string, volume: number = 0.5) {
        this.initContext();
        this.stopAmbient();

        const buffer = this.buffers.get(name) ?? this.createAmbientBuffer(name);
        this.buffers.set(name, buffer);

        this.ambientSource = this.context!.createBufferSource();
        this.ambientSource.buffer = buffer;
        this.ambientSource.loop = true;

        this.ambientGain!.gain.setValueAtTime(volume, this.context!.currentTime);
        this.ambientSource.connect(this.ambientGain!);
        this.ambientSource.start();
    }

    stopAmbient() {
        if (this.ambientSource) {
            try {
                this.ambientSource.stop();
            } catch {
                // Source may already be stopped after rapid pause/resume.
            }
            this.ambientSource.disconnect();
            this.ambientSource = null;
        }
    }

    playBell(name: string, volume: number = 0.8) {
        this.initContext();
        const buffer = this.buffers.get(name);
        if (!buffer) {
            this.playSynthBell(name, volume);
            return;
        }

        const source = this.context!.createBufferSource();
        source.buffer = buffer;

        const gain = this.context!.createGain();
        gain.gain.setValueAtTime(volume, this.context!.currentTime);

        source.connect(gain);
        gain.connect(this.masterGain!);
        source.start();
    }

    setMasterVolume(volume: number) {
        this.initContext();
        this.masterGain!.gain.setTargetAtTime(volume, this.context!.currentTime, 0.1);
    }

    setAmbientVolume(volume: number) {
        this.initContext();
        this.ambientGain!.gain.setTargetAtTime(volume, this.context!.currentTime, 0.1);
    }

    private createAmbientBuffer(name: string): AudioBuffer {
        this.initContext();
        const sampleRate = this.context!.sampleRate;
        const durationSeconds = 2;
        const frameCount = sampleRate * durationSeconds;
        const buffer = this.context!.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < frameCount; i += 1) {
            const t = i / sampleRate;
            const noise = Math.random() * 2 - 1;
            if (name === 'Rain') {
                data[i] = noise * (0.18 + Math.random() * 0.16);
            } else if (name === 'Forest') {
                data[i] = (Math.sin(t * 2 * Math.PI * 7) * 0.08) + (noise * 0.08);
            } else {
                data[i] = noise * 0.22;
            }
        }

        return buffer;
    }

    private playSynthBell(name: string, volume: number) {
        const now = this.context!.currentTime;
        const profiles: Record<string, { frequencies: number[]; type: OscillatorType; decay: number }> = {
            Tibetan: { frequencies: [220, 440, 660], type: 'sine', decay: 2.6 },
            Gong: { frequencies: [110, 165, 220], type: 'triangle', decay: 3.2 },
            Nature: { frequencies: [880, 1320], type: 'sine', decay: 1.4 },
        };
        const profile = profiles[name] ?? profiles.Tibetan;

        profile.frequencies.forEach((frequency, index) => {
            const oscillator = this.context!.createOscillator();
            const gain = this.context!.createGain();
            oscillator.type = profile.type;
            oscillator.frequency.setValueAtTime(frequency, now);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.985, now + profile.decay);
            gain.gain.setValueAtTime(volume / (index + 1.8), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decay);
            oscillator.connect(gain);
            gain.connect(this.masterGain!);
            oscillator.start(now);
            oscillator.stop(now + profile.decay);
        });
    }
}

export const audioEngine = new AudioEngine();
