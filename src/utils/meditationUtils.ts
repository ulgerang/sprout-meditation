import { MeditationSession } from '../store/useMeditationStore';

export const calculateStreak = (history: MeditationSession[]): number => {
    if (history.length === 0) return 0;

    // Get unique dates in YYYY-MM-DD format, sorted descending
    const dates = Array.from(new Set(history.map(s => s.date.split('T')[0])))
        .sort((a, b) => b.localeCompare(a));

    if (dates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    // If the latest meditation isn't today or yesterday, streak is 0
    if (dates[0] !== today && dates[0] !== yesterday) {
        return 0;
    }

    let streak = 0;
    let currentDate = new Date(dates[0]);

    for (let i = 0; i < dates.length; i++) {
        const dateStr = dates[i];
        const dateObj = new Date(dateStr);

        // Calculate difference in days
        const diffTime = Math.abs(currentDate.getTime() - dateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (i === 0 || diffDays === 1) {
            streak++;
            currentDate = dateObj;
        } else if (diffDays === 0) {
            // Same day, already counted or skip
            continue;
        } else {
            // Gap found
            break;
        }
    }

    return streak;
};
