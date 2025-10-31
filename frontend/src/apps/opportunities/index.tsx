// Opportunities Viewer - Main Entry Point
// macOS Aesthetic + 3-Column Layout + Claude Actions Integration
// Updated: SO-FIX-OPP-004 - Hide inactive Claude panel by default

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../icons';
import { useOpportunities } from './hooks/useOpportunities';
import { useClaudeActions } from './hooks/useClaudeActions';

// Import components
import OpportunitiesList from './components/OpportunitiesList';
import OpportunityCard from './components/OpportunityCard';
import OpportunitiesDashboard from './components/OpportunitiesDashboard';
import AnalyzerPanel from './components/AnalyzerPanel';
import ComparisonPanel from './components/ComparisonPanel';
import PitchReader from './components/PitchReader';
import FeedbackHistory from './components/FeedbackHistory';
import PreparationPanel from './components/PreparationPanel';
import RiskAdviser from './components/RiskAdviser';

type ActivePanel = 'dashboard' | 'analyzer' | 'comparison' | 'pitch' | 'feedback' | 'preparation' | 'adviser' | null;

interface OpportunitiesViewerProps {
  apiBaseUrl: string;
}

export const OpportunitiesViewer: React.FC<OpportunitiesViewerProps> = ({ apiBaseUrl }) => {
  const {
    opportunities,
    loading,
    error,
    selectedOpportunity,
    setSelectedOpportunity,
    fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    filterByStatus,
  } = useOpportunities(apiBaseUrl);

  const claudeActions = useClaudeActions();

  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard'); // Start with dashboard - SO-REFACTOR-OPP-002
  const [showClaudePanel, setShowClaudePanel] = useState(false); // Hidden by default - SO-FIX-OPP-004
  const [compareOppIds, setCompareOppIds] = useState<[string?, string?]>([undefined, undefined]);

  // Auto-show Claude panel when actions are available or loading
  const hasClaudeActivity = claudeActions.loading || claudeActions.error || claudeActions.result;

  // Auto-show panel when Claude has activity
  useEffect(() => {
    if (hasClaudeActivity) {
      setShowClaudePanel(true);
    }
  }, [hasClaudeActivity]);

  // macOS Layout: 3 columns - Sidebar | Main Content | Claude Actions
  return (
    <div className="flex h-screen bg-macBg text-macText relative overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-40"></div>

      {/* COLUMN 1: Opportunities Sidebar */}
      <div className="w-80 liquid-glass border-r border-macBorder/40 flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-macBorder/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
              <Icon name="target" size={24} className="text-macAccent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gradient">Opportunities</h2>
              <p className="text-xs text-macSubtext">Active: {opportunities.filter(o => o.status !== 'closed').length}</p>
            </div>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="liquid-glass rounded-lg p-2">
              <div className="text-lg font-bold text-indigo-400">{filterByStatus('interviewing').length}</div>
              <div className="text-[10px] text-macSubtext">Interviews</div>
            </div>
            <div className="liquid-glass rounded-lg p-2">
              <div className="text-lg font-bold text-success">{filterByStatus('offer').length}</div>
              <div className="text-[10px] text-macSubtext">Offers</div>
            </div>
            <div className="liquid-glass rounded-lg p-2">
              <div className="text-lg font-bold text-macSubtext">{filterByStatus('closed').length}</div>
              <div className="text-[10px] text-macSubtext">Closed</div>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <OpportunitiesList
          opportunities={opportunities}
          loading={loading}
          error={error}
          selectedOpportunity={selectedOpportunity}
          onSelectOpportunity={setSelectedOpportunity}
          onDeleteOpportunity={deleteOpportunity}
        />
      </div>

      {/* COLUMN 2: Main Content Area (Dashboard + Panels) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Simplified Header */}
        <div className="p-6 pb-4 border-b border-macBorder/30 bg-macPanel/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {selectedOpportunity ? selectedOpportunity.company : 'Opportunities'}
              </h1>
              <p className="text-xs text-macSubtext mt-1">
                {activePanel === 'dashboard' ? 'Overview & Quick Actions' : activePanel}
              </p>
            </div>
            {activePanel !== 'dashboard' && (
              <button
                onClick={() => setActivePanel('dashboard')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-macPanel/60 hover:bg-macPanel text-macText border border-macBorder/30 transition-all duration-300 flex items-center gap-2"
              >
                <Icon name="grid" size={14} />
                Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden bg-macPanel/10 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {activePanel === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <OpportunitiesDashboard
                  selectedOpportunity={selectedOpportunity}
                  opportunities={opportunities}
                  onAnalyzeClick={() => setActivePanel('analyzer')}
                  onCompareClick={() => setActivePanel('comparison')}
                  onPitchClick={() => setActivePanel('pitch')}
                  onPrepClick={() => setActivePanel('preparation')}
                />
              </motion.div>
            )}

            {activePanel === 'analyzer' && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyzerPanel claudeActions={claudeActions} />
              </motion.div>
            )}

            {activePanel === 'comparison' && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ComparisonPanel
                  opportunities={opportunities}
                  claudeActions={claudeActions}
                  compareIds={compareOppIds}
                  setCompareIds={setCompareOppIds}
                />
              </motion.div>
            )}

            {activePanel === 'pitch' && (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PitchReader
                  opportunity={selectedOpportunity}
                  claudeActions={claudeActions}
                />
              </motion.div>
            )}

            {activePanel === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FeedbackHistory company={selectedOpportunity?.company} claudeActions={claudeActions} />
              </motion.div>
            )}

            {activePanel === 'preparation' && (
              <motion.div
                key="preparation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PreparationPanel
                  opportunity={selectedOpportunity}
                  claudeActions={claudeActions}
                />
              </motion.div>
            )}

            {activePanel === 'adviser' && (
              <motion.div
                key="adviser"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RiskAdviser
                  opportunity={selectedOpportunity}
                  claudeActions={claudeActions}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* COLUMN 3: Claude Actions Panel (Minimizable) */}
      <AnimatePresence>
        {showClaudePanel && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-96 liquid-glass border-l border-macBorder/40 flex flex-col relative z-10 overflow-hidden"
          >
            {/* Claude Panel Header */}
            <div className="p-6 border-b border-macBorder/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-macAccent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-macText">Claude Actions</h3>
                  <p className="text-xs text-macSubtext">AI-powered insights</p>
                </div>
              </div>
              <button
                onClick={() => setShowClaudePanel(false)}
                className="w-8 h-8 rounded-lg hover:bg-macHover/60 transition-colors flex items-center justify-center text-macSubtext hover:text-macText"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Claude Actions Quick Access */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                <button
                  onClick={() => setActivePanel('analyzer')}
                  className="w-full liquid-glass rounded-xl p-4 text-left hover:border-macAccent/40 border border-macBorder/30 transition-all duration-300 hover-lift group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="bar-chart" size={16} className="text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-bold text-macText">Analyze JD</h4>
                  </div>
                  <p className="text-xs text-macSubtext">Get Claude's fit analysis for job descriptions</p>
                </button>

                <button
                  onClick={() => setActivePanel('comparison')}
                  className="w-full liquid-glass rounded-xl p-4 text-left hover:border-macAccent/40 border border-macBorder/30 transition-all duration-300 hover-lift group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="activity" size={16} className="text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-macText">Compare Offers</h4>
                  </div>
                  <p className="text-xs text-macSubtext">Side-by-side intelligent comparison</p>
                </button>

                <button
                  onClick={() => setActivePanel('pitch')}
                  className="w-full liquid-glass rounded-xl p-4 text-left hover:border-macAccent/40 border border-macBorder/30 transition-all duration-300 hover-lift group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="message-circle" size={16} className="text-success" />
                    </div>
                    <h4 className="text-sm font-bold text-macText">Improve Pitch</h4>
                  </div>
                  <p className="text-xs text-macSubtext">Claude optimizes your elevator pitch</p>
                </button>

                <button
                  onClick={() => setActivePanel('preparation')}
                  className="w-full liquid-glass rounded-xl p-4 text-left hover:border-macAccent/40 border border-macBorder/30 transition-all duration-300 hover-lift group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="book" size={16} className="text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-bold text-macText">Mock Interview</h4>
                  </div>
                  <p className="text-xs text-macSubtext">Practice with Claude-generated questions</p>
                </button>

                <button
                  onClick={() => setActivePanel('adviser')}
                  className="w-full liquid-glass rounded-xl p-4 text-left hover:border-macAccent/40 border border-macBorder/30 transition-all duration-300 hover-lift group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="shield" size={16} className="text-amber-400" />
                    </div>
                    <h4 className="text-sm font-bold text-macText">Career Strategy</h4>
                  </div>
                  <p className="text-xs text-macSubtext">Get strategic guidance from Claude</p>
                </button>
              </div>

              {/* Claude Status */}
              {claudeActions.loading && (
                <div className="mt-6 liquid-glass rounded-xl p-4 border border-macAccent/30">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-macAccent"></div>
                    <div>
                      <div className="text-xs font-bold text-macText">Claude is thinking...</div>
                      <div className="text-xs text-macSubtext">Analyzing your request</div>
                    </div>
                  </div>
                </div>
              )}

              {claudeActions.error && (
                <div className="mt-6 liquid-glass rounded-xl p-4 border border-error/30 bg-error/5">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-xs font-bold text-error mb-1">Action Failed</div>
                      <div className="text-xs text-macSubtext">{claudeActions.error}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Claude Panel Button (when hidden) */}
      {!showClaudePanel && (
        <button
          onClick={() => setShowClaudePanel(true)}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-2xl gradient-accent shadow-2xl text-white hover-lift group z-50"
        >
          <svg className="w-6 h-6 mx-auto group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default OpportunitiesViewer;
