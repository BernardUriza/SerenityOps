import React from 'react';
import { Icon } from '../icons';

interface EducationListProps {
  education: any[];
  languages: any[];
  certifications: any[];
  onChange: (field: string, value: any) => void;
}

const EducationList: React.FC<EducationListProps> = ({
  education,
  languages,
  onChange
}) => {
  const handleEducationUpdate = (index: number, field: string, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange('education', updated);
  };

  const handleAddEducation = () => {
    onChange('education', [
      ...education,
      {
        institution: '',
        degree: '',
        field: '',
        start_date: '',
        end_date: '',
        status: 'completed'
      }
    ]);
  };

  const handleDeleteEducation = (index: number) => {
    onChange('education', education.filter((_, i) => i !== index));
  };

  const handleLanguageUpdate = (index: number, field: string, value: any) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    onChange('languages', updated);
  };

  const handleAddLanguage = () => {
    onChange('languages', [
      ...languages,
      { name: '', proficiency: '' }
    ]);
  };

  const handleDeleteLanguage = (index: number) => {
    onChange('languages', languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 relative p-6">
      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
          <Icon name="graduation-cap" size={28} className="text-macAccent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient mb-1">Education & Languages</h2>
          <p className="text-sm text-macSubtext">Academic background and spoken languages</p>
        </div>
      </div>

      {/* Education */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-macText">Education</h3>
              <p className="text-xs text-macSubtext mt-0.5">{education.length} academic records</p>
            </div>
          </div>
          <button
            onClick={handleAddEducation}
            className="px-4 py-2.5 gradient-accent text-white text-xs font-semibold rounded-xl transition-all duration-300 ease-mac hover-lift shadow-lg hover:shadow-accent group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Education
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu, index) => (
            <div
              key={index}
              className="liquid-glass rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-500">#{index + 1}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-macText">
                    {edu.institution || 'New Education'}
                  </h4>
                </div>
                <button
                  onClick={() => handleDeleteEducation(index)}
                  className="px-3 py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all duration-300 ease-mac flex items-center gap-1.5 group/btn"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-xs font-medium">Delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleEducationUpdate(index, 'institution', e.target.value)}
                    placeholder="e.g., Stanford University"
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationUpdate(index, 'degree', e.target.value)}
                    placeholder="e.g., Bachelor of Science"
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => handleEducationUpdate(index, 'field', e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    value={edu.start_date || ''}
                    onChange={(e) => handleEducationUpdate(index, 'start_date', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM or Present"
                    value={edu.end_date || ''}
                    onChange={(e) => handleEducationUpdate(index, 'end_date', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Status
                  </label>
                  <select
                    value={edu.status || 'completed'}
                    onChange={(e) => handleEducationUpdate(index, 'status', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="paused">Paused</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-macText">Spoken Languages</h3>
              <p className="text-xs text-macSubtext mt-0.5">{languages.length} languages spoken</p>
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
          {languages.map((lang, index) => (
            <div key={index} className="liquid-glass rounded-xl p-5 border border-pink-500/20 hover:border-pink-500/30 transition-all duration-300 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    value={lang.name || ''}
                    onChange={(e) => handleLanguageUpdate(index, 'name', e.target.value)}
                    placeholder="e.g., English, Spanish"
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText placeholder-macSubtext/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-macSubtext mb-2">
                    Proficiency Level
                  </label>
                  <select
                    value={lang.proficiency || ''}
                    onChange={(e) => handleLanguageUpdate(index, 'proficiency', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-macPanel/50 border border-macBorder/40 rounded-xl text-macText focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all duration-300 ease-mac"
                  >
                    <option value="">Select level</option>
                    <option value="native">Native</option>
                    <option value="fluent">Fluent</option>
                    <option value="professional">Professional Working</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="beginner">Beginner</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => handleDeleteLanguage(index)}
                    className="w-full px-3 py-2.5 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all duration-300 ease-mac flex items-center justify-center group/btn"
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

      {/* Certifications */}
      <div className="liquid-glass rounded-2xl shadow-lg border border-macBorder/30 p-8 relative z-10 hover-lift transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-macText">Certifications</h3>
            <p className="text-xs text-macSubtext mt-0.5">Professional credentials and badges</p>
          </div>
        </div>

        <div className="text-center py-12 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg className="w-32 h-32 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-semibold text-amber-500">Coming Soon</span>
            </div>
            <p className="text-sm font-medium text-macText mb-2">
              Certifications editor is under development
            </p>
            <p className="text-xs text-macSubtext max-w-md mx-auto leading-relaxed">
              For now, you can manually edit certifications in the YAML file.<br/>
              This feature will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationList;
