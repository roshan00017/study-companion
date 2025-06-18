import type { Message } from "../types/chat.type";


export const chatStorage = {
  getChats(path: string): Message[] {
    const stored = sessionStorage.getItem(`chat_${path}`);
    return stored ? JSON.parse(stored) : [];
  },

  saveChats(path: string, messages: Message[]) {
    sessionStorage.setItem(`chat_${path}`, JSON.stringify(messages));
  },

  clearChats(path: string) {
    sessionStorage.removeItem(`chat_${path}`);
  }
};