"use client";

/**
 * ExperienceCard - Main experience container component
 * Combines EditableField, TagSelector, and AchievementBadge
 * GitHub dark theme with professional layout
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Experience } from '../../types/experience';
import { EditableField } from './EditableField';
import { TagSelector } from './TagSelector';
import { AchievementBadge } from './AchievementBadge';

interface ExperienceCardProps {
  experience: Experience;
  onUpdate: (updates: Partial<Experience>) => void;
  onDelete: () => void;
  editMode: 'edit' | 'presentation';
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onUpdate,
  onDelete,
  editMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const dateRange = `${formatDate(experience.start_date)} - ${
    experience.current ? 'Present' : formatDate(experience.end_date || '')
  }`;

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
          <div className="flex items-center gap-3 mb-2">
            {experience.company_logo && (
              <img
                src={experience.company_logo}
                alt={experience.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <EditableField
                value={experience.company}
                onChange={(value) => onUpdate({ company: value })}
                className="text-xl font-bold text-slate-100 block mb-1"
                as="div"
              />
              <EditableField
                value={experience.role}
                onChange={(value) => onUpdate({ role: value })}
                className="text-sm font-medium text-sky-400"
                as="div"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <EditableField
                value={experience.location}
                onChange={(value) => onUpdate({ location: value })}
                className="text-slate-400"
              />
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{dateRange}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {editMode === 'edit' && (
            <button
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
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
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Description</label>
            <EditableField
              value={experience.description}
              onChange={(value) => onUpdate({ description: value })}
              multiline
              className="text-sm text-slate-300 leading-relaxed block"
              as="p"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Tech Stack</label>
            <TagSelector
              tags={experience.tech_stack}
              onChange={(tech_stack) => onUpdate({ tech_stack })}
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Key Achievements</label>
            <AchievementBadge
              achievements={experience.achievements}
              onChange={(achievements) => onUpdate({ achievements })}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
