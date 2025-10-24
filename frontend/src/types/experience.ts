/**
 * TypeScript type definitions for Experience module
 * SerenityOps - Experience Editor
 */

export interface Experience {
  id?: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  achievements: string[];
  tech_stack: string[];
  company_logo?: string;
  logo?: string;
}

export interface TechIcon {
  name: string;
  emoji?: string;
  svg_url?: string;
  color?: string;
  category?: 'language' | 'framework' | 'tool' | 'platform' | 'database' | 'other';
}

export interface EditMode {
  mode: 'edit' | 'presentation';
}

export interface ExperienceState {
  experiences: Experience[];
  editMode: EditMode['mode'];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved?: Date;
  error?: string;
}

export interface ExperienceActions {
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (startIndex: number, endIndex: number) => void;
  setEditMode: (mode: EditMode['mode']) => void;
  saveExperiences: () => Promise<void>;
  loadExperiences: () => Promise<void>;
}

export type ExperienceStore = ExperienceState & ExperienceActions;
