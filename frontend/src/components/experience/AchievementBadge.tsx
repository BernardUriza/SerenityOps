"use client";

/**
 * AchievementBadge - Displays and manages achievement chips
 * Supports add/edit/delete with animations
 * GitHub dark theme styling
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';

interface AchievementBadgeProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievements,
  onChange,
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newAchievement.trim()) {
      onChange([...achievements, newAchievement.trim()]);
      setNewAchievement('');
      setIsAdding(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(achievements[index]);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editingIndex !== null) {
      const updated = [...achievements];
      updated[editingIndex] = editValue.trim();
      onChange(updated);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleDelete = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'add') {
        handleAdd();
      } else {
        handleSaveEdit();
      }
    } else if (e.key === 'Escape') {
      if (action === 'add') {
        setIsAdding(false);
        setNewAchievement('');
      } else {
        setEditingIndex(null);
        setEditValue('');
      }
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <AnimatePresence mode="popLayout">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="group"
          >
            {editingIndex === index ? (
              <div className="flex items-start gap-1 p-1.5 bg-surface-elevated border border-primary rounded">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'edit')}
                  className="flex-1 bg-transparent outline-none text-xs text-text-primary resize-none"
                  rows={2}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-0.5 text-success hover:bg-success/10 rounded transition-colors"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="p-0.5 text-error hover:bg-error/10 rounded transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 p-1.5 pl-2 bg-surface-elevated/50 border border-border rounded hover:border-border-strong transition-colors">
                <span className="text-success text-xs mt-0.5">•</span>
                <p
                  className="flex-1 text-xs text-text-secondary cursor-pointer"
                  onClick={() => handleEdit(index)}
                >
                  {achievement}
                </p>
                <button
                  onClick={() => handleDelete(index)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-text-tertiary hover:text-error transition-all"
                >
                  <X size={11} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add new achievement */}
      {isAdding ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-1 p-1.5 bg-surface-elevated border border-primary rounded"
        >
          <textarea
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            onBlur={() => {
              setTimeout(() => {
                if (!newAchievement.trim()) {
                  setIsAdding(false);
                }
              }, 200);
            }}
            placeholder="Describe a quantifiable achievement..."
            className="flex-1 bg-transparent outline-none text-xs text-text-primary resize-none"
            rows={2}
            autoFocus
          />
          <button
            onClick={handleAdd}
            className="p-0.5 text-success hover:bg-success/10 rounded transition-colors"
          >
            <Check size={12} />
          </button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-1 p-1.5 bg-surface-elevated/30 border border-border border-dashed rounded text-xs text-text-tertiary hover:text-primary hover:border-primary transition-colors"
        >
          <Plus size={11} />
          <span>Add achievement</span>
        </motion.button>
      )}
    </div>
  );
};
