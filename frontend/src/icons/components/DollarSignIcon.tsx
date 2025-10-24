/**
 * DollarSignIcon - Money and finance icon
 * Replaces: 💰
 */

import React from 'react';
import type { IconProps } from '../types';
import { normalizeSize, mergeClasses, resolveColor } from '../utils/iconHelpers';

export const DollarSignIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  strokeWidth = 2,
  ariaLabel = 'Dollar',
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
};
