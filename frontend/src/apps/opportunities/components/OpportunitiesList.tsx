// OpportunitiesList Component - Sidebar list of opportunities

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  selectedOpportunity: Opportunity | null;
  onSelectOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
}

const OpportunitiesList: React.FC<OpportunitiesListProps> = ({
  opportunities,
  loading,
  error,
  selectedOpportunity,
  onSelectOpportunity,
  onDeleteOpportunity,
}) => {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-macAccent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="liquid-glass rounded-xl p-4 border border-error/30 bg-error/5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-xs font-bold text-error mb-1">Error</div>
              <div className="text-xs text-macSubtext">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-accent-subtle flex items-center justify-center mx-auto mb-4">
            <Icon name="target" size={32} className="text-macAccent opacity-40" />
          </div>
          <p className="text-sm text-macSubtext">No opportunities yet</p>
          <p className="text-xs text-macSubtext mt-1">Add your first opportunity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-2">
        {opportunities.map((opp, index) => (
          <motion.button
            key={opp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectOpportunity(opp)}
            className={`w-full text-left liquid-glass rounded-xl p-4 border transition-all duration-300 hover-lift group ${
              selectedOpportunity?.id === opp.id
                ? 'border-macAccent/40 bg-macAccent/5 shadow-lg'
                : 'border-macBorder/30 hover:border-macAccent/30'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-macText truncate">{opp.company}</h3>
                <p className="text-xs text-macSubtext truncate">{opp.role}</p>
              </div>
              <div
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex-shrink-0 ml-2 ${
                  opp.status === 'active'
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : opp.status === 'interview'
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : opp.status === 'offer'
                    ? 'bg-green-500/10 text-success'
                    : 'bg-macPanel/50 text-macSubtext'
                }`}
              >
                {opp.status}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-macSubtext">
              {opp.priority === 'high' && (
                <span className="px-2 py-0.5 rounded bg-error/10 text-error font-bold">HIGH</span>
              )}
              {opp.next_action && (
                <span className="truncate flex-1">{opp.next_action}</span>
              )}
            </div>

            {/* Claude insight badge */}
            {opp.fit_analysis?.claude_insight && (
              <div className="mt-2 pt-2 border-t border-macBorder/20">
                <div className="flex items-start gap-2">
                  <svg className="w-3 h-3 text-macAccent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-[10px] text-macSubtext line-clamp-2">
                    {opp.fit_analysis.claude_insight}
                  </p>
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesList;
