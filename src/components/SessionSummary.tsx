import React from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { Share2, X, Sprout, Flame, Timer } from 'lucide-react';

export const SessionSummary: React.FC = () => {
    const { lastSession, setCurrentView, history } = useMeditationStore();

    if (!lastSession) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
                <p className="text-text-muted">No session data found.</p>
                <button
                    onClick={() => setCurrentView('home')}
                    className="ml-4 text-primary font-bold"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const durationMinutes = Math.floor(lastSession.duration / 60);
    const durationSeconds = lastSession.duration % 60;
    const timeString = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

    // Simple streak calculation (for demo purposes)
    const streak = history.length;

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center p-6 sm:p-8 bg-background-light dark:bg-background-dark font-display">
            {/* Ambient Background Texture - simplified for React */}
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 mix-blend-multiply bg-center bg-cover pointer-events-none"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}>
            </div>

            {/* Central Floating Card */}
            <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#2a2e33] rounded-[2rem] p-8 shadow-2xl border border-white/60 dark:border-white/5 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Celebratory Icon */}
                <div className="mb-6 flex items-center justify-center">
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                        <Sprout className="w-12 h-12 text-primary" />
                        {/* Decorative subtle ripple ring */}
                        <div className="absolute inset-0 rounded-full border border-primary/20 scale-125 opacity-50 animate-pulse"></div>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-[#141613] dark:text-white text-3xl font-bold leading-tight mb-2">
                    Session Complete
                </h1>

                {/* Quote */}
                <p className="text-text-muted text-base italic leading-relaxed mb-8 max-w-[260px] font-sans">
                    "Quiet the mind, and the soul will speak."
                </p>

                {/* Stats Block */}
                <div className="flex w-full items-center justify-between gap-4 mb-10 px-2">
                    {/* Total Time */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-primary text-3xl font-bold tracking-tight">{timeString}</span>
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest font-sans flex items-center gap-1">
                            <Timer size={10} /> Total Time
                        </span>
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-10 w-px bg-primary/20 rounded-full"></div>

                    {/* Streak */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            <span className="text-primary text-3xl font-bold tracking-tight">{streak}</span>
                            <Flame size={20} className="text-primary fill-primary" />
                        </div>
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest font-sans">Day Streak</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col w-full gap-3">
                    {/* Primary Action: Go to Reflection */}
                    <button
                        onClick={() => setCurrentView('reflection-note')}
                        className="group relative w-full h-14 bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all duration-200 text-white rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-primary/25"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                        <span>Write Reflection</span>
                    </button>

                    {/* Share Action */}
                    <button className="w-full h-14 bg-transparent hover:bg-primary/5 active:scale-[0.98] transition-all duration-200 text-primary border border-primary/30 rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2">
                        <Share2 size={18} />
                        Share Progress
                    </button>

                    {/* Close Action */}
                    <button
                        onClick={() => setCurrentView('home')}
                        className="w-full h-12 text-text-muted text-sm font-medium hover:text-text-main transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
            </div>

            {/* Bottom Branding / Decorative Element */}
            <div className="mt-8 flex items-center gap-2 opacity-40">
                <div className="h-px w-8 bg-primary/40"></div>
                <Sprout className="text-primary w-5 h-5" />
                <div className="h-px w-8 bg-primary/40"></div>
            </div>
        </div>
    );
};
