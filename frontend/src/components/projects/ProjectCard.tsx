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
      className="liquid-glass rounded-2xl border border-macBorder/30 p-6 mb-4 shadow-lg hover:border-cyan-500/30 transition-all duration-300 ease-mac hover-lift"
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
            className={`text-base font-bold bg-transparent outline-none w-full transition-all duration-300 ease-mac ${
              editingField === 'name'
                ? 'text-macAccent ring-2 ring-cyan-500/50 rounded-xl px-4 py-2'
                : 'text-macText hover:text-macAccent cursor-text'
            }`}
            placeholder="Project Name"
          />

          <input
            type="text"
            value={project.tagline}
            onChange={(e) => onUpdate({ tagline: e.target.value })}
            onFocus={() => setEditingField('tagline')}
            onBlur={(e) => handleFieldBlur('tagline', e.target.value)}
            className={`text-sm font-medium block mt-2 bg-transparent outline-none w-full transition-all duration-300 ease-mac ${
              editingField === 'tagline'
                ? 'text-macAccent ring-2 ring-cyan-500/50 rounded-xl px-4 py-2'
                : 'text-macSubtext hover:text-macText cursor-text'
            }`}
            placeholder="Short tagline or description"
          />

          {/* Links */}
          <div className="flex items-center gap-3 mt-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-macPanel/40 hover:bg-macAccent/10 border border-macBorder/30 hover:border-macAccent/30 rounded-lg text-macSubtext hover:text-macAccent transition-all duration-300 ease-mac text-xs font-medium"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 hover:bg-success/20 border border-success/30 hover:border-success/50 rounded-lg text-success hover:text-success transition-all duration-300 ease-mac text-xs font-medium"
              >
                <ExternalLink size={14} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 text-macSubtext hover:text-macText bg-macPanel/40 hover:bg-macPanel/60 border border-macBorder/30 rounded-xl transition-all duration-300 ease-mac"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 text-macSubtext hover:text-error bg-macPanel/40 hover:bg-error/10 border border-macBorder/30 hover:border-error/30 rounded-xl transition-all duration-300 ease-mac"
          >
            <Trash2 size={16} />
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
          className="space-y-5 pt-4 border-t border-macBorder/30"
        >
          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-macText mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Role
            </label>
            <input
              type="text"
              value={project.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              onFocus={() => setEditingField('role')}
              onBlur={(e) => handleFieldBlur('role', e.target.value)}
              className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-300 ease-mac ${
                editingField === 'role'
                  ? 'bg-macPanel/50 text-macAccent ring-2 ring-cyan-500/50 border-cyan-500'
                  : 'bg-macPanel/30 text-macSubtext border-macBorder/40 hover:border-macBorder/60'
              }`}
              placeholder="e.g., Full Stack Developer, Lead Engineer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-macText mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              onFocus={() => setEditingField('description')}
              onBlur={(e) => handleFieldBlur('description', e.target.value)}
              className={`w-full px-4 py-3 text-sm leading-relaxed resize-none rounded-xl border transition-all duration-300 ease-mac ${
                editingField === 'description'
                  ? 'bg-macPanel/50 text-macAccent ring-2 ring-cyan-500/50 border-cyan-500'
                  : 'bg-macPanel/30 text-macSubtext border-macBorder/40 hover:border-macBorder/60'
              }`}
              rows={4}
              placeholder="Describe the project, its purpose, and impact..."
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-semibold text-macText mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Tech Stack
            </label>
            <TechStackSelector
              techStack={project.tech_stack}
              onChange={(tech_stack) => onUpdate({ tech_stack })}
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-semibold text-macText mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Key Achievements
            </label>
            <AchievementsEditor
              achievements={project.achievements}
              onChange={(achievements) => onUpdate({ achievements })}
            />
          </div>

          {/* Links (editable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-macText mb-2 flex items-center gap-2">
                <Github size={14} className="text-macSubtext" />
                GitHub URL
              </label>
              <input
                type="url"
                value={project.github_url || ''}
                onChange={(e) => onUpdate({ github_url: e.target.value })}
                className="w-full bg-macPanel/30 backdrop-blur-md border border-macBorder/40 rounded-xl px-4 py-2.5 text-sm text-macSubtext hover:border-macBorder/60 outline-none focus:border-macAccent focus:ring-2 focus:ring-macAccent/50 transition-all duration-300 ease-mac"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-macText mb-2 flex items-center gap-2">
                <ExternalLink size={14} className="text-success" />
                Live URL
              </label>
              <input
                type="url"
                value={project.live_url || ''}
                onChange={(e) => onUpdate({ live_url: e.target.value })}
                className="w-full bg-macPanel/30 backdrop-blur-md border border-macBorder/40 rounded-xl px-4 py-2.5 text-sm text-macSubtext hover:border-macBorder/60 outline-none focus:border-success focus:ring-2 focus:ring-success/50 transition-all duration-300 ease-mac"
                placeholder="https://demo.example.com"
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
