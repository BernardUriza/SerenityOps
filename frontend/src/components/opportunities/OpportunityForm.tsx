import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CreateOpportunityRequest, OpportunityStage, OpportunityPriority } from '../../types/opportunity';

interface OpportunityFormProps {
  onSubmit: (data: CreateOpportunityRequest) => Promise<void>;
  onCancel: () => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({ onSubmit, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    stage: 'discovered' as OpportunityStage,
    priority: 'medium' as OpportunityPriority,
    description: '',
    location: '',
    salary_range: '',
    work_schedule: '',
    sector: '',
    tech_stack: ''  // Comma-separated string, will split later
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const requestData: CreateOpportunityRequest = {
        company: formData.company,
        role: formData.role,
        stage: formData.stage,
        priority: formData.priority,
        details: {
          description: formData.description,
          location: formData.location,
          salary_range: formData.salary_range,
          work_schedule: formData.work_schedule || undefined,
          sector: formData.sector || undefined,
          tech_stack: formData.tech_stack
            ? formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
            : []
        }
      };

      await onSubmit(requestData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create opportunity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-100">Add New Opportunity</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Grupo Toka Internacional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Full Stack Developer"
              />
            </div>
          </div>

          {/* Stage and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="discovered">Discovered</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Brief description of the role and responsibilities..."
            />
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Remote, Guadalajara"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Salary Range <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.salary_range}
                onChange={(e) => handleChange('salary_range', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., 30000-35000 MXN/month"
              />
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Work Schedule</label>
              <input
                type="text"
                value={formData.work_schedule}
                onChange={(e) => handleChange('work_schedule', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Lunes a Viernes 09:00-18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sector</label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => handleChange('sector', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Fintech, SaaS, E-commerce"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tech_stack}
              onChange={(e) => handleChange('tech_stack', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., Python, Django, Redis, AWS, Docker"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default OpportunityForm;
