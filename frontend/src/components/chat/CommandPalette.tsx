/**
 * CommandPalette - Cmd+K quick navigation
 * 2026 Trend: AI-powered command interfaces
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Plus, Archive, Star, Clock, Command } from 'lucide-react';
import type { Chat } from '../../types/chat';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  chats,
  onSelectChat,
  onNewChat,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build command list
  const commands: Command[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      icon: <Plus size={18} />,
      action: () => {
        onNewChat();
        onClose();
      },
      keywords: ['new', 'create', 'start', 'begin'],
    },
    ...chats.map((chat) => ({
      id: `chat-${chat.id}`,
      label: chat.name,
      description: `${chat.message_count} messages · ${new Date(chat.last_updated).toLocaleDateString()}`,
      icon: <MessageSquare size={18} />,
      action: () => {
        onSelectChat(chat.id);
        onClose();
      },
      keywords: [chat.name.toLowerCase(), chat.archived ? 'archived' : ''],
    })),
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter((cmd) => {
    const searchTerm = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchTerm) ||
      cmd.description.toLowerCase().includes(searchTerm) ||
      cmd.keywords.some((kw) => kw.includes(searchTerm))
    );
  });

  // Auto-focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -50 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[201]"
          >
            <div className="liquid-glass rounded-2xl shadow-2xl border border-macBorder/40 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-macBorder/30">
                <Search size={20} className="text-macSubtext" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-macText text-sm font-medium placeholder-macSubtext/60 outline-none"
                />
                <div className="flex items-center gap-1 text-[10px] font-bold text-macSubtext/70">
                  <kbd className="px-2 py-1 bg-macPanel/60 rounded-md border border-macBorder/30">⌘</kbd>
                  <kbd className="px-2 py-1 bg-macPanel/60 rounded-md border border-macBorder/30">K</kbd>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-macSubtext">No results found</p>
                    <p className="text-xs text-macSubtext/60 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredCommands.map((cmd, index) => (
                      <motion.button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left
                          transition-all duration-200 ease-mac
                          ${
                            selectedIndex === index
                              ? 'bg-macAccent/10 text-macText'
                              : 'text-macSubtext hover:bg-macPanel/40 hover:text-macText'
                          }
                        `}
                      >
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center
                            ${selectedIndex === index ? 'bg-macAccent/20 text-macAccent' : 'bg-macPanel/40'}
                          `}
                        >
                          {cmd.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{cmd.label}</p>
                          <p className="text-xs text-macSubtext/70 truncate">{cmd.description}</p>
                        </div>
                        {selectedIndex === index && (
                          <kbd className="px-2 py-1 bg-macPanel/60 rounded-md text-[10px] font-bold text-macSubtext/70">
                            ↵
                          </kbd>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Tips */}
              <div className="px-4 py-3 border-t border-macBorder/30 bg-macPanel/20 flex items-center justify-between text-[10px] text-macSubtext/70">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-macPanel/60 rounded">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-macPanel/60 rounded">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-macPanel/60 rounded">Esc</kbd> Close
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Command size={10} />
                  Command Palette
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
