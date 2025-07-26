import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LiveTV } from './components/LiveTV';

function App() {
  const [currentSection, setCurrentSection] = useState<string>('dashboard');

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const handleBack = () => {
    setCurrentSection('dashboard');
  };

  if (currentSection === 'live-tv') {
    return <LiveTV onBack={handleBack} />;
  }

  if (currentSection === 'movies') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Movies</h1>
          <p className="text-gray-300 mb-6">Coming Soon</p>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentSection === 'series') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Series</h1>
          <p className="text-gray-300 mb-6">Coming Soon</p>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard onNavigate={handleNavigate} />;
}

export default App;