import React from 'react';
import Home from './components/Home';
import ActiveSession from './components/ActiveSession';
import AudioSettings from './components/AudioSettings';
import Settings from './components/Settings';
import { SessionSummary } from './components/SessionSummary';
import { ReflectionNote } from './components/ReflectionNote';
import { MeditationStatistics } from './components/MeditationStatistics';
import { MindfulnessGuide } from './components/MindfulnessGuide';
import { DailyLogDetails } from './components/DailyLogDetails';
import { useMeditationStore } from './store/useMeditationStore';
import Navigation from './components/Navigation';

const App: React.FC = () => {
    const { isSessionActive, currentView } = useMeditationStore();

    if (isSessionActive) {
        return <ActiveSession />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'home':
                return <Home />;
            case 'audio-settings':
                return <AudioSettings />;
            case 'settings':
                return <Settings />;
            case 'session-summary':
                return <SessionSummary />;
            case 'reflection-note':
                return <ReflectionNote />;
            case 'stats':
                return <MeditationStatistics />;
            case 'guide':
                return <MindfulnessGuide />;
            case 'daily-log':
                return <DailyLogDetails />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="app-container">
            {renderView()}
            <Navigation />
        </div>
    );
};

export default App;
