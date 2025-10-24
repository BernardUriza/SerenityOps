// PreparationPanel - Interview Preparation Materials Access
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../icons';
import type { Opportunity } from '../types';
import type { UseClaudeActionsReturn } from '../hooks/useClaudeActions';

interface PreparationPanelProps {
  opportunity: Opportunity | null;
  claudeActions: UseClaudeActionsReturn;
}

interface PrepMaterial {
  id: string;
  title: string;
  description: string;
  icon: string;
  path?: string;
  action?: () => void;
}

const PreparationPanel: React.FC<PreparationPanelProps> = ({ opportunity: selectedOpportunity, claudeActions }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [mockInterviewConfig, setMockInterviewConfig] = useState({
    type: 'behavioral' as 'technical' | 'behavioral' | 'manager',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const materials: PrepMaterial[] = [
    {
      id: 'star',
      title: 'STAR Stories',
      description: 'Prepared behavioral interview stories with metrics',
      icon: 'book-open',
      path: selectedOpportunity ? `/interview/${selectedOpportunity.company}/star_stories.md` : undefined,
    },
    {
      id: 'runbook',
      title: '45min Runbook',
      description: 'Interview timing breakdown and flow',
      icon: 'clock',
      path: selectedOpportunity ? `/interview/${selectedOpportunity.company}/45min_runbook.md` : undefined,
    },
    {
      id: 'questions',
      title: 'Questions Bank',
      description: 'Manager questions with STAR references',
      icon: 'help-circle',
      path: selectedOpportunity ? `/interview/${selectedOpportunity.company}/manager_questions_bank.md` : undefined,
    },
    {
      id: 'cheatcards',
      title: 'Cheat Cards',
      description: 'Quick reference bullets for key topics',
      icon: 'credit-card',
      path: selectedOpportunity ? `/interview/${selectedOpportunity.company}/cheat_cards.md` : undefined,
    },
    {
      id: 'technical',
      title: 'Technical Learnings',
      description: 'Curated technical insights from past interviews',
      icon: 'code',
      path: '/logs/interviews/technical_learnings.md',
    },
    {
      id: 'mock',
      title: 'Mock Interview',
      description: 'Generate practice questions with Claude',
      icon: 'message-square',
      action: () => setSelectedMaterial('mock'),
    },
  ];

  const handleGenerateMockInterview = async () => {
    if (!selectedOpportunity) return;

    const result = await claudeActions.generateMockInterview(selectedOpportunity.id, {
      interview_type: mockInterviewConfig.type,
      difficulty: mockInterviewConfig.difficulty,
      focus_areas: selectedOpportunity.fit_analysis?.gaps || [],
    });

    if (result) {
      // Display mock interview questions
      console.log('Mock interview generated:', result);
    }
  };

  const handleOpenMaterial = (material: PrepMaterial) => {
    if (material.action) {
      material.action();
    } else if (material.path) {
      // TODO: Implement material viewer/download
      console.log('Opening material:', material.path);
      setSelectedMaterial(material.id);
    }
  };

  if (!selectedOpportunity) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent-subtle flex items-center justify-center mx-auto mb-4">
            <Icon name="briefcase" size={40} className="text-macAccent opacity-40" />
          </div>
          <p className="text-sm text-macSubtext">Select an opportunity to access prep materials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
          <Icon name="briefcase" size={24} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient">Interview Preparation</h2>
          <p className="text-xs text-macSubtext">{selectedOpportunity.company} - {selectedOpportunity.role}</p>
        </div>
      </div>

      {/* Next Action Reminder */}
      {selectedOpportunity.next_action && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-xl p-4 border border-amber-500/30 bg-amber-500/5"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-amber-400 mb-1">Next Action</h3>
              <p className="text-sm text-macText">{selectedOpportunity.next_action}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-2 gap-4">
        {materials.map((material, index) => (
          <motion.button
            key={material.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleOpenMaterial(material)}
            className={`liquid-glass rounded-xl p-5 border transition-all duration-300 hover-lift text-left ${
              selectedMaterial === material.id
                ? 'border-macAccent/40 bg-macAccent/5'
                : 'border-macBorder/30 hover:border-macAccent/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent-subtle flex items-center justify-center flex-shrink-0">
                <Icon name={material.icon as any} size={20} className="text-macAccent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-macText mb-1">{material.title}</h3>
                <p className="text-xs text-macSubtext line-clamp-2">{material.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mock Interview Generator */}
      {selectedMaterial === 'mock' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-xl p-6 border border-macAccent/30 bg-macAccent/5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Icon name="message-circle" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-macAccent">Mock Interview Generator</h3>
              <p className="text-xs text-macSubtext">Practice with Claude-generated questions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-macText mb-2">Interview Type</label>
              <select
                value={mockInterviewConfig.type}
                onChange={(e) => setMockInterviewConfig({ ...mockInterviewConfig, type: e.target.value as any })}
                className="w-full bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-3 text-sm text-macText focus:outline-none focus:border-macAccent/60"
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-macText mb-2">Difficulty</label>
              <select
                value={mockInterviewConfig.difficulty}
                onChange={(e) => setMockInterviewConfig({ ...mockInterviewConfig, difficulty: e.target.value as any })}
                className="w-full bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-xl p-3 text-sm text-macText focus:outline-none focus:border-macAccent/60"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {selectedOpportunity.fit_analysis?.gaps && selectedOpportunity.fit_analysis.gaps.length > 0 && (
            <div className="bg-macPanel/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-macText mb-2">Will focus on your gaps:</p>
              <div className="flex flex-wrap gap-2">
                {selectedOpportunity.fit_analysis.gaps.map((gap, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-semibold"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateMockInterview}
            disabled={claudeActions.loading}
            className="w-full gradient-accent text-white font-semibold rounded-xl p-4 transition-all duration-300 hover-lift shadow-lg hover:shadow-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {claudeActions.loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Icon name="lightning" size={16} />
                Generate Mock Interview
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Timeline Preview */}
      {selectedOpportunity.timeline && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-macText px-3">Interview Timeline</h3>
          <div className="space-y-2">
            {Object.entries(selectedOpportunity.timeline).filter(([_, value]) => value).map(([key, value], idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="liquid-glass rounded-xl p-4 border border-macBorder/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-macAccent mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-macText capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-macSubtext mt-1">{value as string}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreparationPanel;
