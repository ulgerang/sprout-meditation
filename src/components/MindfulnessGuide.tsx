import React from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { ArrowLeft, Scale, Accessibility, Wind, Cloud, Lightbulb, ArrowRight } from 'lucide-react';

export const MindfulnessGuide: React.FC = () => {
    const { setCurrentView } = useMeditationStore();

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#131614] dark:text-[#ECEAE7] font-sans antialiased transition-colors duration-300 min-h-screen pb-24">
            <div className="relative flex flex-col w-full max-w-md mx-auto">
                {/* TopAppBar */}
                <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">Guide</h2>
                    <div className="size-10"></div>
                </header>

                {/* Hero Illustration */}
                <div className="w-full h-48 sm:h-56 overflow-hidden relative mt-2 px-6">
                    <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#e8e6e1] to-transparent dark:from-[#3a383a] dark:to-transparent flex items-center justify-center relative overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2940&auto=format&fit=crop"
                            alt="Zen Background"
                            className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
                        />
                        <div className="relative z-10 text-primary opacity-80">
                            <Scale size={80} strokeWidth={1} />
                        </div>
                    </div>
                </div>

                {/* Headline */}
                <div className="px-8 pt-10 pb-4">
                    <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight">The Art of<br />Sitting</h1>
                    <p className="text-[#A09C96] mt-4 text-base font-medium leading-relaxed">
                        Meditation is not about stopping your thoughts, but rather learning how to observe them without judgment.
                    </p>
                </div>

                {/* Divider */}
                <div className="px-8 py-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
                </div>

                {/* Sections */}
                <div className="space-y-4 px-4 pb-12">
                    <div className="px-6 py-6 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-3xl">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Accessibility size={28} />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">Posture</h3>
                            </div>
                            <div className="pl-16">
                                <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                                    Find a comfortable seat. Keep your spine straight but relaxed, imagining a string pulling you gently from the crown of your head.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-3xl">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Wind size={28} />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">Breathing</h3>
                            </div>
                            <div className="pl-16">
                                <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                                    Breathe naturally. Don't force it. Simply observe the sensation of cool air entering and warm air leaving your nose.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-3xl">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Cloud size={28} />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">Mindset</h3>
                            </div>
                            <div className="pl-16">
                                <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                                    Thoughts will come. Let them pass like clouds drifting across a vast sky. Gently return your focus to the breath.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight Callout */}
                <div className="px-8 pb-12">
                    <div className="rounded-[2rem] bg-[#F4F1ED] dark:bg-[#383638] p-8 flex flex-col gap-4 border border-transparent dark:border-white/5">
                        <div className="flex items-center gap-2 text-primary">
                            <Lightbulb size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Insight</span>
                        </div>
                        <p className="text-lg font-medium italic leading-relaxed opacity-90">
                            "If you have time to breathe, you have time to meditate. You walk, you stand, you lie down, you sit."
                        </p>
                        <p className="text-[#A09C96] text-xs font-bold uppercase tracking-widest">— Ajahn Chah</p>
                    </div>
                </div>

                {/* Sticky Footer CTA */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 z-40">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="w-full bg-primary hover:bg-[#557a69] text-white h-14 rounded-full font-bold text-lg tracking-wide shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                        <span>Start Practice</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
