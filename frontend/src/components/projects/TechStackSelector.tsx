"use client";

/**
 * TechStackSelector - Adds/removes tech stack items with search
 * Similar to TagSelector but optimized for projects
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { TechBadge } from './TechBadge';

interface TechStackSelectorProps {
  techStack: string[];
  onChange: (techStack: string[]) => void;
  className?: string;
}

interface TechIcon {
  name: string;
  emoji?: string;
  svg_url?: string;
  color?: string;
  category?: string;
}

export const TechStackSelector: React.FC<TechStackSelectorProps> = ({
  techStack,
  onChange,
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TechIcon[]>([]);

  // Search for icons
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchIcons = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/icons?query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('Icon search failed:', error);
      }
    };

    const debounce = setTimeout(searchIcons, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleAddTech = (techName: string) => {
    if (!techStack.includes(techName)) {
      onChange([...techStack, techName]);
    }
    setIsAdding(false);
    setSearchQuery('');
  };

  const handleRemoveTech = (tech: string) => {
    onChange(techStack.filter(t => t !== tech));
  };

  const handleManualAdd = () => {
    const tech = searchQuery.trim();
    if (tech && !techStack.includes(tech)) {
      onChange([...techStack, tech]);
    }
    setIsAdding(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleAddTech(searchResults[0].name);
      } else if (searchQuery.trim()) {
        handleManualAdd();
      }
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setSearchQuery('');
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-1 items-center">
        {/* Existing tech stack badges */}
        <AnimatePresence mode="popLayout">
          {techStack.map((tech) => (
            <TechBadge
              key={tech}
              tech={tech}
              onRemove={() => handleRemoveTech(tech)}
              editable={true}
              size="md"
            />
          ))}
        </AnimatePresence>

        {/* Add tech button/search */}
        {!isAdding ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 border-dashed rounded-mac text-xs text-macSubtext hover:text-macAccent hover:border-sky-500 transition-all duration-300 ease-mac"
          >
            <Plus size={11} />
            <span>Add tech</span>
          </motion.button>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-macPanel/70 backdrop-blur-md border border-sky-500 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
              <Search size={11} className="text-macAccent" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  setTimeout(() => {
                    setIsAdding(false);
                    setSearchQuery('');
                  }, 200);
                }}
                placeholder="Search tech..."
                className="bg-transparent outline-none text-xs text-macText w-32"
                autoFocus
              />
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-64 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] z-10 max-h-64 overflow-y-auto"
              >
                {searchResults.map((result) => (
                  <button
                    key={result.name}
                    onClick={() => handleAddTech(result.name)}
                    className="w-full flex items-center gap-1 px-3 py-1 hover:bg-macHover/60 text-left transition-all duration-300 ease-mac"
                  >
                    {result.svg_url ? (
                      <img
                        src={result.svg_url}
                        alt={result.name}
                        className="w-3 h-3"
                        style={{ filter: 'brightness(0.9)' }}
                      />
                    ) : result.emoji ? (
                      <span className="text-xs">{result.emoji}</span>
                    ) : null}
                    <span className="text-xs text-macText">{result.name}</span>
                    <span className="ml-auto text-xs text-macSubtext">{result.category}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
