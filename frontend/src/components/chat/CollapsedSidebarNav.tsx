/**
 * CollapsedSidebarNav - Icon-only navigation for collapsed sidebar
 * 2026 Trend: Minimalist icon-based navigation with tooltips
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Search, Clock, Star, Archive } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import type { Chat } from '../../types/chat';

export interface CollapsedSidebarNavProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onToggleSearch: () => void;
}

export const CollapsedSidebarNav: React.FC<CollapsedSidebarNavProps> = ({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onToggleSearch,
}) => {
  // Get pinned/recent chats (top 5)
  const recentChats = chats
    .filter((c) => !c.archived)
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 flex flex-col items-center py-4 gap-2">
      {/* New Chat Action */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconButton
          icon={Plus}
          size="md"
          variant="accent"
          tooltip="New Chat (⌘N)"
          onClick={onNewChat}
          className="gradient-accent text-white shadow-lg"
        />
      </motion.div>

      <div className="w-8 h-px bg-macBorder/30 my-2" />

      {/* Search Action */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconButton
          icon={Search}
          size="md"
          variant="default"
          tooltip="Search (⌘F)"
          onClick={onToggleSearch}
        />
      </motion.div>

      <div className="w-8 h-px bg-macBorder/30 my-2" />

      {/* Recent Chats */}
      <div className="flex flex-col items-center gap-2 flex-1 overflow-y-auto custom-scrollbar px-1">
        {recentChats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-300 ease-mac
                ${
                  activeChat === chat.id
                    ? 'bg-macAccent/20 text-macAccent ring-2 ring-macAccent/50'
                    : 'hover:bg-macPanel/60 text-macSubtext hover:text-macText'
                }
              `}
              title={chat.name}
            >
              <MessageSquare size={18} />
              {chat.message_count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-macAccent rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {chat.message_count > 99 ? '99+' : chat.message_count}
                </span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="w-8 h-px bg-macBorder/30 my-2" />

      <div className="flex flex-col items-center gap-2">
        {/* Recent */}
        <IconButton
          icon={Clock}
          size="md"
          variant="default"
          tooltip="Recent Chats"
        />

        {/* Starred/Pinned (future feature) */}
        <IconButton
          icon={Star}
          size="md"
          variant="default"
          tooltip="Starred Chats"
        />

        {/* Archived */}
        {chats.some((c) => c.archived) && (
          <IconButton
            icon={Archive}
            size="md"
            variant="default"
            tooltip={`${chats.filter((c) => c.archived).length} Archived`}
          />
        )}
      </div>
    </div>
  );
};
