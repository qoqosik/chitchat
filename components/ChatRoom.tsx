
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Message } from '../types';
import { USER_NAMES, THEME } from '../constants';
import { chatService } from '../services/chatService';

interface ChatRoomProps {
  currentUser: UserRole;
  onLogout: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ currentUser, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize and poll for "real-time" feel (simulated for local storage)
  useEffect(() => {
  const unsubscribe = chatService.subscribeToMessages(setMessages);
  return () => unsubscribe();
}, []);


  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    chatService.sendMessage(inputText, currentUser);
    setInputText('');

  };

  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(ts);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-[#FDFBF7]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#F0E6D2] sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#E8DAEF] flex items-center justify-center text-[#5B3F6B] font-bold">
            {USER_NAMES[currentUser === 'USER_A' ? 'USER_B' : 'USER_A'][0]}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              {USER_NAMES[currentUser === 'USER_A' ? 'USER_B' : 'USER_A']}
            </h2>
            <p className="text-[10px] text-green-400 font-medium">Online now</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 no-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50 space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="font-header text-sm italic">No messages yet. Say hello...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === currentUser;
            const bubbleStyle = msg.sender === 'USER_A' ? THEME.bubbleA : THEME.bubbleB;

            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${bubbleStyle} ${
                    isMe 
                      ? 'rounded-tr-none' 
                      : 'rounded-tl-none'
                  }`}>
                    <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                  </div>
                  <span className="mt-1.5 text-[10px] text-gray-400 font-medium px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#F0E6D2]">
        <form onSubmit={handleSend} className="flex items-end space-x-3">
          <div className="flex-1 bg-[#FAF9F6] border border-[#F0E6D2] rounded-2xl p-2 focus-within:border-[#B7C4CF] transition-colors">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Message..."
              className="w-full bg-transparent border-none outline-none px-3 py-1.5 text-gray-700 placeholder:text-gray-400 resize-none max-h-32 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-3.5 rounded-2xl transition-all ${
              inputText.trim() 
                ? 'bg-[#9CAFAA] text-white shadow-md' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-gray-300">
          Only we can see this conversation🙂
        </p>
      </div>
    </div>
  );
};

export default ChatRoom;
