import React, { useEffect } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { useTimer } from '../hooks/useTimer';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { audioEngine } from '../services/audioEngine';

const BELL_MAP: Record<string, string> = {
    'Tibetan': 'https://actions.google.com/sounds/v1/foley/dinner_bell.ogg',
    'Gong': 'https://actions.google.com/sounds/v1/foley/ambience_bell.ogg',
    'Nature': 'https://actions.google.com/sounds/v1/foley/wind_chime_single.ogg',
};

const AMBIENT_MAP: Record<string, string> = {
    'Rain': 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
    'Forest': 'https://actions.google.com/sounds/v1/nature/forest_morning_birds.ogg',
    'WhiteNoise': 'https://actions.google.com/sounds/v1/weather/white_noise.ogg',
};

const ActiveSession: React.FC = () => {
    const { isSessionActive, isPaused, currentPreset, resetSession, togglePaused, completeSession } = useMeditationStore();
    const { timeLeft, formatTime, isPreparing } = useTimer();

    // Setup Audio
    useEffect(() => {
        if (isSessionActive) {
            const setupAudio = async () => {
                const { ambient } = currentPreset.audioConfig;
                if (ambient !== 'None' && AMBIENT_MAP[ambient]) {
                    await audioEngine.loadSound(ambient, AMBIENT_MAP[ambient]);
                    if (!isPaused) {
                        audioEngine.playAmbient(ambient, 0.4);
                    }
                }
            };
            setupAudio();
            KeepAwake.keepAwake().catch(() => { });
        } else {
            audioEngine.stopAmbient();
            KeepAwake.allowSleep().catch(() => { });
        }

        return () => {
            audioEngine.stopAmbient();
            KeepAwake.allowSleep().catch(() => { });
        };
    }, [isSessionActive]);

    // Handle Pause/Resume for Audio
    useEffect(() => {
        const { ambient } = currentPreset.audioConfig;
        if (isSessionActive) {
            if (isPaused) {
                audioEngine.stopAmbient();
            } else if (ambient !== 'None') {
                audioEngine.playAmbient(ambient, 0.4);
            }
        }
    }, [isPaused, isSessionActive]);

    // Handle bell triggers
    useEffect(() => {
        if (isSessionActive && !isPreparing && !isPaused) {
            const bell = currentPreset.audioConfig.bell;
            if (bell !== 'Silence') {
                audioEngine.playBell(bell);
            }
        }
    }, [isPreparing]);

    // Handle session completion
    useEffect(() => {
        if (timeLeft === 0 && isSessionActive && !isPreparing && !isPaused) {
            const bell = currentPreset.audioConfig.bell;
            if (bell !== 'Silence') {
                audioEngine.playBell(bell);
            }
            Haptics.vibrate().catch(() => { });

            // Transition to summary after 2 seconds (to let the bell resonate)
            const timeout = setTimeout(() => {
                completeSession(currentPreset.duration * 60);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [timeLeft, isSessionActive, isPreparing, isPaused]);

    const handleExit = () => {
        audioEngine.stopAmbient();
        resetSession();
    };



    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-neutral-dark dark:text-neutral-light font-display antialiased overflow-hidden selection:bg-primary/30">
            <div className="relative flex h-full min-h-screen w-full flex-col justify-between">
                {/* Header (Minimal) */}
                <header className="flex items-center p-6 justify-center z-10">
                    <div className="flex items-center gap-2 opacity-30 text-[10px] font-sans tracking-[0.3em] uppercase">
                        {isPreparing ? 'Preparation Phase' : 'Deep Focus Mode'}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={`w-80 h-80 bg-primary/20 rounded-full blur-[100px] dark:bg-primary/10 transition-opacity duration-1000 ${isPaused ? 'opacity-10' : 'animate-pulse'}`}></div>
                    </div>

                    {/* Central Timer */}
                    <div className={`relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 transition-all duration-700 ${isPaused ? 'scale-90 opacity-60' : 'scale-100'}`}>
                        {/* Breathing Rings */}
                        <div className={`absolute inset-0 rounded-full border border-primary/15 ${!isPaused && 'animate-breathe'}`} style={{ animationDelay: '0s' }}></div>
                        <div className={`absolute inset-6 rounded-full border border-primary/25 ${!isPaused && 'animate-breathe'}`} style={{ animationDelay: '0.5s' }}></div>

                        <div className="relative w-full h-full rounded-full border-[2px] border-primary/30 flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-2xl">
                            <h1 className="text-6xl sm:text-7xl font-light tracking-tight tabular-nums mb-1 font-display">
                                {formatTime(timeLeft)}
                            </h1>
                            <p className="text-primary font-body text-xs font-bold tracking-[0.2em] uppercase opacity-70 mt-2">
                                {isPaused ? 'Paused' : (isPreparing ? 'Get Ready' : 'Breathe')}
                            </p>
                        </div>
                    </div>

                    {/* Info Indicator */}
                    <div className="mt-16 flex items-center gap-10 opacity-30 font-body text-[10px] uppercase tracking-widest">
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-lg">spa</span>
                            <span>{currentPreset.audioConfig.ambient}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-lg">notifications_active</span>
                            <span>{currentPreset.audioConfig.bell}</span>
                        </div>
                    </div>
                </main>

                {/* Footer Controls (Mobile Optimized) */}
                <footer className="pb-20 pt-10 px-8 flex flex-col items-center gap-6 z-10">
                    <div className="flex items-center gap-4 w-full max-w-xs">
                        {/* Exit Button - Bottom Left-ish */}
                        <button
                            onClick={handleExit}
                            className="flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-body font-bold text-xs uppercase tracking-widest transition-all active:scale-95 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                            <span>Exit</span>
                        </button>

                        {/* Pause/Resume Button - Bottom Main */}
                        <button
                            onClick={togglePaused}
                            className={`flex-[2] flex items-center justify-center gap-3 h-16 rounded-2xl transition-all active:scale-95 shadow-lg ${isPaused
                                ? 'bg-primary text-white shadow-primary/30'
                                : 'bg-white dark:bg-surface-dark text-primary border border-primary/10'
                                }`}
                        >
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isPaused ? "'FILL' 1" : "" }}>
                                {isPaused ? 'play_arrow' : 'pause'}
                            </span>
                            <span className="font-body font-bold text-sm uppercase tracking-[0.15em]">
                                {isPaused ? 'Resume' : 'Pause'}
                            </span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ActiveSession;
