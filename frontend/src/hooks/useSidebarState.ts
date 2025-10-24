/**
 * useSidebarState - Sidebar state management hook
 * Handles collapsed state, width, and persistence
 * 2026 Trend: Adaptive, collapsible sidebar
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SidebarState {
  // State
  isCollapsed: boolean;
  width: number;
  isResizing: boolean;

  // Actions
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setWidth: (width: number) => void;
  setIsResizing: (isResizing: boolean) => void;
  resetWidth: () => void;
}

// Constants
export const SIDEBAR_WIDTH = {
  MIN: 200,
  DEFAULT: 240,
  MAX: 400,
  COLLAPSED: 64,
} as const;

export const useSidebarState = create<SidebarState>()(
  persist(
    (set) => ({
      // Initial state
      isCollapsed: false,
      width: SIDEBAR_WIDTH.DEFAULT,
      isResizing: false,

      // Toggle collapse state
      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      // Set collapsed state
      setCollapsed: (collapsed: boolean) =>
        set({ isCollapsed: collapsed }),

      // Set custom width
      setWidth: (width: number) => {
        const clampedWidth = Math.max(
          SIDEBAR_WIDTH.MIN,
          Math.min(SIDEBAR_WIDTH.MAX, width)
        );
        set({ width: clampedWidth });
      },

      // Set resizing state
      setIsResizing: (isResizing: boolean) =>
        set({ isResizing }),

      // Reset to default width
      resetWidth: () =>
        set({ width: SIDEBAR_WIDTH.DEFAULT }),
    }),
    {
      name: 'serenity-sidebar-state',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        width: state.width,
      }),
    }
  )
);
