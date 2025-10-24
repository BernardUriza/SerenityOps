/**
 * SearchOverlay - Full-screen search overlay for collapsed mode
 * 2026 Trend: Context-aware floating panels
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ChatSearch } from './ChatSearch';
import { ChatList } from './ChatList';

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  filter,
  onFilterChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('#chat-search');
        input?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101]"
          >
            <div className="liquid-glass rounded-2xl shadow-2xl border border-macBorder/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-macBorder/30">
                <h3 className="text-sm font-bold text-macText">Search Conversations</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-macPanel/60 flex items-center justify-center text-macSubtext hover:text-macText transition-colors"
                  title="Close (Esc)"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-4">
                <ChatSearch
                  value={filter}
                  onChange={onFilterChange}
                  placeholder="Search by name..."
                />
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <ChatList />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
