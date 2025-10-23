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
    <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xs font-bold text-macText">Opportunities</h2>
          <p className="text-macSubtext text-xs mt-1">
            Track job applications and professional opportunities
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-2 bg-macAccent hover:bg-macAccent/80 text-white rounded-mac transition-all duration-300 ease-mac flex items-center gap-1 shadow-[inset_0_0_6px_rgba(10,132,255,0.1)]"
        >
          <span className="text-xs">+</span>
          Add Opportunity
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-4">
          <div className="bg-macHover/60 backdrop-blur-md rounded-mac p-2 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <div className="text-xs text-macSubtext">Total Active</div>
            <div className="text-xs font-bold text-macText mt-1">{data.active_count.total}</div>
          </div>
          <div className="bg-macHover/60 backdrop-blur-md rounded-mac p-2 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <div className="text-xs text-macSubtext">Interviewing</div>
            <div className="text-xs font-bold text-indigo-400 mt-1">{data.active_count.interviewing}</div>
          </div>
          <div className="bg-macHover/60 backdrop-blur-md rounded-mac p-2 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <div className="text-xs text-macSubtext">Offers</div>
            <div className="text-xs font-bold text-success mt-1">{data.active_count.offer}</div>
          </div>
          <div className="bg-macHover/60 backdrop-blur-md rounded-mac p-2 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
            <div className="text-xs text-macSubtext">Closed</div>
            <div className="text-xs font-bold text-macSubtext mt-1">{data.active_count.closed}</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {(['all', 'discovered', 'applied', 'interviewing', 'offer', 'closed'] as const).map(stage => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-3 py-2 rounded-mac text-xs font-medium transition-all duration-300 ease-mac ${
              filterStage === stage
                ? 'bg-macAccent text-white shadow-[inset_0_0_6px_rgba(10,132,255,0.1)]'
                : 'bg-macHover/60 backdrop-blur-md text-macText hover:bg-macHover'
            }`}
          >
            {stage.charAt(0).toUpperCase() + stage.slice(1)} ({stageCounts[stage]})
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
        <div className="bg-red-900/20 border border-red-700 rounded-mac p-2 mb-4 backdrop-blur-md">
          <p className="text-error text-xs">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-macSubtext text-xs mb-1">No opportunities found</div>
          <p className="text-macSubtext text-xs">
            {filterStage === 'all'
              ? 'Click "Add Opportunity" to create your first one'
              : `No opportunities in the "${filterStage}" stage`}
          </p>
        </div>
      )}

      {/* Opportunities grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
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
              className="bg-macPanel/70 backdrop-blur-md rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-1.5 border border-macBorder/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="text-xs font-bold text-macText">{selectedOpportunity.company}</h2>
                  <p className="text-xs text-macSubtext">{selectedOpportunity.role}</p>
                </div>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-macSubtext hover:text-macText text-xs transition-all duration-300 ease-mac"
                >
                  ×
                </button>
              </div>

              {/* Detailed view content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-macText mb-1">Description</h3>
                  <p className="text-macSubtext">{selectedOpportunity.details.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <h3 className="text-xs font-semibold text-macText mb-1">Location</h3>
                    <p className="text-macSubtext">{selectedOpportunity.details.location}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-macText mb-1">Salary Range</h3>
                    <p className="text-macSubtext">{selectedOpportunity.details.salary_range}</p>
                  </div>
                </div>

                {selectedOpportunity.details.tech_stack.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-macText mb-1">Tech Stack</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedOpportunity.details.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-macHover/60 backdrop-blur-md text-macText text-xs rounded-mac"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOpportunity.notes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-macText mb-1">Notes</h3>
                    <div className="space-y-1">
                      {selectedOpportunity.notes.map((note, idx) => (
                        <div key={idx} className="bg-macHover/60 backdrop-blur-md rounded-mac p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                          <div className="text-xs text-macSubtext mb-1">{note.date}</div>
                          <p className="text-macText text-xs">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOpportunity.fit_analysis.red_flags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-error mb-1">Red Flags</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedOpportunity.fit_analysis.red_flags.map((flag, idx) => (
                        <li key={idx} className="text-macSubtext text-xs">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedOpportunity.fit_analysis.green_flags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-success mb-1">Green Flags</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedOpportunity.fit_analysis.green_flags.map((flag, idx) => (
                        <li key={idx} className="text-macSubtext text-xs">{flag}</li>
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
