/**
 * ChatSidebar - Compact sidebar with chat management
 * Header + Search + Sort + List + Footer stats
 * Compact Precision UI - 240px width
 */

import React from 'react';
import { Plus, MessageSquare, ArrowUpDown } from 'lucide-react';
import { ChatSearch } from './ChatSearch';
import { ChatList } from './ChatList';
import { useChatManager } from './hooks/useChatManager';

export const ChatSidebar: React.FC = () => {
  const { chats, filter, sortBy, createChat, setFilter, setSortBy } = useChatManager();

  const handleNewChat = async () => {
    try {
      await createChat();
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const totalMessages = chats.reduce((sum, chat) => sum + chat.message_count, 0);
  const archivedCount = chats.filter((c) => c.archived).length;

  return (
    <div className="w-chat-sidebar bg-surface border-r border-border flex flex-col h-full">
      {/* Header - Compact */}
      <div className="h-header px-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MessageSquare size={14} className="text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">Chats</h2>
        </div>
        <button
          onClick={handleNewChat}
          className="h-6 w-6 bg-success hover:bg-success-hover rounded flex items-center justify-center transition-colors"
          title="New Chat (Cmd+N)"
        >
          <Plus size={12} className="text-white" />
        </button>
      </div>

      {/* Search - Compact */}
      <div className="p-2">
        <ChatSearch value={filter} onChange={setFilter} />
      </div>

      {/* Sort controls - Compact */}
      <div className="px-2 pb-2 flex items-center gap-1">
        <ArrowUpDown size={11} className="text-text-tertiary flex-shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="flex-1 h-6 bg-surface-elevated border border-border rounded px-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
        >
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="messages">Most Messages</option>
        </select>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        <ChatList />
      </div>

      {/* Footer stats - Compact */}
      <div className="h-7 px-2 border-t border-border bg-surface-elevated flex items-center justify-between text-xs text-text-tertiary">
        <span>{chats.length} chats</span>
        <span>{totalMessages} msgs</span>
        {archivedCount > 0 && <span>{archivedCount} archived</span>}
      </div>
    </div>
  );
};
