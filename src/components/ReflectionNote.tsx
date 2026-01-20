import React, { useState } from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { Sprout, Target, Waves, ArrowRight, X } from 'lucide-react';

export const ReflectionNote: React.FC = () => {
    const { saveSessionNote, setCurrentView } = useMeditationStore();
    const [mood, setMood] = useState<'calm' | 'focus' | 'restless'>('calm');
    const [note, setNote] = useState('');

    const handleSave = () => {
        saveSessionNote(mood, note);
    };

    return (
        <div className="relative h-full w-full bg-background-light dark:bg-background-dark font-sans antialiased overflow-hidden flex items-end sm:items-center justify-center p-4">
            {/* Backdrop Blur simulate background */}
            <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] z-0"></div>

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-[420px] bg-white dark:bg-[#2F2F35] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                {/* Decorative top detail */}
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50"></div>

                {/* Close button (top right) */}
                <button
                    onClick={() => setCurrentView('home')}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-text-muted"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="pt-10 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                        <Sprout className="text-primary w-6 h-6" />
                    </div>
                    <h2 className="font-display text-3xl font-medium text-text-main dark:text-stone-100 tracking-tight">Reflection</h2>
                    <p className="text-sm text-text-muted mt-1">Capture your thoughts while they're fresh</p>
                </div>

                {/* Note Input Area */}
                <div className="px-6 py-4 mt-2">
                    <div className="relative group">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-transparent border-0 resize-none text-lg leading-relaxed text-text-main dark:text-stone-200 placeholder:text-stone-400 focus:ring-0 px-0 py-2 min-h-[160px] font-sans"
                            placeholder="How was your session? Let your thoughts flow..."
                        />
                        {/* Subtle underline */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-stone-100 dark:bg-stone-800 group-focus-within:bg-primary/50 transition-colors duration-300"></div>
                    </div>
                </div>

                {/* Mood Selector */}
                <div className="px-6 pb-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4 text-center">How do you feel?</p>
                    <div className="flex gap-3 justify-center">
                        {/* Option 1: Calm */}
                        <button
                            onClick={() => setMood('calm')}
                            className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border transition-all duration-300 select-none group ${mood === 'calm'
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-stone-50 dark:bg-stone-900/50 border-transparent text-text-main dark:text-stone-400 hover:border-primary/30'
                                }`}
                        >
                            <Sprout className={`mb-2 w-7 h-7 transition-transform group-hover:scale-110 ${mood === 'calm' ? 'fill-white/20' : ''}`} />
                            <span className="text-xs font-bold tracking-wide">Calm</span>
                        </button>

                        {/* Option 2: Focus */}
                        <button
                            onClick={() => setMood('focus')}
                            className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border transition-all duration-300 select-none group ${mood === 'focus'
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-stone-50 dark:bg-stone-900/50 border-transparent text-text-main dark:text-stone-400 hover:border-primary/30'
                                }`}
                        >
                            <Target className={`mb-2 w-7 h-7 transition-transform group-hover:scale-110 ${mood === 'focus' ? 'fill-white/20' : ''}`} />
                            <span className="text-xs font-bold tracking-wide">Focus</span>
                        </button>

                        {/* Option 3: Restless */}
                        <button
                            onClick={() => setMood('restless')}
                            className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border transition-all duration-300 select-none group ${mood === 'restless'
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-stone-50 dark:bg-stone-900/50 border-transparent text-text-main dark:text-stone-400 hover:border-primary/30'
                                }`}
                        >
                            <Waves className={`mb-2 w-7 h-7 transition-transform group-hover:scale-110 ${mood === 'restless' ? 'fill-white/20' : ''}`} />
                            <span className="text-xs font-bold tracking-wide">Restless</span>
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 mt-4 flex gap-4 items-center">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="flex-1 h-14 rounded-2xl text-sm font-bold text-text-muted hover:text-text-main hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-[2] h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <span>Save Entry</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
