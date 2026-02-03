
import React, { useState } from 'react';
import { PASSWORDS } from '../constants';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (user: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORDS.USER_A) {
      onLogin('USER_A');
    } else if (password === PASSWORDS.USER_B) {
      onLogin('USER_B');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FDFBF7]">
      <div className="w-full max-w-sm p-8 bg-white rounded-3xl shadow-sm border border-[#F0E6D2]">
        <h1 className="text-2xl font-header font-semibold text-center text-[#7C9070] mb-8">
          Welcome Home
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secret key..."
              className={`w-full px-5 py-4 text-center text-lg bg-[#FAF9F6] border rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-300 ${
                error 
                  ? 'border-red-300 bg-red-50 text-red-500' 
                  : 'border-[#F0E6D2] focus:border-[#B7C4CF] text-[#555]'
              }`}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-400 font-medium animate-pulse">
                Incorrect password, try again
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-4 font-header font-medium text-white bg-[#9CAFAA] rounded-2xl hover:bg-[#8CA09A] transition-colors shadow-lg shadow-[#9CAFAA44]"
          >
            Enter Chat
          </button>
        </form>
        
        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-300">
          Private & Encrypted Space
        </p>
      </div>
    </div>
  );
};

export default Login;
