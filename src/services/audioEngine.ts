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

        const buffer = this.buffers.get(name);
        if (!buffer) return;

        this.ambientSource = this.context!.createBufferSource();
        this.ambientSource.buffer = buffer;
        this.ambientSource.loop = true;

        this.ambientGain!.gain.setValueAtTime(volume, this.context!.currentTime);
        this.ambientSource.connect(this.ambientGain!);
        this.ambientSource.start();
    }

    stopAmbient() {
        if (this.ambientSource) {
            this.ambientSource.stop();
            this.ambientSource.disconnect();
            this.ambientSource = null;
        }
    }

    playBell(name: string, volume: number = 0.8) {
        this.initContext();
        const buffer = this.buffers.get(name);
        if (!buffer) return;

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
}

export const audioEngine = new AudioEngine();
