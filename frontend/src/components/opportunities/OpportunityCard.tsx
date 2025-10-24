import React from 'react';
import { motion } from 'framer-motion';
import type { Opportunity, OpportunityStage, OpportunityPriority } from '../../types/opportunity';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
  onUpdateStage: (id: string, stage: OpportunityStage) => void;
}

const stageColors: Record<OpportunityStage, string> = {
  discovered: 'bg-slate-600',
  applied: 'bg-macAccent',
  interviewing: 'bg-indigo-600',
  offer: 'bg-green-600',
  closed: 'bg-macHover/60'
};

const stageBorderColors: Record<OpportunityStage, string> = {
  discovered: 'border-slate-500',
  applied: 'border-macAccent',
  interviewing: 'border-indigo-500',
  offer: 'border-green-500',
  closed: 'border-macBorder/40'
};

const stageGradients: Record<OpportunityStage, string> = {
  discovered: 'from-slate-500/5 to-transparent',
  applied: 'from-macAccent/5 to-transparent',
  interviewing: 'from-indigo-500/5 to-transparent',
  offer: 'from-green-500/5 to-transparent',
  closed: 'from-macBorder/5 to-transparent'
};

const priorityColors: Record<OpportunityPriority, string> = {
  high: 'text-error',
  medium: 'text-yellow-400',
  low: 'text-macSubtext'
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onDelete,
  onUpdateStage
}) => {
  const stageColor = stageColors[opportunity.stage as OpportunityStage] || stageColors.discovered;
  const stageBorder = stageBorderColors[opportunity.stage as OpportunityStage] || stageBorderColors.discovered;
  const stageGradient = stageGradients[opportunity.stage as OpportunityStage] || stageGradients.discovered;
  const priorityColor = priorityColors[opportunity.priority as OpportunityPriority] || priorityColors.medium;

  const getDaysSince = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getOutcomeColor = (outcome: string | undefined) => {
    if (!outcome) return 'text-macSubtext';
    switch (outcome) {
      case 'accepted': return 'text-success';
      case 'declined': return 'text-yellow-400';
      case 'rejected': return 'text-error';
      case 'withdrawn': return 'text-macSubtext';
      default: return 'text-macSubtext';
    }
  };

  const getTechMatchColor = (match: number | null) => {
    if (match === null) return 'text-macSubtext';
    if (match >= 0.8) return 'text-success';
    if (match >= 0.6) return 'text-yellow-400';
    return 'text-error';
  };

  const daysSince = getDaysSince(opportunity.timeline.discovered);
  const hasRedFlags = opportunity.fit_analysis.red_flags.length > 0;
  const hasGreenFlags = opportunity.fit_analysis.green_flags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative liquid-glass border-2 ${stageBorder} rounded-2xl p-6 shadow-lg hover-lift transition-all duration-300 ease-mac cursor-pointer overflow-hidden group`}
      onClick={() => onSelect(opportunity)}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stageGradient} pointer-events-none`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with company and role */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl gradient-accent-subtle flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gradient truncate mb-1">{opportunity.company}</h3>
                <p className="text-sm text-macText font-medium truncate">{opportunity.role}</p>
              </div>
            </div>
            {/* Priority badge */}
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg flex-shrink-0 ml-2 ${
              opportunity.priority === 'high' ? 'bg-error/10 text-error border border-error/30' :
              opportunity.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
              'bg-macPanel/50 text-macSubtext border border-macBorder/30'
            }`}>
              {opportunity.priority.toUpperCase()}
            </span>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white ${stageColor} rounded-xl shadow-md`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></span>
              {opportunity.stage}
            </span>
            {opportunity.outcome && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                opportunity.outcome === 'accepted' ? 'bg-success/10 text-success border border-success/30' :
                opportunity.outcome === 'declined' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                opportunity.outcome === 'rejected' ? 'bg-error/10 text-error border border-error/30' :
                'bg-macPanel/50 text-macSubtext border border-macBorder/30'
              }`}>
                {opportunity.outcome}
              </span>
            )}
            {daysSince !== null && (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-macPanel/50 text-macSubtext border border-macBorder/30">
                {daysSince}d ago
              </span>
            )}
          </div>
        </div>

        {/* Key details with icons */}
        <div className="grid grid-cols-1 gap-2.5 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-macSubtext font-medium">Location:</span>
            <span className="text-macText font-semibold flex-1">{opportunity.details.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-macSubtext font-medium">Salary:</span>
            <span className="text-success font-bold flex-1">{opportunity.details.salary_range}</span>
          </div>
          {opportunity.details.sector && (
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-macSubtext font-medium">Sector:</span>
              <span className="text-macText font-semibold flex-1">{opportunity.details.sector}</span>
            </div>
          )}
        </div>

        {/* Tech stack preview */}
        {opportunity.details.tech_stack.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2.5">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-xs font-semibold text-macSubtext">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {opportunity.details.tech_stack.slice(0, 5).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-macPanel/70 backdrop-blur-md text-macText text-xs font-medium rounded-lg border border-macBorder/30 hover:border-purple-400/40 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
              {opportunity.details.tech_stack.length > 5 && (
                <span className="px-3 py-1.5 bg-macPanel/50 backdrop-blur-md text-macSubtext text-xs font-medium rounded-lg border border-macBorder/20">
                  +{opportunity.details.tech_stack.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fit analysis with progress bars */}
        {(opportunity.fit_analysis.technical_match !== null ||
          opportunity.fit_analysis.cultural_match !== null) && (
          <div className="mb-4 p-3.5 rounded-xl bg-macPanel/30 border border-macBorder/30">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs font-semibold text-macSubtext">Fit Analysis</span>
            </div>
            <div className="space-y-2.5">
              {opportunity.fit_analysis.technical_match !== null && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-medium text-macSubtext">Technical</span>
                    <span className={`text-[10px] font-bold ${getTechMatchColor(opportunity.fit_analysis.technical_match)}`}>
                      {(opportunity.fit_analysis.technical_match * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-macHover/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        opportunity.fit_analysis.technical_match >= 0.8 ? 'bg-success' :
                        opportunity.fit_analysis.technical_match >= 0.6 ? 'bg-yellow-400' :
                        'bg-error'
                      }`}
                      style={{ width: `${(opportunity.fit_analysis.technical_match * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {opportunity.fit_analysis.cultural_match !== null && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-medium text-macSubtext">Cultural</span>
                    <span className={`text-[10px] font-bold ${getTechMatchColor(opportunity.fit_analysis.cultural_match)}`}>
                      {(opportunity.fit_analysis.cultural_match * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-macHover/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        opportunity.fit_analysis.cultural_match >= 0.8 ? 'bg-success' :
                        opportunity.fit_analysis.cultural_match >= 0.6 ? 'bg-yellow-400' :
                        'bg-error'
                      }`}
                      style={{ width: `${(opportunity.fit_analysis.cultural_match * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Red/Green flags indicators */}
        {(hasRedFlags || hasGreenFlags) && (
          <div className="mb-4 flex items-center gap-2">
            {hasGreenFlags && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/30 rounded-lg">
                <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold text-success">{opportunity.fit_analysis.green_flags.length} Green</span>
              </div>
            )}
            {hasRedFlags && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 border border-error/30 rounded-lg">
                <svg className="w-3.5 h-3.5 text-error" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold text-error">{opportunity.fit_analysis.red_flags.length} Red</span>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="mb-4 pt-4 border-t border-macBorder/30">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-macSubtext font-medium">Discovered:</span>
              <span className="text-macText font-semibold">{formatDate(opportunity.timeline.discovered)}</span>
            </div>
            {opportunity.timeline.closed && (
              <div className="flex items-center gap-1.5">
                <span className="text-macSubtext font-medium">Closed:</span>
                <span className="text-macText font-semibold">{formatDate(opportunity.timeline.closed)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {opportunity.stage !== 'closed' && (
            <button
              onClick={() => onUpdateStage(opportunity.id, 'closed')}
              className="flex-1 px-4 py-2.5 bg-macPanel/50 backdrop-blur-md hover:bg-macPanel/70 text-macText text-xs font-semibold rounded-xl transition-all duration-300 ease-mac border border-macBorder/30 hover:border-macAccent/40 shadow-md hover-lift"
            >
              Close
            </button>
          )}
          <button
            onClick={() => onDelete(opportunity.id)}
            className="flex-1 px-4 py-2.5 bg-error/10 hover:bg-error/20 text-error text-xs font-semibold rounded-xl transition-all duration-300 ease-mac border border-error/30 hover:border-error/50 shadow-md hover-lift"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
