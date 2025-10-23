"use client";

/**
 * AchievementsEditor - Manages project achievements with inline editing
 * Reuses logic from Experience AchievementBadge but styled for projects
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';

interface AchievementsEditorProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
  className?: string;
}

export const AchievementsEditor: React.FC<AchievementsEditorProps> = ({
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
    <div className={`space-y-2 ${className}`}>
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
              <div className="flex items-start gap-2 p-2 bg-slate-800 border border-sky-500 rounded-lg">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'edit')}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-200 resize-none"
                  rows={2}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-2 pl-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                <span className="text-sky-400 mt-1">•</span>
                <p
                  className="flex-1 text-sm text-slate-300 cursor-pointer"
                  onClick={() => handleEdit(index)}
                >
                  {achievement}
                </p>
                <button
                  onClick={() => handleDelete(index)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                >
                  <X size={14} />
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
          className="flex items-start gap-2 p-2 bg-slate-800 border border-sky-500 rounded-lg"
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
            placeholder="Describe a key achievement or impact..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-200 resize-none"
            rows={2}
            autoFocus
          />
          <button
            onClick={handleAdd}
            className="p-1 text-green-400 hover:bg-green-400/10 rounded transition-colors"
          >
            <Check size={16} />
          </button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 p-2 bg-slate-800/30 border border-slate-700 border-dashed rounded-lg text-sm text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors"
        >
          <Plus size={14} />
          <span>Add achievement</span>
        </motion.button>
      )}
    </div>
  );
};
