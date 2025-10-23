/**
 * ChatList - Renders filtered and sorted list of chats
 * Compact Precision UI with animations
 */

import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatItem } from './ChatItem';
import { useChatManager } from './hooks/useChatManager';

export const ChatList: React.FC = () => {
  const {
    chats,
    activeChat,
    filter,
    sortBy,
    setActiveChat,
    renameChat,
    duplicateChat,
    deleteChat,
    archiveChat,
  } = useChatManager();

  // Filter and sort chats
  const filteredAndSortedChats = useMemo(() => {
    let result = [...chats];

    // Apply filter
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      result = result.filter((chat) =>
        chat.name.toLowerCase().includes(lowerFilter)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
        case 'date-asc':
          return new Date(a.last_updated).getTime() - new Date(b.last_updated).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'messages':
          return b.message_count - a.message_count;
        default:
          return 0;
      }
    });

    return result;
  }, [chats, filter, sortBy]);

  if (filteredAndSortedChats.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-xs text-macSubtext">
          {filter ? 'No chats match your search' : 'No chats yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {filteredAndSortedChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChat === chat.id}
            onSelect={() => setActiveChat(chat.id)}
            onRename={(name) => renameChat(chat.id, name)}
            onDuplicate={async () => {
              const duplicated = await duplicateChat(chat.id);
              setActiveChat(duplicated.id);
            }}
            onDelete={async () => {
              if (window.confirm(`Delete "${chat.name}"?`)) {
                await deleteChat(chat.id);
              }
            }}
            onArchive={(archived) => archiveChat(chat.id, archived)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
