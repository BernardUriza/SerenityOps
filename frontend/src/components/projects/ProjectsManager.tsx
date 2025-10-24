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
        <Loader2 size={16} className="animate-spin text-macAccent" />
      </div>
    );
  }

  return (
    <div className="animate-scale-in space-y-8 relative">
      {/* Decorative gradient orbs */}
      <div className="gradient-orb fixed top-[8%] right-[12%] w-[600px] h-[600px] bg-cyan-500/15 -z-10"></div>
      <div className="gradient-orb fixed bottom-[15%] left-[8%] w-[500px] h-[500px] bg-purple-500/12 -z-10" style={{ animationDelay: '3s' }}></div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
            <svg className="w-7 h-7 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Projects</h1>
            <div className="flex items-center gap-3 text-sm text-macSubtext">
              <span>{projects.length} innovative projects</span>
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddProject}
          className="flex items-center gap-2 px-6 py-3 gradient-accent text-white rounded-xl font-semibold text-sm hover:shadow-accent transition-all duration-300 ease-mac hover-lift group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
          <Plus size={16} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
          <span className="relative z-10">Add Project</span>
        </motion.button>
      </div>

      {/* Projects list */}
      <div className="space-y-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 liquid-glass rounded-2xl relative overflow-hidden"
            >
              <div className="gradient-orb absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 gradient-accent-subtle rounded-2xl flex items-center justify-center animate-float">
                  <svg className="w-10 h-10 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-macText mb-2">No projects yet</h3>
                <p className="text-macSubtext text-sm leading-relaxed max-w-md mx-auto mb-6">
                  Showcase your technical achievements and innovative solutions
                </p>
                <button
                  onClick={handleAddProject}
                  className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-white rounded-xl font-semibold text-sm hover:shadow-accent transition-all duration-300 ease-mac hover-lift group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
                  <Plus size={16} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="relative z-10">Add Your First Project</span>
                </button>
              </div>
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
      </div>

      {/* Keyboard hint */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center text-sm text-macSubtext relative z-10"
        >
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Auto-saved after 3 seconds of inactivity
          </span>
        </motion.div>
      )}
    </div>
  );
};
