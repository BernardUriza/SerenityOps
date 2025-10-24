"use client";

/**
 * ProjectsManager - Main orchestrator for projects
 * Manages project list with Zustand store and auto-save
 */

import React, { useEffect } from 'react';
import { Plus, Loader2, Save } from 'lucide-react';
import { Icon } from '../../icons';
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
        <Loader2 size={16} className="text-macAccent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative p-6">
      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
            <Icon name="rocket" size={28} className="text-macAccent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Projects</h1>
            <div className="flex items-center gap-3 text-sm text-macSubtext">
              <span>{projects.length} innovative projects</span>
              {isSaving && (
                <span className="flex items-center gap-1.5 text-macAccent">
                  <Loader2 size={14} />
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

        <button
          onClick={handleAddProject}
          className="flex items-center gap-2 px-6 py-3 gradient-accent text-white rounded-xl font-semibold text-sm hover:shadow-accent"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects list */}
      <div className="space-y-6 relative z-10">
        {projects.length === 0 ? (
          <div className="text-center py-20 liquid-glass rounded-2xl relative overflow-hidden">
            <div className="gradient-orb absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 gradient-accent-subtle rounded-2xl flex items-center justify-center">
                <Icon name="rocket" size={40} className="text-macAccent" />
              </div>
              <h3 className="text-lg font-semibold text-macText mb-2">No projects yet</h3>
              <p className="text-macSubtext text-sm leading-relaxed max-w-md mx-auto mb-6">
                Showcase your technical achievements and innovative solutions
              </p>
              <button
                onClick={handleAddProject}
                className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-white rounded-xl font-semibold text-sm hover:shadow-accent"
              >
                <Plus size={16} />
                <span>Add Your First Project</span>
              </button>
            </div>
          </div>
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
      </div>

      {/* Keyboard hint */}
      {projects.length > 0 && (
        <div className="mt-8 text-center text-sm text-macSubtext relative z-10">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Auto-saved after 3 seconds of inactivity
          </span>
        </div>
      )}
    </div>
  );
};
