import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!botId || !BOTS[botId]) {
      navigate("/dashboard");
    }
  }, [botId, navigate]);

  if (!BOTS[botId]) {
    return null;
  }

  const bot = BOTS[botId];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`hidden md:block transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-14"
          }`}
        >
          <Sidebar
            botId={botId}
            botLabel={bot.label}
            history={history}
            onNewChat={() => navigate(`/chat/${botId}`)}
            onSelectChat={(selectedChatId) =>
              navigate(`/chat/${botId}/${selectedChatId}`)
            }
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            activeChatId={currentChatId}
          />
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-50 glass-panel rounded-lg p-2 transition-colors"
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {/* Mobile Sidebar Overlay */}
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
                history={history}
                onNewChat={() => {
                  navigate(`/chat/${botId}`);
                  setSidebarOpen(false);
                }}
                onSelectChat={(selectedChatId) => {
                  navigate(`/chat/${botId}/${selectedChatId}`);
                  setSidebarOpen(false);
                }}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activeChatId={currentChatId}
              />
            </div>
          </div>
        )}

        {/* Main Chat */}
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
