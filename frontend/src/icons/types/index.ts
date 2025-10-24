/**
 * Icon System Type Definitions
 * Following Interface Segregation Principle (ISP)
 */

/**
 * Base icon properties
 * Single Responsibility: Define core icon attributes
 */
export interface IconProps {
  /** Icon size in pixels or Tailwind class */
  size?: number | string;
  /** Icon color (Tailwind class or hex) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Stroke width for outlined icons */
  strokeWidth?: number;
}

/**
 * Icon component type
 * Open/Closed Principle: Extend without modifying
 */
export type IconComponent = React.FC<IconProps>;

/**
 * Icon metadata for registry
 */
export interface IconMetadata {
  /** Unique icon identifier */
  name: string;
  /** Icon category for organization */
  category: IconCategory;
  /** Icon component */
  component: IconComponent;
  /** Keywords for search */
  keywords: string[];
  /** Default color hint */
  defaultColor?: string;
}

/**
 * Icon categories for logical grouping
 * Using const object instead of enum for erasableSyntaxOnly compatibility
 */
export const IconCategory = {
  GENERAL: 'general',
  NAVIGATION: 'navigation',
  COMMUNICATION: 'communication',
  BUSINESS: 'business',
  TECHNOLOGY: 'technology',
  STATUS: 'status',
  ACTIONS: 'actions',
  FINANCE: 'finance',
} as const;

export type IconCategory = typeof IconCategory[keyof typeof IconCategory];

/**
 * Icon resolver strategy interface
 * Dependency Inversion Principle: Depend on abstractions
 */
export interface IconResolver {
  resolve(name: string): IconComponent | null;
}

/**
 * Icon size presets for consistency
 * Using const object instead of enum for erasableSyntaxOnly compatibility
 */
export const IconSize = {
  XS: 12,
  SM: 16,
  MD: 20,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

export type IconSize = typeof IconSize[keyof typeof IconSize];

/**
 * Icon variant for different visual styles
 * Using const object instead of enum for erasableSyntaxOnly compatibility
 */
export const IconVariant = {
  OUTLINE: 'outline',
  SOLID: 'solid',
  DUOTONE: 'duotone',
} as const;

export type IconVariant = typeof IconVariant[keyof typeof IconVariant];
