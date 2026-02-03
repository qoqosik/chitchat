
import { Message, UserRole } from '../types';

const STORAGE_KEY = 'cozyduo_history';

export const chatService = {
  getHistory: (): Message[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMessage: (text: string, sender: UserRole): Message => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender,
      text,
      timestamp: Date.now()
    };
    
    const history = chatService.getHistory();
    const updatedHistory = [...history, newMessage];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    
    return newMessage;
  },

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
