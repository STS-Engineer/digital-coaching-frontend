// frontend/src/services/chat.js
import api from './api';

export const chatService = {
  async sendMessage(botId, message, chatId = null) {
    const payload = {
      bot_id: botId,
      message: message,
    };
    
    if (chatId) {
      payload.chat_id = chatId;
    }
    
    const response = await api.post('/api/chat', payload);
    return response.data;
  },
  
  async getHistory(botId) {
    const response = await api.get(`/api/history/${botId}`);
    return response.data.items || [];
  },
  
  async getConversation(botId, chatId) {
    const response = await api.get(`/api/history/${botId}/${chatId}`);
    return response.data;
  },
  
  async createNewChat(botId) {
    const response = await api.post(`/api/history/${botId}/new`);
    return response.data;
  }
};