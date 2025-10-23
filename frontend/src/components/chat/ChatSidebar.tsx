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
    <div className="w-chat-sidebar bg-macPanel/50 backdrop-blur-md border-r border-macBorder/40 flex flex-col h-full">
      {/* Header - Compact */}
      <div className="h-header px-2 border-b border-macBorder/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MessageSquare size={14} className="text-macAccent" />
          <h2 className="text-sm font-semibold text-macText">Chats</h2>
        </div>
        <button
          onClick={handleNewChat}
          className="h-6 w-6 bg-macAccent hover:bg-macAccent/80 rounded-mac flex items-center justify-center transition-all duration-300 ease-mac"
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
        <ArrowUpDown size={11} className="text-macSubtext flex-shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="flex-1 h-6 bg-macPanel/60 backdrop-blur-md border border-macBorder/40 rounded-mac px-1.5 text-xs text-macText focus:outline-none focus:ring-1 focus:ring-macAccent/40 focus:border-macAccent transition-all duration-300 ease-mac"
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
      <div className="h-7 px-2 border-t border-macBorder/40 bg-macPanel/70 backdrop-blur-md flex items-center justify-between text-xs text-macSubtext">
        <span>{chats.length} chats</span>
        <span>{totalMessages} msgs</span>
        {archivedCount > 0 && <span>{archivedCount} archived</span>}
      </div>
    </div>
  );
};
