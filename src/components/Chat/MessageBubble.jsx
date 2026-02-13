import React, { useEffect, useState } from "react";
import { Bot, Check, Copy, Pencil, User, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageBubble = ({
  message,
  isUser,
  messageIndex,
  onEditSubmit,
  isBusy,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message);

  useEffect(() => {
    if (!isEditing) {
      setDraft(message);
    }
  }, [message, isEditing]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Copied");
    } catch (error) {
      console.error("Copy failed", error);
      toast.error("Copy failed");
    }
  };

  const handleSubmit = () => {
    const cleanContent = draft.trim();
    if (!cleanContent) return;
    if (onEditSubmit) {
      onEditSubmit(messageIndex, cleanContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraft(message);
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} items-end space-x-2`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-white/10 border border-border flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-foreground" />
        </div>
      )}

      <div
        className={[
          "group flex flex-col max-w-[85%]",
          isUser ? "items-end text-right" : "items-start",
        ].join(" ")}
      >
        <div className={isUser ? "message-user rounded-br-none" : "message-bot rounded-bl-none"}>
          {isEditing ? (
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  handleCancel();
                }
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              rows={Math.min(6, Math.max(2, draft.split("\n").length))}
              className="w-full bg-transparent outline-none resize-none text-sm"
              autoFocus
            />
          ) : (
            message
          )}
        </div>

        {isUser && !isEditing && (
          <div className="mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => {
                if (!isBusy) setIsEditing(true);
              }}
              disabled={isBusy}
              className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Edit"
              aria-label="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={isBusy}
              className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Copy"
              aria-label="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}

        {isUser && isEditing && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isBusy}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isBusy}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5" />
              Send
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
