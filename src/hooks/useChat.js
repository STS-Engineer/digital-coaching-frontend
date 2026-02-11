import { useState, useEffect } from 'react';
import { chatService } from '../services/chat';
import toast from 'react-hot-toast';

export function useChat(botId, initialChatId = null) {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(initialChatId);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (botId) {
      loadHistory();
      loadChat(initialChatId);
      return;
    }

    setMessages([]);
    setCurrentChatId(null);
    setHistory([]);
  }, [botId, initialChatId]);

  const loadChat = async (chatId) => {
    if (!chatId) {
      setMessages([]);
      setCurrentChatId(null);
      return;
    }

    setLoading(true);
    try {
      const data = await chatService.getConversation(botId, chatId);
      setMessages(data.messages || []);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Failed to load chat:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await chatService.getHistory(botId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim() || loading) return null;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(botId, message, currentChatId);
      
      // Mettre à jour le chat ID si c'est une nouvelle conversation
      if (response.chat_id && response.chat_id !== currentChatId) {
        setCurrentChatId(response.chat_id);
      }

      // Ajouter la réponse du bot
      const botMessage = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, botMessage]);

      // Rafraîchir l'historique
      await loadHistory();

      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, an error occurred. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await chatService.createNewChat(botId);
      setCurrentChatId(response.chat_id);
      setMessages([]);
      await loadHistory();
      return response.chat_id;
    } catch (error) {
      console.error('Failed to create new chat:', error);
      toast.error('Failed to create new chat');
      return null;
    }
  };

  return {
    messages,
    currentChatId,
    history,
    loading,
    historyLoading,
    sendMessage,
    loadChat,
    createNewChat,
    refreshHistory: loadHistory,
  };
}
