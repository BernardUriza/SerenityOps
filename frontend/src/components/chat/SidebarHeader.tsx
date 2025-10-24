/**
 * SidebarHeader - Extracted header component
 * Single Responsibility: Display header with actions
 */

import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

export interface SidebarHeaderProps {
  chatCount: number;
  onNewChat: () => void;
  loading?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  chatCount,
  onNewChat,
  loading = false,
}) => {
  return (
    <div className="h-24 px-6 py-4 border-b-2 border-macAccent/20 flex items-center justify-between bg-gradient-to-br from-macPanel/40 via-macPanel/30 to-transparent backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-2xl shadow-macAccent/30 ring-2 ring-macAccent/20">
          <MessageSquare size={26} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div>
          <h2 className="text-lg font-black text-macText tracking-tight">Conversations</h2>
          <p className="text-xs text-macSubtext font-semibold mt-0.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></span>
            {chatCount} total chats
          </p>
        </div>
      </div>

      <IconButton
        icon={Plus}
        size="md"
        variant="accent"
        tooltip="New Chat (⌘N)"
        onClick={onNewChat}
        loading={loading}
        className="gradient-accent text-white shadow-2xl shadow-macAccent/40 hover:shadow-macAccent/60 hover:scale-110 transition-all duration-300 ring-2 ring-macAccent/30"
      />
    </div>
  );
};
