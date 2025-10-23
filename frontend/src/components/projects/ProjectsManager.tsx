"use client";

/**
 * ProjectsManager - Main orchestrator for projects
 * Manages project list with Zustand store and auto-save
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Save, Rocket } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useAutoSave } from '../../hooks/useAutoSave';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../../types/project';

export const ProjectsManager: React.FC = () => {
  const {
    projects,
    isLoading,
    isSaving,
    lastSaved,
    error,
    addProject,
    updateProject,
    deleteProject,
    loadProjects,
  } = useProjectStore();

  // Initialize auto-save
  useAutoSave(3000);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleAddProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: 'New Project',
      tagline: 'Brief description of what this project does',
      description: 'Detailed description of the project, its purpose, and impact...',
      role: 'Your Role',
      tech_stack: [],
      achievements: [],
      github_url: '',
      live_url: '',
    };
    addProject(newProject);
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
          <div className="flex items-center gap-3">
            <Rocket size={28} className="text-sky-400" />
            <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-2">
            <span>{projects.length} projects</span>
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddProject}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-lg"
        >
          <Plus size={16} />
          Add Project
        </motion.button>
      </div>

      {/* Projects list */}
      <AnimatePresence mode="popLayout">
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <Rocket size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-4">No projects yet</p>
            <button
              onClick={handleAddProject}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
            >
              <Plus size={18} />
              Add Your First Project
            </button>
          </motion.div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={(updates) => updateProject(project.id!, updates)}
              onDelete={() => deleteProject(project.id!)}
            />
          ))
        )}
      </AnimatePresence>

      {/* Helper text */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center text-sm text-slate-500"
        >
          Projects auto-save after 3 seconds of inactivity
        </motion.div>
      )}
    </div>
  );
};
