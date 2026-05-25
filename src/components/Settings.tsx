import React from 'react';
import { useMeditationStore } from '../store/useMeditationStore';
import { ArrowLeft, History, ShieldCheck, Heart, Download, Mail, FileText, Upload, Settings as SettingsIcon } from 'lucide-react';
import { calculateStreak } from '../utils/meditationUtils';

const Settings: React.FC = () => {
    const { history, setCurrentView, importHistory } = useMeditationStore();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleExport = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const dataStr = JSON.stringify(history, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `mindfulness_backup_${new Date().toISOString().split('T')[0]}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            setIsProcessing(false);
        }, 1000);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const success = importHistory(content);
            setIsProcessing(false);
            if (success) {
                alert('Data Restored Successfully!');
            } else {
                alert('Failed to restore data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    const handleEmailExport = () => {
        const totalMinutes = history.reduce((acc, s) => acc + s.duration, 0) / 60;
        const streak = calculateStreak(history);
        const subject = encodeURIComponent('My Mindfulness Journey Backup');
        const body = encodeURIComponent(
            `Mindfulness App Summary:\n\n` +
            `- Total Meditation: ${Math.floor(totalMinutes / 60)}h ${Math.floor(totalMinutes % 60)}m\n` +
            `- Total Sessions: ${history.length}\n` +
            `- Current Streak: ${streak} days\n\n` +
            `Attached below is my raw backup data (JSON format):\n\n` +
            JSON.stringify(history, null, 2)
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-body antialiased text-[#242428] dark:text-stone-100 h-screen overflow-hidden">
            <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
                {/* Header */}
                <header className="px-6 pt-12 pb-4 flex items-center justify-between z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm sticky top-0">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-[#242428] dark:text-stone-300"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-display text-xl font-medium tracking-tight">Settings</h1>
                    <div className="w-8"></div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-6 pb-12 space-y-8 no-scrollbar">
                {/* Data Management Section */}
                <section className="mt-4">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <FileText className="text-primary w-4 h-4" />
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Data Management</h3>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm p-6 border border-stone-100 dark:border-stone-800/60 relative overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 flex items-center justify-center mb-4 shadow-sm text-[#242428] dark:text-stone-200">
                                <History className="w-10 h-10 opacity-80" />
                            </div>
                            <h2 className="font-display text-2xl font-medium mb-1">Backup & Restore</h2>
                            <p className="text-sm text-neutral-500">Your data belongs to you.</p>

                            <div className="mt-6 mb-8 inline-flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800/80 rounded-full">
                                <FileText className={`w-3.5 h-3.5 text-neutral-400 ${isProcessing ? 'animate-pulse text-primary' : ''}`} />
                                <span className="text-xs font-medium text-neutral-400">
                                    {isProcessing ? 'Processing...' : `${history.length} Sessions Saved`}
                                </span>
                            </div>

                            <div className="w-full flex items-center justify-between p-4 rounded-xl bg-background-light dark:bg-background-dark/50 border border-stone-100 dark:border-stone-800 mb-6 transition-colors hover:border-primary/20">
                                <div className="text-left">
                                    <p className="font-medium text-sm">JSON Format</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5">Compatible with any device</p>
                                </div>
                                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                                    <ShieldCheck className="w-5 h-5 text-primary opacity-60" />
                                </div>
                            </div>

                            <div className="w-full space-y-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".json"
                                    onChange={handleImport}
                                />
                                <button
                                    onClick={handleExport}
                                    disabled={isProcessing}
                                    className="group w-full h-12 bg-primary hover:bg-[#5a7d6d] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    <Download className={`w-5 h-5 transition-transform ${isProcessing ? '' : 'group-hover:-translate-y-0.5'}`} />
                                    {isProcessing ? 'Processing...' : 'Download Backup'}
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-12 bg-transparent border border-stone-200 dark:border-stone-700 text-[#242428] dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    >
                                        <Upload className="w-4 h-4 text-neutral-400" />
                                        Restore
                                    </button>
                                    <button
                                        onClick={handleEmailExport}
                                        className="h-12 bg-transparent border border-stone-200 dark:border-stone-700 text-[#242428] dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    >
                                        <Mail className="w-4 h-4 text-neutral-400" />
                                        Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <SettingsIcon className="text-primary w-4 h-4" />
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">App Info</h3>
                    </div>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-stone-100 dark:border-stone-800/60 divide-y divide-stone-50 dark:divide-stone-800/50">
                        <div className="py-3 flex justify-between items-center">
                            <span className="text-sm">Version</span>
                            <span className="text-sm font-bold opacity-60">1.0.0</span>
                        </div>
                        <div className="py-3 flex justify-between items-center">
                            <span className="text-sm">Developed with</span>
                            <div className="flex items-center gap-1 text-primary">
                                <Heart className="w-3 h-3 fill-current" />
                                <span className="text-xs font-bold">Mindfulness Team</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Brand */}
                <div className="text-center pt-2 opacity-60 pb-10 flex flex-col items-center">
                    <Heart className="w-8 h-8 text-primary animate-pulse" />
                    <p className="text-[10px] text-neutral-400 mt-2 tracking-widest uppercase">Your peace of mind</p>
                </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
