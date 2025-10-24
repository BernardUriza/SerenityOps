/**
 * SidebarToggle - Toggle button for collapsing sidebar
 * 2026 Trend: Smooth collapsible navigation
 */

import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  onToggle,
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-macSubtext hover:text-macAccent hover:bg-macAccent/10 transition-all duration-300 ease-mac focus:outline-none focus:ring-2 focus:ring-macAccent/50"
      title={isCollapsed ? 'Expand sidebar (⌘\\)' : 'Collapse sidebar (⌘\\)'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {isCollapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <PanelLeftClose size={18} />
        )}
      </motion.div>
    </motion.button>
  );
};
