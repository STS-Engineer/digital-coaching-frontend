import React from "react";
import { User, Bot } from "lucide-react";

const MessageBubble = ({ message, isUser }) => {
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} items-end space-x-2`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-white/10 border border-border flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-foreground" />
        </div>
      )}

      <div className={isUser ? "message-user rounded-br-none" : "message-bot rounded-bl-none"}>
        {message}
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
