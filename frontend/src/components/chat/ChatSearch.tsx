/**
 * ChatSearch - Search bar with debounce for filtering chats
 * Compact design with keyboard accessibility
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
        size={14}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          title="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
