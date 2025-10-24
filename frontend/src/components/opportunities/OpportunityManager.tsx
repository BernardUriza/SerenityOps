import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOpportunityStore } from '../../stores/opportunityStore';
import OpportunityCard from './OpportunityCard';
import OpportunityForm from './OpportunityForm';
import type { Opportunity, OpportunityStage, CreateOpportunityRequest } from '../../types/opportunity';

interface OpportunityManagerProps {
  apiBaseUrl: string;
}

const OpportunityManager: React.FC<OpportunityManagerProps> = ({ apiBaseUrl }) => {
  const {
    opportunities,
    data,
    loading,
    error,
    filterStage,
    setFilterStage,
    loadOpportunities,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity
  } = useOpportunityStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Load opportunities on mount
  useEffect(() => {
    loadOpportunities(apiBaseUrl);
  }, [apiBaseUrl, loadOpportunities]);

  // Filter opportunities based on selected stage
  const filteredOpportunities = filterStage === 'all'
    ? opportunities
    : opportunities.filter(opp => opp.stage === filterStage);

  // Handle add new opportunity
  const handleAddOpportunity = async (formData: CreateOpportunityRequest) => {
    await addOpportunity(apiBaseUrl, formData as Partial<Opportunity>);
    setShowForm(false);
  };

  // Handle update opportunity stage
  const handleUpdateStage = async (id: string, stage: OpportunityStage) => {
    const updates: Partial<Opportunity> = {
      stage,
      timeline: {
        discovered: null,
        applied: null,
        first_interview: null,
        final_interview: null,
        offer_received: null,
        decision_deadline: null,
        closed: stage === 'closed' ? new Date().toISOString().split('T')[0] : null
      }
    };
    await updateOpportunity(apiBaseUrl, id, updates);
  };

  // Handle delete opportunity
  const handleDeleteOpportunity = async (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      await deleteOpportunity(apiBaseUrl, id);
    }
  };

  // Stage counts
  const stageCounts = {
    all: opportunities.length,
    discovered: opportunities.filter(o => o.stage === 'discovered').length,
    applied: opportunities.filter(o => o.stage === 'applied').length,
    interviewing: opportunities.filter(o => o.stage === 'interviewing').length,
    offer: opportunities.filter(o => o.stage === 'offer').length,
    closed: opportunities.filter(o => o.stage === 'closed').length
  };

  return (
    <div className="animate-bounce-in space-y-8 relative p-6">
      {/* Ambient effects - Fixed position */}
      <div className="gradient-orb fixed top-[10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/15 -z-10"></div>
      <div className="gradient-orb fixed bottom-[15%] left-[20%] w-[500px] h-[500px] bg-indigo-500/12 -z-10" style={{ animationDelay: '5s' }}></div>

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
            <svg className="w-7 h-7 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-1">Opportunities</h2>
            <p className="text-macSubtext text-sm">
              Track job applications and professional opportunities
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 gradient-accent hover:shadow-accent text-white font-semibold rounded-xl transition-all duration-300 ease-mac flex items-center gap-2 hover-lift group relative overflow-hidden bounce-click"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
          <span className="text-sm relative z-10 transition-transform duration-300 group-hover:rotate-180">+</span>
          <span className="relative z-10">Add Opportunity</span>
        </button>
      </div>

      {/* Stats - Bento Style */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10">
          <div className="liquid-glass rounded-mac p-4 shadow-md bento-card group transition-all duration-300 interactive-element relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-macAccent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-xs text-macSubtext relative z-10">Total Active</div>
            <div className="text-2xl font-bold text-macText mt-2 group-hover:scale-110 transition-transform duration-300 relative z-10">{data.active_count.total}</div>
          </div>
          <div className="liquid-glass rounded-mac p-4 shadow-md bento-card group transition-all duration-300 interactive-element relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-xs text-macSubtext relative z-10">Interviewing</div>
            <div className="text-2xl font-bold text-indigo-400 mt-2 group-hover:scale-110 transition-transform duration-300 relative z-10">{data.active_count.interviewing}</div>
          </div>
          <div className="liquid-glass rounded-mac p-4 shadow-md bento-card group transition-all duration-300 interactive-element relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-xs text-macSubtext relative z-10">Offers</div>
            <div className="text-2xl font-bold text-success mt-2 group-hover:scale-110 transition-transform duration-300 relative z-10">{data.active_count.offer}</div>
          </div>
          <div className="liquid-glass rounded-mac p-4 shadow-md bento-card group transition-all duration-300 interactive-element relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="text-xs text-macSubtext relative z-10">Closed</div>
            <div className="text-2xl font-bold text-macSubtext mt-2 group-hover:scale-110 transition-transform duration-300 relative z-10">{data.active_count.closed}</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {(['all', 'discovered', 'applied', 'interviewing', 'offer', 'closed'] as const).map((stage, index) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`px-4 py-2 rounded-mac text-xs font-medium transition-all duration-300 ease-mac group bounce-click ripple-effect ${
              filterStage === stage
                ? 'liquid-glass-accent text-white shadow-accent animate-scale-in'
                : 'liquid-glass text-macText hover:liquid-glass-accent animate-slide-in-left'
            }`}
          >
            <span className="group-hover:scale-105 inline-block transition-transform duration-300 relative z-10">
              {stage.charAt(0).toUpperCase() + stage.slice(1)} ({stageCounts[stage]})
            </span>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macAccent"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-mac p-4 mb-6 backdrop-blur-md">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredOpportunities.length === 0 && (
        <div className="text-center py-16">
          <div className="text-macSubtext text-sm mb-2">No opportunities found</div>
          <p className="text-macSubtext text-sm">
            {filterStage === 'all'
              ? 'Click "Add Opportunity" to create your first one'
              : `No opportunities in the "${filterStage}" stage`}
          </p>
        </div>
      )}

      {/* Opportunities grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onSelect={setSelectedOpportunity}
              onDelete={handleDeleteOpportunity}
              onUpdateStage={handleUpdateStage}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Add opportunity form modal */}
      <AnimatePresence>
        {showForm && (
          <OpportunityForm
            onSubmit={handleAddOpportunity}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Opportunity details modal (future feature) */}
      <AnimatePresence>
        {selectedOpportunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 z-50"
            onClick={() => setSelectedOpportunity(null)}
          >
            <div
              className="bg-macPanel/70 backdrop-blur-md rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border border-macBorder/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-base font-bold text-macText">{selectedOpportunity.company}</h2>
                  <p className="text-sm text-macSubtext mt-1">{selectedOpportunity.role}</p>
                </div>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-macSubtext hover:text-macText text-xl transition-all duration-300 ease-mac"
                >
                  ×
                </button>
              </div>

              {/* Detailed view content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-macText mb-3">Description</h3>
                  <p className="text-macSubtext text-sm leading-relaxed">{selectedOpportunity.details.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-macText mb-2">Location</h3>
                    <p className="text-macSubtext text-sm">{selectedOpportunity.details.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-macText mb-2">Salary Range</h3>
                    <p className="text-macSubtext text-sm">{selectedOpportunity.details.salary_range}</p>
                  </div>
                </div>

                {selectedOpportunity.details.tech_stack.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-macText mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.details.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-macHover/60 backdrop-blur-md text-macText text-xs rounded-mac"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOpportunity.notes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-macText mb-3">Notes</h3>
                    <div className="space-y-3">
                      {selectedOpportunity.notes.map((note, idx) => (
                        <div key={idx} className="bg-macHover/60 backdrop-blur-md rounded-mac p-4 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                          <div className="text-xs text-macSubtext mb-2">{note.date}</div>
                          <p className="text-macText text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOpportunity.fit_analysis.red_flags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-error mb-3">Red Flags</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedOpportunity.fit_analysis.red_flags.map((flag, idx) => (
                        <li key={idx} className="text-macSubtext text-sm">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedOpportunity.fit_analysis.green_flags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-success mb-3">Green Flags</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedOpportunity.fit_analysis.green_flags.map((flag, idx) => (
                        <li key={idx} className="text-macSubtext text-sm">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpportunityManager;
