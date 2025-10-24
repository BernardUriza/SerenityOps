// ComparisonPanel - Side-by-side opportunity comparison
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';

interface ComparisonPanelProps {
  opportunities: Opportunity[];
  claudeActions: UseClaudeActionsReturn;
  compareIds: [string?, string?];
  setCompareIds: (ids: [string?, string?]) => void;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  opportunities,
  claudeActions,
  compareIds,
  setCompareIds,
}) => {
  const [comparison, setComparison] = useState<any>(null);

  const handleCompare = async () => {
    if (!compareIds[0] || !compareIds[1]) {
      alert('Please select two opportunities to compare');
      return;
    }

    const result = await claudeActions.compareOpportunities({
      opportunity_a_id: compareIds[0],
      opportunity_b_id: compareIds[1],
    });

    if (result) {
      setComparison(result);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
          <Icon name="target" size={24} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient">Compare Opportunities</h2>
          <p className="text-xs text-macSubtext">Side-by-side intelligent comparison</p>
        </div>
      </div>

      {/* Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-macText mb-2">Opportunity A</label>
          <select
            value={compareIds[0] || ''}
            onChange={(e) => setCompareIds([e.target.value, compareIds[1]])}
            className="w-full bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-3 text-sm text-macText focus:outline-none focus:border-macAccent/60"
          >
            <option value="">Select...</option>
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.company} - {opp.role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-macText mb-2">Opportunity B</label>
          <select
            value={compareIds[1] || ''}
            onChange={(e) => setCompareIds([compareIds[0], e.target.value])}
            className="w-full bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-3 text-sm text-macText focus:outline-none focus:border-macAccent/60"
          >
            <option value="">Select...</option>
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.company} - {opp.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={claudeActions.loading || !compareIds[0] || !compareIds[1]}
        className="w-full gradient-accent text-white font-semibold rounded-xl p-4 transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {claudeActions.loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Comparing...
          </>
        ) : (
          <>
            <Icon name="target" size={16} />
            Compare with Claude
          </>
        )}
      </button>

      {/* Comparison Results */}
      {comparison && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="liquid-glass rounded-xl p-6 border border-cyan-500/20">
              <h3 className="text-sm font-bold text-macText mb-3">{comparison.opportunity_a.company}</h3>
              <p className="text-xs text-macSubtext">{comparison.opportunity_a.role}</p>
              <div className="mt-4 text-2xl font-bold text-cyan-400">
                {comparison.fit_comparison.a_score}%
              </div>
            </div>

            <div className="liquid-glass rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-sm font-bold text-macText mb-3">{comparison.opportunity_b.company}</h3>
              <p className="text-xs text-macSubtext">{comparison.opportunity_b.role}</p>
              <div className="mt-4 text-2xl font-bold text-purple-400">
                {comparison.fit_comparison.b_score}%
              </div>
            </div>
          </div>

          {/* Claude Recommendation */}
          {comparison.claude_recommendation && (
            <div className="liquid-glass rounded-xl p-6 border border-macAccent/30 bg-macAccent/5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-macAccent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-macAccent mb-2">Claude's Recommendation</h3>
                  <p className="text-sm text-macText leading-relaxed">{comparison.claude_recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ComparisonPanel;
