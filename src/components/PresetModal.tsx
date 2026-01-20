import React, { useState, useRef, useEffect } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface PresetModalProps {
    isOpen: boolean;
    onClose: () => void;
    presetId: string | null;
}

const PresetModal: React.FC<PresetModalProps> = ({ isOpen, onClose, presetId }) => {
    const { presets, updatePreset } = useMeditationStore();
    const preset = presets.find(p => p.id === presetId);
    const [duration, setDuration] = useState(preset?.duration || 10);
    const [prepTime, setPrepTime] = useState(preset?.preparationTime || 10);
    const [bellSound, setBellSound] = useState(preset?.audioConfig?.bell || 'Tibetan');
    const [ambientSound, setAmbientSound] = useState(preset?.audioConfig?.ambient || 'None');

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const accelerationRef = useRef<number>(200);

    if (!isOpen || !preset) return null;

    const adjustDuration = (amount: number) => {
        setDuration(prev => Math.max(1, prev + amount));
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
    };

    const startAdjusting = (amount: number) => {
        adjustDuration(amount);
        accelerationRef.current = 200;

        timerRef.current = setTimeout(() => {
            const run = () => {
                adjustDuration(amount);
                accelerationRef.current = Math.max(50, accelerationRef.current * 0.9);
                timerRef.current = setTimeout(run, accelerationRef.current);
            };
            run();
        }, 500);
    };

    const stopAdjusting = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        return () => stopAdjusting();
    }, []);

    const handleSave = () => {
        updatePreset(preset.id, {
            duration,
            preparationTime: prepTime,
            audioConfig: {
                ...preset.audioConfig,
                bell: bellSound,
                ambient: ambientSound
            }
        });
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex flex-col justify-end">
            <div
                className="w-full bg-[#f4f3f1] dark:bg-[#1e201f] rounded-t-[32px] shadow-2xl pb-8 flex flex-col max-h-[90%] overflow-y-auto relative animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bottom Sheet Handle */}
                <div className="flex flex-col items-center pt-4 pb-2 sticky top-0 bg-[#f4f3f1] dark:bg-[#1e201f] z-20 rounded-t-[32px]">
                    <div className="h-1.5 w-12 rounded-full bg-[#dadddc] dark:bg-neutral-600 mb-4"></div>
                    <h4 className="text-neutral-500 dark:text-neutral-400 text-sm font-bold tracking-wider uppercase">Edit Preset</h4>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 px-6 space-y-8">
                    {/* Duration Section */}
                    <section className="flex flex-col items-center pt-2">
                        <h1 className="text-neutral-800 dark:text-neutral-200 text-[32px] font-bold leading-tight text-center mb-6">Duration</h1>

                        {/* Simple Duration Selector (Replacing complex wheel for now) */}
                        <div className="flex items-center gap-6">
                            <button
                                onMouseDown={() => startAdjusting(-1)}
                                onMouseUp={stopAdjusting}
                                onMouseLeave={stopAdjusting}
                                onTouchStart={(e) => { e.preventDefault(); startAdjusting(-1); }}
                                onTouchEnd={stopAdjusting}
                                className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-primary active:scale-90 transition-transform"
                            >
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-bold text-neutral-800 dark:text-white tabular-nums">{duration}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">minutes</span>
                            </div>
                            <button
                                onMouseDown={() => startAdjusting(1)}
                                onMouseUp={stopAdjusting}
                                onMouseLeave={stopAdjusting}
                                onTouchStart={(e) => { e.preventDefault(); startAdjusting(1); }}
                                onTouchEnd={stopAdjusting}
                                className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-primary active:scale-90 transition-transform"
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </section>

                    <div className="h-px w-full bg-neutral-200 dark:bg-neutral-700"></div>

                    {/* Preparation Section */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">self_improvement</span>
                                <h3 className="text-neutral-800 dark:text-neutral-200 font-bold text-lg">Preparation</h3>
                            </div>
                            <span className="text-sm text-primary font-semibold bg-primary/10 px-2 py-1 rounded-md">{prepTime}s</span>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-1.5 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 flex justify-between relative isolate">
                            {[0, 10, 20, 30].map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setPrepTime(time)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${prepTime === time
                                        ? 'text-white bg-primary shadow-sm'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                                        }`}
                                >
                                    {time === 0 ? 'None' : `${time}s`}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Audio Section */}
                    <div className="space-y-6 pb-4">
                        {/* Bell Sound Selection */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-1 text-neutral-800 dark:text-neutral-200">
                                <span className="material-symbols-outlined text-primary">notifications_active</span>
                                <h3 className="font-bold text-lg">Bell Sound</h3>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                                {['Tibetan', 'Gong', 'Nature', 'Silence'].map((sound) => (
                                    <button
                                        key={sound}
                                        onClick={() => setBellSound(sound)}
                                        className={`group flex-shrink-0 flex flex-col items-center gap-3 w-28 p-3 rounded-2xl border-2 transition-all ${bellSound === sound
                                            ? 'bg-white dark:bg-surface-dark border-primary ring-2 ring-primary/20'
                                            : 'bg-neutral-100 dark:bg-neutral-800 border-transparent hover:bg-white'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${bellSound === sound ? 'bg-primary text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                                            }`}>
                                            <span className="material-symbols-outlined">
                                                {sound === 'Tibetan' ? 'waves' : sound === 'Gong' ? 'circle_notifications' : sound === 'Nature' ? 'forest' : 'do_not_disturb_on'}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${bellSound === sound ? 'text-neutral-800 dark:text-white' : 'text-neutral-500'}`}>
                                            {sound}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Ambient Background Selection */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-1 text-neutral-800 dark:text-neutral-200">
                                <span className="material-symbols-outlined text-primary">graphic_eq</span>
                                <h3 className="font-bold text-lg">Ambient Background</h3>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                                {[
                                    { id: 'None', icon: 'block' },
                                    { id: 'Rain', icon: 'water_drop' },
                                    { id: 'Forest', icon: 'forest' },
                                    { id: 'WhiteNoise', icon: 'waves' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setAmbientSound(item.id)}
                                        className={`group flex-shrink-0 flex flex-col items-center gap-3 w-28 p-3 rounded-2xl border-2 transition-all ${ambientSound === item.id
                                            ? 'bg-white dark:bg-surface-dark border-primary ring-2 ring-primary/20'
                                            : 'bg-neutral-100 dark:bg-neutral-800 border-transparent hover:bg-white'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${ambientSound === item.id ? 'bg-primary text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                                            }`}>
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                        </div>
                                        <span className={`text-sm font-bold ${ambientSound === item.id ? 'text-neutral-800 dark:text-white' : 'text-neutral-500'}`}>
                                            {item.id}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                </div>

                {/* Footer / Action Bar */}
                <div className="sticky bottom-0 bg-[#f4f3f1] dark:bg-[#1e201f] pt-4 pb-8 px-6 mt-4 border-t border-transparent z-20">
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 h-14 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-[2] h-14 rounded-xl bg-primary hover:bg-[#5a7d6d] text-white font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined">check</span>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default PresetModal;
