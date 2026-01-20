import React from 'react';
import { X, Share2, Download, Copy, Check } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        totalTime: string;
        sessions: number;
        streak: number;
    };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, stats }) => {
    const [copied, setCopied] = React.useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        const text = `I've meditated for ${stats.totalTime} across ${stats.sessions} sessions! My current streak is ${stats.streak} days. Join me on my mindfulness journey!`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#131614]/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-background-light dark:bg-[#2C2C2E] rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-white/20 dark:border-white/5">
                {/* Header */}
                <div className="p-6 pb-0 flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight">Share Progress</h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Share Card (The one that looks like a post) */}
                <div className="p-6">
                    <div className="relative aspect-[4/5] w-full rounded-3xl bg-primary overflow-hidden shadow-inner flex flex-col items-center justify-center p-8 text-white text-center">
                        {/* Decorative Background Circles */}
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-2">
                                <Share2 className="w-8 h-8" />
                            </div>

                            <h4 className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">My Mindfulness</h4>

                            <div className="space-y-1">
                                <div className="text-5xl font-bold tabular-nums tracking-tighter">{stats.totalTime}</div>
                                <p className="text-xs font-medium opacity-70 uppercase tracking-widest">Total Meditation</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/20">
                                <div>
                                    <div className="text-xl font-bold">{stats.sessions}</div>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Sessions</p>
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{stats.streak}</div>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Day Streak</p>
                                </div>
                            </div>

                            <div className="pt-8">
                                <div className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Mindfulness App</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-8 grid grid-cols-2 gap-3">
                    <button
                        onClick={handleCopy}
                        className="h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 opacity-60" />}
                        <span className="text-sm font-bold">{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                    <button className="h-12 rounded-2xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
                        <Download className="w-5 h-5" />
                        <span className="text-sm font-bold">Save Image</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
