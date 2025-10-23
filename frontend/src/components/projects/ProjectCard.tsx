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
      className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac p-1.5 mb-4 shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:border-macBorder/40 transition-all duration-300 ease-mac"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1">
          <input
            type="text"
            value={project.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            onFocus={() => setEditingField('name')}
            onBlur={(e) => handleFieldBlur('name', e.target.value)}
            className={`text-xs font-bold bg-transparent outline-none w-full transition-all duration-300 ease-mac ${
              editingField === 'name'
                ? 'text-macAccent ring-2 ring-sky-500/50 rounded-mac px-3 py-2'
                : 'text-macText'
            }`}
            placeholder="Project Name"
          />

          <input
            type="text"
            value={project.tagline}
            onChange={(e) => onUpdate({ tagline: e.target.value })}
            onFocus={() => setEditingField('tagline')}
            onBlur={(e) => handleFieldBlur('tagline', e.target.value)}
            className={`text-xs font-medium block mt-2 bg-transparent outline-none w-full transition-all duration-300 ease-mac ${
              editingField === 'tagline'
                ? 'text-macAccent ring-2 ring-sky-500/50 rounded-mac px-3 py-2'
                : 'text-macSubtext'
            }`}
            placeholder="Short tagline or description"
          />

          {/* Links */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-macSubtext hover:text-macAccent transition-all duration-300 ease-mac"
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
                className="flex items-center gap-1 text-macSubtext hover:text-success transition-all duration-300 ease-mac"
              >
                <ExternalLink size={12} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-macSubtext hover:text-macText hover:bg-macPanel/70 rounded-mac transition-all duration-300 ease-mac"
          >
            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-macSubtext hover:text-error hover:bg-error/10 rounded-mac transition-all duration-300 ease-mac"
          >
            <Trash2 size={11} />
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
          className="space-y-1"
        >
          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-1">Your Role</label>
            <input
              type="text"
              value={project.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              onFocus={() => setEditingField('role')}
              onBlur={(e) => handleFieldBlur('role', e.target.value)}
              className={`w-full bg-transparent outline-none text-xs transition-all duration-300 ease-mac ${
                editingField === 'role'
                  ? 'text-macAccent ring-2 ring-sky-500/50 rounded-mac px-3 py-2'
                  : 'text-macSubtext'
              }`}
              placeholder="e.g., Full Stack Developer, Lead Engineer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-1">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              onFocus={() => setEditingField('description')}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              className={`w-full bg-transparent outline-none text-xs leading-relaxed resize-none transition-all duration-300 ease-mac ${
                editingField === 'description'
                  ? 'text-macAccent ring-2 ring-sky-500/50 rounded-mac px-3 py-2'
                  : 'text-macSubtext'
              }`}
              rows={3}
              placeholder="Describe the project, its purpose, and impact..."
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-1">Tech Stack</label>
            <TechStackSelector
              techStack={project.tech_stack}
              onChange={(tech_stack) => onUpdate({ tech_stack })}
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-1">Key Achievements</label>
            <AchievementsEditor
              achievements={project.achievements}
              onChange={(achievements) => onUpdate({ achievements })}
            />
          </div>

          {/* Links (editable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <label className="block text-xs font-medium text-macSubtext mb-1">GitHub URL</label>
              <input
                type="url"
                value={project.github_url || ''}
                onChange={(e) => onUpdate({ github_url: e.target.value })}
                className="w-full bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-mac px-3 py-1 text-xs text-macSubtext outline-none focus:border-sky-500 transition-all duration-300 ease-mac"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-macSubtext mb-1">Live URL</label>
              <input
                type="url"
                value={project.live_url || ''}
                onChange={(e) => onUpdate({ live_url: e.target.value })}
                className="w-full bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-mac px-3 py-1 text-xs text-macSubtext outline-none focus:border-sky-500 transition-all duration-300 ease-mac"
                placeholder="https://..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
