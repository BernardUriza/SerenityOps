/**
 * StarIcon - Favorites and ratings icon
 * Replaces: 🌟
 */

import React from 'react';
import type { IconProps } from '../types';
import { normalizeSize, mergeClasses, resolveColor } from '../utils/iconHelpers';

export const StarIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  strokeWidth = 2,
  ariaLabel = 'Star',
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};
