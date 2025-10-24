import React from 'react';

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
    <div className="space-y-6 p-6">
      <h2 className="text-lg font-bold text-macText mb-4">Skills</h2>

      {/* Programming Languages */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold text-macText">Programming Languages</h3>
          <button
            onClick={handleAddLanguage}
            className="px-4 py-2 bg-macAccent hover:bg-macAccent/80 text-white text-xs font-medium rounded-mac transition-all duration-300 ease-mac flex items-center gap-2"
          >
            <span className="text-sm">+</span>
            Add Language
          </button>
        </div>

        <div className="space-y-5">
          {skills.languages?.map((lang: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-xs text-macSubtext mb-1.5">Language</label>
                <input
                  type="text"
                  value={lang.name || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'name', e.target.value)}
                  className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-xs text-macSubtext mb-1.5">Proficiency</label>
                <input
                  type="text"
                  value={lang.proficiency || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'proficiency', e.target.value)}
                  placeholder="beginner/intermediate/advanced/expert"
                  className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-xs text-macSubtext mb-1.5">Years</label>
                <input
                  type="number"
                  value={lang.years || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'years', parseInt(e.target.value))}
                  className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
                />
              </div>
              <div className="col-span-12 md:col-span-2 flex items-end">
                <button
                  onClick={() => handleDeleteLanguage(index)}
                  className="w-full h-11 px-2 bg-error/20 hover:bg-error/30 text-error rounded-mac transition-all duration-300 ease-mac flex items-center justify-center"
                  aria-label="Delete language"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frameworks */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
        <h3 className="text-sm font-semibold text-macText mb-5">Frameworks</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-macSubtext mb-2">
              Backend Frameworks (comma-separated)
            </label>
            <input
              type="text"
              value={skills.frameworks?.backend?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('backend', e.target.value)}
              placeholder="e.g., .NET Core, ASP.NET, Entity Framework"
              className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.backend?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.frameworks.backend.map((fw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-primary-subtle text-macAccent text-xs rounded-mac border border-primary-muted">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-macSubtext mb-2">
              Frontend Frameworks (comma-separated)
            </label>
            <input
              type="text"
              value={skills.frameworks?.frontend?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('frontend', e.target.value)}
              placeholder="e.g., React, Angular, Next.js"
              className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.frontend?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.frameworks.frontend.map((fw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-primary-subtle text-macAccent text-xs rounded-mac border border-primary-muted">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-macSubtext mb-2">
              Mobile Frameworks (comma-separated)
            </label>
            <input
              type="text"
              value={skills.frameworks?.mobile?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('mobile', e.target.value)}
              placeholder="e.g., Ionic Framework, React Native"
              className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.mobile?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.frameworks.mobile.map((fw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-primary-subtle text-macAccent text-xs rounded-mac border border-primary-muted">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-macSubtext mb-2">
              UI Libraries (comma-separated)
            </label>
            <input
              type="text"
              value={skills.frameworks?.ui?.join(', ') || ''}
              onChange={(e) => handleFrameworksChange('ui', e.target.value)}
              placeholder="e.g., Bootstrap, Material-UI, DevExpress"
              className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
            />
            {skills.frameworks?.ui?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.frameworks.ui.map((fw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-primary-subtle text-macAccent text-xs rounded-mac border border-primary-muted">
                    {fw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Databases */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold text-macText">Databases</h3>
          <button
            onClick={handleAddDatabase}
            className="px-4 py-2 bg-macAccent hover:bg-macAccent/80 text-white text-xs font-medium rounded-mac transition-all duration-300 ease-mac flex items-center gap-2"
          >
            <span className="text-sm">+</span>
            Add Database
          </button>
        </div>

        <div className="space-y-5">
          {skills.databases?.map((db: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-5">
                <label className="block text-xs text-macSubtext mb-1.5">Database</label>
                <input
                  type="text"
                  value={db.name || ''}
                  onChange={(e) => handleDatabaseUpdate(index, 'name', e.target.value)}
                  className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
                />
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className="block text-xs text-macSubtext mb-1.5">Proficiency</label>
                <input
                  type="text"
                  value={db.proficiency || ''}
                  onChange={(e) => handleDatabaseUpdate(index, 'proficiency', e.target.value)}
                  className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac"
                />
              </div>
              <div className="col-span-12 md:col-span-2 flex items-end">
                <button
                  onClick={() => handleDeleteDatabase(index)}
                  className="w-full h-11 px-2 bg-error/20 hover:bg-error/30 text-error rounded-mac transition-all duration-300 ease-mac flex items-center justify-center"
                  aria-label="Delete database"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud & DevOps */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
        <h3 className="text-sm font-semibold text-macText mb-5">Cloud & DevOps</h3>
        <label className="block text-xs font-medium text-macSubtext mb-2">
          Cloud & DevOps Tools (comma-separated)
        </label>
        <input
          type="text"
          value={skills.cloud_devops?.join(', ') || ''}
          onChange={(e) => handleListChange('cloud_devops', e.target.value)}
          placeholder="e.g., Azure, AWS, Docker, Kubernetes, GitLab CI/CD"
          className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
        />
        {skills.cloud_devops?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.cloud_devops.map((tool: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-success-muted text-success text-xs rounded-md border border-success/30">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
        <h3 className="text-sm font-semibold text-macText mb-5">Tools</h3>
        <label className="block text-xs font-medium text-macSubtext mb-2">
          Development Tools (comma-separated)
        </label>
        <input
          type="text"
          value={skills.tools?.join(', ') || ''}
          onChange={(e) => handleListChange('tools', e.target.value)}
          placeholder="e.g., Git, Visual Studio, VS Code"
          className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
        />
        {skills.tools?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.tools.map((tool: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-warning-muted text-warning text-xs rounded-md border border-warning/30">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Domain Expertise */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6">
        <h3 className="text-sm font-semibold text-macText mb-5">Domain Expertise</h3>
        <label className="block text-xs font-medium text-macSubtext mb-2">
          Domain Areas (comma-separated)
        </label>
        <input
          type="text"
          value={skills.domain_expertise?.join(', ') || ''}
          onChange={(e) => handleListChange('domain_expertise', e.target.value)}
          placeholder="e.g., Finance, Real Estate Technology, Supply Chain"
          className="w-full h-11 px-4 py-2 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 text-macText text-sm rounded-mac focus:ring-1 focus:ring-macAccent focus:border-macAccent transition-all duration-300 ease-mac placeholder-text-disabled"
        />
        {skills.domain_expertise?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.domain_expertise.map((domain: string, i: number) => (
              <span key={i} className="px-2.5 py-1 bg-primary-subtle text-macAccent text-xs rounded-mac border border-primary-muted">
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
