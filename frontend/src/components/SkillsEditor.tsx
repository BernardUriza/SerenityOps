import React from 'react';
import { Icon } from '../icons';

interface SkillsEditorProps {
  skills: any;
  onChange: (skills: any) => void;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const handleLanguageUpdate = (index: number, field: string, value: any) => {
    const updated = { ...skills };
    updated.languages[index] = { ...updated.languages[index], [field]: value };
    onChange(updated);
  };

  const handleAddLanguage = () => {
    onChange({
      ...skills,
      languages: [...skills.languages, { name: '', proficiency: '', years: 0 }]
    });
  };

  const handleDeleteLanguage = (index: number) => {
    onChange({
      ...skills,
      languages: skills.languages.filter((_: any, i: number) => i !== index)
    });
  };

  const handleDatabaseUpdate = (index: number, field: string, value: any) => {
    const updated = { ...skills };
    updated.databases[index] = { ...updated.databases[index], [field]: value };
    onChange(updated);
  };

  const handleAddDatabase = () => {
    onChange({
      ...skills,
      databases: [...skills.databases, { name: '', proficiency: '' }]
    });
  };

  const handleDeleteDatabase = (index: number) => {
    onChange({
      ...skills,
      databases: skills.databases.filter((_: any, i: number) => i !== index)
    });
  };

  const handleListChange = (field: string, value: string) => {
    onChange({
      ...skills,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    });
  };

  const handleFrameworksChange = (category: string, value: string) => {
    onChange({
      ...skills,
      frameworks: {
        ...skills.frameworks,
        [category]: value.split(',').map(item => item.trim()).filter(item => item)
      }
    });
  };

  return (
    <div className="animate-scale-in space-y-8 relative p-6">
      {/* Decorative gradient orbs */}
      <div className="gradient-orb fixed top-[10%] right-[18%] w-[600px] h-[600px] bg-green-500/15 -z-10"></div>
      <div className="gradient-orb fixed bottom-[12%] left-[10%] w-[500px] h-[500px] bg-blue-500/12 -z-10" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
          <Icon name="lightning" size={28} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient mb-1">Skills & Expertise</h2>
          <p className="text-sm text-macSubtext">Your technical toolkit and domain knowledge</p>
        </div>
      </div>

      {/* Programming Languages */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-macAccent/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-macText">Programming Languages</h3>
              <p className="text-xs text-macSubtext mt-0.5">{skills.languages?.length || 0} languages tracked</p>
            </div>
          </div>
          <button
            onClick={handleAddLanguage}
            className="px-4 py-2.5 gradient-accent text-white text-xs font-semibold rounded-xl transition-all duration-300 ease-mac hover-lift shadow-lg hover:shadow-accent group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Language
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {skills.languages?.map((lang: any, index: number) => (
            <div key={index} className="liquid-glass rounded-xl p-5 border border-macBorder/30 hover:border-macAccent/30 transition-all duration-300 group">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-xs font-medium text-macSubtext mb-2">Language</label>
                  <input
                    type="text"
                    value={lang.name || ''}
                    onChange={(e) => handleLanguageUpdate(index, 'name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent transition-all duration-300 ease-mac"
                  />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-xs font-medium text-macSubtext mb-2">Proficiency</label>
                  <select
                    value={lang.proficiency || ''}
                    onChange={(e) => handleLanguageUpdate(index, 'proficiency', e.target.value)}
                    className="w-full px-4 py-2.5 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent transition-all duration-300 ease-mac"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-xs font-medium text-macSubtext mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={lang.years || ''}
                    onChange={(e) => handleLanguageUpdate(index, 'years', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-macAccent/50 focus:border-macAccent transition-all duration-300 ease-mac"
                    min="0"
                  />
                </div>
                <div className="col-span-12 md:col-span-2 flex items-end">
                  <button
                    onClick={() => handleDeleteLanguage(index)}
                    className="w-full px-3 py-2.5 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all duration-300 ease-mac flex items-center justify-center group/btn"
                    aria-label="Delete language"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frameworks */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-macText">Frameworks & Libraries</h3>
            <p className="text-xs text-macSubtext mt-0.5">Backend, Frontend, Mobile, and UI frameworks</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Backend Frameworks Card */}
          <div className="liquid-glass rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <label className="text-xs font-semibold text-macText">Backend Frameworks</label>
            </div>
            <input
              type="text"
              value={skills.frameworks?.backend?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('backend', e.target.value)}
              placeholder="e.g., .NET Core, ASP.NET"
              className="w-full h-10 px-3 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.backend?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.frameworks.backend.map((fw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-lg border border-purple-500/20">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Frontend Frameworks Card */}
          <div className="liquid-glass rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <label className="text-xs font-semibold text-macText">Frontend Frameworks</label>
            </div>
            <input
              type="text"
              value={skills.frameworks?.frontend?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('frontend', e.target.value)}
              placeholder="e.g., React, Angular, Next.js"
              className="w-full h-10 px-3 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.frontend?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.frameworks.frontend.map((fw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-500/20">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Frameworks Card */}
          <div className="liquid-glass rounded-xl p-5 border border-pink-500/20 hover:border-pink-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <label className="text-xs font-semibold text-macText">Mobile Frameworks</label>
            </div>
            <input
              type="text"
              value={skills.frameworks?.mobile?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('mobile', e.target.value)}
              placeholder="e.g., Ionic, React Native"
              className="w-full h-10 px-3 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.mobile?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.frameworks.mobile.map((fw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-pink-500/10 text-pink-400 text-xs font-medium rounded-lg border border-pink-500/20">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* UI Libraries Card */}
          <div className="liquid-glass rounded-xl p-5 border border-amber-500/20 hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <label className="text-xs font-semibold text-macText">UI Libraries</label>
            </div>
            <input
              type="text"
              value={skills.frameworks?.ui?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('ui', e.target.value)}
              placeholder="e.g., Bootstrap, Material-UI"
              className="w-full h-10 px-3 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.ui?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.frameworks.ui.map((fw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-lg border border-amber-500/20">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Databases */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-macText">Databases</h3>
              <p className="text-xs text-macSubtext mt-0.5">{skills.databases?.length || 0} databases mastered</p>
            </div>
          </div>
          <button
            onClick={handleAddDatabase}
            className="px-4 py-2.5 gradient-accent text-white text-xs font-semibold rounded-xl transition-all duration-300 ease-mac hover-lift shadow-lg hover:shadow-accent group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Database
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {skills.databases?.map((db: any, index: number) => (
            <div key={index} className="liquid-glass rounded-xl p-5 border border-macBorder/30 hover:border-green-500/30 transition-all duration-300 group">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs font-medium text-macSubtext mb-2">Database</label>
                  <input
                    type="text"
                    value={db.name || ''}
                    onChange={(e) => handleDatabaseUpdate(index, 'name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 ease-mac"
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs font-medium text-macSubtext mb-2">Proficiency</label>
                  <select
                    value={db.proficiency || ''}
                    onChange={(e) => handleDatabaseUpdate(index, 'proficiency', e.target.value)}
                    className="w-full px-4 py-2.5 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 ease-mac"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="col-span-12 md:col-span-2 flex items-end">
                  <button
                    onClick={() => handleDeleteDatabase(index)}
                    className="w-full px-3 py-2.5 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all duration-300 ease-mac flex items-center justify-center group/btn"
                    aria-label="Delete database"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud & DevOps */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-macText">Cloud & DevOps</h3>
            <p className="text-xs text-macSubtext mt-0.5">{skills.cloud_devops?.length || 0} tools mastered</p>
          </div>
        </div>
        <label className="block text-xs font-medium text-macSubtext mb-2">
          Cloud & DevOps Tools (comma-separated)
        </label>
        <input
          type="text"
          value={skills.cloud_devops?.join(', ') || ''}
          onChange={(e) => handleListChange('cloud_devops', e.target.value)}
          placeholder="e.g., Azure, AWS, Docker, Kubernetes, GitLab CI/CD"
          className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ease-mac placeholder-text-disabled"
        />
        {skills.cloud_devops?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.cloud_devops.map((tool: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/20">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-macText">Development Tools</h3>
            <p className="text-xs text-macSubtext mt-0.5">{skills.tools?.length || 0} tools in your arsenal</p>
          </div>
        </div>
        <label className="block text-xs font-medium text-macSubtext mb-2">
          Development Tools (comma-separated)
        </label>
        <input
          type="text"
          value={skills.tools?.join(', ') || ''}
          onChange={(e) => handleListChange('tools', e.target.value)}
          placeholder="e.g., Git, Visual Studio, VS Code"
          className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 ease-mac placeholder-text-disabled"
        />
        {skills.tools?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.tools.map((tool: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 text-xs font-medium rounded-lg border border-orange-500/20">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Domain Expertise */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-macText">Domain Expertise</h3>
            <p className="text-xs text-macSubtext mt-0.5">{skills.domain_expertise?.length || 0} industry domains</p>
          </div>
        </div>

        <label className="block text-xs font-medium text-macSubtext mb-2">
          Domain Areas (comma-separated)
        </label>
        <input
          type="text"
          value={skills.domain_expertise?.join(', ') || ''}
          onChange={(e) => handleListChange('domain_expertise', e.target.value)}
          placeholder="e.g., Finance, Real Estate Technology, Supply Chain"
          className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-xl focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
        />
        {skills.domain_expertise?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.domain_expertise.map((domain: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-500 text-xs font-medium rounded-lg border border-indigo-500/20">
                {domain}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsEditor;
