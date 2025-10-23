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
      <div className="bg-surface-elevated border border-border rounded shadow-sm p-8">
        <h2 className="text-sm font-bold text-slate-50 mb-1.5">Generated CVs</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated border border-border rounded shadow-sm p-8">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <h2 className="text-sm font-bold text-slate-50">Generated CVs</h2>
          <p className="text-text-tertiary mt-1">{cvs.length} CV{cvs.length !== 1 ? 's' : ''} generated</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-2 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {generating ? 'Starting...' : 'Generate CV'}
          </button>
          <button
            onClick={loadCVs}
            className="px-2 py-2 text-primary hover:text-blue-300 hover:bg-surface-hover font-medium rounded transition-colors border border-border-strong hover:border-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* CV Job Progress Tracker */}
      <div className="mb-1.5">
        <CVJobProgress
          onComplete={() => {
            // Reload CVs when generation is complete
            loadCVs();
          }}
          onError={(error) => {
            console.error('CV generation failed:', error);
          }}
        />
      </div>

      {cvs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-sm font-medium text-slate-50 mb-2">No CVs generated yet</h3>
          <p className="text-text-tertiary">
            Click "Generate CV" to create your first professional CV
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {cvs.map((cv, index) => (
            <div
              key={cv.filename}
              className={`border rounded p-3 hover:shadow-md transition-shadow ${
                index === 0 ? 'ring-2 ring-blue-500 bg-surface-hover border-blue-500' : 'bg-surface-elevated border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-slate-50">
                      {cv.filename}
                    </h3>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(cv.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {cv.size_kb} KB
                    </span>
                    <span className="px-2 py-0.5 bg-surface-hover text-text-secondary text-xs rounded uppercase font-medium">
                      {cv.format}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handlePreview(cv.filename)}
                    className="px-2 py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>

                  <button
                    onClick={() => handleDownload(cv.filename)}
                    className="px-2 py-2 bg-surface-hover hover:bg-slate-600 text-slate-50 font-medium rounded transition-colors flex items-center gap-2 border border-border-strong hover:border-slate-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>

                  <button
                    onClick={() => handleDelete(cv.filename)}
                    disabled={deleting === cv.filename}
                    className="px-2 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
