/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Compact Precision Typography Scale
      fontSize: {
        'xs': ['10px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'sm': ['12.5px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'base': ['12.5px', { lineHeight: '1.25', letterSpacing: '0' }],
        'lg': ['14px', { lineHeight: '1.3', letterSpacing: '0' }],
        'xl': ['16px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },

      // Compact Spacing Scale (0.4rem base unit)
      spacing: {
        '0.5': '0.2rem',   // 3.2px
        '1': '0.4rem',     // 6.4px
        '1.5': '0.6rem',   // 9.6px
        '2': '0.8rem',     // 12.8px
        '2.5': '1rem',     // 16px
        '3': '1.2rem',     // 19.2px
        '4': '1.6rem',     // 25.6px
        '5': '2rem',       // 32px
        '6': '2.4rem',     // 38.4px
        '7': '2.8rem',     // 44.8px
        '8': '3.2rem',     // 51.2px
        '10': '4rem',      // 64px
        '12': '4.8rem',    // 76.8px
      },

      // Compact Precision Color System
      colors: {
        // Base backgrounds
        background: '#090C10',

        surface: {
          DEFAULT: '#0F1419',
          elevated: '#1A1F29',
          hover: '#1E242E',
          active: '#252B36',
        },

        // Primary brand
        primary: {
          DEFAULT: '#2E97FF',
          hover: '#1E87EF',
          active: '#0E77DF',
          muted: 'rgba(46, 151, 255, 0.2)',
          subtle: 'rgba(46, 151, 255, 0.1)',
        },

        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          muted: 'rgba(16, 185, 129, 0.2)',
        },
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          muted: 'rgba(239, 68, 68, 0.2)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          muted: 'rgba(245, 158, 11, 0.2)',
        },

        // Text hierarchy
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          tertiary: '#64748B',
          disabled: '#475569',
        },

        // Borders
        border: {
          DEFAULT: 'rgba(148, 163, 184, 0.1)',
          strong: 'rgba(148, 163, 184, 0.2)',
          hover: 'rgba(148, 163, 184, 0.3)',
        },

        // Legacy support (minimal)
        card: '#1A1F29',
      },

      // Compact Border Radius
      borderRadius: {
        'none': '0',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
        'full': '9999px',
      },

      // Fast Transitions
      transitionDuration: {
        DEFAULT: '150ms',
        'fast': '100ms',
        'normal': '150ms',
        'slow': '200ms',
      },

      // Compact Heights
      height: {
        'input': '1.75rem',      // 28px - h-7
        'button': '1.75rem',     // 28px - h-7
        'tab': '1.75rem',        // 28px - h-7
        'row': '1.625rem',       // 26px
        'header': '2.25rem',     // 36px
        'sidebar-icon': '2.25rem', // 36px
      },

      // Compact Widths
      width: {
        'sidebar': '3.25rem',    // 52px
        'chat-sidebar': '15rem', // 240px
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

      // Box shadows (minimal, subtle)
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'md': '0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'lg': '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
        'none': 'none',
      },

      // Backdrop blur (for modals)
      backdropBlur: {
        'sm': '4px',
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
