/**
 * ChatSidebar - Refactored with SOLID principles
 * - Single Responsibility: Compose sidebar layout
 * - Open/Closed: Extensible via child components
 * - Dependency Inversion: Depends on abstractions (hooks, child components)
 */

import React, { useMemo, useEffect } from 'react';
import { ChatSearch } from './ChatSearch';
import { ChatList } from './ChatList';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { SortControl } from './SortControl';
import { useChatManager } from './hooks/useChatManager';

export const ChatSidebar: React.FC = () => {
  const {
    chats,
    filter,
    sortBy,
    isLoading,
    isSaving,
    loadChats,
    createChat,
    setFilter,
    setSortBy
  } = useChatManager();

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Memoized calculations (DRY)
  const stats = useMemo(() => ({
    totalMessages: chats.reduce((sum, chat) => sum + chat.message_count, 0),
    archivedCount: chats.filter((c) => c.archived).length,
  }), [chats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd+N / Ctrl+N: New Chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      // Cmd+F / Ctrl+F: Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('#chat-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleNewChat = async () => {
    try {
      await createChat();
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <div className="w-chat-sidebar liquid-glass border-r border-macBorder/30 flex flex-col h-full shadow-xl">
      {/* Header Section */}
      <SidebarHeader
        chatCount={chats.length}
        onNewChat={handleNewChat}
        loading={isSaving}
      />

      {/* Search Section */}
      <div className="p-3">
        <ChatSearch value={filter} onChange={setFilter} />
      </div>

      {/* Sort Controls */}
      <SortControl value={sortBy} onChange={setSortBy} />

      {/* Chat List - Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-macAccent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-medium text-macSubtext">Loading conversations...</p>
            </div>
          </div>
        ) : (
          <ChatList />
        )}
      </div>

      {/* Footer Stats */}
      <SidebarFooter
        chatCount={chats.length}
        messageCount={stats.totalMessages}
        archivedCount={stats.archivedCount}
        isOnline={!isLoading}
      />
    </div>
  );
};
