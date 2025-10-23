/**
 * CV Generation Job Progress Component
 *
 * Displays real-time progress of CV generation with:
 * - Animated progress bar
 * - Current stage indicator
 * - Download link on success
 * - Error details on failure
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCVJobPolling } from '../hooks/useCVJobPolling';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface CVJobProgressProps {
  onComplete?: (downloadUrl: string) => void;
  onError?: (errorMessage: string) => void;
}

const CVJobProgress: React.FC<CVJobProgressProps> = ({ onComplete, onError }) => {
  const { job, clearJob } = useCVJobPolling();

  // Trigger callbacks on status change
  useEffect(() => {
    if (job?.status === 'success' && job.download_url && onComplete) {
      onComplete(`${API_BASE_URL}${job.download_url}`);
    }

    if (job?.status === 'error' && job.error_message && onError) {
      onError(job.error_message);
    }
  }, [job?.status, job?.download_url, job?.error_message, onComplete, onError]);

  if (!job) {
    return (
      <div className="p-2 bg-surface-elevated/60 rounded border border-border text-text-tertiary text-sm">
        Press "Generate CV" to start.
      </div>
    );
  }

  // Queued state
  if (job.status === 'queued') {
    return (
      <div className="p-2 bg-blue-900/30 border border-blue-700 rounded">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <div>
            <p className="text-blue-300 font-semibold">Queued</p>
            <p className="text-primary text-sm">Waiting to start...</p>
          </div>
        </div>
      </div>
    );
  }

  // Running state
  if (job.status === 'running') {
    return (
      <div className="p-2 bg-surface-elevated/60 rounded border border-border">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">{job.stage}</p>
            <span className="text-xs text-text-tertiary">{job.progress}%</span>
          </div>

          {/* Animated progress bar */}
          <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary h-2"
              initial={{ width: 0 }}
              animate={{ width: `${job.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
            <p className="text-xs text-text-tertiary">Generating your CV...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (job.status === 'success') {
    return (
      <div className="p-2 bg-emerald-900/30 border border-emerald-700 rounded">
        <div className="space-y-1.5">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <p className="text-emerald-300 font-semibold">CV Generated Successfully!</p>
              <p className="text-success text-sm mt-1">{job.stage}</p>
            </div>
          </div>

          {job.download_url && (
            <div className="mt-3 p-3 bg-slate-950 rounded border border-border">
              <a
                href={`${API_BASE_URL}${job.download_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Download PDF {job.size && `(${(job.size / 1024).toFixed(1)} KB)`}
              </a>

              {job.filename && (
                <div className="mt-2 text-xs text-text-tertiary">
                  <span className="font-mono">{job.filename}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={clearJob}
            className="text-xs text-emerald-500 hover:text-success transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (job.status === 'error') {
    return (
      <div className="p-2 bg-red-900/30 border border-red-700 rounded">
        <div className="space-y-1.5">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-300 font-semibold">Generation Failed</p>
              <p className="text-error text-sm mt-1">{job.stage}</p>
            </div>
          </div>

          {job.error_message && (
            <details className="mt-2">
              <summary className="text-xs text-red-500 cursor-pointer hover:text-error">
                Show error details
              </summary>
              <pre className="mt-2 p-3 bg-slate-950 rounded border border-border text-xs text-error overflow-x-auto max-h-40">
                {job.error_message}
              </pre>
            </details>
          )}

          <button
            onClick={clearJob}
            className="text-xs text-red-500 hover:text-error transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CVJobProgress;
