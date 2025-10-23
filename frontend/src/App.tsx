import { useState, useEffect } from 'react';

import ProfileForm from './components/ProfileForm';
import { ExperienceEditor } from './components/experience';
import { ProjectsManager } from './components/projects';
import SkillsEditor from './components/SkillsEditor';
import EducationList from './components/EducationList';
import CVManager from './components/CVManager';
import QuickImport from './components/QuickImport';
import { ChatManager } from './components/chat';
import OpportunityManager from './components/opportunities/OpportunityManager';
import { useCVJobStore, loadJobFromLocalStorage } from './stores/cvJobStore';

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
  const { setJob } = useCVJobStore();

  // Load curriculum on mount
  useEffect(() => {
    loadCurriculum();
  }, []);

  // Restore job from localStorage on mount
  useEffect(() => {
    const savedJob = loadJobFromLocalStorage();
    if (savedJob) {
      setJob(savedJob);
    }
  }, [setJob]);

  const loadCurriculum = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/api/curriculum`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load curriculum`);
      }

      const data = await response.json();
      setCurriculum(data);
    } catch (error) {
      console.error('[App] Error loading curriculum:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showNotification('Request timed out. Is the API server running?', 'error');
        } else {
          showNotification(error.message, 'error');
        }
      }
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

  // Loading state - Compact Precision
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <img
              src="/logo.svg"
              alt="SerenityOps"
              className="w-16 h-16 mx-auto"
              style={{ filter: 'drop-shadow(0 0 12px rgba(46, 151, 255, 0.4))' }}
            />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">SerenityOps</h2>
          <p className="text-xs text-text-secondary">Loading intelligence system...</p>
          <div className="mt-3">
            <div className="w-32 h-0.5 bg-surface-elevated rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Compact Precision
  if (!curriculum) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-surface-elevated border border-border-strong p-4 rounded max-w-sm">
          <div className="text-error mb-3">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-text-primary mb-1 text-center">Failed to load curriculum</h2>
          <p className="text-xs text-text-secondary text-center mb-3">
            Make sure the FastAPI backend is running on port 8000.
          </p>
          <code className="block bg-surface p-2 rounded text-xs text-center text-text-tertiary">
            cd api && uvicorn main:app --reload
          </code>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'chat' as TabType, label: 'Chat', icon: '💬' },
    { id: 'import' as TabType, label: 'Import', icon: '📥' },
    { id: 'profile' as TabType, label: 'Profile', icon: '👤' },
    { id: 'experience' as TabType, label: 'Experience', icon: '💼' },
    { id: 'projects' as TabType, label: 'Projects', icon: '🚀' },
    { id: 'skills' as TabType, label: 'Skills', icon: '⚡' },
    { id: 'education' as TabType, label: 'Education', icon: '🎓' },
    { id: 'cvs' as TabType, label: 'CVs', icon: '📄' },
    { id: 'finances' as TabType, label: 'Finances', icon: '💰' },
    { id: 'opportunities' as TabType, label: 'Opportunities', icon: '🎯' },
  ];

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Compact Precision Sidebar - 52px */}
      <div className="w-sidebar bg-surface border-r border-border flex flex-col">
        {/* Header - Compact */}
        <div className="h-header border-b border-border flex items-center justify-center">
          <h1 className="text-sm font-bold text-primary">SO</h1>
        </div>

        {/* Navigation - Icon Only */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full h-sidebar-icon flex items-center justify-center transition-colors relative group ${
                activeTab === item.id
                  ? 'bg-primary/10 border-l-2 border-primary text-primary'
                  : 'text-text-tertiary hover:bg-surface-hover hover:text-text-secondary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-surface-elevated border border-border-strong rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-tooltip">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Actions - Compact */}
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={handleSave}
            disabled={saving}
            title="Save Changes (Ctrl+S)"
            className="w-full h-7 bg-surface-elevated hover:bg-surface-hover text-text-primary text-xs font-medium rounded transition-colors disabled:opacity-40 border border-border-strong flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
          <button
            onClick={handleGenerateCV}
            disabled={generating}
            title="Generate CV"
            className="w-full h-7 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-colors disabled:opacity-40 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - Compact */}
      <div className="flex-1 overflow-y-auto">
        <div className={activeTab === 'chat' ? 'h-full' : 'max-w-7xl mx-auto p-3'}>
          {activeTab === 'chat' && (
            <ChatManager apiBaseUrl={API_BASE_URL} />
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
            <ProjectsManager />
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
            <div className="bg-surface-elevated border border-border rounded p-3">
              <h2 className="text-sm font-semibold text-text-primary mb-2">Finances</h2>
              <div className="bg-surface border border-border rounded p-3">
                <p className="text-xs text-text-secondary">
                  Finances module coming soon. Will integrate with finances/structure.yaml
                </p>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <OpportunityManager apiBaseUrl={API_BASE_URL} />
          )}
        </div>
      </div>

      {/* Notification Toast - Compact Precision */}
      {notification && (
        <div className="fixed bottom-3 right-3 z-50 animate-slide-up">
          <div className={`rounded p-2 max-w-sm border text-xs ${
            notification.type === 'success'
              ? 'bg-success/10 border-success text-success'
              : 'bg-error/10 border-error text-error'
          }`}>
            <div className="flex items-start gap-2">
              {notification.type === 'success' ? (
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="font-medium leading-tight">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
