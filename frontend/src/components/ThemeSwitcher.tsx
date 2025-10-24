/**
 * ThemeSwitcher - Theme toggle component for sidebar
 * 2026 Trend: Mode switching (dark/light) for accessibility and preference
 * Includes animated icon transitions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSwitcherProps {
  isCollapsed: boolean;
}

type Theme = 'light' | 'dark' | 'system';

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isCollapsed }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('serenity-theme');
    return (saved as Theme) || 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('serenity-theme', theme);
    // In a real app, this would apply theme to document.documentElement
    // For now, we're just persisting the preference
    console.log('Theme changed to:', theme);
  }, [theme]);

  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1];
  const Icon = currentTheme.icon;

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`w-full h-12 flex items-center transition-all duration-300 group relative rounded-2xl border-2 border-transparent hover:border-macAccent/40 ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4 gap-3'
        } hover:bg-macHover/60`}
        title={`Theme: ${currentTheme.label}`}
      >
        {/* Icon with glow effect */}
        <div className="relative flex-shrink-0">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
              theme === 'light'
                ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 text-yellow-500'
                : theme === 'dark'
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400'
                : 'bg-gradient-to-br from-cyan-400/20 to-blue-400/20 text-cyan-400'
            }`}
          >
            <Icon size={18} className="drop-shadow-[0_0_8px_currentColor]" />
          </motion.div>
          <div className={`absolute inset-0 blur-xl opacity-50 ${
            theme === 'light' ? 'bg-yellow-400' : theme === 'dark' ? 'bg-purple-500' : 'bg-cyan-400'
          }`}></div>
        </div>

        {/* Label - Only when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 text-left"
            >
              <p className="text-sm font-bold text-macText">{currentTheme.label} Mode</p>
              <p className="text-xs text-macSubtext">Theme</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <span className="absolute left-full ml-4 px-4 py-2.5 liquid-glass-accent rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none z-tooltip shadow-2xl shadow-macAccent/40 border-2 border-macAccent/30">
            {currentTheme.label} Mode
          </span>
        )}
      </button>

      {/* Theme Menu - Only when expanded */}
      <AnimatePresence>
        {isMenuOpen && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 liquid-glass rounded-2xl overflow-hidden shadow-2xl border-2 border-macBorder/40"
          >
            {themes.map((themeOption, index) => {
              const ThemeIcon = themeOption.icon;
              const isActive = theme === themeOption.value;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-macAccent/20 text-macAccent'
                      : 'text-macText hover:bg-macHover/60'
                  } ${index > 0 ? 'border-t border-macBorder/30' : ''}`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${
                    themeOption.value === 'light'
                      ? 'bg-yellow-400/10 text-yellow-500'
                      : themeOption.value === 'dark'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-cyan-400/10 text-cyan-400'
                  }`}>
                    <ThemeIcon size={14} />
                  </div>
                  <span className="text-sm font-semibold flex-1">{themeOption.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-macAccent shadow-lg shadow-macAccent/50"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
