"use client";

/**
 * ProjectCard - Individual project card with inline editing
 * GitHub dark theme, expandable, with tech stack logos
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ChevronDown, ChevronUp, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../../types/project';
import { TechStackSelector } from './TechStackSelector';
import { AchievementsEditor } from './AchievementsEditor';

interface ProjectCardProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFieldBlur = (field: string, value: string) => {
    if (value.trim() !== project[field as keyof Project]) {
      onUpdate({ [field]: value.trim() });
    }
    setEditingField(null);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6 shadow-lg shadow-slate-800/50 hover:border-slate-700 transition-colors"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={project.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            onFocus={() => setEditingField('name')}
            onBlur={(e) => handleFieldBlur('name', e.target.value)}
            className={`text-xl font-bold bg-transparent outline-none w-full transition-colors ${
              editingField === 'name'
                ? 'text-sky-400 ring-2 ring-sky-500/50 rounded px-2 py-1'
                : 'text-slate-100'
            }`}
            placeholder="Project Name"
          />

          <input
            type="text"
            value={project.tagline}
            onChange={(e) => onUpdate({ tagline: e.target.value })}
            onFocus={() => setEditingField('tagline')}
            onBlur={(e) => handleFieldBlur('tagline', e.target.value)}
            className={`text-sm font-medium block mt-1 bg-transparent outline-none w-full transition-colors ${
              editingField === 'tagline'
                ? 'text-sky-400 ring-2 ring-sky-500/50 rounded px-2 py-1'
                : 'text-slate-400'
            }`}
            placeholder="Short tagline or description"
          />

          {/* Links */}
          <div className="flex items-center gap-3 mt-2 text-xs">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors"
              >
                <Github size={12} />
                <span>GitHub</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink size={12} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Your Role</label>
            <input
              type="text"
              value={project.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              onFocus={() => setEditingField('role')}
              onBlur={(e) => handleFieldBlur('role', e.target.value)}
              className={`w-full bg-transparent outline-none text-sm transition-colors ${
                editingField === 'role'
                  ? 'text-sky-400 ring-2 ring-sky-500/50 rounded px-2 py-1'
                  : 'text-slate-300'
              }`}
              placeholder="e.g., Full Stack Developer, Lead Engineer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              onFocus={() => setEditingField('description')}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              className={`w-full bg-transparent outline-none text-sm leading-relaxed resize-none transition-colors ${
                editingField === 'description'
                  ? 'text-sky-400 ring-2 ring-sky-500/50 rounded px-2 py-1'
                  : 'text-slate-300'
              }`}
              rows={3}
              placeholder="Describe the project, its purpose, and impact..."
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Tech Stack</label>
            <TechStackSelector
              techStack={project.tech_stack}
              onChange={(tech_stack) => onUpdate({ tech_stack })}
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Key Achievements</label>
            <AchievementsEditor
              achievements={project.achievements}
              onChange={(achievements) => onUpdate({ achievements })}
            />
          </div>

          {/* Links (editable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">GitHub URL</label>
              <input
                type="url"
                value={project.github_url || ''}
                onChange={(e) => onUpdate({ github_url: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-sky-500 transition-colors"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Live URL</label>
              <input
                type="url"
                value={project.live_url || ''}
                onChange={(e) => onUpdate({ live_url: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-sky-500 transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
