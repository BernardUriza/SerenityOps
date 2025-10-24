/**
 * NavIconWithBadge - Navigation icon with optional notification badge
 * Prevents overlap by using controlled relative positioning
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../icons';

interface NavIconWithBadgeProps {
  iconName: string;
  size?: number;
  badge?: number;
  badgeType?: 'default' | 'success' | 'warning';
  isActive?: boolean;
  isLogo?: boolean;
}

export const NavIconWithBadge: React.FC<NavIconWithBadgeProps> = ({
  iconName,
  size = 24,
  badge,
  badgeType = 'default',
  isActive = false,
  isLogo = false,
}) => {
  const showBadge = !isLogo && badge && badge > 0;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      {/* Icon */}
      <div className={`transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : ''}`}>
        <Icon name={iconName} size={size} />
      </div>

      {/* Badge - Only render if not logo and has count */}
      <AnimatePresence>
        {showBadge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center px-1.5 text-[10px] font-black rounded-full shadow-lg z-20 animate-pulse ${
              badgeType === 'success'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/50'
                : badgeType === 'warning'
                ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/50'
                : 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/50'
            }`}
          >
            {badge > 99 ? '99+' : badge}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
