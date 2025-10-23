/**
 * ChatManager - Main orchestrator for Chat v2
 * Combines ChatSidebar + ChatView with keyboard shortcuts
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
    <div className="flex h-full bg-slate-950">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat View */}
      {activeChat ? (
        <ChatView conversationId={activeChat} apiBaseUrl={apiBaseUrl} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">No chat selected</h2>
            <p className="text-slate-400 mb-6">
              Select a chat from the sidebar or create a new one
            </p>
            <button
              onClick={() => createChat()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              Start New Chat
            </button>
            <div className="mt-6 text-xs text-slate-500">
              <p>Keyboard shortcuts:</p>
              <p className="mt-1">
                <kbd className="px-2 py-1 bg-slate-700 rounded">Cmd+N</kbd> New Chat
              </p>
              <p className="mt-1">
                <kbd className="px-2 py-1 bg-slate-700 rounded">Cmd+K</kbd> Search
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
