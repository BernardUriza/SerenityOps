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

      // Fetch current curriculum to preserve data managed by other stores (experience, projects)
      const currentResponse = await fetch(`${API_BASE_URL}/api/curriculum`);
      if (!currentResponse.ok) throw new Error('Failed to fetch current curriculum');
      const currentCurriculum = await currentResponse.json();

      // Merge: preserve experience/projects from current, update personal/summary from local state
      const updatedCurriculum = {
        ...currentCurriculum,
        personal: curriculum.personal,
        summary: curriculum.summary,
        // Preserve these fields that are managed by separate stores
        experience: currentCurriculum.experience,
        projects: currentCurriculum.projects,
      };

      const response = await fetch(`${API_BASE_URL}/api/curriculum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCurriculum)
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

  // Loading state - Enhanced with Liquid Glass
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-macBg relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 gradient-mesh opacity-40"></div>
        <div className="gradient-orb fixed top-[10%] right-[30%] w-[600px] h-[600px] bg-macAccent/30"></div>

        <div className="text-center relative z-10 animate-bounce-in">
          <div className="mb-6 relative">
            <img
              src="/logo.svg"
              alt="SerenityOps"
              className="w-20 h-20 mx-auto animate-glow-pulse"
              style={{ filter: 'drop-shadow(0 0 20px rgba(10, 132, 255, 0.6))' }}
            />
            {/* Orbiting particles */}
            <div className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2">
              <div className="particle absolute top-0 left-1/4 animate-float"></div>
              <div className="particle absolute top-1/4 right-1/4 animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="particle absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gradient mb-2">SerenityOps</h2>
          <p className="text-xs text-macSubtext mb-4">Loading intelligence system...</p>

          {/* Enhanced loading bar */}
          <div className="mt-4 px-4">
            <div className="w-48 h-1 liquid-glass rounded-full mx-auto overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-macAccent via-cyan-400 to-macAccent animate-shimmer"></div>
            </div>
          </div>

          {/* Skeleton preview */}
          <div className="mt-8 liquid-glass rounded-mac p-4 w-64 mx-auto">
            <div className="skeleton skeleton-title mb-3"></div>
            <div className="skeleton skeleton-text mb-2"></div>
            <div className="skeleton skeleton-text w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - macOS Style
  if (!curriculum) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-macBg">
        <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 p-4 rounded-mac max-w-sm shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
          <div className="text-error mb-3">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-macText mb-1 text-center">Failed to load curriculum</h2>
          <p className="text-xs text-macSubtext text-center mb-3">
            Make sure the FastAPI backend is running on port 8000.
          </p>
          <code className="block bg-macPanel/60 p-2 rounded-mac text-xs text-center text-macSubtext border border-macBorder/30">
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
    <div className="flex h-screen bg-macBg text-macText relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-40"></div>

      {/* Floating gradient orbs */}
      <div className="gradient-orb fixed top-[-10%] right-[20%] w-[500px] h-[500px] bg-macAccent/30" style={{ animationDelay: '0s' }}></div>
      <div className="gradient-orb fixed bottom-[-15%] left-[10%] w-[400px] h-[400px] bg-purple-500/20" style={{ animationDelay: '4s' }}></div>

      {/* macOS Sidebar - Liquid Glass */}
      <div className="w-sidebar liquid-glass flex flex-col relative overflow-hidden z-10 shadow-xl">
        {/* Enhanced ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-macAccent/8 via-transparent to-purple-500/5 pointer-events-none animate-gradient-shift"></div>

        {/* Particles effect */}
        <div className="particle absolute top-[20%] left-[30%]" style={{ animationDelay: '0s' }}></div>
        <div className="particle absolute top-[60%] left-[70%]" style={{ animationDelay: '2s' }}></div>
        <div className="particle absolute top-[80%] left-[40%]" style={{ animationDelay: '4s' }}></div>

        {/* Header - Liquid Glass with Glow */}
        <div className="h-header flex items-center justify-center relative z-10 mb-4">
          <div className="relative group cursor-pointer perspective-container">
            <h1 className="text-sm font-bold text-gradient relative z-10 transition-all duration-300 group-hover:scale-110 animate-glow-pulse">SO</h1>
            <div className="absolute inset-0 bg-macAccent/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-morph"></div>
          </div>
        </div>

        {/* Navigation - Icon Only with Enhanced Interactions */}
        <nav className="flex-1 overflow-y-auto py-3 relative z-10">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`w-full h-sidebar-icon flex items-center justify-center transition-all duration-300 ease-mac relative group mb-1 animate-slide-in-left ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-macAccent/25 via-macAccent/20 to-transparent border-l-2 border-macAccent text-macAccent shadow-[inset_0_0_12px_rgba(10,132,255,0.15)]'
                  : 'text-slate-300 hover:bg-macHover/60 hover:text-macText hover:scale-105'
              }`}
            >
              <span className={`text-lg transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>

              {/* Enhanced Tooltip with Slide Animation */}
              <span className="absolute left-full ml-3 px-3 py-1.5 glass-panel rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none z-tooltip">
                {item.label}
              </span>

              {/* Active indicator glow */}
              {activeTab === item.id && (
                <div className="absolute left-0 w-0.5 h-full bg-macAccent shadow-[0_0_10px_rgba(10,132,255,0.5)]"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Actions - Liquid Glass with Physics */}
        <div className="p-3 space-y-2 relative z-10 mt-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            title="Save Changes (Ctrl+S)"
            className="w-full h-8 liquid-glass text-macText text-xs font-medium rounded-mac transition-all duration-300 ease-mac disabled:opacity-40 flex items-center justify-center hover-lift group bounce-click ripple-effect"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
          <button
            onClick={handleGenerateCV}
            disabled={generating}
            title="Generate CV"
            className="w-full h-8 liquid-glass-accent hover:shadow-accent text-white text-xs font-semibold rounded-mac transition-all duration-300 ease-mac disabled:opacity-40 flex items-center justify-center hover-lift group relative overflow-hidden bounce-click ripple-effect"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
            <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - Centered & Spacious */}
      <div className="flex-1 overflow-y-auto relative">
        <div className={activeTab === 'chat' ? 'h-full' : 'max-w-6xl mx-auto px-8 py-12'}>
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
            <div className="bg-macPanel/50 backdrop-blur-md border border-macBorder/30 rounded-mac p-6 shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
              <h2 className="text-sm font-semibold text-macText mb-4">Finances</h2>
              <div className="bg-macPanel/60 border border-macBorder/40 rounded-mac p-4">
                <p className="text-xs text-macSubtext">
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

      {/* Enhanced Notification Toast with Animations */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`glass-strong rounded-mac p-4 max-w-sm border text-xs shadow-xl relative overflow-hidden group ${
            notification.type === 'success'
              ? 'border-success/40'
              : 'border-error/40'
          }`}>
            {/* Animated gradient background */}
            <div className={`absolute inset-0 opacity-10 ${
              notification.type === 'success'
                ? 'bg-gradient-to-br from-success/30 to-transparent'
                : 'bg-gradient-to-br from-error/30 to-transparent'
            }`}></div>

            {/* Content */}
            <div className="flex items-start gap-3 relative z-10">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === 'success'
                  ? 'bg-success/20 text-success'
                  : 'bg-error/20 text-error'
              }`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium leading-relaxed ${
                  notification.type === 'success' ? 'text-success' : 'text-error'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-macBorder/20 overflow-hidden">
              <div
                className={`h-full ${
                  notification.type === 'success' ? 'bg-success' : 'bg-error'
                }`}
                style={{
                  animation: 'shrink 5s linear forwards'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
