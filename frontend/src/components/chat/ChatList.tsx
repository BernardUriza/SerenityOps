/**
 * ChatList - Refactored with SOLID principles and modern confirm dialog
 * - Uses custom hook for confirmations
 * - Better empty states
 * - Improved accessibility
 */

import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageSquare, Search } from 'lucide-react';
import { ChatItem } from './ChatItem';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useConfirm } from '../../hooks/useConfirm';
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

  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  // Filter and sort chats (memoized for performance - DRY)
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

  // Handle delete with confirmation
  const handleDelete = async (chatId: string, chatName: string) => {
    const confirmed = await confirm({
      type: 'danger',
      title: 'Delete Conversation',
      message: `Are you sure you want to delete "${chatName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      await deleteChat(chatId);
    }
  };

  // Empty state component (DRY)
  const EmptyState: React.FC<{ icon: React.ReactNode; title: string; message: string }> = ({
    icon,
    title,
    message,
  }) => (
    <div className="flex flex-col items-center justify-center h-40 px-4">
      <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-xs font-bold text-macText text-center mb-1">{title}</p>
      <p className="text-[10px] text-macSubtext/70 text-center max-w-[180px] leading-relaxed">{message}</p>
    </div>
  );

  if (filteredAndSortedChats.length === 0) {
    return (
      <>
        {filter ? (
          <EmptyState
            icon={<Search size={20} className="text-macAccent" />}
            title="No matches found"
            message={`No conversations match "${filter}". Try a different search term.`}
          />
        ) : (
          <EmptyState
            icon={<MessageSquare size={20} className="text-macAccent" />}
            title="No conversations yet"
            message="Click the + button to start your first conversation"
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
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
              onDelete={() => handleDelete(chat.id, chat.name)}
              onArchive={(archived) => archiveChat(chat.id, archived)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        type={confirmState.type}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={confirmState.loading}
      />
    </>
  );
};
