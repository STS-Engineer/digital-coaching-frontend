import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Home, MessageSquare } from "lucide-react";

const Sidebar = ({
  botLabel,
  history = [],
  onNewChat,
  onSelectChat,
  isOpen,
  onToggle,
  activeChatId,
}) => {
  const navigate = useNavigate();

  // Collapsed
  if (!isOpen) {
    return (
      <aside className="fixed inset-y-0 left-0 z-40 w-14 glass-panel border-r border-border flex flex-col items-center py-3">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-border transition-colors"
          title="Open sidebar"
          aria-label="Open sidebar"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={onNewChat}
          className="mt-3 p-2 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-border transition-colors"
          title="New chat"
          aria-label="New chat"
        >
          <Plus className="w-4 h-4 text-foreground" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => navigate("/dashboard")}
          className="group p-2 rounded-xl bg-white/70 dark:bg-white/10 
                     hover:bg-white/90 dark:hover:bg-white/20 
                     border border-border transition-all duration-300 
                     hover:scale-105 active:scale-95"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <Home className="w-4 h-4 text-foreground" />
        </button>
      </aside>
    );
  }

  // Expanded
  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-72 glass-panel border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-semibold text-foreground">History</div>
          </div>
          <button
            onClick={onNewChat}
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg 
                     border border-border bg-white/70 dark:bg-white/10
                     hover:bg-white/90 dark:hover:bg-white/20
                     transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-sm text-foreground">New chat</span>
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No chat history
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.chat_id}
              onClick={() => onSelectChat(item.chat_id)}
              className={`history-item ${item.chat_id === activeChatId ? "active" : ""}`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare
                  className={[
                    "w-4 h-4 shrink-0 transition-colors",
                    item.chat_id === activeChatId ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                />
                <span className="truncate">{item.title}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => navigate("/dashboard")}
          className="group w-full flex items-center gap-2 px-3 py-2 rounded-xl 
                     border border-border bg-white/70 dark:bg-white/10
                     hover:bg-white/90 dark:hover:bg-white/20
                     transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Home className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="text-sm text-foreground">Back to Dashboard</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
