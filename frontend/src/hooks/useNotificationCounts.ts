// useNotificationCounts - Real-time notification counters hook
import { useEffect, useState } from "react";

const API_BASE_URL = 'http://localhost:8000';
const POLL_INTERVAL = 30000; // 30 seconds

export interface NotificationCounts {
  chat: number;
  cvs: number;
  opportunities: number;
  projects: number;
}

export function useNotificationCounts() {
  const [counts, setCounts] = useState<NotificationCounts>({
    chat: 0,
    cvs: 0,
    opportunities: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: number;

    async function fetchCounts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications/summary`);
        if (!res.ok) {
          throw new Error(`Failed to load notifications: ${res.statusText}`);
        }
        const data = await res.json();

        if (isMounted) {
          setCounts(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useNotificationCounts] Error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    }

    // Initial fetch
    fetchCounts();

    // Set up polling interval
    intervalId = setInterval(fetchCounts, POLL_INTERVAL);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { counts, loading, error };
}
