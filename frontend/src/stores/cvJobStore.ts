/**
 * CV Generation Job Store
 *
 * Manages persistent state for CV generation jobs with progress tracking.
 * Integrates with localStorage for persistence across page reloads.
 */

import { create } from 'zustand';

export type JobStatus = 'queued' | 'running' | 'error' | 'success';

export interface CVJob {
  id: string;
  opportunity: string;
  user_id: string;
  status: JobStatus;
  progress: number;
  stage: string;
  error_message?: string;
  output_path?: string;
  download_url?: string;
  filename?: string;
  size?: number;
  created_at: string;
  updated_at: string;
}

interface CVJobStore {
  job: CVJob | null;
  setJob: (job: CVJob | null) => void;
  updateStatus: (update: Partial<CVJob>) => void;
  clearJob: () => void;
}

export const useCVJobStore = create<CVJobStore>((set) => ({
  job: null,

  setJob: (job) => {
    set({ job });
    // Persist to localStorage
    if (job) {
      localStorage.setItem('cvJobId', job.id);
      localStorage.setItem('cvJob', JSON.stringify(job));
    } else {
      localStorage.removeItem('cvJobId');
      localStorage.removeItem('cvJob');
    }
  },

  updateStatus: (update) =>
    set((state) => {
      if (!state.job) return state;

      const updatedJob = { ...state.job, ...update };

      // Persist to localStorage
      localStorage.setItem('cvJob', JSON.stringify(updatedJob));

      return { job: updatedJob };
    }),

  clearJob: () => {
    set({ job: null });
    localStorage.removeItem('cvJobId');
    localStorage.removeItem('cvJob');
  },
}));

/**
 * Load job from localStorage on app init
 */
export function loadJobFromLocalStorage(): CVJob | null {
  try {
    const jobData = localStorage.getItem('cvJob');
    if (jobData) {
      const job = JSON.parse(jobData) as CVJob;

      // Only restore if job is not completed or failed
      if (job.status === 'queued' || job.status === 'running') {
        return job;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to load job from localStorage:', error);
    return null;
  }
}
