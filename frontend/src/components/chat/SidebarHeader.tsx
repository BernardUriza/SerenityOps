/**
 * SidebarHeader - Extracted header component
 * Single Responsibility: Display header with actions
 * Fixed: Integrated toggle button to prevent overlap
 */

import React from 'react';
import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconButton } from '../ui/IconButton';

export interface SidebarHeaderProps {
  chatCount: number;
  onNewChat: () => void;
  loading?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  chatCount,
  onNewChat,
  loading = false,
  isCollapsed = false,
  onToggle,
}) => {
  return (
    <div className="h-24 px-6 py-4 border-b-2 border-macAccent/20 flex items-center justify-between gap-3 bg-gradient-to-br from-macPanel/40 via-macPanel/30 to-transparent backdrop-blur-xl shadow-xl">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-2xl shadow-macAccent/30 ring-2 ring-macAccent/20 flex-shrink-0">
          <MessageSquare size={26} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-macText tracking-tight truncate">Conversations</h2>
          <p className="text-xs text-macSubtext font-semibold mt-0.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></span>
            <span className="truncate">{chatCount} total chats</span>
          </p>
        </div>
      </div>

      {/* Right: Actions Group */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Toggle Button */}
        {onToggle && (
          <motion.button
            onClick={onToggle}
            className="w-10 h-10 rounded-xl liquid-glass hover:bg-macAccent/20 flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:shadow-xl border border-macBorder/40 hover:border-macAccent/60"
            title={isCollapsed ? 'Expand sidebar (⌘\\)' : 'Collapse sidebar (⌘\\)'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-macAccent"
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </motion.div>
          </motion.button>
        )}

        {/* New Chat Button */}
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
    </div>
  );
};
