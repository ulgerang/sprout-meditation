import React from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { ChevronLeft, ChevronRight, Share2, ArrowLeft, Sprout, TrendingUp, History, Target, Waves, Wind } from 'lucide-react';
import ShareModal from './ShareModal';
import { calculateStreak } from '../utils/meditationUtils';

export const MeditationStatistics: React.FC = () => {
    const { history, setCurrentView } = useMeditationStore();
    const [isShareOpen, setIsShareOpen] = React.useState(false);

    const streak = calculateStreak(history);

    // Calculate Weekly Summary
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyMinutes = last7Days.map(date => {
        const daySessions = history.filter(s => s.date.startsWith(date));
        const totalSeconds = daySessions.reduce((acc, s) => acc + s.duration, 0);
        return Math.floor(totalSeconds / 60);
    });

    const maxMins = Math.max(...dailyMinutes, 1);
    const totalWeeklyMins = dailyMinutes.reduce((a, b) => a + b, 0);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins}m`;
        return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    const getMoodIcon = (mood?: string) => {
        switch (mood) {
            case 'calm': return <Sprout className="w-5 h-5" />;
            case 'focus': return <Target className="w-5 h-5" />;
            case 'restless': return <Waves className="w-5 h-5" />;
            default: return <Wind className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-sans antialiased overflow-x-hidden transition-colors duration-300 min-h-screen pb-24">
            <div className="relative flex h-full w-full max-w-md mx-auto flex-col">
                {/* Top App Bar */}
                <header className="flex items-center justify-between p-6 pt-8 sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm transition-colors duration-300">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Statistics</h1>
                    <button
                        onClick={() => setIsShareOpen(true)}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </header>

                {/* Simple Calendar (Static Placeholder) */}
                <section className="px-6 mb-8 mt-2">
                    <div className="bg-white dark:bg-[#3E3B3E] rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-white/5 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <button className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors text-neutral-400">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">January 2026</h2>
                            <button className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors text-neutral-400">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{d}</div>
                            ))}
                            {/* Empty days for layout */}
                            {Array.from({ length: 4 }).map((_, i) => <div key={i}></div>)}
                            {Array.from({ length: 20 }).map((_, i) => {
                                const day = i + 1;
                                const isToday = day === 20;
                                const hasSession = history.some(s => {
                                    const d = new Date(s.date);
                                    return d.getDate() === day && d.getMonth() === 0 && d.getFullYear() === 2026;
                                });
                                return (
                                    <div key={day} className="flex flex-col items-center justify-center relative">
                                        <div className={`size-8 flex items-center justify-center rounded-full text-xs font-semibold ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-neutral-500'
                                            }`}>
                                            {day}
                                        </div>
                                        {hasSession && !isToday && <div className="absolute bottom-[-2px] size-1 rounded-full bg-primary/40"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Weekly Summary Chart */}
                <section className="px-6 mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold">Weekly Activity</h3>
                        <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase">+12%</span>
                        </div>
                    </div>

                    <div className="bg-white/40 dark:bg-white/5 rounded-3xl p-6 border border-white/50 dark:border-white/5 backdrop-blur-sm">
                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Total Effort</p>
                            <p className="text-3xl font-bold tracking-tight">
                                {Math.floor(totalWeeklyMins / 60)}h {totalWeeklyMins % 60}m
                            </p>
                        </div>

                        {/* Bar Chart */}
                        <div className="flex items-end justify-between h-32 gap-3 px-2">
                            {dailyMinutes.map((mins, i) => {
                                const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                                const label = dayLabels[i];
                                const height = (mins / maxMins) * 100;
                                const isToday = i === 6;

                                return (
                                    <div key={i} className="group flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer">
                                        <div className="w-full relative bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden h-full flex items-end">
                                            <div
                                                className={`w-full transition-all duration-700 ease-out ${isToday ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-700 opacity-60'}`}
                                                style={{ height: `${Math.max(height, 5)}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-neutral-400'}`}>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Recent Sessions List */}
                <section className="px-6 mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold">Recent History</h3>
                        <button
                            onClick={() => setCurrentView('daily-log')}
                            className="text-xs font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
                        >
                            View All <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {history.slice(0, 3).map((session) => (
                            <div key={session.id} className="group flex items-center p-4 bg-white dark:bg-[#3E3B3E] rounded-2xl shadow-sm border border-transparent hover:border-primary/20 transition-all cursor-pointer">
                                <div className="size-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    {getMoodIcon(session.mood)}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h4 className="text-sm font-bold truncate">{session.presetName}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-medium">
                                        <span>{new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                        <span className="size-1 bg-neutral-300 rounded-full"></span>
                                        <span>{session.mood || 'No Mood'}</span>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-3 py-1 rounded-lg">
                                    {formatDuration(session.duration)}
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="py-12 flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-3xl">
                                <Sprout className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-xs font-medium tracking-wide">No sessions found yet</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                stats={{
                    totalTime: `${Math.floor(totalWeeklyMins / 60)}h ${totalWeeklyMins % 60}m`,
                    sessions: history.length,
                    streak: streak
                }}
            />
        </div>
    );
};
