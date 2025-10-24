"use client";

/**
 * ExperienceCard - Main experience container component
 * Combines EditableField, TagSelector, and AchievementBadge
 * GitHub dark theme with professional layout
 */

import React, { useState } from 'react';
import { MapPin, Calendar, Trash2, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import type { Experience } from '../../types/experience';
import { EditableField } from './EditableField';
import { TagSelector } from './TagSelector';
import { AchievementBadge } from './AchievementBadge';

// Company logos mapping
const COMPANY_LOGOS: Record<string, string> = {
  'JLL': 'https://logo.clearbit.com/jll.com',
  'PlanetTogether': 'https://logo.clearbit.com/planettogether.com',
  'WorkTeam': 'https://logo.clearbit.com/workteam.mx',
  'Corporativo FRAGUA': 'https://logo.clearbit.com/fragua.com.mx',
  'Dalton Efectivo Seguro': 'https://logo.clearbit.com/dalton.com.mx',
  'EC Ideas': 'https://logo.clearbit.com/ecideas.com',
};

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

  // Priority: logo from YAML > company_logo > Clearbit fallback
  const logoUrl = experience.logo || experience.company_logo || COMPANY_LOGOS[experience.company];

  return (
    <div
      className="liquid-glass rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-mac"
      style={{ marginBottom: '1.5rem' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Company logo with fallback */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md overflow-hidden liquid-glass">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={experience.company}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<svg class="w-6 h-6 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                    }
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-macAccent" />
              )}
            </div>
            <div className="flex-1">
              <EditableField
                value={experience.company}
                onChange={(value) => onUpdate({ company: value })}
                className="text-base font-bold text-macText block mb-1"
                as="div"
              />
              <EditableField
                value={experience.role}
                onChange={(value) => onUpdate({ role: value })}
                className="text-sm font-semibold text-macAccent"
                as="div"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-macSubtext">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <EditableField
                value={experience.location}
                onChange={(value) => onUpdate({ location: value })}
                className="text-macSubtext"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{dateRange}</span>
            </div>
            {experience.current && (
              <span className="px-2.5 py-1 gradient-accent text-white text-xs font-semibold rounded-full shadow-accent">
                Current
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-macSubtext hover:text-macText hover:bg-macHover/60 rounded-xl transition-all duration-300 ease-mac bounce-click"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {editMode === 'edit' && (
            <button
              onClick={onDelete}
              className="p-2 text-macSubtext hover:text-error hover:bg-error/10 rounded-xl transition-all duration-300 ease-mac bounce-click"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-6 pt-6 border-t border-macBorder/20">
          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-macText mb-2">
              <div className="w-1 h-4 bg-macAccent rounded-full"></div>
              Description
            </label>
            <EditableField
              value={experience.description}
              onChange={(value) => onUpdate({ description: value })}
              multiline
              className="text-sm text-macSubtext leading-relaxed block"
              as="p"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-macText mb-2">
              <div className="w-1 h-4 bg-macAccent rounded-full"></div>
              Tech Stack
            </label>
            <TagSelector
              tags={experience.tech_stack}
              onChange={(tech_stack) => onUpdate({ tech_stack })}
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-macText mb-2">
              <div className="w-1 h-4 bg-macAccent rounded-full"></div>
              Key Achievements
            </label>
            <AchievementBadge
              achievements={experience.achievements}
              onChange={(achievements) => onUpdate({ achievements })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
