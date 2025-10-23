import React from 'react';

interface ProfileFormProps {
  personal: any;
  summary: string;
  onChange: (field: string, value: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ personal, summary, onChange }) => {
  return (
    <div className="bg-surface-elevated border border-border rounded shadow-sm p-8">
      <h2 className="text-sm font-bold text-slate-50 mb-1.5">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={personal.full_name || ''}
            onChange={(e) => onChange('full_name', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Title
          </label>
          <input
            type="text"
            value={personal.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={personal.tagline || ''}
            onChange={(e) => onChange('tagline', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Email
          </label>
          <input
            type="email"
            value={personal.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={personal.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Location
          </label>
          <input
            type="text"
            value={personal.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Website
          </label>
          <input
            type="url"
            value={personal.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            value={personal.linkedin || ''}
            onChange={(e) => onChange('linkedin', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            GitHub
          </label>
          <input
            type="url"
            value={personal.github || ''}
            onChange={(e) => onChange('github', e.target.value)}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Professional Summary
          </label>
          <textarea
            value={summary || ''}
            onChange={(e) => onChange('summary', e.target.value)}
            rows={6}
            className="w-full px-2 py-2 bg-surface-elevated border border-border text-slate-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="A brief overview of your professional background and expertise"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
