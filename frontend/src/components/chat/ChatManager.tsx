/**
 * ChatManager - Main orchestrator for Chat v2
 * Combines ChatSidebar + ChatView with keyboard shortcuts
 * Compact Precision UI
 */

import React, { useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatView } from './ChatView';
import { useChatManager } from './hooks/useChatManager';

interface ChatManagerProps {
  apiBaseUrl: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ apiBaseUrl }) => {
  const { activeChat, loadChats, createChat, setFilter } = useChatManager();

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+N or Ctrl+N: New Chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        createChat();
      }

      // Cmd+K or Ctrl+K: Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Escape: Clear search / deselect chat
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput && searchInput.value) {
          setFilter('');
          searchInput.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createChat, setFilter]);

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar - Compact */}
      <ChatSidebar />

      {/* Main Chat View */}
      {activeChat ? (
        <ChatView conversationId={activeChat} apiBaseUrl={apiBaseUrl} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-surface">
          <div className="text-center max-w-xs">
            <div className="text-3xl mb-2">💬</div>
            <h2 className="text-sm font-semibold text-text-primary mb-1">No chat selected</h2>
            <p className="text-xs text-text-secondary mb-3">
              Select a chat from the sidebar or create a new one
            </p>
            <button
              onClick={() => createChat()}
              className="h-7 px-3 bg-success hover:bg-success-hover text-white text-xs font-semibold rounded transition-colors"
            >
              Start New Chat
            </button>
            <div className="mt-3 text-xs text-text-tertiary space-y-0.5">
              <p className="font-medium text-[10px]">Keyboard shortcuts:</p>
              <div className="flex items-center justify-center gap-1.5 text-[10px]">
                <kbd className="px-1 py-0.5 bg-surface-elevated border border-border rounded">Cmd+N</kbd>
                <span>New Chat</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[10px]">
                <kbd className="px-1 py-0.5 bg-surface-elevated border border-border rounded">Cmd+K</kbd>
                <span>Search</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
