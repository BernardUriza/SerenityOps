/**
 * ChatManager - Main orchestrator for Chat v2
 * Combines ChatSidebar + ChatView
 * Modern 2026 Layout with Collapsible Sidebar
 */

import React from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatView } from './ChatView';
import { useChatManager } from './hooks/useChatManager';

interface ChatManagerProps {
  apiBaseUrl: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ apiBaseUrl }) => {
  const { activeChat, createChat } = useChatManager();

  // Note: Keyboard shortcuts are now handled in ChatSidebar
  // ⌘N - New Chat
  // ⌘F - Focus Search
  // ⌘\ - Toggle Chat Sidebar (⌘B toggles main app sidebar)
  // ⌘K - Command Palette

  return (
    <div className="flex h-full bg-macBg relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="gradient-orb fixed top-[5%] right-[15%] w-[600px] h-[600px] bg-macAccent/10 -z-10"></div>
      <div className="gradient-orb fixed bottom-[10%] left-[25%] w-[500px] h-[500px] bg-purple-500/8 -z-10" style={{ animationDelay: '4s' }}></div>

      {/* Sidebar - Compact */}
      <ChatSidebar />

      {/* Main Chat View */}
      {activeChat ? (
        <ChatView conversationId={activeChat} apiBaseUrl={apiBaseUrl} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-macBg relative">
          {/* Decorative elements */}
          <div className="gradient-orb absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-500/8"></div>
          <div className="particle absolute top-[20%] left-[30%]"></div>
          <div className="particle absolute bottom-[30%] right-[40%]" style={{ animationDelay: '2s' }}></div>

          <div className="text-center max-w-2xl px-8 relative z-10 animate-scale-in">
            {/* Icon with gradient */}
            <div className="w-28 h-28 mx-auto mb-8 gradient-accent-subtle rounded-3xl flex items-center justify-center shadow-xl animate-glow-pulse">
              <svg className="w-14 h-14 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gradient mb-3">Start a Conversation</h2>
            <p className="text-base text-macSubtext mb-8 leading-relaxed max-w-md mx-auto">
              Get AI-powered career insights and strategic advice. Select a conversation from the sidebar or start a new one.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => createChat()}
              className="inline-flex items-center gap-3 px-8 py-4 gradient-accent text-white text-base font-semibold rounded-xl hover:shadow-accent transition-all duration-300 ease-mac hover-lift group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
              <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">Start New Conversation</span>
            </button>

            {/* Keyboard shortcuts - Enhanced */}
            <div className="mt-12 liquid-glass rounded-2xl p-6 max-w-md mx-auto border border-macBorder/30">
              <p className="text-sm font-semibold text-macText mb-4">Keyboard Shortcuts</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-macSubtext">New conversation</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">⌘</kbd>
                    <span className="text-macSubtext">+</span>
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">N</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-macSubtext">Command palette</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">⌘</kbd>
                    <span className="text-macSubtext">+</span>
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">K</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-macSubtext">Toggle chat sidebar</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">⌘</kbd>
                    <span className="text-macSubtext">+</span>
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">\</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-macSubtext">Focus search</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">⌘</kbd>
                    <span className="text-macSubtext">+</span>
                    <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-sm font-semibold text-xs">F</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
