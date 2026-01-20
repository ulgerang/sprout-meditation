import React from 'react';
import { useMeditationStore, MeditationSession } from '../store/useMeditationStore';
import { ArrowLeft, Calendar, Sprout, MoreHorizontal, Edit2, Smile } from 'lucide-react';

export const DailyLogDetails: React.FC = () => {
    const { history, setCurrentView, setSelectedSession } = useMeditationStore();

    // Group history by date
    const groupedHistory = history.reduce((acc, session) => {
        const dateKey = new Date(session.date).toLocaleDateString([], {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(session);
        return acc;
    }, {} as Record<string, MeditationSession[]>);

    const formatTimeOnly = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-main dark:text-gray-100 font-sans transition-colors duration-200 antialiased overflow-x-hidden pb-12">
            <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark">
                <header className="flex items-center justify-between p-4 pt-12 pb-2 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                    <button
                        onClick={() => setCurrentView('stats')}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Daily Log</h1>
                    <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <Calendar className="w-5 h-5" />
                    </button>
                </header>

                <main className="flex-1 px-6 pt-4 relative z-0">
                    {Object.keys(groupedHistory).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                            <Sprout className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-sm font-medium">Your journey starts here.</p>
                        </div>
                    ) : (
                        Object.entries(groupedHistory).map(([date, sessions]) => (
                            <div key={date} className="mb-12">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight">{date.split(',')[1]}</h2>
                                    <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em] opacity-70 mt-1">
                                        {date.split(',')[0]}
                                    </p>
                                </div>

                                <div className="relative pl-4 border-l-2 border-primary/20 dark:border-primary/10 ml-2 space-y-10 py-1">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="relative">
                                            {/* dot */}
                                            <div className="absolute -left-[23px] top-1.5 size-3 rounded-full bg-primary border-4 border-background-light dark:border-background-dark box-content z-10"></div>

                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2 text-xs text-neutral-400 font-bold uppercase tracking-wider">
                                                    <span>{formatTimeOnly(session.date)}</span>
                                                    <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                                                    <span>{formatDuration(session.duration)}</span>
                                                </div>

                                                <div className="bg-white dark:bg-stone-800/50 p-5 rounded-3xl shadow-sm border border-neutral-100 dark:border-white/5 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                        <Sprout className="w-12 h-12 text-primary" />
                                                    </div>

                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-lg font-bold truncate pr-8">{session.presetName}</h3>
                                                            <button className="text-neutral-300 hover:text-neutral-500 transition-colors">
                                                                <MoreHorizontal size={20} />
                                                            </button>
                                                        </div>

                                                        {session.note && (
                                                            <div className="mt-1 mb-3">
                                                                <p className="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed italic">
                                                                    "{session.note}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/5 text-[10px] font-bold text-primary border border-primary/10 uppercase tracking-widest">
                                                                <Smile size={12} className="mr-1.5" />
                                                                {session.mood || 'Reflection'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </main>

                {/* Daily Total Summary Floating (Simplified) */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[380px] z-50">
                    <div className="bg-primary text-white rounded-[2rem] p-4 pr-6 shadow-2xl shadow-primary/40 flex items-center justify-between border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Sprout className="text-white w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Meditated Today</span>
                                <span className="text-xl font-bold">
                                    {Math.floor(history.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).reduce((acc, s) => acc + s.duration, 0) / 60)}
                                    <span className="text-sm font-medium opacity-80 ml-1">mins</span>
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentView('home')}
                            className="bg-white text-primary rounded-2xl px-5 py-2.5 text-xs font-bold shadow-lg active:scale-95 transition-all"
                        >
                            Start New
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
