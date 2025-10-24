/**
 * ChatSearch - Enhanced search with debounce and better UX
 * Supports keyboard navigation and clear visual feedback
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import type { ChatSearchProps } from '../../types/chat';

export const ChatSearch: React.FC<ChatSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search conversations...',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced update (performance optimization - DRY principle)
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  // Keyboard shortcut hint
  const showShortcut = !isFocused && !localValue;

  return (
    <div className="relative group">
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Search
          size={14}
          className={`transition-all duration-300 ${
            isFocused ? 'text-macAccent scale-110' : 'text-macSubtext'
          }`}
        />
      </div>

      {/* Search input */}
      <input
        id="chat-search"
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full h-9 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-xl pl-10 pr-20 text-xs font-medium text-macText placeholder-macSubtext/60 focus:outline-none focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent focus:bg-macPanel/70 transition-all duration-300 ease-mac shadow-sm"
      />

      {/* Right side actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Keyboard shortcut hint */}
        {showShortcut && (
          <div className="px-2 py-0.5 bg-macPanel/60 rounded-md border border-macBorder/30 text-[10px] font-bold text-macSubtext/70 pointer-events-none">
            ⌘F
          </div>
        )}

        {/* Clear button */}
        {localValue && (
          <button
            onClick={handleClear}
            className="w-6 h-6 rounded-lg bg-macPanel/60 hover:bg-error/20 flex items-center justify-center text-macSubtext hover:text-error transition-all duration-300 ease-mac group/clear"
            title="Clear search (Esc)"
          >
            <X size={12} className="transition-transform duration-300 group-hover/clear:rotate-90" />
          </button>
        )}
      </div>

      {/* Search results count hint */}
      {localValue && (
        <div className="absolute -bottom-5 left-0 right-0 text-center">
          <span className="text-[10px] text-macSubtext/70 font-medium">
            Press Enter to search
          </span>
        </div>
      )}
    </div>
  );
};
