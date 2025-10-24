import React, { useState, useEffect } from 'react';
import CVJobProgress from './CVJobProgress';
import { useCVJobStore } from '../stores/cvJobStore';
import { useCVJobPolling } from '../hooks/useCVJobPolling';

interface CVFile {
  filename: string;
  size_kb: number;
  created_at: string;
  format: string;
  download_url: string;
  preview_url: string;
}

interface CVManagerProps {
  apiBaseUrl: string;
}

const CVManager: React.FC<CVManagerProps> = ({ apiBaseUrl }) => {
  const [cvs, setCvs] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const { setJob } = useCVJobStore();

  // Enable job polling
  useCVJobPolling();

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/api/cv/list`);
      if (!response.ok) throw new Error('Failed to load CVs');
      const data = await response.json();
      setCvs(data.files);
    } catch (error) {
      console.error('Error loading CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (filename: string) => {
    window.open(`${apiBaseUrl}/api/cv/file/${filename}`, '_blank');
  };

  const handleDownload = (filename: string) => {
    window.open(`${apiBaseUrl}/api/cv/download/${filename}`, '_blank');
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const response = await fetch(`${apiBaseUrl}/api/cv/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: 'pdf',
          opportunity: 'general'
        })
      });

      if (!response.ok) throw new Error('Failed to start CV generation');

      const data = await response.json();

      // Set job in store to start polling
      setJob({
        id: data.job_id,
        opportunity: 'general',
        user_id: 'default',
        status: data.status,
        progress: 0,
        stage: 'Queued',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Failed to start CV generation');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      setDeleting(filename);
      const response = await fetch(`${apiBaseUrl}/api/cv/${filename}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete CV');

      // Reload CVs after deletion
      await loadCVs();
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="liquid-glass rounded-mac shadow-xl p-8 animate-scale-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="skeleton skeleton-avatar"></div>
          <div className="flex-1">
            <div className="skeleton skeleton-title w-32 mb-2"></div>
            <div className="skeleton skeleton-text w-24"></div>
          </div>
        </div>

        {/* Skeleton CVs */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="liquid-glass rounded-mac p-5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="skeleton skeleton-title w-48 mb-3"></div>
                  <div className="flex gap-4">
                    <div className="skeleton skeleton-text w-24"></div>
                    <div className="skeleton skeleton-text w-16"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="skeleton w-24 h-10 rounded-mac"></div>
                  <div className="skeleton w-24 h-10 rounded-mac"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in space-y-8 p-6">
      {/* Decorative header section */}
      <div className="relative">
        <div className="gradient-orb absolute -top-20 -right-20 w-72 h-72 bg-macAccent/15"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg animate-glow-pulse">
              <svg className="w-7 h-7 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-macText mb-1 text-gradient">Generated CVs</h2>
              <p className="text-macSubtext text-sm">{cvs.length} professional CV{cvs.length !== 1 ? 's' : ''} ready to impress</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 gradient-accent hover:shadow-accent text-white font-semibold rounded-xl transition-all duration-300 ease-mac disabled:opacity-50 disabled:cursor-not-allowed text-sm hover-lift group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer"></span>
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {generating ? 'Starting...' : 'Generate CV'}
              </span>
            </button>
            <button
              onClick={loadCVs}
              className="px-6 py-3 liquid-glass text-macAccent hover:text-blue-300 font-medium rounded-xl transition-all duration-300 ease-mac text-sm hover-lift group bounce-click"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CV Job Progress Tracker */}
      <CVJobProgress
        onComplete={() => {
          loadCVs();
        }}
        onError={(error) => {
          console.error('CV generation failed:', error);
        }}
      />

      {cvs.length === 0 ? (
        <div className="text-center py-20 liquid-glass rounded-2xl relative overflow-hidden">
          <div className="gradient-orb absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-macAccent/10"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 gradient-accent-subtle rounded-2xl flex items-center justify-center animate-float">
              <svg className="w-10 h-10 text-macAccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-macText mb-2">No CVs generated yet</h3>
            <p className="text-macSubtext text-sm leading-relaxed max-w-md mx-auto">
              Click the <span className="text-macAccent font-medium">"Generate CV"</span> button above to create your first professional CV
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 perspective-container">
          {cvs.map((cv, index) => (
            <div
              key={cv.filename}
              className={`rounded-2xl p-6 transition-all duration-400 ease-mac group card-3d bento-card relative ${
                index === 0
                  ? 'liquid-glass-accent shadow-accent ring-2 ring-blue-400/30'
                  : 'liquid-glass hover:liquid-glass-accent shadow-lg hover:shadow-xl'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-macText">
                      {cv.filename}
                    </h3>
                    {index === 0 && (
                      <span className="px-3 py-1 gradient-accent text-white text-xs font-semibold rounded-full shadow-accent flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-macSubtext">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(cv.created_at)}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {cv.size_kb} KB
                    </span>
                    <span className="px-2.5 py-1 bg-macHover/60 text-macSubtext text-xs rounded-mac uppercase font-medium">
                      {cv.format}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(cv.filename)}
                    className="px-4 py-3 liquid-glass-accent text-white font-semibold rounded-mac transition-all duration-300 ease-mac flex items-center gap-2 shadow-accent text-sm interactive-element bounce-click ripple-effect"
                  >
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>

                  <button
                    onClick={() => handleDownload(cv.filename)}
                    className="px-4 py-3 liquid-glass text-macText font-medium rounded-mac transition-all duration-300 ease-mac flex items-center gap-2 text-sm interactive-element bounce-click"
                  >
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translateY-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>

                  <button
                    onClick={() => handleDelete(cv.filename)}
                    disabled={deleting === cv.filename}
                    className="px-4 py-3 liquid-glass border border-red-500/40 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium rounded-mac transition-all duration-300 ease-mac flex items-center gap-2 disabled:opacity-50 text-sm interactive-element bounce-click"
                  >
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting === cv.filename ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CVManager;
