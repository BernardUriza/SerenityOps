/**
 * Icon Component - Smart Icon Resolver
 * Implements Strategy Pattern for icon resolution
 * Follows Single Responsibility Principle
 */

import React from 'react';
import type { IconProps } from '../types';
import { getIconByName } from '../constants/iconRegistry';
import { WrenchIcon } from './WrenchIcon';

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
 * Resolves icon by name from registry
 * Provides fallback for missing icons
 */
export const Icon: React.FC<SmartIconProps> = ({
  name,
  fallback: FallbackIcon = WrenchIcon,
  warnOnMissing = true,
  ...iconProps
}) => {
  const iconMetadata = getIconByName(name);

  // Icon not found - use fallback
  if (!iconMetadata) {
    if (warnOnMissing && process.env.NODE_ENV === 'development') {
      console.warn(`[Icon] Icon "${name}" not found in registry. Using fallback.`);
    }
    return <FallbackIcon {...iconProps} />;
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
