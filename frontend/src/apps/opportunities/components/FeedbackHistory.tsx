// FeedbackHistory - Historical Interview Feedback Viewer
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { FeedbackEntry } from '../types';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';
import { opportunitiesService } from '../services/opportunitiesService';

interface FeedbackHistoryProps {
  claudeActions: UseClaudeActionsReturn;
  company?: string;
}

const FeedbackHistory: React.FC<FeedbackHistoryProps> = ({ claudeActions, company: selectedCompany }) => {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'technical' | 'behavioral' | 'culture'>('all');
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    loadFeedback();
  }, [selectedCompany]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const data = await opportunitiesService.fetchFeedbackHistory(selectedCompany);
      setFeedback(data);
    } catch (error) {
      console.error('Error loading feedback:', error);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (feedback.length === 0) return;

    // TODO: Implement Claude summary generation
    // const result = await claudeActions.generateFeedbackSummary(feedback);
    // setSummary(result?.summary || null);
    setSummary('Claude summary will be generated here based on historical feedback patterns.');
  };

  const filteredFeedback = feedback.filter((entry) => {
    if (filterType === 'all') return true;
    return entry.type === filterType;
  });

  const groupByCompany = () => {
    const grouped: Record<string, FeedbackEntry[]> = {};
    filteredFeedback.forEach((entry) => {
      if (!grouped[entry.company]) {
        grouped[entry.company] = [];
      }
      grouped[entry.company].push(entry);
    });
    return grouped;
  };

  const groupedFeedback = groupByCompany();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
            <Icon name="document" size={24} className="text-macAccent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">Feedback History</h2>
            <p className="text-xs text-macSubtext">
              {selectedCompany ? `Filtered by ${selectedCompany}` : 'All companies'}
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={claudeActions.loading || feedback.length === 0}
          className="gradient-accent text-white font-semibold rounded-xl px-4 py-2 text-sm transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Icon name="lightning" size={14} />
          Claude Summary
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'technical', 'behavioral', 'culture'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              filterType === type
                ? 'bg-macAccent/10 text-macAccent border border-macAccent/30'
                : 'bg-macPanel/60 text-macSubtext border border-macBorder/30 hover:border-macAccent/30'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Claude Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-xl p-6 border border-macAccent/30 bg-macAccent/5"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-macAccent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-macAccent mb-2">Key Learnings Summary</h3>
              <p className="text-sm text-macText leading-relaxed">{summary}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feedback List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-macAccent"></div>
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl gradient-accent-subtle flex items-center justify-center mx-auto mb-4">
              <Icon name="document" size={40} className="text-macAccent opacity-40" />
            </div>
            <p className="text-sm text-macSubtext">No feedback history yet</p>
            <p className="text-xs text-macSubtext mt-1">Interview feedback will appear here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFeedback).map(([company, entries]) => (
            <div key={company} className="space-y-3">
              <div className="flex items-center gap-2 px-3">
                <div className="w-2 h-2 rounded-full bg-macAccent"></div>
                <h3 className="text-sm font-bold text-macText">{company}</h3>
                <span className="text-xs text-macSubtext">({entries.length} entries)</span>
              </div>

              <div className="space-y-2">
                {entries.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="liquid-glass rounded-xl p-5 border border-macBorder/30 hover:border-macAccent/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              entry.type === 'technical'
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : entry.type === 'behavioral'
                                ? 'bg-purple-500/10 text-purple-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {entry.type}
                          </span>
                          <span className="text-xs text-macSubtext">{entry.date}</span>
                        </div>
                        <p className="text-sm text-macText font-semibold">{entry.topic}</p>
                      </div>

                      {entry.rating && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-macPanel/60">
                          <Icon name="star" size={12} className="text-amber-400" />
                          <span className="text-xs font-bold text-macText">{entry.rating}/5</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-macSubtext leading-relaxed mb-3">{entry.feedback}</p>

                    {entry.learnings && entry.learnings.length > 0 && (
                      <div className="pt-3 border-t border-macBorder/20">
                        <p className="text-xs font-semibold text-macAccent mb-2">Key Learnings:</p>
                        <ul className="space-y-1">
                          {entry.learnings.map((learning, learningIdx) => (
                            <li key={learningIdx} className="flex items-start gap-2 text-xs text-macSubtext">
                              <span className="text-macAccent flex-shrink-0 mt-0.5">▪</span>
                              <span className="flex-1">{learning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.action_items && entry.action_items.length > 0 && (
                      <div className="pt-3 border-t border-macBorder/20 mt-3">
                        <p className="text-xs font-semibold text-success mb-2">Action Items:</p>
                        <ul className="space-y-1">
                          {entry.action_items.map((action, actionIdx) => (
                            <li key={actionIdx} className="flex items-start gap-2 text-xs text-macSubtext">
                              <span className="text-success flex-shrink-0 mt-0.5">→</span>
                              <span className="flex-1">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;
