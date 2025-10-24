/**
 * useAppSidebarState - Global state for main App sidebar
 * Handles collapse/expand state with localStorage persistence
 * 2026 Trend: Collapsible sidebar (240px ↔ 80px)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const APP_SIDEBAR_WIDTH = {
  COLLAPSED: 80,
  EXPANDED: 260,
} as const;

interface AppSidebarState {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useAppSidebarState = create<AppSidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
    }),
    {
      name: 'serenity-app-sidebar-state',
    }
  )
);
