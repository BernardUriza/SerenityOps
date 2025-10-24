"use client";

/**
 * ExperienceEditor - Main editor component
 * Manages experience list with Zustand store
 * Supports edit/presentation modes, auto-save, and keyboard shortcuts
 */

import React, { useEffect } from 'react';
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
        <Loader2 size={16} className="animate-spin text-macAccent" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative gradient orbs - animations disabled */}
      <div className="fixed top-[8%] right-[12%] w-[600px] h-[600px] bg-purple-500/15 -z-10 blur-[100px]"></div>
      <div className="fixed bottom-[15%] left-[8%] w-[500px] h-[500px] bg-cyan-500/12 -z-10 blur-[100px]"></div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Experience</h1>
            <div className="flex items-center gap-3 text-sm text-macSubtext">
              <span>{experiences.length} professional positions</span>
              {isSaving && (
                <span className="flex items-center gap-1.5 text-macAccent">
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </span>
              )}
              {!isSaving && lastSaved && (
                <span className="flex items-center gap-1.5 text-success">
                  <Save size={14} />
                  Saved {formatLastSaved()}
                </span>
              )}
            </div>
            {error && (
              <p className="text-sm text-error mt-1">Error: {error}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <button
            onClick={() => setEditMode(editMode === 'edit' ? 'presentation' : 'edit')}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ease-mac backdrop-blur-md hover-lift bounce-click ripple-effect
              ${editMode === 'edit'
                ? 'liquid-glass-accent text-white shadow-accent'
                : 'liquid-glass text-macText hover:liquid-glass-accent'
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
            <button
              onClick={handleAddExperience}
              className="flex items-center gap-2 px-6 py-3 gradient-accent text-white rounded-xl font-semibold text-sm hover:shadow-accent transition-all duration-300 ease-mac"
            >
              <Plus size={16} />
              <span>Add Experience</span>
            </button>
          )}
        </div>
      </div>

      {/* Experience list */}
      <div className="relative z-10" style={{ marginTop: '2rem' }}>
        {experiences.length === 0 ? (
          <div className="text-center py-20 liquid-glass rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-macAccent/10 blur-[100px]"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 gradient-accent-subtle rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-macText mb-2">No experiences yet</h3>
              <p className="text-macSubtext text-sm leading-relaxed max-w-md mx-auto mb-6">
                Click the button below to add your first professional experience
              </p>
              <button
                onClick={handleAddExperience}
                className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-white rounded-xl font-semibold text-sm hover:shadow-accent transition-all duration-300 ease-mac"
              >
                <Plus size={16} />
                <span>Add Your First Experience</span>
              </button>
            </div>
          </div>
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
      </div>

      {/* Keyboard hint */}
      {editMode === 'edit' && (
        <div
          className="text-center text-sm text-macSubtext relative z-10"
          style={{ marginTop: '2rem' }}
        >
          <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-md font-semibold">Ctrl</kbd>
          {' + '}
          <kbd className="px-3 py-1.5 liquid-glass backdrop-blur-md rounded-mac shadow-md font-semibold">E</kbd>
          {' to toggle preview mode'}
        </div>
      )}
    </div>
  );
};
