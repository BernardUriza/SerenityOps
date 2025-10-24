/**
 * SortControl - Enhanced sort component with better UX
 * Single Responsibility: Handle chat sorting
 */

import React from 'react';
import { ArrowUpDown, Calendar, MessageSquare, SortAsc } from 'lucide-react';
import type { SortOption } from '../../types/chat';

export interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: Array<{ value: SortOption; label: string; icon: React.ReactNode }> = [
  { value: 'date-desc', label: 'Latest First', icon: <Calendar size={12} /> },
  { value: 'date-asc', label: 'Oldest First', icon: <Calendar size={12} /> },
  { value: 'name', label: 'Name (A-Z)', icon: <SortAsc size={12} /> },
  { value: 'messages', label: 'Most Messages', icon: <MessageSquare size={12} /> },
];

export const SortControl: React.FC<SortControlProps> = ({ value, onChange }) => {
  const currentOption = sortOptions.find(opt => opt.value === value);

  return (
    <div className="px-3 pb-3">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ArrowUpDown size={12} className="text-macSubtext" />
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="w-full h-9 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-xl pl-9 pr-9 text-xs font-semibold text-macText focus:outline-none focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent transition-all duration-300 ease-mac appearance-none cursor-pointer hover:bg-macPanel/70"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-3 h-3 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Current selection indicator */}
      <div className="mt-2 flex items-center gap-2 px-3">
        <div className="w-1 h-1 rounded-full bg-macAccent" />
        <span className="text-[10px] text-macSubtext font-medium">
          Sorted by {currentOption?.label.toLowerCase()}
        </span>
      </div>
    </div>
  );
};
