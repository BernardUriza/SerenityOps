/**
 * Reusable IconButton Component
 * Compact button with only icon for toolbars and action menus
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type IconButtonVariant = 'default' | 'accent' | 'warning' | 'danger' | 'success';
export type IconButtonSize = 'xs' | 'sm' | 'md';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  tooltip?: string;
  loading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: 'hover:bg-macAccent/10 text-macSubtext hover:text-macAccent',
  accent: 'hover:bg-macAccent/10 text-macAccent',
  warning: 'hover:bg-warning/10 text-macSubtext hover:text-warning',
  danger: 'hover:bg-error/10 text-macSubtext hover:text-error',
  success: 'hover:bg-success/10 text-macSubtext hover:text-success',
};

const sizeConfig: Record<IconButtonSize, { button: string; icon: number }> = {
  xs: { button: 'w-6 h-6', icon: 12 },
  sm: { button: 'w-7 h-7', icon: 14 },
  md: { button: 'w-8 h-8', icon: 16 },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  variant = 'default',
  size = 'sm',
  tooltip,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const config = sizeConfig[size];

  return (
    <button
      className={`
        ${config.button}
        ${variantStyles[variant]}
        rounded-lg
        flex items-center justify-center
        transition-all duration-300 ease-mac
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-macAccent/50
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      title={tooltip}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin" width={config.icon} height={config.icon} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <Icon size={config.icon} />
      )}
    </button>
  );
};
