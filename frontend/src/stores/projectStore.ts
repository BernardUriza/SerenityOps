/**
 * Zustand store for Projects state management
 * Handles CRUD operations and persistence
 */

import { create } from 'zustand';
import type { ProjectStore, Project } from '../types/project';

const API_BASE_URL = 'http://localhost:8000/api';

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // State
  projects: [],
  isLoading: false,
  isSaving: false,
  lastSaved: undefined,
  error: undefined,

  // Actions
  addProject: (project: Project) => {
    const newProject = {
      ...project,
      id: project.id || crypto.randomUUID(),
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    }));
  },

  deleteProject: (id: string) => {
    set((state) => ({
      projects: state.projects.filter((proj) => proj.id !== id),
    }));
  },

  reorderProjects: (startIndex: number, endIndex: number) => {
    set((state) => {
      const result = Array.from(state.projects);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { projects: result };
    });
  },

  saveProjects: async () => {
    const { projects } = get();
    set({ isSaving: true, error: undefined });

    try {
      // Fetch full curriculum
      const response = await fetch(`${API_BASE_URL}/curriculum`);
      if (!response.ok) throw new Error('Failed to fetch curriculum');

      const curriculum = await response.json();

      // Update projects in curriculum
      const updatedCurriculum = {
        ...curriculum,
        projects: projects.map(({ id, ...proj }) => proj), // Remove id for backend
      };

      // Save updated curriculum
      const saveResponse = await fetch(`${API_BASE_URL}/curriculum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCurriculum),
      });

      if (!saveResponse.ok) throw new Error('Failed to save projects');

      set({ isSaving: false, lastSaved: new Date(), error: undefined });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isSaving: false, error: errorMessage });
    }
  },

  loadProjects: async () => {
    set({ isLoading: true, error: undefined });

    try {
      const response = await fetch(`${API_BASE_URL}/curriculum`);
      if (!response.ok) throw new Error('Failed to load projects');

      const curriculum = await response.json();
      const projects = (curriculum.projects || []).map((proj: Project) => ({
        ...proj,
        id: crypto.randomUUID(), // Generate client-side IDs
      }));

      set({ projects, isLoading: false, error: undefined });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ isLoading: false, error: errorMessage });
    }
  },
}));
