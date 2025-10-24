/**
 * Reusable Button Component - SOLID compliant
 * Supports multiple variants and sizes with consistent styling
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'gradient-accent text-white shadow-lg hover:shadow-accent',
  secondary: 'liquid-glass text-macText hover:shadow-md',
  ghost: 'hover:bg-macPanel/40 text-macSubtext hover:text-macText',
  danger: 'liquid-glass border border-red-500/40 hover:bg-red-500/20 text-red-400 hover:text-red-300',
  success: 'liquid-glass border border-green-500/40 hover:bg-green-500/20 text-green-400 hover:text-green-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-xl
        transition-all duration-300 ease-mac
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-macAccent/50
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} />}
        </>
      )}
    </button>
  );
};
