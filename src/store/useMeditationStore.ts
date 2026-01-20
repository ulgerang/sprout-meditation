import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';

interface AudioConfig {
    bell: string;
    ambient: string;
    volume: number;
}

interface Preset {
    id: string;
    duration: number; // in minutes
    preparationTime: number; // in seconds
    audioConfig: AudioConfig;
}

export interface MeditationSession {
    id: string;
    date: string; // ISO string
    duration: number; // actual duration in seconds
    presetName: string;
    mood?: 'calm' | 'focus' | 'restless' | string;
    note?: string;
}

interface MeditationState {
    currentPreset: Preset;
    presets: Preset[];
    isSessionActive: boolean;
    isPreparing: boolean;
    isPaused: boolean;
    timeLeft: number;
    prepTimeLeft: number;
    currentView: 'home' | 'audio-settings' | 'settings' | 'session-summary' | 'reflection-note' | 'stats' | 'guide' | 'daily-log';
    history: MeditationSession[];
    lastSession?: MeditationSession;
    selectedSession?: MeditationSession; // For viewing details

    // Actions
    setSessionActive: (active: boolean) => void;
    setPreparing: (preparing: boolean) => void;
    setPaused: (paused: boolean) => void;
    togglePaused: () => void;
    setTimeLeft: (time: number) => void;
    setPrepTimeLeft: (time: number) => void;
    setCurrentPreset: (preset: Preset) => void;
    setCurrentView: (view: 'home' | 'audio-settings' | 'settings' | 'session-summary' | 'reflection-note' | 'stats' | 'guide' | 'daily-log') => void;
    setSelectedSession: (session: MeditationSession | undefined) => void;
    startSession: () => void;
    finishPreparation: () => void;
    resetSession: () => void;
    updatePreset: (id: string, updates: Partial<Preset>) => void;

    // History Actions
    completeSession: (durationSeconds: number) => void;
    saveSessionNote: (mood: string, note: string) => void;
    clearHistory: () => void;
    importHistory: (jsonString: string) => boolean;
}

const capacitorStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const { value } = await Preferences.get({ key: name });
        return value;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await Preferences.set({ key: name, value });
    },
    removeItem: async (name: string): Promise<void> => {
        await Preferences.remove({ key: name });
    },
};

const defaultPresets: Preset[] = [
    {
        id: '1',
        duration: 10,
        preparationTime: 10,
        audioConfig: { bell: 'Tibetan', ambient: 'None', volume: 0.8 }
    },
    {
        id: '2',
        duration: 15,
        preparationTime: 10,
        audioConfig: { bell: 'Tibetan', ambient: 'None', volume: 0.8 }
    },
    {
        id: '3',
        duration: 30,
        preparationTime: 10,
        audioConfig: { bell: 'Tibetan', ambient: 'None', volume: 0.8 }
    },
    {
        id: '4',
        duration: 45,
        preparationTime: 10,
        audioConfig: { bell: 'Tibetan', ambient: 'None', volume: 0.8 }
    },
    {
        id: '5',
        duration: 60,
        preparationTime: 10,
        audioConfig: { bell: 'Tibetan', ambient: 'None', volume: 0.8 }
    },
];

export const useMeditationStore = create<MeditationState>()(
    persist(
        (set) => ({
            currentPreset: defaultPresets[0],
            presets: defaultPresets,
            isSessionActive: false,
            isPreparing: false,
            isPaused: false,
            timeLeft: defaultPresets[0].duration * 60,
            prepTimeLeft: defaultPresets[0].preparationTime,
            currentView: 'home',
            history: [],

            setSessionActive: (active) => set({ isSessionActive: active }),
            setPreparing: (preparing) => set({ isPreparing: preparing }),
            setPaused: (paused) => set({ isPaused: paused }),
            togglePaused: () => set((state) => ({ isPaused: !state.isPaused })),
            setTimeLeft: (time) => set({ timeLeft: time }),
            setPrepTimeLeft: (time) => set({ prepTimeLeft: time }),
            setCurrentView: (view) => set({ currentView: view }),
            setSelectedSession: (session) => set({ selectedSession: session }),
            setCurrentPreset: (preset) => set({
                currentPreset: preset,
                timeLeft: preset.duration * 60,
                prepTimeLeft: preset.preparationTime,
            }),
            startSession: () => set((state) => {
                const hasPrep = state.currentPreset.preparationTime > 0;
                return {
                    isSessionActive: true,
                    isPreparing: hasPrep,
                    isPaused: false,
                    prepTimeLeft: state.currentPreset.preparationTime,
                    timeLeft: state.currentPreset.duration * 60
                };
            }),
            finishPreparation: () => set({ isPreparing: false }),
            resetSession: () => set((state) => ({
                isSessionActive: false,
                isPreparing: false,
                isPaused: false,
                timeLeft: state.currentPreset.duration * 60,
                prepTimeLeft: state.currentPreset.preparationTime,
                currentView: 'home'
            })),
            updatePreset: (id, updates) => set((state) => {
                const newPresets = state.presets.map(p => p.id === id ? { ...p, ...updates } : p);
                const isCurrent = state.currentPreset.id === id;
                const updatedCurrent = isCurrent ? { ...state.currentPreset, ...updates } : state.currentPreset;

                return {
                    presets: newPresets,
                    currentPreset: updatedCurrent,
                    timeLeft: updatedCurrent.duration * 60,
                    prepTimeLeft: updatedCurrent.preparationTime
                };
            }),

            completeSession: (durationSeconds) => set((state) => {
                const newSession: MeditationSession = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    duration: durationSeconds,
                    presetName: `Session ${state.currentPreset.id}`
                };
                return {
                    isSessionActive: false,
                    lastSession: newSession,
                    currentView: 'session-summary',
                    history: [newSession, ...state.history]
                };
            }),

            saveSessionNote: (mood, note) => set((state) => {
                if (!state.lastSession) return state;
                const updatedSession = { ...state.lastSession, mood, note };
                const newHistory = state.history.map(s => s.id === updatedSession.id ? updatedSession : s);
                return {
                    history: newHistory,
                    lastSession: undefined,
                    currentView: 'home'
                };
            }),

            clearHistory: () => set({ history: [] }),

            importHistory: (jsonString) => {
                try {
                    const data = JSON.parse(jsonString);
                    if (Array.isArray(data)) {
                        set({ history: data });
                        return true;
                    }
                    return false;
                } catch (e) {
                    console.error('Failed to import history', e);
                    return false;
                }
            },
        }),
        {
            name: 'meditation-storage',
            storage: createJSONStorage(() => capacitorStorage),
            partialize: (state) => ({
                history: state.history,
                presets: state.presets
            }),
        }
    )
);
