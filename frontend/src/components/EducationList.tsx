import React from 'react';

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
    <div className="animate-scale-in space-y-8 relative">
      {/* Decorative gradient orbs */}
      <div className="gradient-orb fixed top-[12%] right-[20%] w-[600px] h-[600px] bg-indigo-500/15 -z-10"></div>
      <div className="gradient-orb fixed bottom-[10%] left-[12%] w-[500px] h-[500px] bg-pink-500/12 -z-10" style={{ animationDelay: '5s' }}></div>

      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
          <svg className="w-7 h-7 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient mb-1">Education & Languages</h2>
          <p className="text-sm text-macSubtext">Academic background and spoken languages</p>
        </div>
      </div>

      {/* Education */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-macText">Education</h3>
          <button
            onClick={handleAddEducation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-macAccent hover:bg-macAccent/80 text-white text-xs font-medium rounded-mac transition-all duration-300 ease-mac"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Education
          </button>
        </div>

        <div className="space-y-3">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-macPanel/60 border border-macBorder/40 rounded-mac p-3"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-macText">Education {index + 1}</h4>
                <button
                  onClick={() => handleDeleteEducation(index)}
                  className="p-1.5 bg-macPanel/60 hover:bg-macHover/60 border border-macBorder/40 rounded-mac transition-all duration-300 ease-mac"
                >
                  <svg className="w-4 h-4 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-macSubtext uppercase mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleEducationUpdate(index, 'institution', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div>
                  <label className="block text-xs text-macSubtext uppercase mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationUpdate(index, 'degree', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-macSubtext uppercase mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => handleEducationUpdate(index, 'field', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div>
                  <label className="block text-xs text-macSubtext uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    value={edu.start_date || ''}
                    onChange={(e) => handleEducationUpdate(index, 'start_date', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div>
                  <label className="block text-xs text-macSubtext uppercase mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    value={edu.end_date || ''}
                    onChange={(e) => handleEducationUpdate(index, 'end_date', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-macSubtext uppercase mb-1">
                    Status
                  </label>
                  <input
                    type="text"
                    value={edu.status || ''}
                    onChange={(e) => handleEducationUpdate(index, 'status', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                  />
                  <p className="text-xs text-macSubtext/70 mt-1">completed, in-progress, etc.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-macText">Spoken Languages</h3>
          <button
            onClick={handleAddLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-macAccent hover:bg-macAccent/80 text-white text-xs font-medium rounded-mac transition-all duration-300 ease-mac"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Language
          </button>
        </div>

        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-5">
                <label className="block text-xs text-macSubtext uppercase mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={lang.name || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs text-macSubtext uppercase mb-1">
                  Proficiency
                </label>
                <input
                  type="text"
                  value={lang.proficiency || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'proficiency', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText placeholder-macSubtext/50 focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                />
                <p className="text-xs text-macSubtext/70 mt-1">native, fluent, professional, etc.</p>
              </div>

              <div className="md:col-span-1 md:pt-6">
                <button
                  onClick={() => handleDeleteLanguage(index)}
                  className="p-1.5 bg-macPanel/60 hover:bg-macHover/60 border border-macBorder/40 rounded-mac transition-all duration-300 ease-mac"
                >
                  <svg className="w-4 h-4 text-macSubtext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-6 relative z-10">
        <h3 className="text-base font-semibold text-macText mb-6">
          Certifications
        </h3>
        <p className="text-sm text-macSubtext">
          Certifications section coming soon. You can manually edit the YAML for now.
        </p>
      </div>
    </div>
  );
};

export default EducationList;
