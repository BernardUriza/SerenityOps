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
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-surface-elevated rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-1.5 border-b border-border">
          <h2 className="text-xs font-semibold text-text-primary">Add New Opportunity</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-1.5 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Company <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Grupo Toka Internacional"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Role <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Full Stack Developer"
              />
            </div>
          </div>

          {/* Stage and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="discovered">Discovered</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Brief description of the role and responsibilities..."
            />
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Location <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Remote, Guadalajara"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Salary Range <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.salary_range}
                onChange={(e) => handleChange('salary_range', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., 30000-35000 MXN/month"
              />
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Work Schedule</label>
              <input
                type="text"
                value={formData.work_schedule}
                onChange={(e) => handleChange('work_schedule', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Lunes a Viernes 09:00-18:00"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Sector</label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => handleChange('sector', e.target.value)}
                className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Fintech, SaaS, E-commerce"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tech_stack}
              onChange={(e) => handleChange('tech_stack', e.target.value)}
              className="w-full px-3 py-1 bg-surface-hover border border-border-strong rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., Python, Django, Redis, AWS, Docker"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-1.5 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-2 py-1 bg-surface-hover hover:bg-slate-600 text-text-secondary rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-2 py-1 bg-sky-600 hover:bg-primary text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
