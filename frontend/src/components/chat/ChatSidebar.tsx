/**
 * ChatSidebar - Compact sidebar with chat management
 * Header + Search + Sort + List + Footer stats
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
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-sky-400" />
          <h2 className="text-sm font-semibold text-slate-200">Chats</h2>
        </div>
        <button
          onClick={handleNewChat}
          className="p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
          title="New Chat (Cmd+N)"
        >
          <Plus size={14} className="text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2">
        <ChatSearch value={filter} onChange={setFilter} />
      </div>

      {/* Sort controls */}
      <div className="px-2 pb-2 flex items-center gap-1">
        <ArrowUpDown size={12} className="text-slate-500" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
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

      {/* Footer stats */}
      <div className="px-3 py-2 border-t border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>{chats.length} chats</span>
          <span>{totalMessages} messages</span>
          {archivedCount > 0 && <span>{archivedCount} archived</span>}
        </div>
      </div>
    </div>
  );
};
