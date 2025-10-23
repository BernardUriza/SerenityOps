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
  const priorityColor = priorityColors[opportunity.priority as OpportunityPriority] || priorityColors.medium;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-macPanel/70 backdrop-blur-md border ${stageBorder} rounded-mac p-5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-mac cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)]`}
      onClick={() => onSelect(opportunity)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-macText">{opportunity.company}</h3>
          <p className="text-xs text-macSubtext">{opportunity.role}</p>
        </div>
        <div className="flex items-center gap-1">
          {/* Priority indicator */}
          <span className={`text-xs font-bold ${priorityColor}`}>
            {opportunity.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stage badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-medium text-white ${stageColor} rounded-full`}>
          {opportunity.stage}
        </span>
        {opportunity.outcome && (
          <span className={`ml-2 text-xs font-medium ${getOutcomeColor(opportunity.outcome)}`}>
            ({opportunity.outcome})
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-macSubtext">Location:</span>
          <span className="text-macText">{opportunity.details.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-macSubtext">Salary:</span>
          <span className="text-macText">{opportunity.details.salary_range}</span>
        </div>
        {opportunity.details.sector && (
          <div className="flex items-center gap-1">
            <span className="text-macSubtext">Sector:</span>
            <span className="text-macText">{opportunity.details.sector}</span>
          </div>
        )}
      </div>

      {/* Tech stack preview */}
      {opportunity.details.tech_stack.length > 0 && (
        <div className="mt-1.5">
          <p className="text-xs text-macSubtext mb-1">Tech Stack:</p>
          <div className="flex flex-wrap gap-1">
            {opportunity.details.tech_stack.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-2 bg-macHover/60 backdrop-blur-md text-macText text-xs rounded-mac"
              >
                {tech}
              </span>
            ))}
            {opportunity.details.tech_stack.length > 5 && (
              <span className="px-3 py-2 bg-macHover/60 backdrop-blur-md text-macSubtext text-xs rounded-mac">
                +{opportunity.details.tech_stack.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Fit analysis */}
      {(opportunity.fit_analysis.technical_match !== null ||
        opportunity.fit_analysis.cultural_match !== null) && (
        <div className="mt-1.5 pt-3 border-t border-macBorder/40">
          <p className="text-xs text-macSubtext mb-1">Fit Analysis:</p>
          <div className="flex gap-1 text-xs">
            {opportunity.fit_analysis.technical_match !== null && (
              <div>
                <span className="text-macSubtext">Tech: </span>
                <span className={getTechMatchColor(opportunity.fit_analysis.technical_match)}>
                  {(opportunity.fit_analysis.technical_match * 100).toFixed(0)}%
                </span>
              </div>
            )}
            {opportunity.fit_analysis.cultural_match !== null && (
              <div>
                <span className="text-macSubtext">Culture: </span>
                <span className={getTechMatchColor(opportunity.fit_analysis.cultural_match)}>
                  {(opportunity.fit_analysis.cultural_match * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mt-1.5 pt-3 border-t border-macBorder/40 text-xs text-macSubtext">
        <div className="flex justify-between">
          <span>Discovered: {formatDate(opportunity.timeline.discovered)}</span>
          {opportunity.timeline.closed && (
            <span>Closed: {formatDate(opportunity.timeline.closed)}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
        {opportunity.stage !== 'closed' && (
          <button
            onClick={() => onUpdateStage(opportunity.id, 'closed')}
            className="px-3 py-1 bg-macHover/60 backdrop-blur-md hover:bg-macHover text-macText text-xs rounded-mac transition-all duration-300 ease-mac shadow-[inset_0_0_6px_rgba(10,132,255,0.1)]"
          >
            Close
          </button>
        )}
        <button
          onClick={() => onDelete(opportunity.id)}
          className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-error text-xs rounded-mac transition-all duration-300 ease-mac"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
