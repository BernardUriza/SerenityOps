import React from 'react';

interface ProfileFormProps {
  personal: any;
  summary: string;
  onChange: (field: string, value: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ personal, summary, onChange }) => {
  return (
    <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
      <h2 className="text-sm font-bold text-macText mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={personal.full_name || ''}
            onChange={(e) => onChange('full_name', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Title
          </label>
          <input
            type="text"
            value={personal.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={personal.tagline || ''}
            onChange={(e) => onChange('tagline', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Email
          </label>
          <input
            type="email"
            value={personal.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={personal.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Location
          </label>
          <input
            type="text"
            value={personal.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Website
          </label>
          <input
            type="url"
            value={personal.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            value={personal.linkedin || ''}
            onChange={(e) => onChange('linkedin', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-macSubtext mb-2">
            GitHub
          </label>
          <input
            type="url"
            value={personal.github || ''}
            onChange={(e) => onChange('github', e.target.value)}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="block text-sm font-medium text-macSubtext mb-2">
            Professional Summary
          </label>
          <textarea
            value={summary || ''}
            onChange={(e) => onChange('summary', e.target.value)}
            rows={6}
            className="w-full px-3 py-2.5 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 text-macText rounded-mac focus:ring-2 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
            placeholder="A brief overview of your professional background and expertise"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
