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

  const updateMessage = (messageIndex, newContent) => {
    if (typeof messageIndex !== 'number') return;
    const cleanContent = newContent.trim();
    if (!cleanContent) return;
    setMessages((prev) =>
      prev.map((message, index) =>
        index === messageIndex ? { ...message, content: cleanContent } : message
      )
    );
  };

  const regenerateFromIndex = async (messageIndex, newContent) => {
    if (loading) return null;
    if (typeof messageIndex !== 'number') return null;
    const cleanContent = newContent.trim();
    if (!cleanContent) return null;
    if (messageIndex < 0 || messageIndex >= messages.length) return null;

    setMessages((prev) => {
      const next = prev.slice(0, messageIndex + 1).map((message, index) =>
        index === messageIndex ? { ...message, content: cleanContent } : message
      );
      return next;
    });

    setLoading(true);
    try {
      const response = await chatService.sendMessage(
        botId,
        cleanContent,
        currentChatId
      );

      if (response.chat_id && response.chat_id !== currentChatId) {
        setCurrentChatId(response.chat_id);
      }

      const botMessage = { role: 'assistant', content: response.reply };
      setMessages((prev) => [...prev, botMessage]);

      await loadHistory();
      return response;
    } catch (error) {
      console.error('Failed to regenerate message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to regenerate response');
      return null;
    } finally {
      setLoading(false);
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
    updateMessage,
    regenerateFromIndex,
    refreshHistory: loadHistory,
  };
}
