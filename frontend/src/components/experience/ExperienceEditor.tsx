"use client";

/**
 * ExperienceEditor - Main editor component
 * Manages experience list with Zustand store
 * Supports edit/presentation modes, auto-save, and keyboard shortcuts
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Edit3, Save, Loader2 } from 'lucide-react';
import { useExperienceStore } from '../../stores/experienceStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { ExperienceCard } from './ExperienceCard';
import type { Experience } from '../../types/experience';

export const ExperienceEditor: React.FC = () => {
  const {
    experiences,
    editMode,
    isLoading,
    isSaving,
    lastSaved,
    error,
    addExperience,
    updateExperience,
    deleteExperience,
    setEditMode,
    loadExperiences,
  } = useExperienceStore();

  // Initialize auto-save
  useAutoSave(3000);

  // Load experiences on mount
  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  // Keyboard shortcut: Ctrl+E to toggle mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setEditMode(editMode === 'edit' ? 'presentation' : 'edit');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, setEditMode]);

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: 'Company Name',
      role: 'Your Role',
      location: 'Location',
      start_date: new Date().toISOString().slice(0, 7),
      end_date: '',
      current: true,
      description: 'Describe your responsibilities and impact...',
      achievements: [],
      tech_stack: [],
    };
    addExperience(newExperience);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastSaved.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Experience</h1>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{experiences.length} positions</span>
            {isSaving && (
              <span className="flex items-center gap-1 text-sky-400">
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span className="flex items-center gap-1 text-emerald-400">
                <Save size={14} />
                Saved {formatLastSaved()}
              </span>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-400 mt-2">Error: {error}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <button
            onClick={() => setEditMode(editMode === 'edit' ? 'presentation' : 'edit')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${editMode === 'edit'
                ? 'bg-sky-500 text-white hover:bg-sky-600'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }
            `}
          >
            {editMode === 'edit' ? (
              <>
                <Eye size={16} />
                Preview
              </>
            ) : (
              <>
                <Edit3 size={16} />
                Edit
              </>
            )}
          </button>

          {/* Add button (only in edit mode) */}
          {editMode === 'edit' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddExperience}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              <Plus size={16} />
              Add Experience
            </motion.button>
          )}
        </div>
      </div>

      {/* Experience list */}
      <AnimatePresence mode="popLayout">
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-slate-400 text-lg mb-4">No experiences yet</p>
            <button
              onClick={handleAddExperience}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
            >
              <Plus size={18} />
              Add Your First Experience
            </button>
          </motion.div>
        ) : (
          experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onUpdate={(updates) => updateExperience(exp.id!, updates)}
              onDelete={() => deleteExperience(exp.id!)}
              editMode={editMode}
            />
          ))
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {editMode === 'edit' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center text-sm text-slate-500"
        >
          <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded">Ctrl</kbd>
          {' + '}
          <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded">E</kbd>
          {' to toggle preview mode'}
        </motion.div>
      )}
    </div>
  );
};
