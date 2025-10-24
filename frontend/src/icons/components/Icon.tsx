/**
 * Icon Component - Smart Icon Resolver with Lucide Fallback
 * Implements Strategy Pattern for icon resolution
 * Follows Single Responsibility Principle
 *
 * Resolution Strategy:
 * 1. Custom icon registry (high-quality custom icons)
 * 2. Lucide icons (universal fallback via getIconByName)
 * 3. Fallback icon (WrenchIcon) - only if both above fail
 */

import React from 'react';
import type { IconProps } from '../types';
import { getIconByName } from '../constants/iconRegistry';
import { WrenchIcon } from './WrenchIcon';
import { CircleHelp } from 'lucide-react';

export interface SmartIconProps extends IconProps {
  /** Icon name from registry */
  name: string;
  /** Fallback icon if not found */
  fallback?: React.ComponentType<IconProps>;
  /** Show warning in console if icon not found */
  warnOnMissing?: boolean;
}

/**
 * Icon Component
 * Resolves icon by name from registry with Lucide fallback
 * Provides graceful degradation for missing icons
 */
export const Icon: React.FC<SmartIconProps> = ({
  name,
  fallback: FallbackIcon = WrenchIcon,
  warnOnMissing = false, // Changed to false by default - Lucide fallback handles most cases
  ...iconProps
}) => {
  const iconMetadata = getIconByName(name);

  // Icon not found - use fallback (rare case, as Lucide covers most icons)
  if (!iconMetadata) {
    if (warnOnMissing && import.meta.env.DEV) {
      console.warn(
        `[IconRegistry] Icon "${name}" not found in custom registry or Lucide. Using fallback icon.`
      );
    }

    // Use CircleHelp from Lucide as the ultimate fallback
    const { size = 20, className = '', color, ...rest } = iconProps;
    return (
      <CircleHelp
        size={size}
        className={`${color || 'text-macSubtext'} opacity-50 ${className}`}
        strokeWidth={1.25}
        {...rest}
      />
    );
  }

  const IconComponent = iconMetadata.component;

  // Use default color from metadata if not specified
  const finalProps: IconProps = {
    ...iconProps,
    color: iconProps.color || iconMetadata.defaultColor,
  };

  return <IconComponent {...finalProps} />;
};

/**
 * Utility: Check if icon exists
 */
export const hasIcon = (name: string): boolean => {
  return getIconByName(name) !== null;
};

/**
 * HOC: WithIcon - Inject icon into component
 */
export const withIcon = <P extends object>(
  Component: React.ComponentType<P & { icon: React.ReactNode }>,
  iconName: string,
  iconProps?: Partial<IconProps>
) => {
  return (props: P) => {
    const icon = <Icon name={iconName} {...iconProps} />;
    return <Component {...props} icon={icon} />;
  };
};
