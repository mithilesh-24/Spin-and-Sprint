import React, { useState, useEffect } from 'react';
import Registration from './pages/Registration';
import Game from './pages/Game';
import { initLocalRegistry } from './services/googleSheets';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('spidey_theme') || 'dark';
  });

  const [teamData, setTeamData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('spidey_active_team');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    initLocalRegistry();
  }, []);

  useEffect(() => {
    localStorage.setItem('spidey_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRegisterSuccess = (team) => {
    setTeamData(team);
    try {
      sessionStorage.setItem('spidey_active_team', JSON.stringify(team));
    } catch (e) {}
  };

  const handleSwitchTeam = () => {
    setTeamData(null);
    try {
      sessionStorage.removeItem('spidey_active_team');
    } catch (e) {}
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'light' ? 'light-theme bg-[#f8fafc] text-slate-900' : 'dark-theme bg-[#050811] text-white'}`}>
      {!teamData ? (
        <Registration
          theme={theme}
          onToggleTheme={toggleTheme}
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : (
        <Game
          teamData={teamData}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSwitchTeam={handleSwitchTeam}
        />
      )}
    </div>
  );
}
