/**
 * Zustand store for Experience state management
 * Handles CRUD operations, auto-save, and edit mode toggling
 */

import { create } from 'zustand';
import type { ExperienceStore, Experience } from '../types/experience';

const API_BASE_URL = 'http://localhost:8000/api';

export const useExperienceStore = create<ExperienceStore>((set, get) => ({
  // State
  experiences: [],
  editMode: 'edit',
  isLoading: false,
  isSaving: false,
  lastSaved: undefined,
  error: undefined,

  // Actions
  addExperience: (experience: Experience) => {
    const newExperience = {
      ...experience,
      id: experience.id || crypto.randomUUID(),
    };
    set((state) => ({
      experiences: [...state.experiences, newExperience],
    }));
  },

  updateExperience: (id: string, updates: Partial<Experience>) => {
    set((state) => ({
      experiences: state.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  },

  deleteExperience: (id: string) => {
    set((state) => ({
      experiences: state.experiences.filter((exp) => exp.id !== id),
    }));
  },

  reorderExperiences: (startIndex: number, endIndex: number) => {
    set((state) => {
      const result = Array.from(state.experiences);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { experiences: result };
    });
  },

  setEditMode: (mode: 'edit' | 'presentation') => {
    set({ editMode: mode });
  },

  saveExperiences: async () => {
    const { experiences } = get();
    set({ isSaving: true, error: undefined });

    try {
      // Fetch full curriculum
      const response = await fetch(`${API_BASE_URL}/curriculum`);
      if (!response.ok) throw new Error('Failed to fetch curriculum');

      const curriculum = await response.json();

      // Update experiences in curriculum
      const updatedCurriculum = {
        ...curriculum,
        experience: experiences.map(({ id, ...exp }) => exp), // Remove id for backend
      };

      // Save updated curriculum
      const saveResponse = await fetch(`${API_BASE_URL}/curriculum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCurriculum),
      });

      if (!saveResponse.ok) throw new Error('Failed to save experiences');

      set({ isSaving: false, lastSaved: new Date(), error: undefined });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
    }
  },

  loadExperiences: async () => {
    set({ isLoading: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/curriculum`);
      if (!response.ok) throw new Error('Failed to load experiences');

      const curriculum = await response.json();
      const experiences = (curriculum.experience || []).map((exp: Experience) => ({
        ...exp,
        id: crypto.randomUUID(), // Generate client-side IDs
      }));

      set({ experiences, isLoading: false, error: undefined });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isLoading: false, error: errorMessage });
    }
  },
}));
