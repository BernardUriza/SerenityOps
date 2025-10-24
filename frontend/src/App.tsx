import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileForm from './components/ProfileForm';
import { ExperienceEditor } from './components/experience';
import { ProjectsManager } from './components/projects';
import SkillsEditor from './components/SkillsEditor';
import EducationList from './components/EducationList';
import CVManager from './components/CVManager';
import QuickImport from './components/QuickImport';
import { ChatManager } from './components/chat';
import OpportunitiesViewer from './apps/opportunities';
import { useCVJobStore, loadJobFromLocalStorage } from './stores/cvJobStore';
import { Icon, IconProvider } from './icons';
import VersionBadge from './components/VersionBadge';
import { useAppSidebarState, APP_SIDEBAR_WIDTH } from './hooks/useAppSidebarState';
import { useNotificationCounts } from './hooks/useNotificationCounts';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AppSidebarProfile } from './components/AppSidebarProfile';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { NavIconWithBadge } from './components/NavIconWithBadge';

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
  const { isCollapsed, toggleCollapse } = useAppSidebarState();
  const { counts: notificationCounts } = useNotificationCounts();

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

  // Keyboard shortcut: ⌘B / Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleCollapse]);

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
              <div className="absolute inset-0 bg-linear-to-r from-macAccent via-cyan-400 to-macAccent animate-shimmer"></div>
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

  // Navigation items with live notification badges from API
  const navItems = [
    {
      id: 'chat' as TabType,
      label: 'Chat',
      icon: 'message-circle',
      badge: notificationCounts.chat,
      badgeType: undefined // default red for unread messages
    },
    { id: 'import' as TabType, label: 'Import', icon: 'download' },
    { id: 'profile' as TabType, label: 'Profile', icon: 'user' },
    { id: 'experience' as TabType, label: 'Experience', icon: 'briefcase' },
    {
      id: 'projects' as TabType,
      label: 'Projects',
      icon: 'rocket',
      badge: notificationCounts.projects,
      badgeType: 'warning' as const
    },
    { id: 'skills' as TabType, label: 'Skills', icon: 'lightning' },
    { id: 'education' as TabType, label: 'Education', icon: 'graduation-cap' },
    {
      id: 'cvs' as TabType,
      label: 'CVs',
      icon: 'file',
      badge: notificationCounts.cvs,
      badgeType: 'success' as const // green for new CVs
    },
    { id: 'finances' as TabType, label: 'Finances', icon: 'dollar-sign' },
    {
      id: 'opportunities' as TabType,
      label: 'Opportunities',
      icon: 'target',
      badge: notificationCounts.opportunities,
      badgeType: 'warning' as const // orange for active opportunities
    },
  ];

  return (
    <IconProvider config={{ enableCache: true, debug: false }}>
      <div className="flex h-screen bg-macBg text-macText relative overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-40"></div>

      {/* Floating gradient orbs */}
      <div className="gradient-orb fixed top-[-10%] right-[20%] w-[500px] h-[500px] bg-macAccent/30" style={{ animationDelay: '0s' }}></div>
      <div className="gradient-orb fixed bottom-[-15%] left-[10%] w-[400px] h-[400px] bg-purple-500/20" style={{ animationDelay: '4s' }}></div>

      {/* macOS Sidebar - ULTRA VISUAL 2026 - COLLAPSIBLE - FIXED LAYOUT */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? APP_SIDEBAR_WIDTH.COLLAPSED : APP_SIDEBAR_WIDTH.EXPANDED }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="liquid-glass flex flex-col justify-between h-screen relative z-sticky shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-r-2 border-macAccent/30"
      >
        {/* Enhanced ambient gradient overlay - MORE VISIBLE */}
        <div className="absolute inset-0 bg-gradient-to-b from-macAccent/20 via-purple-500/15 to-cyan-500/10 pointer-events-none animate-gradient-shift"></div>

        {/* Particles effect - BIGGER */}
        <div className="particle absolute top-[20%] left-[30%] w-3 h-3 bg-macAccent/40" style={{ animationDelay: '0s' }}></div>
        <div className="particle absolute top-[60%] left-[70%] w-2 h-2 bg-purple-500/40" style={{ animationDelay: '2s' }}></div>
        <div className="particle absolute top-[80%] left-[40%] w-2.5 h-2.5 bg-cyan-500/40" style={{ animationDelay: '4s' }}></div>

        {/* TOP SECTION - Header + Navigation */}
        <div className="flex flex-col flex-1">
          {/* Header - Logo and Toggle Button */}
          <div className="h-24 flex items-center justify-between relative z-10 border-b-2 border-macAccent/20 px-4 flex-shrink-0 gap-3">
            {/* Left: Logo */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="relative group cursor-pointer flex-shrink-0">
                    <img
                      src="/logo.svg"
                      alt="SerenityOps"
                      className="w-12 h-12 relative z-10 transition-all duration-500 group-hover:scale-125 animate-glow-pulse"
                      style={{ filter: 'drop-shadow(0 0 16px rgba(10, 132, 255, 0.8))' }}
                    />
                    <div className="absolute inset-0 bg-macAccent/40 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-morph"></div>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-black text-gradient tracking-tight">SerenityOps</h1>
                    <p className="text-xs text-macSubtext font-semibold">Intelligence System</p>
                  </div>
                </motion.div>
              )}
              {isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer flex-shrink-0"
                >
                  <img
                    src="/logo.svg"
                    alt="SerenityOps"
                    className="w-12 h-12 relative z-10 transition-all duration-500 group-hover:scale-125 animate-glow-pulse"
                    style={{ filter: 'drop-shadow(0 0 16px rgba(10, 132, 255, 0.8))' }}
                  />
                  <div className="absolute inset-0 bg-macAccent/40 blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right: Toggle Button */}
            <button
              onClick={toggleCollapse}
              className="w-11 h-11 rounded-xl liquid-glass hover:bg-macAccent/20 flex items-center justify-center transition-all duration-300 group hover:scale-105 hover:shadow-xl border border-macBorder/40 hover:border-macAccent/60 flex-shrink-0"
              title={isCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                className="text-macAccent"
              >
                {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
              </motion.div>
            </button>
          </div>

          {/* Navigation - COLLAPSIBLE with LABELS - WITH PROPER GAP */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 relative z-10 flex flex-col gap-3">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`w-full h-14 flex items-center transition-all duration-500 ease-mac relative group animate-slide-in-left rounded-2xl ${
                isCollapsed ? 'justify-center px-2' : 'justify-start px-4 gap-4'
              } ${
                activeTab === item.id
                  ? 'bg-gradient-to-br from-macAccent/40 via-macAccent/30 to-macAccent/20 border-2 border-macAccent/60 text-white shadow-[0_0_24px_rgba(10,132,255,0.5)] scale-[1.03] ring-2 ring-macAccent/30'
                  : 'text-slate-400 hover:bg-macHover/80 hover:text-white hover:scale-[1.02] hover:shadow-2xl border-2 border-transparent hover:border-macAccent/40'
              }`}
            >
              <NavIconWithBadge
                iconName={item.icon}
                size={24}
                badge={'badge' in item ? item.badge : undefined}
                badgeType={'badgeType' in item ? item.badgeType as 'default' | 'success' | 'warning' : 'default'}
                isActive={activeTab === item.id}
                isLogo={false}
              />

              {/* Label - Only visible when expanded */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className={`text-sm font-bold truncate ${activeTab === item.id ? 'text-white' : 'text-macText group-hover:text-white'}`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip - Only visible when collapsed */}
              {isCollapsed && (
                <span className="absolute left-full ml-4 px-4 py-2.5 liquid-glass-accent rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none z-tooltip shadow-2xl shadow-macAccent/40 border-2 border-macAccent/30">
                  {item.label}
                </span>
              )}

              {/* Active indicator glow - MEGA VISIBLE */}
              {activeTab === item.id && (
                <div className="absolute left-0 w-1.5 h-10 bg-gradient-to-b from-white via-macAccent to-cyan-500 rounded-r-full shadow-[0_0_20px_rgba(10,132,255,0.8)] animate-pulse"></div>
              )}

              {/* Shine effect on active */}
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-2xl"></div>
              )}
            </button>
          ))}
          </nav>
        </div>

        {/* BOTTOM SECTION - Theme + Profile + Actions */}
        <div className="flex flex-col gap-2 pb-3 relative z-10 flex-shrink-0">
          {/* Theme Switcher - 2026 Trend: Mode Switching */}
          <div className="px-3">
            <ThemeSwitcher isCollapsed={isCollapsed} />
          </div>

          {/* User Profile - 2026 Trend: Account Management */}
          <div className="px-3">
            <AppSidebarProfile isCollapsed={isCollapsed} />
          </div>

          {/* Actions - COLLAPSIBLE with LABELS */}
          <div className="px-3 pt-3 space-y-3 border-t-2 border-macAccent/20 bg-gradient-to-t from-macPanel/40 to-transparent">
          <button
            onClick={handleSave}
            disabled={saving}
            title="Save Changes (Ctrl+S)"
            aria-label="Save changes"
            className={`w-full h-12 glass-strong text-macText font-bold rounded-2xl transition-all duration-500 ease-mac disabled:opacity-40 flex items-center hover-lift group bounce-click ripple-effect hover:scale-105 hover:shadow-2xl border-2 border-macAccent/50 hover:border-macAccent/80 ${
              isCollapsed ? 'justify-center px-2' : 'justify-center gap-3 px-4'
            }`}
          >
            <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(10,132,255,0.5)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm"
                >
                  Save
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={handleGenerateCV}
            disabled={generating}
            title="Generate CV"
            aria-label="Generate CV"
            className={`w-full h-12 gradient-accent hover:shadow-[0_0_32px_rgba(10,132,255,0.6)] text-white font-black rounded-2xl transition-all duration-500 ease-mac disabled:opacity-40 flex items-center hover-lift group relative overflow-hidden bounce-click ripple-effect hover:scale-105 ring-2 ring-macAccent/40 hover:ring-4 hover:ring-macAccent/60 ${
              isCollapsed ? 'justify-center px-2' : 'justify-center gap-3 px-4'
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
            <svg className="w-6 h-6 relative z-10 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm"
                >
                  Generate CV
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Perfectly Centered & Spacious */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Chat and Opportunities get full height, others get centered container */}
        {activeTab === 'chat' ? (
          <div className="h-full">
            <ChatManager apiBaseUrl={API_BASE_URL} />
          </div>
        ) : activeTab === 'opportunities' ? (
          <div className="h-full">
            <OpportunitiesViewer apiBaseUrl={API_BASE_URL} />
          </div>
        ) : (
          <div className="min-h-full flex items-start justify-center px-8 py-12">
            <div className="w-full max-w-5xl animate-fade-in">
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
                <div className="space-y-6 p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-mac bg-macAccent/10 backdrop-blur-md flex items-center justify-center shadow-[0_2px_6px_rgba(10,132,255,0.15)]">
                      <svg className="w-5 h-5 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-macText">Financial Management</h2>
                      <p className="text-xs text-macSubtext">Track income, expenses, and goals</p>
                    </div>
                  </div>

                  {/* Coming Soon Card */}
                  <div className="bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac p-8 shadow-[0_2px_6px_rgba(0,0,0,0.2)] text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-mac bg-macAccent/5 flex items-center justify-center">
                      <svg className="w-8 h-8 text-macAccent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-macText mb-2">Coming Soon</h3>
                    <p className="text-xs text-macSubtext max-w-md mx-auto leading-relaxed">
                      This module will integrate with <code className="px-1.5 py-0.5 bg-macPanel/60 rounded text-macAccent font-mono">finances/structure.yaml</code> to provide comprehensive financial tracking, projections, and insights for your career planning.
                    </p>
                  </div>

                  {/* Preview Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: 'chart-bar', title: 'Income Tracking', desc: 'Monitor salary and revenue streams' },
                      { icon: 'credit-card', title: 'Expense Management', desc: 'Track and categorize spending' },
                      { icon: 'target', title: 'Financial Goals', desc: 'Set and achieve money targets' }
                    ].map((feature, i) => (
                      <div key={i} className="bg-macPanel/50 backdrop-blur-md border border-macBorder/30 rounded-mac p-4 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
                        <div className="mb-2">
                          <Icon name={feature.icon} size={32} />
                        </div>
                        <h4 className="text-xs font-semibold text-macText mb-1">{feature.title}</h4>
                        <p className="text-xs text-macSubtext">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Notification Toast with Animations */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-modal animate-slide-up">
          <div className={`glass-strong rounded-mac p-4 max-w-sm border text-xs shadow-xl relative overflow-hidden group ${
            notification.type === 'success'
              ? 'border-success/40'
              : 'border-error/40'
          }`}>
            {/* Animated gradient background */}
            <div className={`absolute inset-0 opacity-10 ${
              notification.type === 'success'
                ? 'bg-linear-to-br from-success/30 to-transparent'
                : 'bg-linear-to-br from-error/30 to-transparent'
            }`}></div>

            {/* Content */}
            <div className="flex items-start gap-3 relative z-10">
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
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

      {/* Version Badge - Persistent deployment info */}
      <VersionBadge />
      </div>
    </IconProvider>
  );
}

export default App;
