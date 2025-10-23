"use client";

/**
 * TagSelector - Tech stack tag selector with icon search
 * Fetches icons from backend API
 * Displays emoji + logo with animated hover states
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search } from 'lucide-react';
import type { TechIcon } from '../../types/experience';

interface TagSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  onChange,
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TechIcon[]>([]);
  const [tagIcons, setTagIcons] = useState<Record<string, TechIcon>>({});

  // Fetch icons for existing tags
  useEffect(() => {
    const fetchTagIcons = async () => {
      const icons: Record<string, TechIcon> = {};

      for (const tag of tags) {
        if (!tagIcons[tag]) {
          try {
            const response = await fetch(`http://localhost:8000/api/icons/${tag}`);
            if (response.ok) {
              const data = await response.json();
              icons[tag] = data;
            }
          } catch (error) {
            console.error(`Failed to fetch icon for ${tag}:`, error);
          }
        }
      }

      setTagIcons(prev => ({ ...prev, ...icons }));
    };

    if (tags.length > 0) {
      fetchTagIcons();
    }
  }, [tags]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleAddTag = (tagName: string, icon: TechIcon) => {
    if (!tags.includes(tagName)) {
      onChange([...tags, tagName]);
      setTagIcons(prev => ({ ...prev, [tagName]: icon }));
    }
    setIsAdding(false);
    setSearchQuery('');
  };

  const handleRemoveTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      {/* Existing tags */}
      <AnimatePresence mode="popLayout">
        {tags.map((tag) => {
          const icon = tagIcons[tag];
          return (
            <motion.div
              key={tag}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 px-3 py-2 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac text-xs group shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-mac"
              style={{ borderColor: icon?.color ? `${icon.color}40` : undefined }}
            >
              {icon?.emoji && <span className="text-sm">{icon.emoji}</span>}
              {icon?.svg_url && (
                <img
                  src={icon.svg_url}
                  alt={tag}
                  className="w-3 h-3"
                  style={{ filter: 'brightness(0.9)' }}
                />
              )}
              <span className="text-macText">{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-0.5 text-macSubtext hover:text-error transition-all duration-300 ease-mac opacity-0 group-hover:opacity-100"
              >
                <X size={11} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add tag button/search */}
      {!isAdding ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 border-dashed rounded-mac text-xs text-macSubtext hover:text-macAccent hover:border-macAccent transition-all duration-300 ease-mac"
        >
          <Plus size={11} />
          <span>Add tech</span>
        </motion.button>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-4 px-3 py-2 bg-macPanel/70 backdrop-blur-md border border-macAccent rounded-mac shadow-[inset_0_0_6px_rgba(10,132,255,0.1)]">
            <Search size={11} className="text-macAccent" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                setTimeout(() => {
                  setIsAdding(false);
                  setSearchQuery('');
                }, 200);
              }}
              placeholder="Search tech..."
              className="bg-transparent outline-none text-xs text-macText w-24"
              autoFocus
            />
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-2 w-56 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] z-10 max-h-48 overflow-y-auto"
            >
              {searchResults.map((result) => (
                <button
                  key={result.name}
                  onClick={() => handleAddTag(result.name, result)}
                  className="w-full flex items-center gap-4 px-3 py-2 hover:bg-macHover/60 text-left transition-all duration-300 ease-mac"
                >
                  {result.emoji && <span className="text-sm">{result.emoji}</span>}
                  {result.svg_url && (
                    <img
                      src={result.svg_url}
                      alt={result.name}
                      className="w-4 h-4"
                      style={{ filter: 'brightness(0.9)' }}
                    />
                  )}
                  <span className="text-xs text-macText">{result.name}</span>
                  <span className="ml-auto text-[10px] text-macSubtext">{result.category}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
