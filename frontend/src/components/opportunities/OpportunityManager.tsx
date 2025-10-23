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
    await addOpportunity(apiBaseUrl, formData);
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
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Opportunities</h2>
          <p className="text-slate-400 text-sm mt-1">
            Track job applications and professional opportunities
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add Opportunity
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400">Total Active</div>
            <div className="text-2xl font-bold text-slate-100 mt-1">{data.active_count.total}</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400">Interviewing</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{data.active_count.interviewing}</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400">Offers</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{data.active_count.offer}</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400">Closed</div>
            <div className="text-2xl font-bold text-slate-500 mt-1">{data.active_count.closed}</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'discovered', 'applied', 'interviewing', 'offer', 'closed'] as const).map(stage => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStage === stage
                ? 'bg-sky-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {stage.charAt(0).toUpperCase() + stage.slice(1)} ({stageCounts[stage]})
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500 text-lg mb-2">No opportunities found</div>
          <p className="text-slate-600 text-sm">
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
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOpportunity(null)}
          >
            <div
              className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedOpportunity.company}</h2>
                  <p className="text-lg text-slate-400">{selectedOpportunity.role}</p>
                </div>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-slate-400 hover:text-slate-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Detailed view content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Description</h3>
                  <p className="text-slate-400">{selectedOpportunity.details.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Location</h3>
                    <p className="text-slate-400">{selectedOpportunity.details.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Salary Range</h3>
                    <p className="text-slate-400">{selectedOpportunity.details.salary_range}</p>
                  </div>
                </div>

                {selectedOpportunity.details.tech_stack.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.details.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOpportunity.notes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Notes</h3>
                    <div className="space-y-2">
                      {selectedOpportunity.notes.map((note, idx) => (
                        <div key={idx} className="bg-slate-700 rounded p-3">
                          <div className="text-xs text-slate-500 mb-1">{note.date}</div>
                          <p className="text-slate-300 text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOpportunity.fit_analysis.red_flags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 mb-2">Red Flags</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedOpportunity.fit_analysis.red_flags.map((flag, idx) => (
                        <li key={idx} className="text-slate-400 text-sm">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedOpportunity.fit_analysis.green_flags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-400 mb-2">Green Flags</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedOpportunity.fit_analysis.green_flags.map((flag, idx) => (
                        <li key={idx} className="text-slate-400 text-sm">{flag}</li>
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
