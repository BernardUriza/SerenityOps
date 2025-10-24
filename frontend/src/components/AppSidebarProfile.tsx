/**
 * AppSidebarProfile - User profile section for main sidebar
 * 2026 Trend: Account management prominently displayed
 * Shows avatar, name, and account menu
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronUp } from 'lucide-react';

interface AppSidebarProfileProps {
  isCollapsed: boolean;
}

export const AppSidebarProfile: React.FC<AppSidebarProfileProps> = ({ isCollapsed }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock user data - in real app, this would come from auth context
  const user = {
    name: 'Bernard Orozco',
    email: 'bernard@serenityops.com',
    avatar: null, // Could be URL or null for initials
    role: 'Software Engineer'
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: LogOut, label: 'Sign Out', action: () => console.log('Sign out'), danger: true },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`w-full flex items-center transition-all duration-300 group relative ${
          isCollapsed ? 'justify-center p-2' : 'justify-between p-4 gap-3'
        } hover:bg-macHover/60 rounded-2xl border-2 border-transparent hover:border-macAccent/40`}
      >
        {/* Avatar */}
        <div className={`flex items-center gap-3 ${isCollapsed ? '' : 'flex-1 min-w-0'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-xl ring-2 ring-macAccent/30">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <span className="text-white font-black text-sm">{getUserInitials(user.name)}</span>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-macPanel shadow-lg shadow-green-500/50 animate-pulse"></div>
          </div>

          {/* User Info - Only when expanded */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-sm font-bold text-macText truncate">{user.name}</p>
                <p className="text-xs text-macSubtext truncate">{user.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chevron - Only when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: isMenuOpen ? 180 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronUp size={16} className="text-macSubtext" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <span className="absolute left-full ml-4 px-4 py-2.5 liquid-glass-accent rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none z-tooltip shadow-2xl shadow-macAccent/40 border-2 border-macAccent/30">
            {user.name}
          </span>
        )}
      </button>

      {/* Dropdown Menu - Only when expanded */}
      <AnimatePresence>
        {isMenuOpen && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 right-0 mb-2 liquid-glass rounded-2xl overflow-hidden shadow-2xl border-2 border-macBorder/40"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  item.danger
                    ? 'text-error hover:bg-error/10'
                    : 'text-macText hover:bg-macHover/60'
                } ${index > 0 ? 'border-t border-macBorder/30' : ''}`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
