/**
 * Version Badge Component
 *
 * Persistent deployment badge showing current frontend/backend versions
 * Fixed position, semi-transparent, macOS aesthetic
 * Expandable on click to show detailed build info
 */

import { useState } from 'react';
import { useVersionInfo } from '../hooks/useVersionInfo';
import VersionDetailModal from './VersionDetailModal';

export default function VersionBadge() {
  const { versionInfo, isLoading, error } = useVersionInfo();
  const [showDetails, setShowDetails] = useState(false);

  // Don't render if loading or error (keep UI clean)
  if (isLoading || error || !versionInfo) {
    return null;
  }

  const { frontend, backend } = versionInfo;

  return (
    <>
      {/* Badge */}
      <div
        onClick={() => setShowDetails(!showDetails)}
        className="fixed bottom-2 right-3 bg-white/40 backdrop-blur-md border border-black/10 rounded-md px-2 py-[2px] text-[11px] text-black font-light shadow-sm select-none transition-all hover:bg-white/60 cursor-pointer z-[9999]"
        title="Click to view deployment details"
      >
        <span className="opacity-60">🪶</span> v{frontend.version} · <span className="opacity-60">⚙️</span> {backend.version}
      </div>

      {/* Detail Modal */}
      {showDetails && (
        <VersionDetailModal
          versionInfo={versionInfo}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
