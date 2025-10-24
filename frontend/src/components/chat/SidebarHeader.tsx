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
    <div className="h-14 px-4 border-b border-macBorder/30 flex items-center justify-between bg-macPanel/30 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-accent-subtle flex items-center justify-center">
          <MessageSquare size={18} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-macText">Conversations</h2>
          <p className="text-[10px] text-macSubtext font-medium">{chatCount} total</p>
        </div>
      </div>

      <IconButton
        icon={Plus}
        size="md"
        variant="accent"
        tooltip="New Chat (⌘N)"
        onClick={onNewChat}
        loading={loading}
        className="gradient-accent text-white shadow-lg hover:shadow-accent"
      />
    </div>
  );
};
