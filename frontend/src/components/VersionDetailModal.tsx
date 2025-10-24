/**
 * Version Detail Modal Component
 *
 * Expandable modal showing detailed build information
 * Displays commit hashes, timestamps, author, and last change description
 */

import type { VersionInfo } from '../hooks/useVersionInfo';

interface VersionDetailModalProps {
  versionInfo: VersionInfo;
  onClose: () => void;
}

export default function VersionDetailModal({ versionInfo, onClose }: VersionDetailModalProps) {
  const { frontend, backend, last_change } = versionInfo;

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998]"
      />

      {/* Modal */}
      <div className="fixed bottom-8 right-3 bg-white/70 backdrop-blur-md border border-black/10 rounded-lg shadow-lg p-3 w-[300px] text-sm text-black/90 font-light z-[9999] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-black/5">
          <h3 className="text-xs font-medium text-black/60 uppercase tracking-wide">
            Deployment Info
          </h3>
          <button
            onClick={onClose}
            className="text-black/40 hover:text-black/70 transition-colors text-lg leading-none"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Frontend Version */}
        <div className="mb-2 space-y-0.5">
          <div className="text-[10px] text-black/50 uppercase tracking-wide">Frontend Build</div>
          <div className="text-xs">
            <span className="font-medium">v{frontend.version}</span>
            <span className="text-black/50 ml-1">({frontend.commit})</span>
          </div>
          <div className="text-[10px] text-black/40">{formatDate(frontend.build_date)}</div>
        </div>

        {/* Backend Version */}
        <div className="mb-3 space-y-0.5">
          <div className="text-[10px] text-black/50 uppercase tracking-wide">Backend Build</div>
          <div className="text-xs">
            <span className="font-medium">{backend.version}</span>
            <span className="text-black/50 ml-1">({backend.commit})</span>
          </div>
          <div className="text-[10px] text-black/40">{formatDate(backend.build_date)}</div>
        </div>

        {/* Last Change */}
        <div className="mb-3 space-y-0.5 pt-2 border-t border-black/5">
          <div className="text-[10px] text-black/50 uppercase tracking-wide">Last Change</div>
          <div className="text-xs font-medium break-words">{last_change.description}</div>
          <div className="text-[10px] text-black/40">
            by {last_change.author} · {formatDate(last_change.timestamp)}
          </div>
        </div>

        {/* View History Link */}
        <div className="pt-2 border-t border-black/5">
          <a
            href="/logs/builds/latest.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-purple-600 hover:text-purple-700 transition-colors"
          >
            View build history →
          </a>
        </div>
      </div>
    </>
  );
}
