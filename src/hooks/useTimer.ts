import { useEffect, useRef } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';

export const useTimer = () => {
    const {
        isSessionActive,
        isPreparing,
        isPaused,
        timeLeft,
        prepTimeLeft,
        setTimeLeft,
        setPrepTimeLeft,
        setSessionActive,
        finishPreparation,
    } = useMeditationStore();

    const startTimeRef = useRef<number | null>(null);
    const initialTimeLeftRef = useRef<number>(0);
    const requestRef = useRef<number>();

    useEffect(() => {
        if (isSessionActive && !isPaused) {
            // Start or Resume: record the start time
            startTimeRef.current = performance.now();
            initialTimeLeftRef.current = isPreparing ? prepTimeLeft : timeLeft;

            const tick = () => {
                const now = performance.now();
                const elapsed = Math.floor((now - (startTimeRef.current as number)) / 1000);
                const currentTimeLeft = Math.max(0, initialTimeLeftRef.current - elapsed);

                if (isPreparing) {
                    if (currentTimeLeft !== prepTimeLeft) {
                        setPrepTimeLeft(currentTimeLeft);
                    }
                    if (currentTimeLeft <= 0) {
                        finishPreparation();
                    }
                } else {
                    if (currentTimeLeft !== timeLeft) {
                        setTimeLeft(currentTimeLeft);
                    }
                    if (currentTimeLeft <= 0) {
                        startTimeRef.current = null;
                    }
                }

                if (isSessionActive && !isPaused) {
                    requestRef.current = requestAnimationFrame(tick);
                }
            };

            requestRef.current = requestAnimationFrame(tick);
        } else {
            // Paused or Inactive: stop the loop
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            startTimeRef.current = null;
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isSessionActive, isPreparing, isPaused]);

    return {
        timeLeft: isPreparing ? prepTimeLeft : timeLeft,
        isPreparing,
        isPaused,
        formatTime: (seconds: number) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };
};
