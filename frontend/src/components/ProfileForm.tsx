import React from 'react';

interface ProfileFormProps {
  personal: any;
  summary: string;
  onChange: (field: string, value: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ personal, summary, onChange }) => {
  const summaryMaxLength = 500;
  const summaryLength = (summary || '').length;
  const summaryPercentage = (summaryLength / summaryMaxLength) * 100;

  return (
    <div className="animate-tilt-in space-y-10 relative p-6">
      {/* Animated gradient orbs - Larger & More Dynamic */}
      <div className="gradient-orb fixed top-[5%] right-[15%] w-[600px] h-[600px] bg-macAccent/15 -z-10"></div>
      <div className="gradient-orb fixed bottom-[10%] left-[5%] w-[500px] h-[500px] bg-purple-500/12 -z-10" style={{ animationDelay: '4s' }}></div>

      {/* Floating particles */}
      <div className="particle fixed top-[15%] right-[25%]"></div>
      <div className="particle fixed top-[65%] left-[15%]" style={{ animationDelay: '2s' }}></div>
      <div className="particle fixed bottom-[25%] right-[35%]" style={{ animationDelay: '4s' }}></div>

      {/* Header with gradient accent - No Border */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
            <svg className="w-7 h-7 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-1">Personal Information</h2>
            <p className="text-sm text-macSubtext">Build your professional identity</p>
          </div>
        </div>
      </div>

      <div className="space-y-10 relative z-10">
        {/* Identity Section */}
        <div className="liquid-glass rounded-2xl p-8 shadow-lg">
          <h3 className="text-sm font-semibold text-macText mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-macAccent rounded-full"></div>
            Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={personal.full_name || ''}
                onChange={(e) => onChange('full_name', e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
              Professional Title
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="text"
                value={personal.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                placeholder="Senior Software Engineer"
              />
            </div>
          </div>

          <div className="md:col-span-2 group">
            <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
              Tagline
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <input
                type="text"
                value={personal.tagline || ''}
                onChange={(e) => onChange('tagline', e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                placeholder="Building elegant solutions to complex problems"
              />
            </div>
          </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="liquid-glass rounded-2xl p-8 shadow-lg">
          <h3 className="text-sm font-semibold text-macText mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-macAccent rounded-full"></div>
            Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={personal.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
                Phone
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={personal.phone || ''}
                  onChange={(e) => onChange('phone', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
                Location
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={personal.location || ''}
                  onChange={(e) => onChange('location', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
                Website
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macAccent transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={personal.website || ''}
                  onChange={(e) => onChange('website', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="liquid-glass rounded-2xl p-8 shadow-lg">
          <h3 className="text-sm font-semibold text-macText mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-macAccent rounded-full"></div>
            Professional Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
                LinkedIn
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-[#0A66C2] transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  value={personal.linkedin || ''}
                  onChange={(e) => onChange('linkedin', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-[#0A66C2]/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-macSubtext mb-3 uppercase tracking-wide">
                GitHub
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-macSubtext group-focus-within:text-macText transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={personal.github || ''}
                  onChange={(e) => onChange('github', e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="liquid-glass rounded-2xl p-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-macAccent rounded-full"></div>
              <div>
                <label className="block text-sm font-semibold text-macText">
                  Professional Summary
                </label>
                <p className="text-xs text-macSubtext mt-1">A compelling overview of your expertise and career highlights</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-medium transition-colors duration-300 ${
                summaryLength > summaryMaxLength ? 'text-error' :
                summaryLength > summaryMaxLength * 0.9 ? 'text-warning' :
                'text-macSubtext'
              }`}>
                {summaryLength} / {summaryMaxLength}
              </span>
              <div className="w-24 h-1.5 bg-macBg rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-mac ${
                    summaryLength > summaryMaxLength ? 'bg-error' :
                    summaryLength > summaryMaxLength * 0.9 ? 'bg-warning' :
                    'bg-gradient-to-r from-macAccent/60 to-macAccent'
                  }`}
                  style={{ width: `${Math.min(summaryPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="relative group">
            <textarea
              value={summary || ''}
              onChange={(e) => onChange('summary', e.target.value)}
              rows={7}
              maxLength={summaryMaxLength}
              className="w-full px-4 py-4 bg-macBg/60 backdrop-blur-sm text-macText rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:bg-macBg/80 transition-all duration-300 ease-mac text-sm leading-relaxed resize-none outline-none"
              placeholder="Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Led teams of 5+ engineers in delivering high-impact products that serve millions of users."
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-focus-within:opacity-100 transition-all duration-300 transform group-focus-within:scale-110">
              <svg className="w-5 h-5 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
