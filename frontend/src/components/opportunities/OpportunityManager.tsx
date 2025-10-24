import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../icons';
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
    <div className="space-y-8 relative p-6">
      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
            <Icon name="target" size={28} className="text-macAccent" />
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
          className="px-6 py-3 gradient-accent text-white font-semibold rounded-xl transition-all duration-300 ease-mac hover-lift shadow-lg hover:shadow-accent group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Opportunity
          </span>
        </button>
      </div>

      {/* Enhanced Stats */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative liquid-glass rounded-xl p-5 shadow-lg border border-macBorder/30 hover-lift transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-macSubtext">Total Active</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gradient mb-1">{data.active_count.total}</div>
              <div className="text-[10px] text-macSubtext font-medium">opportunities</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative liquid-glass rounded-xl p-5 shadow-lg border border-indigo-500/20 hover-lift transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-macSubtext">Interviewing</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">{data.active_count.interviewing}</div>
              <div className="text-[10px] text-macSubtext font-medium">active interviews</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative liquid-glass rounded-xl p-5 shadow-lg border border-green-500/20 hover-lift transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-macSubtext">Offers</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-success mb-1">{data.active_count.offer}</div>
              <div className="text-[10px] text-macSubtext font-medium">pending offers</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative liquid-glass rounded-xl p-5 shadow-lg border border-macBorder/30 hover-lift transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-macBorder/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-macPanel/50 border border-macBorder/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-macSubtext">Closed</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-macSubtext mb-1">{data.active_count.closed}</div>
              <div className="text-[10px] text-macSubtext font-medium">archived</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6 relative z-10">
        {(['all', 'discovered', 'applied', 'interviewing', 'offer', 'closed'] as const).map((stage) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ease-mac shadow-md hover-lift border ${
              filterStage === stage
                ? 'gradient-accent text-white shadow-accent border-macAccent/30'
                : 'liquid-glass text-macText border-macBorder/30 hover:border-macAccent/40 hover:text-macAccent'
            }`}
          >
            <span className="flex items-center gap-2">
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                filterStage === stage
                  ? 'bg-white/20 text-white'
                  : 'bg-macPanel/50 text-macSubtext'
              }`}>
                {stageCounts[stage]}
              </span>
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
        <div className="text-center py-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
              <Icon name="target" size={40} className="text-macAccent" />
            </div>
          </div>
          <div className="text-macText text-base font-semibold mb-2">No opportunities found</div>
          <p className="text-macSubtext text-sm max-w-md mx-auto">
            {filterStage === 'all'
              ? 'Click "Add Opportunity" to create your first one and start tracking your career journey'
              : `No opportunities in the "${filterStage}" stage. Try selecting a different filter or add a new opportunity.`}
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
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOpportunity(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 border border-macBorder/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon name="target" size={32} className="text-macAccent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gradient mb-2">{selectedOpportunity.company}</h2>
                    <p className="text-base text-macText font-semibold mb-2">{selectedOpportunity.role}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-md ${
                        selectedOpportunity.stage === 'discovered' ? 'bg-slate-600' :
                        selectedOpportunity.stage === 'applied' ? 'bg-macAccent' :
                        selectedOpportunity.stage === 'interviewing' ? 'bg-indigo-600' :
                        selectedOpportunity.stage === 'offer' ? 'bg-green-600' :
                        'bg-macHover/60'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></span>
                        {selectedOpportunity.stage}
                      </span>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                        selectedOpportunity.priority === 'high' ? 'bg-error/10 text-error border border-error/30' :
                        selectedOpportunity.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                        'bg-macPanel/50 text-macSubtext border border-macBorder/30'
                      }`}>
                        {selectedOpportunity.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="w-12 h-12 flex items-center justify-center text-macSubtext hover:text-error bg-macPanel/40 hover:bg-error/10 border border-macBorder/30 hover:border-error/30 rounded-xl transition-all duration-300 ease-mac group flex-shrink-0"
                >
                  <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Detailed view content */}
              <div className="space-y-5">
                {/* Description Card */}
                <div className="relative liquid-glass rounded-xl p-6 border border-cyan-500/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-macText">Description</h3>
                    </div>
                    <p className="text-macText text-sm leading-relaxed">{selectedOpportunity.details.description}</p>
                  </div>
                </div>

                {/* Location and Salary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative liquid-glass rounded-xl p-5 border border-indigo-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-macText">Location</h3>
                      </div>
                      <p className="text-macText text-sm font-medium">{selectedOpportunity.details.location}</p>
                    </div>
                  </div>
                  <div className="relative liquid-glass rounded-xl p-5 border border-green-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                          <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-macText">Salary Range</h3>
                      </div>
                      <p className="text-success text-sm font-bold">{selectedOpportunity.details.salary_range}</p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                {selectedOpportunity.details.tech_stack.length > 0 && (
                  <div className="relative liquid-glass rounded-xl p-6 border border-purple-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-macText">Tech Stack</h3>
                        <span className="ml-auto px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-lg border border-purple-500/20">
                          {selectedOpportunity.details.tech_stack.length} technologies
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOpportunity.details.tech_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-2 bg-macPanel/70 backdrop-blur-md text-macText text-xs font-semibold rounded-lg border border-macBorder/30 hover:border-purple-400/40 hover:bg-macPanel transition-all duration-300 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOpportunity.notes.length > 0 && (
                  <div className="relative liquid-glass rounded-xl p-6 border border-amber-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-bold text-macText">Notes</h3>
                        <span className="ml-auto px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/20">
                          {selectedOpportunity.notes.length} notes
                        </span>
                      </div>
                      <div className="space-y-3">
                        {selectedOpportunity.notes.map((note, idx) => (
                          <div key={idx} className="bg-macPanel/40 rounded-lg p-4 border border-macBorder/30 hover:border-amber-400/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-macSubtext font-bold">{note.date}</span>
                            </div>
                            <p className="text-macText text-sm leading-relaxed">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Red/Green Flags Grid */}
                {(selectedOpportunity.fit_analysis.red_flags.length > 0 || selectedOpportunity.fit_analysis.green_flags.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOpportunity.fit_analysis.red_flags.length > 0 && (
                      <div className="relative liquid-glass rounded-xl p-6 border border-red-500/30 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                              <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-bold text-error">Red Flags</h3>
                            <span className="ml-auto px-2.5 py-1 bg-error/10 text-error text-[10px] font-bold rounded-lg border border-error/20">
                              {selectedOpportunity.fit_analysis.red_flags.length}
                            </span>
                          </div>
                          <ul className="space-y-2.5">
                            {selectedOpportunity.fit_analysis.red_flags.map((flag, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-macText text-sm bg-macPanel/30 rounded-lg p-3 border border-red-500/10">
                                <svg className="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {selectedOpportunity.fit_analysis.green_flags.length > 0 && (
                      <div className="relative liquid-glass rounded-xl p-6 border border-green-500/30 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                              <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-bold text-success">Green Flags</h3>
                            <span className="ml-auto px-2.5 py-1 bg-success/10 text-success text-[10px] font-bold rounded-lg border border-success/20">
                              {selectedOpportunity.fit_analysis.green_flags.length}
                            </span>
                          </div>
                          <ul className="space-y-2.5">
                            {selectedOpportunity.fit_analysis.green_flags.map((flag, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-macText text-sm bg-macPanel/30 rounded-lg p-3 border border-green-500/10">
                                <svg className="w-4 h-4 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpportunityManager;
