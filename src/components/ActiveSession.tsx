import React, { useEffect, useRef } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { useTimer } from '../hooks/useTimer';
import { Haptics } from '@capacitor/haptics';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { audioEngine } from '../services/audioEngine';

const ActiveSession: React.FC = () => {
    const { isSessionActive, isPaused, currentPreset, resetSession, togglePaused, completeSession, sessionStartTime, hasCompletedTarget, markTargetComplete } = useMeditationStore();
    const { timeLeft, formatTime, isPreparing } = useTimer();
    const startBellPlayedRef = useRef(false);
    const completionHandledRef = useRef(false);

    const playConfiguredBell = React.useCallback(() => {
        const { bell, volume } = currentPreset.audioConfig;
        if (bell === 'Silence') return;

        audioEngine.playBell(bell, volume);
    }, [currentPreset.audioConfig]);

    // Keep the screen awake only while a session is active.
    useEffect(() => {
        if (isSessionActive) {
            KeepAwake.keepAwake().catch(() => { });
        } else {
            KeepAwake.allowSleep().catch(() => { });
        }

        return () => {
            KeepAwake.allowSleep().catch(() => { });
        };
    }, [isSessionActive]);

    // Load and control ambient audio separately so pause/resume does not restart the timer.
    useEffect(() => {
        let cancelled = false;
        const { ambient, volume } = currentPreset.audioConfig;

        audioEngine.stopAmbient();

        if (isSessionActive && !isPaused && ambient !== 'None' && !cancelled) {
            audioEngine.playAmbient(ambient, volume);
        }

        return () => {
            cancelled = true;
            audioEngine.stopAmbient();
        };
    }, [isSessionActive, isPaused, currentPreset.audioConfig]);

    useEffect(() => {
        if (!isSessionActive) {
            startBellPlayedRef.current = false;
            completionHandledRef.current = false;
        }
    }, [isSessionActive]);

    // Handle the start bell once, either after preparation or immediately when preparation is disabled.
    useEffect(() => {
        if (isSessionActive && !isPreparing && !startBellPlayedRef.current) {
            startBellPlayedRef.current = true;
            playConfiguredBell();
        }
    }, [isSessionActive, isPreparing, playConfiguredBell]);

    // Handle session target reached — bell rings, session continues past target
    useEffect(() => {
        if (timeLeft === 0 && isSessionActive && !isPreparing && !isPaused && !completionHandledRef.current) {
            completionHandledRef.current = true;
            playConfiguredBell();
            Haptics.vibrate().catch(() => { });
            markTargetComplete();
            // Session continues — user must press "End Session" to finish
        }
    }, [timeLeft, isSessionActive, isPreparing, isPaused, playConfiguredBell, markTargetComplete]);

    const handleExit = () => {
        audioEngine.stopAmbient();
        if (hasCompletedTarget && sessionStartTime) {
            // Target was reached — save session with actual elapsed time
            const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
            completeSession(elapsedSeconds);
        } else {
            // Early quit before target — reset without saving
            resetSession();
        }
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
                    {/* Target-complete indicator */}
                    {hasCompletedTarget && (
                        <div className="flex items-center gap-2 text-primary/70 font-body text-xs tracking-wide animate-pulse">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span>Target reached — session continues</span>
                        </div>
                    )}
                    <div className="flex items-center gap-4 w-full max-w-xs">
                        {/* Exit / End Session Button */}
                        {hasCompletedTarget ? (
                            <button
                                onClick={handleExit}
                                className="flex-[2] flex items-center justify-center gap-3 h-16 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 font-body font-bold text-sm uppercase tracking-[0.15em] transition-all active:scale-95 hover:bg-[#5a7d6d]"
                            >
                                <span className="material-symbols-outlined text-2xl">flag</span>
                                <span>End Session</span>
                            </button>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ActiveSession;
