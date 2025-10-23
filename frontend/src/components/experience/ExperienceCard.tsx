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
      className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac p-3 mb-3 hover:border-macBorder/40 shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-mac"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {experience.company_logo && (
              <img
                src={experience.company_logo}
                alt={experience.company}
                className="w-8 h-8 rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              <EditableField
                value={experience.company}
                onChange={(value) => onUpdate({ company: value })}
                className="text-sm font-bold text-macText block mb-0.5"
                as="div"
              />
              <EditableField
                value={experience.role}
                onChange={(value) => onUpdate({ role: value })}
                className="text-xs font-medium text-macAccent"
                as="div"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-macSubtext">
            <div className="flex items-center gap-1">
              <MapPin size={11} />
              <EditableField
                value={experience.location}
                onChange={(value) => onUpdate({ location: value })}
                className="text-macSubtext"
              />
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={11} />
              <span>{dateRange}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-macSubtext hover:text-macSubtext hover:bg-macHover/60 rounded-mac transition-all duration-300 ease-mac"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {editMode === 'edit' && (
            <button
              onClick={onDelete}
              className="p-1 text-macSubtext hover:text-error hover:bg-error/10 rounded-mac transition-all duration-300 ease-mac"
            >
              <Trash2 size={14} />
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
            <label className="block text-xs font-medium text-macSubtext mb-1">Description</label>
            <EditableField
              value={experience.description}
              onChange={(value) => onUpdate({ description: value })}
              multiline
              className="text-xs text-macSubtext leading-relaxed block"
              as="p"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-1">Tech Stack</label>
            <TagSelector
              tags={experience.tech_stack}
              onChange={(tech_stack) => onUpdate({ tech_stack })}
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-1">Key Achievements</label>
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
