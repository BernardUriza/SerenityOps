/**
 * Version Info Hook
 *
 * Fetches and caches version information from backend
 * Auto-refreshes every 15 seconds to detect deployments
 */

import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const REFRESH_INTERVAL = 15000; // 15 seconds

export interface VersionInfo {
  frontend: {
    version: string;
    commit: string;
    build_date: string;
  };
  backend: {
    version: string;
    commit: string;
    build_date: string;
  };
  last_change: {
    author: string;
    description: string;
    timestamp: string;
  };
}

export function useVersionInfo() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchVersion = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/version`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json() as VersionInfo;
      setVersionInfo(data);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch version info:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchVersion();

    // Set up auto-refresh interval
    intervalRef.current = window.setInterval(fetchVersion, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { versionInfo, isLoading, error, refresh: fetchVersion };
}
