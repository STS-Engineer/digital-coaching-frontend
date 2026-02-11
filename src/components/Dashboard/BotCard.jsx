// frontend/src/components/Dashboard/BotCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const BotCard = ({ bot }) => {
  return (
    <Link to={`/chat/${bot.id}`} className="group h-full">
      <div
        className="card tilt-card reveal-item h-full cursor-pointer"
        data-reveal
        data-tilt
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`icon-chip ${bot.color}`}>{bot.icon}</div>
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
            →
          </span>
        </div>

        <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {bot.label}
        </h3>

        <p className="text-muted-foreground text-sm">{bot.description}</p>

        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-xs text-primary font-medium">Start Chatting →</span>
        </div>
      </div>
    </Link>
  );
};

export default BotCard;
