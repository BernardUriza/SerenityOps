import React, { useState, useEffect } from 'react';

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
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-50 mb-6">Generated CVs</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Generated CVs</h2>
          <p className="text-slate-400 mt-1">{cvs.length} CV{cvs.length !== 1 ? 's' : ''} generated</p>
        </div>
        <button
          onClick={loadCVs}
          className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 font-medium rounded-lg transition-colors border border-slate-600 hover:border-blue-500"
        >
          Refresh
        </button>
      </div>

      {cvs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-50 mb-2">No CVs generated yet</h3>
          <p className="text-slate-400">
            Click "Generate CV" to create your first professional CV
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cvs.map((cv, index) => (
            <div
              key={cv.filename}
              className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                index === 0 ? 'ring-2 ring-blue-500 bg-slate-700 border-blue-500' : 'bg-slate-900 border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-50">
                      {cv.filename}
                    </h3>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
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
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded uppercase font-medium">
                      {cv.format}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handlePreview(cv.filename)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>

                  <button
                    onClick={() => handleDownload(cv.filename)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 font-medium rounded-lg transition-colors flex items-center gap-2 border border-slate-600 hover:border-slate-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>

                  <button
                    onClick={() => handleDelete(cv.filename)}
                    disabled={deleting === cv.filename}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
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
