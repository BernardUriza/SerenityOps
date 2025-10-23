/**
 * CV Job Polling Hook
 *
 * Automatically polls CV generation job status and updates store.
 * Handles lifecycle: start polling → update status → stop when complete
 */

import { useEffect, useRef } from 'react';
import { useCVJobStore } from '../stores/cvJobStore';
import type { CVJob } from '../stores/cvJobStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const POLLING_INTERVAL = 1500; // 1.5 seconds

export function useCVJobPolling() {
  const { job, updateStatus, clearJob } = useCVJobStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Only poll if job exists and is not in terminal state
    if (!job || job.status === 'success' || job.status === 'error') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start polling
    const poll = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cv/status/${job.id}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json() as CVJob;

        // Update store with latest status
        updateStatus(data);

        // Stop polling if job is complete
        if (data.status === 'success' || data.status === 'error') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (error) {
        console.error('Failed to fetch job status:', error);
      }
    };

    // Poll immediately
    poll();

    // Set up interval
    intervalRef.current = window.setInterval(poll, POLLING_INTERVAL);

    // Cleanup on unmount or job change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [job?.id, job?.status, updateStatus]);

  return { job, clearJob };
}
