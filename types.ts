
export type UserRole = 'USER_A' | 'USER_B';

export interface Message {
  id: string;
  sender: UserRole;
  text: string;
  timestamp: number;
}

export interface ChatState {
  currentUser: UserRole | null;
  messages: Message[];
}
