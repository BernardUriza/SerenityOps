import { useState, useEffect } from 'react';

import ProfileForm from './components/ProfileForm';
import { ExperienceEditor } from './components/experience';
import ProjectsManager from './components/ProjectsManager';
import SkillsEditor from './components/SkillsEditor';
import EducationList from './components/EducationList';
import CVManager from './components/CVManager';
import QuickImport from './components/QuickImport';
import CareerChat from './components/CareerChat';

// API configuration
const API_BASE_URL = 'http://localhost:8000';

type TabType = 'chat' | 'import' | 'profile' | 'experience' | 'projects' | 'skills' | 'education' | 'finances' | 'opportunities' | 'cvs';

function App() {
  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    loadCurriculum();
  }, []);

  const loadCurriculum = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/curriculum`);
      if (!response.ok) throw new Error('Failed to load curriculum');
      const data = await response.json();
      setCurriculum(data);
    } catch (error) {
      console.error('Error loading curriculum:', error);
      showNotification('Failed to load curriculum. Make sure the API is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/api/curriculum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curriculum)
      });

      if (!response.ok) throw new Error('Failed to save curriculum');

      const result = await response.json();
      showNotification(`Saved successfully at ${result.timestamp}`, 'success');
    } catch (error) {
      console.error('Error saving curriculum:', error);
      showNotification('Failed to save curriculum', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCV = async () => {
    try {
      setGenerating(true);
      const response = await fetch(`${API_BASE_URL}/api/cv/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'html' })
      });

      if (!response.ok) throw new Error('Failed to generate CV');

      const result = await response.json();
      showNotification('CV generated successfully!', 'success');

      // Switch to CVs tab and open the CV
      setActiveTab('cvs');
      setTimeout(() => {
        window.open(`${API_BASE_URL}${result.preview_url}`, '_blank');
      }, 500);
    } catch (error) {
      console.error('Error generating CV:', error);
      showNotification('Failed to generate CV', 'error');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading SerenityOps...</p>
        </div>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-50 mb-2 text-center">Failed to load curriculum</h2>
          <p className="text-slate-400 text-center mb-4">
            Make sure the FastAPI backend is running on port 8000.
          </p>
          <code className="block bg-slate-900 p-3 rounded text-sm text-center text-slate-300">
            cd api && uvicorn main:app --reload
          </code>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'chat' as TabType, name: 'Career Chat', icon: '💬' },
    { id: 'import' as TabType, name: 'Quick Import', icon: '📥' },
    { id: 'profile' as TabType, name: 'Profile', icon: '👤' },
    { id: 'experience' as TabType, name: 'Experience', icon: '💼' },
    { id: 'projects' as TabType, name: 'Projects', icon: '🚀' },
    { id: 'skills' as TabType, name: 'Skills', icon: '⚡' },
    { id: 'education' as TabType, name: 'Education', icon: '🎓' },
    { id: 'cvs' as TabType, name: 'Generated CVs', icon: '📄' },
    { id: 'finances' as TabType, name: 'Finances', icon: '💰' },
    { id: 'opportunities' as TabType, name: 'Opportunities', icon: '🎯' },
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-slate-50">SerenityOps</h1>
          <p className="text-sm text-slate-400 mt-1">Career Intelligence</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-50 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 border border-slate-700 hover:border-slate-600"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleGenerateCV}
            disabled={generating}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 shadow-md"
          >
            {generating ? 'Generating...' : 'Generate CV'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className={activeTab === 'chat' ? 'h-full' : 'max-w-6xl mx-auto p-8'}>
          {activeTab === 'chat' && (
            <CareerChat apiBaseUrl={API_BASE_URL} />
          )}

          {activeTab === 'import' && (
            <QuickImport
              apiBaseUrl={API_BASE_URL}
              onDataMerged={() => {
                loadCurriculum();
                setActiveTab('profile');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileForm
              personal={curriculum.personal}
              summary={curriculum.summary}
              onChange={(field, value) => {
                if (field === 'summary') {
                  setCurriculum({ ...curriculum, summary: value });
                } else {
                  setCurriculum({
                    ...curriculum,
                    personal: { ...curriculum.personal, [field]: value }
                  });
                }
              }}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceEditor />
          )}

          {activeTab === 'projects' && (
            <ProjectsManager
              projects={curriculum.projects}
              onChange={(projects) =>
                setCurriculum({ ...curriculum, projects })
              }
            />
          )}

          {activeTab === 'skills' && (
            <SkillsEditor
              skills={curriculum.skills}
              onChange={(skills) =>
                setCurriculum({ ...curriculum, skills })
              }
            />
          )}

          {activeTab === 'education' && (
            <EducationList
              education={curriculum.education}
              languages={curriculum.languages}
              certifications={curriculum.certifications}
              onChange={(field, value) =>
                setCurriculum({ ...curriculum, [field]: value })
              }
            />
          )}

          {activeTab === 'cvs' && (
            <CVManager apiBaseUrl={API_BASE_URL} />
          )}

          {activeTab === 'finances' && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-50 mb-4">Finances</h2>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400">
                  Finances module coming soon. Will integrate with finances/structure.yaml
                </p>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-50 mb-4">Opportunities</h2>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400">
                  Opportunities tracker coming soon. Will integrate with opportunities/structure.yaml
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className={`rounded-lg shadow-lg p-4 max-w-md border ${
            notification.type === 'success'
              ? 'bg-emerald-900 border-emerald-700'
              : 'bg-red-900 border-red-700'
          }`}>
            <div className="flex items-start">
              {notification.type === 'success' ? (
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className={`font-medium ${
                notification.type === 'success' ? 'text-emerald-100' : 'text-red-100'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
