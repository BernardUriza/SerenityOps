/**
 * CreditCardIcon - Payment and expenses icon
 * Replaces: 💳
 */

import React from 'react';
import type { IconProps } from '../types';
import { normalizeSize, mergeClasses, resolveColor } from '../utils/iconHelpers';

export const CreditCardIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  strokeWidth = 2,
  ariaLabel = 'Credit Card',
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
};
