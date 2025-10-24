/**
 * useAutoSave hook - Automatically saves data after debounced changes
 * Integrates with Zustand store
 */

import { useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useExperienceStore } from '../stores/experienceStore';

export function useAutoSave(delay: number = 3000) {
  const { experiences, saveExperiences, isSaving } = useExperienceStore();
  const debouncedExperiences = useDebounce(experiences, delay);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if already saving
    if (isSaving) {
      return;
    }

    // PROTECTION: Skip if experiences is empty (prevents saving empty state on initial load)
    if (!experiences || experiences.length === 0) {
      console.log('Auto-save skipped: experiences array is empty');
      return;
    }

    // Trigger save after debounce
    const save = async () => {
      try {
        await saveExperiences();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    save();
  }, [debouncedExperiences]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isSaving };
}
