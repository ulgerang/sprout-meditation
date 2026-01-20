import React, { useState } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { useTimer } from '../hooks/useTimer';
import PresetModal from './PresetModal';
import { calculateStreak } from '../utils/meditationUtils';

const Home: React.FC = () => {
    const { currentPreset, presets, history, setCurrentPreset, startSession, setCurrentView } = useMeditationStore();
    const { formatTime } = useTimer();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

    const streak = calculateStreak(history);

    const handleEditClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setEditingPresetId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display h-screen w-full flex flex-col overflow-hidden text-[#131614] dark:text-[#eceeed] transition-colors duration-500 selection:bg-primary/30 relative">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-breathe"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#d9dddb]/40 dark:bg-black/20 rounded-full blur-[100px]"></div>
            </div>

            <header className="flex items-center justify-between px-6 pt-12 pb-2 relative z-10 w-full max-w-lg mx-auto">
                <button
                    className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
                >
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" style={{ fontSize: '28px' }}>spa</span>
                </button>
                <h1 className="text-sm font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400 opacity-80">Meditation</h1>
                <div className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-neutral-200/50 dark:border-white/10 shadow-sm">
                    <span className="material-symbols-outlined text-orange-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300 leading-none pt-0.5">Day {streak}</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md mx-auto px-6 z-10 pb-24">
                <div className="relative flex items-center justify-center mb-8 w-full aspect-square max-w-[280px] sm:max-w-[320px]">
                    <div className="absolute inset-4 rounded-full bg-white dark:bg-surface-dark shadow-[0_20px_50px_-12px_rgba(103,142,124,0.15)] dark:shadow-none"></div>
                    <svg className="w-full h-full relative z-10 drop-shadow-sm transform rotate-[-90deg]" viewBox="0 0 120 120">
                        <circle className="text-neutral-200 dark:text-neutral-700/50" cx="60" cy="60" fill="none" r="52" stroke="currentColor" strokeWidth="1.5"></circle>
                        <circle
                            className="progress-ring__circle"
                            cx="60" cy="60" fill="none" r="52" stroke="#678e7c"
                            strokeWidth="2.5"
                            strokeDasharray="326.72"
                            strokeDashoffset="0"
                            strokeLinecap="round"
                        ></circle>
                        <circle className="cursor-pointer hover:scale-125 transition-transform shadow-sm" cx="60" cy="8" fill="#fbfaf9" r="5" stroke="#678e7c" strokeWidth="2"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <div className="relative flex items-center justify-center">
                            <div className="text-[3.5rem] sm:text-[4rem] font-light tracking-tighter text-neutral-800 dark:text-neutral-100 leading-none tabular-nums font-display">
                                {formatTime(currentPreset.duration * 60)}
                            </div>
                            <button
                                onClick={() => { setEditingPresetId(currentPreset.id); setIsModalOpen(true); }}
                                aria-label="Edit time"
                                className="absolute -right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full text-neutral-400 hover:text-primary hover:bg-neutral-100 dark:hover:bg-white/10 transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                        </div>
                        <button
                            onClick={startSession}
                            className="mt-5 group relative flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-full hover:bg-[#5a7d6d] active:scale-95 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="material-symbols-outlined relative z-10 text-[22px]">play_arrow</span>
                            <span className="relative z-10 text-base font-semibold tracking-wide pr-1">Start</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
                    {presets.map((preset) => (
                        <div key={preset.id} className="relative group h-20">
                            <button
                                onClick={() => setCurrentPreset(preset)}
                                className={`w-full h-full flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${currentPreset.id === preset.id
                                    ? 'bg-white dark:bg-surface-dark border-2 border-primary shadow-sm text-primary'
                                    : 'bg-[#f4f6f5] dark:bg-white/5 border border-transparent hover:bg-white dark:hover:bg-surface-dark text-neutral-500 dark:text-neutral-400 group-hover:shadow-sm'
                                    }`}
                            >
                                <span className={`text-xl font-display ${currentPreset.id === preset.id ? 'font-bold' : 'font-medium group-hover:text-primary transition-colors'}`}>
                                    {preset.duration}
                                </span>
                                <span className={`text-[11px] font-semibold mt-[-2px] ${currentPreset.id === preset.id ? 'opacity-80' : 'opacity-60'}`}>min</span>
                            </button>
                            <button
                                onClick={(e) => handleEditClick(e, preset.id)}
                                aria-label="Edit preset"
                                className={`absolute top-1 right-1 h-7 w-7 flex items-center justify-center rounded-full transition-colors z-10 ${currentPreset.id === preset.id ? 'text-primary/60 hover:text-primary hover:bg-neutral-100 dark:hover:bg-white/10' : 'text-neutral-400/50 hover:text-primary hover:bg-neutral-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                        </div>
                    ))}
                    <div className="relative group h-20">
                        <button className="w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300/70 dark:border-neutral-600 hover:border-primary/60 dark:hover:border-primary/60 hover:bg-white dark:hover:bg-surface-dark text-neutral-400 hover:text-primary transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">add</span>
                        </button>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <PresetModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    presetId={editingPresetId}
                />
            )}
        </div>
    );
};

export default Home;
