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
        className="absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-7 bg-surface-elevated border border-border rounded pl-7 pr-7 text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
          title="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
