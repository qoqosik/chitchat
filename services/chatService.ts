import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Message, UserRole } from '../types';

const CHAT_ID = 'private-chat';

const messagesRef = collection(db, 'chats', CHAT_ID, 'messages');

export const chatService = {
  subscribeToMessages(callback: (messages: Message[]) => void) {
    const q = query(messagesRef, orderBy('timestamp'));

    return onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, 'id'>),
      }));

      callback(msgs);
    });
  },

  async sendMessage(text: string, sender: UserRole) {
    await addDoc(messagesRef, {
      text,
      sender,
      timestamp: Date.now(),
    });
  },
};
