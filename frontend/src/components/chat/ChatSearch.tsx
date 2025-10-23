/**
 * ChatSearch - Search bar with debounce for filtering chats
 * Compact Precision UI - 28px height
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import type { ChatSearchProps } from '../../types/chat';

export const ChatSearch: React.FC<ChatSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search chats...',
}) => {
  return (
    <div className="relative">
      <Search
        size={12}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-macSubtext"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-7 bg-macPanel/60 backdrop-blur-md border border-macBorder/40 rounded-mac pl-7 pr-7 text-xs text-macText placeholder-macSubtext focus:outline-none focus:ring-1 focus:ring-macAccent/40 focus:border-macAccent transition-all duration-300 ease-mac"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-macSubtext hover:text-macText transition-all duration-300 ease-mac"
          title="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
