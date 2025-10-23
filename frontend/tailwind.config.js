/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // macOS Theme Colors
      colors: {
        // Legacy colors (maintained for compatibility)
        background: '#0a0e14',

        surface: {
          DEFAULT: '#141b24',
          elevated: '#1a2332',
          hover: '#232d3f',
          active: '#2d3748',
        },

        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          active: '#1d4ed8',
          muted: 'rgba(59, 130, 246, 0.2)',
          subtle: 'rgba(59, 130, 246, 0.1)',
        },

        success: {
          DEFAULT: '#10b981',
          hover: '#059669',
          muted: 'rgba(16, 185, 129, 0.2)',
        },

        error: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          muted: 'rgba(239, 68, 68, 0.2)',
        },

        warning: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          muted: 'rgba(245, 158, 11, 0.2)',
        },

        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          tertiary: '#64748b',
          disabled: '#475569',
        },

        border: {
          DEFAULT: 'rgba(148, 163, 184, 0.15)',
          strong: 'rgba(148, 163, 184, 0.25)',
          hover: 'rgba(148, 163, 184, 0.35)',
        },

        // macOS Native Theme
        macBg: '#1C1C1E',
        macPanel: '#2C2C2E',
        macAccent: '#0A84FF',
        macBorder: '#3A3A3C',
        macText: '#F5F5F7',
        macSubtext: '#9FA2B2',
        macHover: '#38383A',
      },

      // macOS-style backdrop blur
      backdropBlur: {
        sm: '4px',
        md: '8px',
      },

      // macOS border radius
      borderRadius: {
        mac: '8px',
      },

      // Z-index scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },

      // macOS-style animations
      transitionTimingFunction: {
        'mac': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
