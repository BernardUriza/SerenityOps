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
        <Loader2 size={16} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-base font-bold text-text-primary mb-1">Experience</h1>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span>{experiences.length} positions</span>
            {isSaving && (
              <span className="flex items-center gap-1 text-primary">
                <Loader2 size={12} className="animate-spin" />
                Saving...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span className="flex items-center gap-1 text-success">
                <Save size={12} />
                Saved {formatLastSaved()}
              </span>
            )}
          </div>
          {error && (
            <p className="text-xs text-error mt-1">Error: {error}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <button
            onClick={() => setEditMode(editMode === 'edit' ? 'presentation' : 'edit')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-xs transition-all
              ${editMode === 'edit'
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-surface-elevated text-text-secondary hover:bg-surface-hover'
              }
            `}
          >
            {editMode === 'edit' ? (
              <>
                <Eye size={14} />
                Preview
              </>
            ) : (
              <>
                <Edit3 size={14} />
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-success text-white rounded font-medium text-xs hover:bg-success-hover transition-colors"
            >
              <Plus size={14} />
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
            className="text-center py-8"
          >
            <p className="text-text-secondary text-sm mb-3">No experiences yet</p>
            <button
              onClick={handleAddExperience}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded font-medium text-xs hover:bg-primary-hover transition-colors"
            >
              <Plus size={14} />
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
          className="mt-3 text-center text-xs text-text-tertiary"
        >
          <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded">Ctrl</kbd>
          {' + '}
          <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-border rounded">E</kbd>
          {' to toggle preview mode'}
        </motion.div>
      )}
    </div>
  );
};
