import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../hooks/useChat";

const ChatInterface = ({
  botId,
  botLabel,
  initialChatId = null,
  onHistoryUpdate,
  onChatIdChange,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    loading,
    sendMessage,
    refreshHistory,
    history,
    currentChatId,
  } = useChat(botId, initialChatId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [botId, initialChatId]);

  useEffect(() => {
    if (onHistoryUpdate) {
      onHistoryUpdate(history);
    }
  }, [history, onHistoryUpdate]);

  useEffect(() => {
    if (onChatIdChange) {
      onChatIdChange(currentChatId);
    }
  }, [currentChatId, onChatIdChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");
    await sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="glass-panel border-b border-border py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-primary">{botLabel}</h2>
            {loading && (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshHistory}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center mb-4 border border-border">
              <div className="text-2xl">🤖</div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Start a conversation
            </h3>
            <p className="text-muted-foreground max-w-md">
              Send a message to begin chatting with {botLabel}. Your
              conversation will be saved automatically.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message.content}
            isUser={message.role === "user"}
          />
        ))}

        {loading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white/60 dark:bg-white/10 border border-border max-w-[85%] rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel border-t border-border p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            className="input-primary flex-1"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center gap-2 min-w-[88px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
