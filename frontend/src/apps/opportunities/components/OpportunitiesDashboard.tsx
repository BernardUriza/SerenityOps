// Opportunities Dashboard - Modern Card-Based Layout
// Replaces tab-based UI with integrated dashboard
// SO-REFACTOR-OPP-002 + SO-UX-OPP-003

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';

interface OpportunitiesDashboardProps {
  selectedOpportunity: Opportunity | null;
  opportunities: Opportunity[];
  onAnalyzeClick: () => void;
  onCompareClick: () => void;
  onPitchClick: () => void;
  onPrepClick: () => void;
}

export const OpportunitiesDashboard: React.FC<OpportunitiesDashboardProps> = ({
  selectedOpportunity,
  opportunities,
  onAnalyzeClick,
  onCompareClick,
  onPitchClick,
  onPrepClick,
}) => {
  if (!selectedOpportunity) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl gradient-accent-subtle flex items-center justify-center mx-auto mb-6 opacity-40">
            <Icon name="target" size={48} className="text-macAccent" />
          </div>
          <h3 className="text-2xl font-bold text-macText mb-3">No Opportunity Selected</h3>
          <p className="text-macSubtext text-sm leading-relaxed">
            Select an opportunity from the list to view detailed insights, analysis, and preparation tools.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const fitPercentage = selectedOpportunity.fit_analysis?.skills_match_percentage || 0;
  const interviewDate = selectedOpportunity.timeline?.first_interview;
  const hasPrep = selectedOpportunity.interview_prep && selectedOpportunity.interview_prep.star_stories;

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interviewing': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'offer': return 'bg-success/10 text-success border-success/30';
      case 'applied': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'discovered': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'closed': return 'bg-macSubtext/10 text-macSubtext border-macBorder/30';
      default: return 'bg-macBorder/10 text-macText border-macBorder/30';
    }
  };

  // Priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error border-error/30';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-macSubtext/10 text-macSubtext border-macBorder/30';
      default: return 'bg-macBorder/10 text-macText border-macBorder/30';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass rounded-2xl p-6 border border-macBorder/30"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-macText">{selectedOpportunity.company}</h2>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(selectedOpportunity.status)}`}>
                {selectedOpportunity.status}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(selectedOpportunity.priority)}`}>
                {selectedOpportunity.priority} priority
              </span>
            </div>
            <p className="text-base text-macText/80 mb-3">{selectedOpportunity.role}</p>
            <p className="text-sm text-macSubtext leading-relaxed">
              {selectedOpportunity.details.description}
            </p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="liquid-glass rounded-xl p-4 border border-macBorder/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Icon name="check-circle" size={20} className="text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{fitPercentage}%</div>
                <div className="text-xs text-macSubtext">Skills Match</div>
              </div>
            </div>
          </div>

          {interviewDate && (
            <div className="liquid-glass rounded-xl p-4 border border-macBorder/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Icon name="calendar" size={20} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-macText">{new Date(interviewDate).toLocaleDateString()}</div>
                  <div className="text-xs text-macSubtext">Interview Date</div>
                </div>
              </div>
            </div>
          )}

          <div className="liquid-glass rounded-xl p-4 border border-macBorder/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Icon name="layers" size={20} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-macText">{selectedOpportunity.details.tech_stack.length}</div>
                <div className="text-xs text-macSubtext">Technologies</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Job Fit Analysis Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onAnalyzeClick}
          className="liquid-glass rounded-2xl p-6 border border-macBorder/30 hover:border-cyan-500/40 transition-all duration-300 hover-lift text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Icon name="bar-chart" size={24} className="text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-macText mb-2 group-hover:text-cyan-400 transition-colors">
                Skills Gap Analysis
              </h3>
              <p className="text-sm text-macSubtext leading-relaxed">
                Identify skill gaps, missing requirements, and areas for preparation
              </p>
              {selectedOpportunity.fit_analysis && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-macBorder/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-success rounded-full transition-all duration-500"
                      style={{ width: `${fitPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-macText">{fitPercentage}%</span>
                </div>
              )}
            </div>
          </div>
        </motion.button>

        {/* Interview Prep Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onPrepClick}
          className="liquid-glass rounded-2xl p-6 border border-macBorder/30 hover:border-indigo-500/40 transition-all duration-300 hover-lift text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Icon name="book" size={24} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-macText mb-2 group-hover:text-indigo-400 transition-colors">
                Interview Preparation
              </h3>
              <p className="text-sm text-macSubtext leading-relaxed">
                Review STAR stories, practice questions, and company research
              </p>
              {hasPrep && (
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <Icon name="check-circle" size={14} className="text-success" />
                  <span className="text-success font-semibold">Prep materials ready</span>
                </div>
              )}
            </div>
          </div>
        </motion.button>

        {/* Elevator Pitch Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onPitchClick}
          className="liquid-glass rounded-2xl p-6 border border-macBorder/30 hover:border-success/40 transition-all duration-300 hover-lift text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Icon name="message-circle" size={24} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-macText mb-2 group-hover:text-success transition-colors">
                Elevator Pitch
              </h3>
              <p className="text-sm text-macSubtext leading-relaxed">
                Perfect your pitch with Claude's intelligent suggestions
              </p>
            </div>
          </div>
        </motion.button>

        {/* Compare Offers Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onCompareClick}
          className="liquid-glass rounded-2xl p-6 border border-macBorder/30 hover:border-purple-500/40 transition-all duration-300 hover-lift text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Icon name="activity" size={24} className="text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-macText mb-2 group-hover:text-purple-400 transition-colors">
                Compare Opportunities
              </h3>
              <p className="text-sm text-macSubtext leading-relaxed">
                Side-by-side intelligent comparison of multiple offers
              </p>
              <div className="mt-4 text-xs text-macSubtext">
                {opportunities.filter(o => o.status !== 'closed').length} active opportunities
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Tech Stack */}
      {selectedOpportunity.details.tech_stack.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="liquid-glass rounded-2xl p-6 border border-macBorder/30"
        >
          <h3 className="text-lg font-bold text-macText mb-4 flex items-center gap-2">
            <Icon name="code" size={20} className="text-macAccent" />
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedOpportunity.details.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-macAccent/10 text-macAccent text-xs font-semibold border border-macAccent/20 hover:border-macAccent/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Notes */}
      {selectedOpportunity.notes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="liquid-glass rounded-2xl p-6 border border-macBorder/30"
        >
          <h3 className="text-lg font-bold text-macText mb-4 flex items-center gap-2">
            <Icon name="file-text" size={20} className="text-macAccent" />
            Notes
          </h3>
          <div className="space-y-3">
            {selectedOpportunity.notes.slice(0, 3).map((note, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-macAccent mt-2 flex-shrink-0" />
                <p className="text-sm text-macSubtext leading-relaxed">{note}</p>
              </div>
            ))}
            {selectedOpportunity.notes.length > 3 && (
              <button className="text-xs text-macAccent hover:text-macAccent/80 transition-colors font-semibold">
                View all {selectedOpportunity.notes.length} notes →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OpportunitiesDashboard;
