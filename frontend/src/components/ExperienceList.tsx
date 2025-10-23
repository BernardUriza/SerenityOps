import React from 'react';

interface ExperienceListProps {
  experiences: any[];
  onChange: (experiences: any[]) => void;
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences, onChange }) => {
  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddExperience = () => {
    onChange([
      ...experiences,
      {
        company: '',
        role: '',
        location: '',
        start_date: '',
        end_date: null,
        current: true,
        description: '',
        achievements: [],
        tech_stack: []
      }
    ]);
  };

  const handleDelete = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].achievements[achIndex] = value;
    onChange(updated);
  };

  const handleAddAchievement = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements.push('');
    onChange(updated);
  };

  const handleTechStackChange = (expIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].tech_stack = value.split(',').map(t => t.trim()).filter(t => t);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-macText">Work Experience</h2>
        <button
          onClick={handleAddExperience}
          className="flex items-center gap-2 px-4 py-2 bg-macAccent hover:bg-macAccent/80 text-white rounded-mac transition-all duration-300 ease-mac shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {/* Experience Cards */}
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac shadow-[0_2px_6px_rgba(0,0,0,0.2)] p-5"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-macText">Experience {index + 1}</h3>
            <button
              onClick={() => handleDelete(index)}
              className="p-2 hover:bg-red-500/10 rounded-mac transition-all duration-300 ease-mac text-red-500"
              aria-label="Delete experience"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company */}
            <div>
              <label className="block text-xs text-macSubtext mb-1.5">Company</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => handleUpdate(index, 'company', e.target.value)}
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs text-macSubtext mb-1.5">Role</label>
              <input
                type="text"
                value={exp.role || ''}
                onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs text-macSubtext mb-1.5">Location</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
              />
            </div>

            {/* Start Date */}
            <div className="md:col-span-1">
              <label className="block text-xs text-macSubtext mb-1.5">Start Date</label>
              <input
                type="text"
                placeholder="YYYY-MM"
                value={exp.start_date || ''}
                onChange={(e) => handleUpdate(index, 'start_date', e.target.value)}
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
              />
            </div>

            {/* End Date */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs text-macSubtext mb-1.5">End Date</label>
              <input
                type="text"
                placeholder="YYYY-MM or leave empty"
                value={exp.end_date || ''}
                onChange={(e) => handleUpdate(index, 'end_date', e.target.value || null)}
                disabled={exp.current}
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Currently Working Checkbox */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current || false}
                  onChange={(e) => {
                    handleUpdate(index, 'current', e.target.checked);
                    if (e.target.checked) {
                      handleUpdate(index, 'end_date', null);
                    }
                  }}
                  className="w-4 h-4 rounded border-macBorder/40 text-macAccent focus:ring-macAccent/40 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-macText">Currently working here</span>
              </label>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs text-macSubtext mb-1.5">Description</label>
              <textarea
                value={exp.description || ''}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac resize-y"
              />
            </div>

            {/* Achievements */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-macSubtext">Achievements</label>
              </div>
              <div className="space-y-2">
                {exp.achievements?.map((achievement: string, achIndex: number) => (
                  <div key={achIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, achIndex, e.target.value)}
                      placeholder="Achievement description"
                      className="flex-1 px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
                    />
                    <button
                      onClick={() => {
                        const updated = [...experiences];
                        updated[index].achievements.splice(achIndex, 1);
                        onChange(updated);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-mac transition-all duration-300 ease-mac text-red-500"
                      aria-label="Delete achievement"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddAchievement(index)}
                  className="px-3 py-1.5 text-sm text-macAccent hover:bg-macAccent/10 rounded-mac transition-all duration-300 ease-mac"
                >
                  Add Achievement
                </button>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="md:col-span-2">
              <label className="block text-xs text-macSubtext mb-1.5">Tech Stack (comma-separated)</label>
              <input
                type="text"
                value={exp.tech_stack?.join(', ') || ''}
                onChange={(e) => handleTechStackChange(index, e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js"
                className="w-full px-3 py-2 bg-macPanel/60 border border-macBorder/40 rounded-mac text-macText text-sm focus:border-macAccent focus:ring-1 focus:ring-macAccent/40 focus:outline-none transition-all duration-300 ease-mac"
              />
              <p className="mt-1 text-xs text-macSubtext">e.g., React, TypeScript, Node.js</p>
              {exp.tech_stack && exp.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.tech_stack.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-macPanel/60 backdrop-blur-md border border-macBorder/40 rounded-mac text-xs text-macSubtext"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
