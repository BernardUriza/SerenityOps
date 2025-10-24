"use client";

/**
 * TechBadge - Displays technology logo with intelligent fallback
 * Priority: SVG logo > Emoji (NO DUPLICATION)
 * Fetches from backend icon service
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Icon } from '../../icons';

interface TechBadgeProps {
  tech: string;
  onRemove?: () => void;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface TechIconData {
  name: string;
  emoji?: string;
  svg_url?: string;
  color?: string;
  category?: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  tech,
  onRemove,
  editable = false,
  size = 'md',
}) => {
  const [iconData, setIconData] = useState<TechIconData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/icons/${encodeURIComponent(tech)}`);
        if (response.ok) {
          const data = await response.json();
          setIconData(data);
        } else {
          // Fallback data if API fails - use null to trigger Icon fallback
          setIconData({
            name: tech,
            emoji: undefined,
            color: '#808080',
          });
        }
      } catch (error) {
        console.error(`Failed to fetch icon for ${tech}:`, error);
        setIconData({
          name: tech,
          emoji: undefined,
          color: '#808080',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIcon();
  }, [tech]);

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-3 py-2 text-xs',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-4 bg-macPanel/50 backdrop-blur-md border border-macBorder/40 rounded-mac ${sizeClasses[size]} animate-pulse`}>
        <div className={`${iconSizes[size]} bg-macHover/60 rounded`}></div>
        <span className="text-macSubtext">{tech}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={editable ? { scale: 1.05 } : {}}
      className={`flex items-center gap-4 bg-macPanel/70 backdrop-blur-md border border-macBorder/40 rounded-mac ${sizeClasses[size]} group shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-mac`}
      style={{
        borderColor: iconData?.color ? `${iconData.color}40` : undefined,
      }}
    >
      {/* PRIORITY: Show SVG logo if available, otherwise show emoji, finally fallback to custom icon */}
      {iconData?.svg_url ? (
        <img
          src={iconData.svg_url}
          alt={tech}
          className={`${iconSizes[size]}`}
          style={{ filter: 'brightness(0.9)' }}
          onError={(e) => {
            // Fallback to emoji or icon if SVG fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallbackElement = target.nextElementSibling;
            if (fallbackElement) (fallbackElement as HTMLElement).style.display = 'inline-block';
          }}
        />
      ) : iconData?.emoji ? (
        <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-xs'}`}>
          {iconData.emoji}
        </span>
      ) : (
        <Icon name="wrench" size={12} className="flex-shrink-0" />
      )}

      {/* Hidden fallback for SVG error */}
      {iconData?.svg_url && iconData?.emoji && (
        <span
          className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-xs'}`}
          style={{ display: 'none' }}
        >
          {iconData.emoji}
        </span>
      )}
      {iconData?.svg_url && !iconData?.emoji && (
        <div style={{ display: 'none' }}>
          <Icon name="wrench" size={12} className="flex-shrink-0" />
        </div>
      )}

      <span className="text-macText">{tech}</span>

      {editable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-macSubtext hover:text-error transition-all duration-300 ease-mac opacity-0 group-hover:opacity-100"
        >
          <X size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
      )}
    </motion.div>
  );
};
