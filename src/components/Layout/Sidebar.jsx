import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  PanelLeft,
  Plus,
  Home,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  Search,
} from "lucide-react";

const Sidebar = ({
  botLabel,
  history = [],
  onNewChat,
  onSelectChat,
  onRenameChat,
  onTogglePin,
  onDeleteChat,
  isOpen,
  onToggle,
  activeChatId,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const editInputRef = useRef(null);

  // For portal menu positioning
  const actionBtnRefs = useRef({});
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return history;
    return history.filter((item) => {
      const title = (item.displayTitle || item.title || "").toLowerCase();
      return title.includes(query);
    });
  }, [history, searchQuery]);

  const confirmTarget = useMemo(() => {
    if (!confirmDeleteId) return null;
    return history.find((item) => item.chat_id === confirmDeleteId) || null;
  }, [confirmDeleteId, history]);

  useEffect(() => {
    if (!editingId) return;
    editInputRef.current?.focus();
  }, [editingId]);

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return undefined;

    const handleClick = (event) => {
      const menuEl = document.querySelector(`[data-portal-menu="${openMenuId}"]`);
      const btnEl = actionBtnRefs.current[openMenuId];

      if (menuEl && menuEl.contains(event.target)) return;
      if (btnEl && btnEl.contains(event.target)) return;

      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);

  // ESC closes delete modal
  useEffect(() => {
    if (!confirmDeleteId) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setConfirmDeleteId(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmDeleteId]);

  // Keep portal menu positioned correctly on scroll/resize
  useEffect(() => {
    if (!openMenuId) return;

    const update = () => {
      const btn = actionBtnRefs.current[openMenuId];
      if (!btn) return;
      const rect = btn.getBoundingClientRect();

      setMenuPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [openMenuId]);

  const startRename = (item) => {
    setEditingId(item.chat_id);
    setDraftTitle(item.displayTitle || item.title || "");
    setOpenMenuId(null);
  };

  const commitRename = (chatIdToRename) => {
    const cleanTitle = draftTitle.trim();
    if (cleanTitle && onRenameChat) {
      onRenameChat(chatIdToRename, cleanTitle);
    }
    setEditingId(null);
    setDraftTitle("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setDraftTitle("");
  };

  const handleDelete = (chatIdToDelete) => {
    setOpenMenuId(null);
    setConfirmDeleteId(chatIdToDelete);
  };

  const confirmDelete = () => {
    if (confirmDeleteId && onDeleteChat) {
      onDeleteChat(confirmDeleteId);
    }
    setConfirmDeleteId(null);
  };

  const closeConfirmDelete = () => {
    setConfirmDeleteId(null);
  };

  const openMenuFor = (chatId) => {
    const btn = actionBtnRefs.current[chatId];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();

    setMenuPos({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
    setOpenMenuId((prev) => (prev === chatId ? null : chatId));
  };

  // ✅ Robust new chat handler (fixes "button does nothing")
  const handleNewChat = () => {
    // close any open UI states that might block clicks / feel broken
    setOpenMenuId(null);
    setConfirmDeleteId(null);
    if (editingId) cancelRename();

    if (typeof onNewChat === "function") {
      onNewChat();
      return;
    }

    // Fallback route (adjust if needed)
    navigate("/chat");
  };

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
          onClick={handleNewChat}
          className="mt-3 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 border border-transparent transition-colors shadow-sm"
          title="New chat"
          aria-label="New chat"
          type="button"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => navigate("/dashboard")}
          className="group p-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white 
                     hover:opacity-90
                     border border-transparent transition-all duration-300 
                     hover:scale-105 active:scale-95 shadow-sm"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
          type="button"
        >
          <Home className="w-4 h-4 text-white" />
        </button>
      </aside>
    );
  }

  // Expanded
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 w-72 glass-panel border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-2"
              aria-label="New chat"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-7 w-auto object-contain"
                draggable="false"
              />
            </button>

            {/* Close Sidebar (ChatGPT style icon) */}
            <button
              type="button"
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <PanelLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="mt-4 w-full p-2 rounded-lg bg-primary text-white hover:bg-primary/90 border border-transparent transition-colors shadow-sm flex items-center justify-center gap-2"
            aria-label="New chat"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-sm text-white">New chat</span>
          </button>

          {/* Search */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search chats..."
              className="input-primary w-full text-sm pl-9 py-2"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {history.length === 0 ? "No chat history" : "No chats found"}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isActive = item.chat_id === activeChatId;
              const isEditing = editingId === item.chat_id;
              const isPinned = Boolean(item.isPinned);

              return (
                <div
                  key={item.chat_id}
                  className={`history-item group flex items-center gap-2 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare
                      className={[
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground",
                      ].join(" ")}
                    />

                    {isEditing ? (
                      <div className="flex items-center flex-1 min-w-0">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={draftTitle}
                          onChange={(event) => setDraftTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              commitRename(item.chat_id);
                            }
                            if (event.key === "Escape") {
                              event.preventDefault();
                              cancelRename();
                            }
                          }}
                          onBlur={() => commitRename(item.chat_id)}
                          className="input-primary text-sm py-1 px-3 flex-1"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectChat(item.chat_id)}
                        className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      >
                        <span className="truncate">
                          {item.displayTitle || item.title}
                        </span>
                        {isPinned && (
                          <Pin className="w-3.5 h-3.5 text-primary" />
                        )}
                      </button>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      ref={(el) => (actionBtnRefs.current[item.chat_id] = el)}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openMenuFor(item.chat_id);
                      }}
                      className={[
                        "p-1 rounded-md transition-all",
                        "hover:bg-white/60 dark:hover:bg-white/10",
                        openMenuId === item.chat_id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                      ].join(" ")}
                      title="Chat actions"
                      aria-label="Chat actions"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}

                  {openMenuId === item.chat_id &&
                    typeof document !== "undefined" &&
                    createPortal(
                      <div
                        data-portal-menu={item.chat_id}
                        className="fixed z-[9999] w-28 rounded-xl border border-border bg-white/90 dark:bg-slate-900/95 shadow-lg backdrop-blur-sm"
                        style={{
                          top: `${menuPos.top}px`,
                          left: `${menuPos.left}px`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => startRename(item)}
                          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/60 dark:hover:bg-white/10"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                          Rename
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onTogglePin?.(item.chat_id);
                          }}
                          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/60 dark:hover:bg-white/10"
                        >
                          {isPinned ? (
                            <PinOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Pin className="w-4 h-4 text-muted-foreground" />
                          )}
                          {isPinned ? "Unpin" : "Pin"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.chat_id)}
                          className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>,
                      document.body
                    )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="group w-full flex items-center gap-2 px-3 py-2 rounded-xl 
                       border border-transparent bg-gradient-to-r from-primary to-secondary text-white
                       hover:opacity-90
                       transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-sm"
          >
            <Home className="w-4 h-4 text-white transition-colors" />
            <span className="text-sm text-white">Back to Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Confirm Delete Modal */}
      {confirmDeleteId &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeConfirmDelete}
            />

            <div className="relative w-[92%] max-w-md rounded-2xl border border-border bg-white/90 dark:bg-slate-900/95 shadow-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Delete this chat?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">
                      {confirmTarget?.displayTitle ||
                        confirmTarget?.title ||
                        "This chat"}
                    </span>{" "}
                    will be removed.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeConfirmDelete}
                  className="
                    px-5 py-2 rounded-full text-sm font-medium
                    border border-border bg-transparent
                    text-foreground
                    hover:bg-black/5 dark:hover:bg-white/10
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="
                    px-5 py-2 rounded-full text-sm font-medium
                    border border-red-500 bg-transparent
                    text-red-600
                    hover:bg-red-50 dark:hover:bg-red-500/10
                    transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Sidebar;
