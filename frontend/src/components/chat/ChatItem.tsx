/**
 * ChatItem - Refactored with SOLID and improved UX
 * - Single Responsibility: Display and manage single chat
 * - Better visual feedback and animations
 * - Improved accessibility
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Copy, Trash2, Archive, ArchiveX } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus and select input when entering rename mode
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
    const trimmed = renameDraft.trim();
    if (trimmed && trimmed !== chat.name) {
      try {
        setActionLoading('rename');
        await onRename(trimmed);
      } catch (error) {
        console.error('Rename failed:', error);
      } finally {
        setActionLoading(null);
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

  const handleAction = async (
    e: React.MouseEvent,
    action: () => Promise<void> | void,
    actionName: string
  ) => {
    e.stopPropagation();
    try {
      setActionLoading(actionName);
      await action();
    } catch (error) {
      console.error(`${actionName} failed:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const formattedDate = new Date(chat.last_updated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative mx-2 mb-1.5 rounded-xl cursor-pointer transition-all duration-300 ease-mac ${
        isActive
          ? 'bg-gradient-to-r from-macAccent/10 to-macAccent/5 backdrop-blur-md shadow-lg border border-macAccent/30 scale-[1.01]'
          : 'hover:bg-macPanel/40 border border-transparent hover:border-macBorder/30 hover:scale-[1.005]'
      } ${chat.archived ? 'opacity-60' : ''}`}
      title={`${chat.name} - ${chat.message_count} messages - Updated ${formattedDate}`}
    >
      <div className="flex items-center px-3 py-2.5">
        {/* Active indicator - Enhanced */}
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-macAccent to-macAccent/60 rounded-r-full shadow-lg shadow-macAccent/50"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {/* Chat content */}
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-macPanel/60 border-2 border-macAccent/50 rounded-lg px-2.5 py-1.5 text-xs font-medium text-macText outline-none focus:ring-2 focus:ring-macAccent/50 transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
            disabled={actionLoading === 'rename'}
          />
        ) : (
          <div className="flex-1 flex items-center min-w-0 gap-2">
            {/* Chat name */}
            <span
              className={`text-xs font-semibold truncate transition-colors duration-300 ${
                isActive ? 'text-macAccent' : 'text-macText'
              }`}
            >
              {chat.name}
            </span>

            {/* Archived badge */}
            {chat.archived && (
              <span className="px-1.5 py-0.5 bg-warning/10 text-warning text-[9px] font-bold rounded uppercase">
                Archived
              </span>
            )}

            {/* Message count badge */}
            <span className="ml-auto text-[10px] font-bold text-macSubtext/70 bg-macPanel/40 px-2 py-0.5 rounded-lg flex-shrink-0 border border-macBorder/20">
              {chat.message_count}
            </span>
          </div>
        )}
      </div>

      {/* Hover actions - Enhanced with loading states */}
      {!isRenaming && isHovering && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-macPanel/95 backdrop-blur-xl rounded-lg px-1.5 py-1 shadow-xl border border-macBorder/50"
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            icon={Edit3}
            size="xs"
            variant="default"
            tooltip="Rename"
            onClick={handleRenameStart}
            loading={actionLoading === 'rename'}
          />

          <IconButton
            icon={Copy}
            size="xs"
            variant="default"
            tooltip="Duplicate"
            onClick={(e) => handleAction(e, onDuplicate, 'duplicate')}
            loading={actionLoading === 'duplicate'}
          />

          <IconButton
            icon={chat.archived ? ArchiveX : Archive}
            size="xs"
            variant="warning"
            tooltip={chat.archived ? 'Unarchive' : 'Archive'}
            onClick={(e) => handleAction(e, () => onArchive(!chat.archived), 'archive')}
            loading={actionLoading === 'archive'}
          />

          <IconButton
            icon={Trash2}
            size="xs"
            variant="danger"
            tooltip="Delete"
            onClick={(e) => handleAction(e, onDelete, 'delete')}
            loading={actionLoading === 'delete'}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
