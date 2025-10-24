/**
 * ChatSidebar - Modern 2026 collapsible sidebar
 * - SOLID principles maintained
 * - Collapsible state management
 * - Smooth transitions and animations
 * - Keyboard shortcuts: ⌘N, ⌘F, ⌘B
 */

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatSearch } from './ChatSearch';
import { ChatList } from './ChatList';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { SortControl } from './SortControl';
import { SidebarToggle } from './SidebarToggle';
import { CollapsedSidebarNav } from './CollapsedSidebarNav';
import { SearchOverlay } from './SearchOverlay';
import { ResizeHandle } from './ResizeHandle';
import { CommandPalette } from './CommandPalette';
import { useChatManager } from './hooks/useChatManager';
import { useSidebarState, SIDEBAR_WIDTH } from '../../hooks/useSidebarState';

export const ChatSidebar: React.FC = () => {
  const {
    chats,
    activeChat,
    filter,
    sortBy,
    isLoading,
    isSaving,
    loadChats,
    createChat,
    setFilter,
    setSortBy,
    setActiveChat,
  } = useChatManager();

  const { isCollapsed, width, isResizing, toggleCollapse } = useSidebarState();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

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
      // Cmd+B / Ctrl+B: Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
      // Cmd+K / Ctrl+K: Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleCollapse]);

  const handleNewChat = async () => {
    try {
      await createChat();
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  // Calculate current width
  const currentWidth = isCollapsed ? SIDEBAR_WIDTH.COLLAPSED : width;

  return (
    <motion.div
      initial={false}
      animate={{ width: currentWidth }}
      transition={isResizing ? { duration: 0 } : { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className={`liquid-glass border-r border-macBorder/30 flex flex-col h-full shadow-xl relative overflow-hidden ${
        isResizing ? 'select-none' : ''
      }`}
      style={{ minWidth: currentWidth }}
    >
      {/* Resize Handle */}
      <ResizeHandle />

      {/* Toggle Button - Floating */}
      <div className="absolute top-4 right-3 z-50">
        <SidebarToggle isCollapsed={isCollapsed} onToggle={toggleCollapse} />
      </div>

      {/* Header Section */}
      <motion.div
        initial={false}
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <SidebarHeader
          chatCount={chats.length}
          onNewChat={handleNewChat}
          loading={isSaving}
        />
      </motion.div>

      {/* Content - Hide when collapsed */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
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
        </motion.div>
      )}

      {/* Collapsed Mode - Icon-only navigation */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <CollapsedSidebarNav
            chats={chats}
            activeChat={activeChat}
            onNewChat={handleNewChat}
            onSelectChat={setActiveChat}
            onToggleSearch={() => setIsSearchOpen(true)}
          />
        </motion.div>
      )}

      {/* Search Overlay for Collapsed Mode */}
      <SearchOverlay
        isOpen={isSearchOpen && isCollapsed}
        onClose={() => setIsSearchOpen(false)}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Command Palette - Global */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        chats={chats}
        onSelectChat={setActiveChat}
        onNewChat={handleNewChat}
      />
    </motion.div>
  );
};
