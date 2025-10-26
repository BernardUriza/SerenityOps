/**
 * Command Palette (cmd+k)
 *
 * Power user navigation and action system inspired by Raycast/Spotlight
 *
 * Features:
 * - Keyboard trigger (cmd+k / ctrl+k)
 * - Fuzzy search
 * - Categorized actions (Go to, Create, Search, Settings)
 * - Keyboard navigation (arrows, enter, esc)
 * - Recent commands tracking
 * - Action previews
 *
 * SO-UI-FEAT-008
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../../icons';

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  category: 'goto' | 'create' | 'search' | 'settings' | 'ai';
  icon: string;
  keywords: string[];
  onExecute: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  onNavigate?: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Command definitions
  const commands: CommandAction[] = [
    // Navigation - Go To
    {
      id: 'goto-dashboard',
      label: 'Go to Dashboard',
      description: 'View main dashboard',
      category: 'goto',
      icon: 'home',
      keywords: ['dashboard', 'home', 'main'],
      onExecute: () => handleNavigate('/dashboard')
    },
    {
      id: 'goto-opportunities',
      label: 'Go to Opportunities',
      description: 'View job opportunities',
      category: 'goto',
      icon: 'briefcase',
      keywords: ['opportunities', 'jobs', 'applications'],
      onExecute: () => handleNavigate('/opportunities')
    },
    {
      id: 'goto-cv',
      label: 'Go to CV Builder',
      description: 'Edit your curriculum vitae',
      category: 'goto',
      icon: 'file-text',
      keywords: ['cv', 'resume', 'curriculum'],
      onExecute: () => handleNavigate('/cv')
    },
    {
      id: 'goto-chat',
      label: 'Go to AI Chat',
      description: 'Chat with SerenityOps AI',
      category: 'goto',
      icon: 'message-circle',
      keywords: ['chat', 'ai', 'assistant', 'claude'],
      onExecute: () => handleNavigate('/chat')
    },
    {
      id: 'goto-calendar',
      label: 'Go to Interview Calendar',
      description: 'View interview schedule',
      category: 'goto',
      icon: 'calendar',
      keywords: ['calendar', 'interviews', 'schedule'],
      onExecute: () => handleNavigate('/calendar')
    },
    {
      id: 'goto-pipeline',
      label: 'Go to Pipeline Funnel',
      description: 'View conversion analytics',
      category: 'goto',
      icon: 'trending-up',
      keywords: ['pipeline', 'funnel', 'analytics', 'conversion'],
      onExecute: () => handleNavigate('/pipeline')
    },

    // Create Actions
    {
      id: 'create-opportunity',
      label: 'Create New Opportunity',
      description: 'Add a new job opportunity',
      category: 'create',
      icon: 'plus',
      keywords: ['create', 'new', 'opportunity', 'job', 'add'],
      onExecute: () => handleAction('create-opportunity')
    },
    {
      id: 'create-note',
      label: 'Create Quick Note',
      description: 'Add a quick note or reminder',
      category: 'create',
      icon: 'file-plus',
      keywords: ['create', 'note', 'memo', 'reminder'],
      onExecute: () => handleAction('create-note')
    },

    // Search Actions
    {
      id: 'search-opportunities',
      label: 'Search Opportunities',
      description: 'Search through your job applications',
      category: 'search',
      icon: 'search',
      keywords: ['search', 'find', 'opportunities'],
      onExecute: () => handleAction('search-opportunities')
    },
    {
      id: 'search-companies',
      label: 'Search Companies',
      description: 'Find companies in your pipeline',
      category: 'search',
      icon: 'building',
      keywords: ['search', 'companies', 'employers'],
      onExecute: () => handleAction('search-companies')
    },

    // AI Actions
    {
      id: 'ai-cover-letter',
      label: 'Generate Cover Letter',
      description: 'Create AI-powered cover letter',
      category: 'ai',
      icon: 'sparkles',
      keywords: ['ai', 'cover', 'letter', 'generate'],
      onExecute: () => handleAction('ai-cover-letter')
    },
    {
      id: 'ai-interview-prep',
      label: 'Interview Preparation',
      description: 'Get AI assistance for interviews',
      category: 'ai',
      icon: 'brain',
      keywords: ['ai', 'interview', 'preparation', 'coaching'],
      onExecute: () => handleAction('ai-interview-prep')
    },

    // Settings
    {
      id: 'settings-theme',
      label: 'Toggle Dark Mode',
      description: 'Switch between light and dark theme',
      category: 'settings',
      icon: 'moon',
      keywords: ['theme', 'dark', 'light', 'mode'],
      onExecute: () => handleAction('toggle-theme'),
      shortcut: '⌘ D'
    },
    {
      id: 'settings-preferences',
      label: 'Open Settings',
      description: 'Configure SerenityOps preferences',
      category: 'settings',
      icon: 'settings',
      keywords: ['settings', 'preferences', 'config'],
      onExecute: () => handleNavigate('/settings'),
      shortcut: '⌘ ,'
    }
  ];

  // Filter commands based on query
  const filteredCommands = query.trim() === ''
    ? commands
    : commands.filter(cmd => {
        const searchTerms = query.toLowerCase().split(' ');
        return searchTerms.every(term =>
          cmd.label.toLowerCase().includes(term) ||
          cmd.description?.toLowerCase().includes(term) ||
          cmd.keywords.some(kw => kw.includes(term))
        );
      });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  const categoryLabels = {
    goto: 'Go to',
    create: 'Create',
    search: 'Search',
    ai: 'AI Actions',
    settings: 'Settings'
  };

  // Flatten for keyboard navigation
  const flatCommands = filteredCommands;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette with cmd+k or ctrl+k
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }

      // Navigate with arrows
      if (isOpen && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatCommands.length);
      }

      if (isOpen && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatCommands.length) % flatCommands.length);
      }

      // Execute with enter
      if (isOpen && e.key === 'Enter' && flatCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(flatCommands[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const handleAction = (actionId: string) => {
    console.log(`Executing action: ${actionId}`);
    // Add to recent commands
    setRecentCommands(prev => {
      const updated = [actionId, ...prev.filter(id => id !== actionId)].slice(0, 5);
      localStorage.setItem('serenity-recent-commands', JSON.stringify(updated));
      return updated;
    });
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const executeCommand = (command: CommandAction) => {
    command.onExecute();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none">
        <div className="w-full max-w-2xl mx-4 pointer-events-auto animate-scale-in">
          <div className="liquid-glass border border-macBorder/60 rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-macBorder/40">
              <Icon name="search" size={20} className="text-macSubtext" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-macText placeholder-macSubtext outline-none text-base"
              />
              <kbd className="px-2 py-1 text-xs font-mono bg-macBg border border-macBorder rounded">
                ESC
              </kbd>
            </div>

            {/* Commands List */}
            <div
              ref={listRef}
              className="max-h-[400px] overflow-y-auto px-2 py-2"
            >
              {flatCommands.length === 0 ? (
                <div className="py-8 text-center text-macSubtext">
                  <Icon name="search" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No commands found</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category} className="mb-4">
                    <div className="px-3 py-1 text-xs font-semibold text-macSubtext uppercase tracking-wide">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </div>
                    {cmds.map((cmd, idx) => {
                      const globalIndex = flatCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={cmd.id}
                          onClick={() => executeCommand(cmd)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            isSelected
                              ? 'bg-macAccent/10 border border-macAccent/30'
                              : 'border border-transparent hover:bg-macBg'
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-macAccent/20' : 'bg-macBg'
                          }`}>
                            <Icon name={cmd.icon} size={16} className={
                              isSelected ? 'text-macAccent' : 'text-macSubtext'
                            } />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-macText text-sm truncate">
                              {cmd.label}
                            </div>
                            {cmd.description && (
                              <div className="text-xs text-macSubtext truncate">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <kbd className="px-2 py-1 text-xs font-mono bg-macBg border border-macBorder rounded text-macSubtext">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-macBorder/40 text-xs text-macSubtext">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-macBg border border-macBorder rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-macBg border border-macBorder rounded">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-macBg border border-macBorder rounded">↵</kbd>
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-macBg border border-macBorder rounded">ESC</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
