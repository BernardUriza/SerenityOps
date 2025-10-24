/**
 * Icon System Utilities
 * DRY Principle: Reusable helper functions
 */

import type { IconProps } from '../types';
import { IconSize } from '../types';

/**
 * Normalize size to number
 * Single Responsibility: Size conversion
 */
export const normalizeSize = (size?: number | string): number => {
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    // Handle Tailwind sizes (w-4, h-4, etc.)
    const match = size.match(/(\d+)/);
    if (match) return parseInt(match[1]) * 4; // Tailwind uses 4px scale
  }
  return IconSize.MD; // Default
};

/**
 * Get SVG viewBox from size
 */
export const getViewBox = (size: number = 24): string => {
  return `0 0 ${size} ${size}`;
};

/**
 * Merge class names intelligently
 */
export const mergeClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get color class or inline style
 */
export const resolveColor = (color?: string): { className?: string; style?: React.CSSProperties } => {
  if (!color) return {};

  // If it's a Tailwind class
  if (color.startsWith('text-') || color.startsWith('bg-')) {
    return { className: color };
  }

  // If it's a hex/rgb color
  return { style: { color } };
};

/**
 * Default icon props for consistency
 */
export const DEFAULT_ICON_PROPS: Partial<IconProps> = {
  size: IconSize.MD,
  strokeWidth: 2,
  color: 'currentColor',
};

/**
 * Validate icon name format
 */
export const isValidIconName = (name: string): boolean => {
  return /^[a-z][a-z0-9-]*$/i.test(name);
};

/**
 * Convert emoji to icon name suggestion
 */
export const emojiToIconName = (emoji: string): string | null => {
  const emojiMap: Record<string, string> = {
    '💼': 'briefcase',
    '🚀': 'rocket',
    '🎯': 'target',
    '📊': 'chart',
    '💡': 'lightbulb',
    '⚙️': 'settings',
    '🔧': 'wrench',
    '📝': 'document',
    '✅': 'check-circle',
    '❌': 'x-circle',
    '⚡': 'lightning',
    '🔥': 'flame',
    '💰': 'dollar-sign',
    '📈': 'trending-up',
    '📉': 'trending-down',
    '🏆': 'trophy',
    '🎓': 'graduation-cap',
    '🌟': 'star',
    '💻': 'laptop',
    '📱': 'smartphone',
  };

  return emojiMap[emoji] || null;
};
