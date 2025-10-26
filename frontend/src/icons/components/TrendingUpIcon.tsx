/**
 * TrendingUp Icon Component
 * Used for: Pipeline, Growth, Metrics, Analytics
 */

import React from 'react';
import type { IconProps } from '../types';

export const TrendingUpIcon: React.FC<IconProps> = ({
  size = 20,
  color = 'currentColor',
  className = '',
  strokeWidth = 1.75,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
};
