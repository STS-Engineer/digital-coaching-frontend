import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import ChatInterface from "../components/Chat/ChatInterface";
import { BOTS } from "../utils/constants";

const ChatPage = () => {
  const { botId, chatId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(chatId || null);
  const [chatMeta, setChatMeta] = useState({});

  const bot = BOTS?.[botId]; // safe read
  const storageKey = botId ? `chatMeta:${botId}` : null;

  useEffect(() => {
    if (!botId || !BOTS[botId]) {
      navigate("/dashboard");
    }
  }, [botId, navigate]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      setChatMeta({});
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setChatMeta(parsed && typeof parsed === "object" ? parsed : {});
    } catch (error) {
      console.error("Failed to parse chat meta", error);
      setChatMeta({});
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(chatMeta));
  }, [chatMeta, storageKey]);

  const sidebarHistory = useMemo(() => {
    const normalized = history
      .filter((item) => !chatMeta[item.chat_id]?.deleted)
      .map((item) => {
        const meta = chatMeta[item.chat_id] || {};
        return {
          ...item,
          displayTitle: meta.title || item.title || "Untitled chat",
          isPinned: Boolean(meta.pinned),
        };
      });

    const pinned = normalized.filter((item) => item.isPinned);
    const unpinned = normalized.filter((item) => !item.isPinned);
    return [...pinned, ...unpinned];
  }, [history, chatMeta]);

  // ✅ early return AFTER hooks
  if (!bot) return null;

  const handleRenameChat = (chatIdToRename, newTitle) => {
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) return;
    setChatMeta((prev) => ({
      ...prev,
      [chatIdToRename]: {
        ...prev[chatIdToRename],
        title: cleanTitle,
      },
    }));
  };

  const handleTogglePin = (chatIdToPin) => {
    setChatMeta((prev) => {
      const current = prev[chatIdToPin] || {};
      return {
        ...prev,
        [chatIdToPin]: {
          ...current,
          pinned: !current.pinned,
        },
      };
    });
  };

  const handleDeleteChat = (chatIdToDelete) => {
    setChatMeta((prev) => ({
      ...prev,
      [chatIdToDelete]: {
        ...prev[chatIdToDelete],
        deleted: true,
      },
    }));
    if (chatIdToDelete === currentChatId) {
      setCurrentChatId(null);
      navigate(`/chat/${botId}`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`hidden md:block transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-14"
          }`}
        >
          <Sidebar
            botId={botId}
            botLabel={bot.label}
            history={sidebarHistory}
            onNewChat={() => navigate(`/chat/${botId}`)}
            onSelectChat={(selectedChatId) =>
              navigate(`/chat/${botId}/${selectedChatId}`)
            }
            onRenameChat={handleRenameChat}
            onTogglePin={handleTogglePin}
            onDeleteChat={handleDeleteChat}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            activeChatId={currentChatId}
          />
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-50 glass-panel rounded-lg p-2 transition-colors"
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72">
              <Sidebar
                botId={botId}
                botLabel={bot.label}
                history={sidebarHistory}
                onNewChat={() => {
                  navigate(`/chat/${botId}`);
                  setSidebarOpen(false);
                }}
                onSelectChat={(selectedChatId) => {
                  navigate(`/chat/${botId}/${selectedChatId}`);
                  setSidebarOpen(false);
                }}
                onRenameChat={handleRenameChat}
                onTogglePin={handleTogglePin}
                onDeleteChat={handleDeleteChat}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activeChatId={currentChatId}
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <ChatInterface
            botId={botId}
            botLabel={bot.label}
            initialChatId={chatId}
            onHistoryUpdate={setHistory}
            onChatIdChange={setCurrentChatId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
