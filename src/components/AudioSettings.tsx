import React, { useEffect, useState } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { audioEngine } from '../services/audioEngine';

const BELL_SOUNDS = [
    { id: 'Tibetan', name: 'Tibetan Bowl', desc: 'Deep resonance', icon: 'landscape', url: 'https://actions.google.com/sounds/v1/foley/dinner_bell.ogg' },
    { id: 'Gong', name: 'Zen Gong', desc: 'Low frequency', icon: 'lens', url: 'https://actions.google.com/sounds/v1/foley/ambience_bell.ogg' },
    { id: 'Nature', name: 'Nature Chime', desc: 'Clear & sharp', icon: 'diamond', url: 'https://actions.google.com/sounds/v1/foley/wind_chime_single.ogg' },
    { id: 'Silence', name: 'No Sound', desc: 'Quiet focus', icon: 'block', url: '' },
];

const AMBIENT_SOUNDS = [
    { id: 'None', name: 'Silent', desc: 'No background sound', icon: 'block', url: '' },
    { id: 'Rain', name: 'Light Rain', desc: 'Gentle drizzle', icon: 'water_drop', url: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg' },
    { id: 'Forest', name: 'Deep Forest', desc: 'Birds & leaves', icon: 'forest', url: 'https://actions.google.com/sounds/v1/nature/forest_morning_birds.ogg' },
    { id: 'WhiteNoise', name: 'White Noise', desc: 'Focus enhancement', icon: 'waves', url: 'https://actions.google.com/sounds/v1/weather/white_noise.ogg' },
];

const AudioSettings: React.FC = () => {
    const { currentPreset, updatePreset, setCurrentView } = useMeditationStore();
    const [previewing, setPreviewing] = useState<string | null>(null);

    const handleBellSelect = (id: string) => {
        updatePreset(currentPreset.id, {
            audioConfig: { ...currentPreset.audioConfig, bell: id }
        });
    };

    const handleAmbientSelect = (id: string) => {
        updatePreset(currentPreset.id, {
            audioConfig: { ...currentPreset.audioConfig, ambient: id }
        });
    };

    const playPreview = async (id: string, url: string, type: 'bell' | 'ambient') => {
        if (!url) return;
        setPreviewing(id);
        await audioEngine.loadSound(id, url);
        if (type === 'bell') {
            audioEngine.playBell(id);
        } else {
            audioEngine.playAmbient(id);
            setTimeout(() => {
                audioEngine.stopAmbient();
                setPreviewing(null);
            }, 3000);
            return;
        }
        setTimeout(() => setPreviewing(null), 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#333333] dark:text-[#e0e0e0] font-display antialiased pb-20">
            <header className="sticky top-0 z-10 flex items-center justify-between px-6 pt-12 pb-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <button
                    onClick={() => setCurrentView('home')}
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                </button>
                <h1 className="text-xl font-bold tracking-tight">Audio Settings</h1>
                <div className="w-10"></div>
            </header>

            <main className="px-6 space-y-8 mt-4">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">notifications_active</span>
                        <h2 className="text-2xl font-bold">Bell Sound</h2>
                    </div>
                    <div className="grid gap-3 font-body">
                        {BELL_SOUNDS.map(sound => (
                            <label key={sound.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${currentPreset.audioConfig.bell === sound.id ? 'bg-white dark:bg-surface-dark border-primary/50 shadow-soft-glow' : 'bg-card-light dark:bg-card-dark border-transparent shadow-sm'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${currentPreset.audioConfig.bell === sound.id ? 'bg-primary/20 text-primary' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                        <span className="material-symbols-outlined">{sound.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{sound.name}</span>
                                        <span className="text-xs opacity-60">{sound.desc}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {sound.url && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); playPreview(sound.id, sound.url, 'bell'); }}
                                            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${previewing === sound.id ? 'text-primary' : 'text-neutral-400 hover:text-primary'}`}
                                        >
                                            <span className="material-symbols-outlined">{previewing === sound.id ? 'volume_up' : 'play_arrow'}</span>
                                        </button>
                                    )}
                                    <input
                                        type="radio"
                                        name="bell"
                                        checked={currentPreset.audioConfig.bell === sound.id}
                                        onChange={() => handleBellSelect(sound.id)}
                                        className="w-5 h-5 accent-primary"
                                    />
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">graphic_eq</span>
                        <h2 className="text-2xl font-bold">Ambient Background</h2>
                    </div>
                    <div className="grid gap-3 font-body">
                        {AMBIENT_SOUNDS.map(sound => (
                            <label key={sound.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${currentPreset.audioConfig.ambient === sound.id ? 'bg-white dark:bg-surface-dark border-primary/50 shadow-soft-glow' : 'bg-card-light dark:bg-card-dark border-transparent shadow-sm'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${currentPreset.audioConfig.ambient === sound.id ? 'bg-primary/20 text-primary' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                        <span className="material-symbols-outlined">{sound.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{sound.name}</span>
                                        <span className="text-xs opacity-60">{sound.desc}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {sound.url && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); playPreview(sound.id, sound.url, 'ambient'); }}
                                            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${previewing === sound.id ? 'text-primary' : 'text-neutral-400 hover:text-primary'}`}
                                        >
                                            <span className="material-symbols-outlined">{previewing === sound.id ? 'volume_up' : 'play_arrow'}</span>
                                        </button>
                                    )}
                                    <input
                                        type="radio"
                                        name="ambient"
                                        checked={currentPreset.audioConfig.ambient === sound.id}
                                        onChange={() => handleAmbientSelect(sound.id)}
                                        className="w-5 h-5 accent-primary"
                                    />
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pointer-events-none">
                <button className="pointer-events-auto w-full max-w-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold active:scale-95 transition-transform shadow-lg shadow-black/10">
                    <span className="material-symbols-outlined">upload_file</span>
                    Upload Your Own (MP3)
                </button>
            </footer>
        </div>
    );
};

export default AudioSettings;
