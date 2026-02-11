// frontend/src/pages/Dashboard.jsx
import React from "react";
import Header from "../components/Layout/Header";
import BotCard from "../components/Dashboard/BotCard";
import { BOTS } from "../utils/constants";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-12 reveal-item" data-reveal>
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            Digital Coaching
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            An integrated coaching platform for self-audit, well-being,
            problem-solving, learning, and strategy alignment with AVOCarbon's
            strategy.
          </p>
          <p className="text-muted-foreground mt-2">
            Choose a coaching assistant to get started.
          </p>
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(BOTS).map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 card reveal-item" data-reveal>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">
                How it works
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  <span>Select a coaching assistant based on your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  <span>Start chatting - your conversation will be saved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  <span>Access your chat history anytime</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">
                Tips for best results
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Be specific with your questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Provide context when needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use different bots for different needs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
