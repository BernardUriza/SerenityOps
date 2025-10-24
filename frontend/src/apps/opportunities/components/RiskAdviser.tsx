// RiskAdviser - Red Flag Detection and Career Strategy Guidance
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';

interface RiskAdviserProps {
  opportunity: Opportunity | null;
  claudeActions: UseClaudeActionsReturn;
}

const RiskAdviser: React.FC<RiskAdviserProps> = ({ opportunity: selectedOpportunity, claudeActions }) => {
  const [strategy, setStrategy] = useState<any>(null);
  const [analysisMode, setAnalysisMode] = useState<'flags' | 'strategy'>('flags');

  useEffect(() => {
    if (selectedOpportunity) {
      setStrategy(null);
    }
  }, [selectedOpportunity]);

  const handleGenerateStrategy = async () => {
    if (!selectedOpportunity) return;

    const result = await claudeActions.generateCareerStrategy({
      opportunity_ids: [selectedOpportunity.id],
      career_goals: 'professional growth',
      constraints: [],
      time_horizon: '6_months',
    });

    if (result) {
      setStrategy(result);
    }
  };

  const getRiskLevel = (flags: string[] | undefined): 'low' | 'medium' | 'high' => {
    if (!flags || flags.length === 0) return 'low';
    if (flags.length >= 3) return 'high';
    return 'medium';
  };

  const riskLevel = selectedOpportunity?.fit_analysis?.red_flags
    ? getRiskLevel(selectedOpportunity.fit_analysis.red_flags)
    : 'low';

  if (!selectedOpportunity) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent-subtle flex items-center justify-center mx-auto mb-4">
            <Icon name="target" size={40} className="text-macAccent opacity-40" />
          </div>
          <p className="text-sm text-macSubtext">Select an opportunity to view risk analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
          <Icon name="target" size={24} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient">Risk Adviser</h2>
          <p className="text-xs text-macSubtext">{selectedOpportunity.company} - {selectedOpportunity.role}</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setAnalysisMode('flags')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            analysisMode === 'flags'
              ? 'bg-macAccent/10 text-macAccent border border-macAccent/30'
              : 'bg-macPanel/60 text-macSubtext border border-macBorder/30 hover:border-macAccent/30'
          }`}
        >
          <Icon name="lightbulb" size={14} className="inline mr-2" />
          Risk Flags
        </button>
        <button
          onClick={() => setAnalysisMode('strategy')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            analysisMode === 'strategy'
              ? 'bg-macAccent/10 text-macAccent border border-macAccent/30'
              : 'bg-macPanel/60 text-macSubtext border border-macBorder/30 hover:border-macAccent/30'
          }`}
        >
          <Icon name="target" size={14} className="inline mr-2" />
          Strategy
        </button>
      </div>

      {/* Risk Flags View */}
      {analysisMode === 'flags' && (
        <div className="space-y-4">
          {/* Risk Level Badge */}
          <div className={`liquid-glass rounded-xl p-5 border ${
            riskLevel === 'high' ? 'border-error/30 bg-error/5' :
            riskLevel === 'medium' ? 'border-amber-500/30 bg-amber-500/5' :
            'border-success/30 bg-success/5'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  riskLevel === 'high' ? 'bg-error/20' :
                  riskLevel === 'medium' ? 'bg-amber-500/20' :
                  'bg-success/20'
                }`}>
                  <Icon
                    name={riskLevel === 'low' ? 'check-circle' : 'alert-triangle'}
                    size={24}
                    className={riskLevel === 'high' ? 'text-error' : riskLevel === 'medium' ? 'text-amber-400' : 'text-success'}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-macText">Overall Risk Level</h3>
                  <p className="text-xs text-macSubtext">Based on detected flags</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                riskLevel === 'high' ? 'bg-error/10 text-error' :
                riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-success/10 text-success'
              }`}>
                {riskLevel.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Red Flags */}
          {selectedOpportunity.fit_analysis?.red_flags && selectedOpportunity.fit_analysis.red_flags.length > 0 && (
            <div className="liquid-glass rounded-xl p-6 border border-error/30 bg-error/5">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="lightbulb" size={18} className="text-error" />
                <h3 className="text-sm font-bold text-error">Red Flags Detected</h3>
              </div>
              <ul className="space-y-2">
                {selectedOpportunity.fit_analysis.red_flags.map((flag, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-macPanel/30"
                  >
                    <span className="text-error flex-shrink-0 mt-0.5 font-bold">⚠</span>
                    <span className="text-sm text-macText flex-1">{flag}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Green Flags */}
          {selectedOpportunity.fit_analysis?.green_flags && selectedOpportunity.fit_analysis.green_flags.length > 0 && (
            <div className="liquid-glass rounded-xl p-6 border border-success/30 bg-success/5">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="check-circle" size={18} className="text-success" />
                <h3 className="text-sm font-bold text-success">Positive Signals</h3>
              </div>
              <ul className="space-y-2">
                {selectedOpportunity.fit_analysis.green_flags.map((flag, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-macPanel/30"
                  >
                    <span className="text-success flex-shrink-0 mt-0.5 font-bold">✓</span>
                    <span className="text-sm text-macText flex-1">{flag}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Tactical Recommendations */}
          <div className="liquid-glass rounded-xl p-6 border border-macAccent/30 bg-macAccent/5">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-macAccent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-macAccent mb-3">Tactical Recommendations</h3>
                <ul className="space-y-2">
                  {riskLevel === 'high' && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Request detailed information about team structure and culture</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Ask about red flag areas during interview</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Consider as backup option, continue active search</span>
                      </li>
                    </>
                  )}
                  {riskLevel === 'medium' && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Validate concerns during interview process</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Request to speak with potential team members</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Proceed with cautious optimism</span>
                      </li>
                    </>
                  )}
                  {riskLevel === 'low' && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Focus on demonstrating value alignment during interview</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Leverage green flags to strengthen your pitch</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-macText">
                        <span className="text-macAccent flex-shrink-0 mt-0.5">→</span>
                        <span>Strong candidate for advancement</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Strategy View */}
      {analysisMode === 'strategy' && (
        <div className="space-y-4">
          {!strategy ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl gradient-accent-subtle flex items-center justify-center mx-auto mb-4">
                <Icon name="target" size={40} className="text-macAccent" />
              </div>
              <p className="text-sm text-macText mb-2">Generate AI-powered career strategy</p>
              <p className="text-xs text-macSubtext mb-6">
                Claude will analyze your opportunities and create a personalized action plan
              </p>
              <button
                onClick={handleGenerateStrategy}
                disabled={claudeActions.loading}
                className="gradient-accent text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {claudeActions.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Icon name="lightning" size={16} />
                    Generate Strategy
                  </>
                )}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Recommended Actions */}
              {strategy.recommended_actions && (
                <div className="liquid-glass rounded-xl p-6 border border-cyan-500/30 bg-cyan-500/5">
                  <h3 className="text-sm font-bold text-cyan-400 mb-4">Recommended Actions</h3>
                  <ul className="space-y-3">
                    {strategy.recommended_actions.map((action: any, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-xl bg-macPanel/30"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-semibold text-macText">{action.action}</span>
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            action.priority === 'high' ? 'bg-error/10 text-error' :
                            action.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-cyan-500/10 text-cyan-400'
                          }`}>
                            {action.priority}
                          </span>
                        </div>
                        <p className="text-xs text-macSubtext leading-relaxed">{action.rationale}</p>
                        {action.timeline && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-macSubtext">
                            <Icon name="target" size={12} />
                            <span>{action.timeline}</span>
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Claude Strategic Insight */}
              {strategy.claude_insight && (
                <div className="liquid-glass rounded-xl p-6 border border-macAccent/30 bg-macAccent/5">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-macAccent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-macAccent mb-2">Strategic Insight</h3>
                      <p className="text-sm text-macText leading-relaxed">{strategy.claude_insight}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateStrategy}
                disabled={claudeActions.loading}
                className="w-full bg-macPanel/60 text-macText border border-macBorder/30 hover:border-macAccent/30 font-semibold rounded-xl p-3 text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Icon name="wrench" size={14} />
                Regenerate Strategy
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskAdviser;
