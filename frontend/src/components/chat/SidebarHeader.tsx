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
    <div className={`h-16 border-b border-macBorder/30 flex items-center bg-gradient-to-br from-macPanel/40 via-macPanel/30 to-transparent backdrop-blur-xl ${
      isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-4 py-3 gap-3'
    }`}>
      {/* Left: Logo + Title - Only shown when expanded */}
      {!isCollapsed && (
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-macAccent/20 flex-shrink-0">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-macText tracking-tight">Conversations</h2>
            <p className="text-[10px] text-macSubtext font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
              <span className="whitespace-nowrap">{chatCount} total chats</span>
            </p>
          </div>
        </div>
      )}

      {/* Right: Actions Group */}
      <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col' : 'flex-shrink-0'}`}>
        {/* Toggle Button */}
        {onToggle && (
          <motion.button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg liquid-glass hover:bg-macAccent/20 flex items-center justify-center transition-all duration-200 border border-macBorder/30 hover:border-macAccent/50"
            title={isCollapsed ? 'Expand sidebar (⌘\\)' : 'Collapse sidebar (⌘\\)'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-macAccent"
            >
              {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </motion.div>
          </motion.button>
        )}

        {/* New Chat Button - Only shown when expanded */}
        {!isCollapsed && (
          <IconButton
            icon={Plus}
            size="md"
            variant="accent"
            tooltip="New Chat (⌘N)"
            onClick={onNewChat}
            loading={loading}
            className="gradient-accent text-white shadow-lg shadow-macAccent/30 hover:shadow-macAccent/50 transition-all duration-200"
          />
        )}
      </div>
    </div>
  );
};
