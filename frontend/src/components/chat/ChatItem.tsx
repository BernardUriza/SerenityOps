/**
 * ChatItem - Individual chat with inline rename + hover actions
 * Compact 26px height with smooth animations
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Copy, Trash2, Archive, ArchiveX } from 'lucide-react';
import type { ChatItemProps } from '../../types/chat';

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  onArchive,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(chat.name);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering rename mode
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setRenameDraft(chat.name);
  };

  const handleRenameSubmit = async () => {
    if (renameDraft.trim() && renameDraft !== chat.name) {
      try {
        await onRename(renameDraft.trim());
      } catch (error) {
        console.error('Rename failed:', error);
      }
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setRenameDraft(chat.name);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleRenameCancel();
    }
  };

  const handleActionClick = (
    e: React.MouseEvent,
    action: () => Promise<void> | void
  ) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.15 }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative flex items-center h-row px-2 cursor-pointer transition-all ${
        isActive
          ? 'bg-surface-elevated border-l-2 border-primary'
          : 'hover:bg-surface-hover border-l-2 border-transparent'
      } ${chat.archived ? 'opacity-60' : ''}`}
      title={`${chat.name} - ${chat.message_count} messages - ${new Date(
        chat.last_updated
      ).toLocaleDateString()}`}
    >
      {/* Chat name (inline editable) */}
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={renameDraft}
          onChange={(e) => setRenameDraft(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-surface-elevated border border-primary/50 rounded px-1 py-0 text-xs text-text-primary outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="flex-1 flex items-center min-w-0">
          <span className="text-xs text-text-primary truncate">{chat.name}</span>
          <span className="ml-auto text-[10px] text-text-tertiary ml-2 flex-shrink-0">
            {chat.message_count}
          </span>
        </div>
      )}

      {/* Hover actions */}
      {!isRenaming && isHovering && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="absolute right-1 flex items-center gap-0.5 bg-surface-elevated/95 rounded px-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleRenameStart}
            className="p-0.5 hover:bg-surface-hover rounded transition-colors"
            title="Rename"
          >
            <Edit3 size={11} className="text-text-secondary" />
          </button>
          <button
            onClick={(e) => handleActionClick(e, onDuplicate)}
            className="p-0.5 hover:bg-surface-hover rounded transition-colors"
            title="Duplicate"
          >
            <Copy size={11} className="text-text-secondary" />
          </button>
          <button
            onClick={(e) => handleActionClick(e, () => onArchive(!chat.archived))}
            className="p-0.5 hover:bg-surface-hover rounded transition-colors"
            title={chat.archived ? 'Unarchive' : 'Archive'}
          >
            {chat.archived ? (
              <ArchiveX size={11} className="text-text-secondary" />
            ) : (
              <Archive size={11} className="text-text-secondary" />
            )}
          </button>
          <button
            onClick={(e) => handleActionClick(e, onDelete)}
            className="p-0.5 hover:bg-error/10 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={11} className="text-error" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
