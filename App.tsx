
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserRole | null>(null);

  useEffect(() => {
    // Basic persistence of session
    const savedUser = sessionStorage.getItem('cozyduo_session') as UserRole;
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (selectedUser: UserRole) => {
    setUser(selectedUser);
    sessionStorage.setItem('cozyduo_session', selectedUser);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('cozyduo_session');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#9CAFAA44]">
      {user ? (
        <ChatRoom currentUser={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
