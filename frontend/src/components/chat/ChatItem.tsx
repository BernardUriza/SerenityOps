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
      className={`group relative mx-3 mb-2 rounded-xl cursor-pointer transition-all duration-300 ease-mac ${
        isActive
          ? 'bg-gradient-to-r from-macAccent/20 via-macAccent/10 to-transparent backdrop-blur-md shadow-lg shadow-macAccent/20 border-2 border-macAccent/50 ring-1 ring-macAccent/30'
          : 'hover:bg-macPanel/60 border border-transparent hover:border-macAccent/20 hover:shadow-lg'
      } ${chat.archived ? 'opacity-60' : ''}`}
      title={`${chat.name} - ${chat.message_count} messages - Updated ${formattedDate}`}
    >
      <div className="flex items-start px-4 py-2.5 min-h-[3rem]">
        {/* Active indicator - Enhanced */}
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-10 bg-gradient-to-b from-macAccent via-macAccent to-macAccent/60 rounded-r-full shadow-2xl shadow-macAccent/70 blur-[0.5px]"
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
          <div className="flex-1 grid grid-cols-[1fr_auto] items-center gap-2 min-w-0">
            {/* Chat name - No truncate, allows wrapping */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className={`text-xs font-bold leading-tight break-words transition-colors duration-300 ${
                  isActive ? 'text-macAccent' : 'text-macText'
                }`}
              >
                {chat.name}
              </span>

              {/* Archived badge - Below name */}
              {chat.archived && (
                <span className="px-1.5 py-0.5 bg-warning/20 text-warning text-[9px] font-bold rounded uppercase w-fit">
                  Archived
                </span>
              )}
            </div>

            {/* Message count badge - Right aligned */}
            <span className="text-[10px] font-bold text-macSubtext bg-macPanel/60 px-2 py-1 rounded-lg flex-shrink-0 border border-macBorder/30 self-start">
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
