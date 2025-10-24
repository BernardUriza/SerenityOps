/**
 * ChartBarIcon - Analytics and metrics icon
 * Replaces: 📊
 */

import React from 'react';
import type { IconProps } from '../types';
import { normalizeSize, mergeClasses, resolveColor } from '../utils/iconHelpers';

export const ChartBarIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  strokeWidth = 2,
  ariaLabel = 'Chart',
}) => {
  const iconSize = normalizeSize(size);
  const colorProps = resolveColor(color);

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colorProps.style?.color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={mergeClasses('serenity-icon', colorProps.className, className)}
      style={colorProps.style}
      role="img"
      aria-label={ariaLabel}
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
};
