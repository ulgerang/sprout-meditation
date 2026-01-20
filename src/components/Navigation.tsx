import React from 'react';
import { useMeditationStore } from '../store/useMeditationStore';

const Navigation: React.FC = () => {
    const { currentView, setCurrentView } = useMeditationStore();

    const mainViews = ['home', 'stats', 'guide', 'settings'];
    if (!mainViews.includes(currentView)) return null;

    return (
        <nav className="fixed bottom-0 w-full bg-white/80 dark:bg-[#2f2d2f]/90 backdrop-blur-xl border-t border-neutral-200/50 dark:border-white/5 pb-8 pt-3 px-6 z-50">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                <button
                    onClick={() => setCurrentView('home')}
                    className={`flex flex-col items-center gap-1 p-2 w-16 group transition-colors ${currentView === 'home' ? 'text-primary' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                >
                    <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: currentView === 'home' ? "'FILL' 1" : "'FILL' 0" }}>timer</span>
                    <span className={`text-[11px] ${currentView === 'home' ? 'font-bold' : 'font-medium'}`}>Timer</span>
                </button>
                <button
                    onClick={() => setCurrentView('stats')}
                    className={`flex flex-col items-center gap-1 p-2 w-16 group transition-colors ${currentView === 'stats' ? 'text-primary' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                >
                    <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: currentView === 'stats' ? "'FILL' 1" : "'FILL' 0" }}>bar_chart</span>
                    <span className={`text-[11px] ${currentView === 'stats' ? 'font-bold' : 'font-medium'}`}>Stats</span>
                </button>
                <button
                    onClick={() => setCurrentView('guide')}
                    className={`flex flex-col items-center gap-1 p-2 w-16 group transition-colors ${currentView === 'guide' ? 'text-primary' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                >
                    <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: currentView === 'guide' ? "'FILL' 1" : "'FILL' 0" }}>menu_book</span>
                    <span className={`text-[11px] ${currentView === 'guide' ? 'font-bold' : 'font-medium'}`}>Guide</span>
                </button>
                <button
                    onClick={() => setCurrentView('settings')}
                    className={`flex flex-col items-center gap-1 p-2 w-16 group transition-colors ${currentView === 'settings' ? 'text-primary' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                >
                    <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: currentView === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
                    <span className={`text-[11px] ${currentView === 'settings' ? 'font-bold' : 'font-medium'}`}>Settings</span>
                </button>
            </div>
        </nav>
    );
};

export default Navigation;
