/**
 * TypeScript type definitions for Projects module
 * SerenityOps - Projects Editor
 */

export interface Project {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  tech_stack: string[];
  achievements: string[];
  github_url?: string;
  live_url?: string;
}

export interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved?: Date;
  error?: string;
}

export interface ProjectActions {
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  saveProjects: () => Promise<void>;
  loadProjects: () => Promise<void>;
}

export type ProjectStore = ProjectState & ProjectActions;
