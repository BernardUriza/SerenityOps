"use client";

/**
 * TechBadge - Displays technology logo with intelligent fallback
 * Priority: SVG logo > Emoji (NO DUPLICATION)
 * Fetches from backend icon service
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

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
          // Fallback data if API fails
          setIconData({
            name: tech,
            emoji: '🔧',
            color: '#808080',
          });
        }
      } catch (error) {
        console.error(`Failed to fetch icon for ${tech}:`, error);
        setIconData({
          name: tech,
          emoji: '🔧',
          color: '#808080',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIcon();
  }, [tech]);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-2 py-1 text-xs',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1.5 bg-surface-elevated/50 border border-border rounded ${sizeClasses[size]} animate-pulse`}>
        <div className={`${iconSizes[size]} bg-surface-hover rounded`}></div>
        <span className="text-text-tertiary">{tech}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={editable ? { scale: 1.05 } : {}}
      className={`flex items-center gap-1.5 bg-surface-elevated border border-border rounded ${sizeClasses[size]} group`}
      style={{
        borderColor: iconData?.color ? `${iconData.color}40` : undefined,
      }}
    >
      {/* PRIORITY: Show SVG logo if available, otherwise show emoji */}
      {iconData?.svg_url ? (
        <img
          src={iconData.svg_url}
          alt={tech}
          className={`${iconSizes[size]}`}
          style={{ filter: 'brightness(0.9)' }}
          onError={(e) => {
            // Fallback to emoji if SVG fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const emojiSpan = target.nextElementSibling as HTMLSpanElement;
            if (emojiSpan) emojiSpan.style.display = 'inline';
          }}
        />
      ) : iconData?.emoji ? (
        <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-xs'}`}>
          {iconData.emoji}
        </span>
      ) : null}

      {/* Hidden emoji fallback */}
      {iconData?.svg_url && iconData?.emoji && (
        <span
          className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-xs'}`}
          style={{ display: 'none' }}
        >
          {iconData.emoji}
        </span>
      )}

      <span className="text-text-primary">{tech}</span>

      {editable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-text-tertiary hover:text-error transition-colors opacity-0 group-hover:opacity-100"
        >
          <X size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
      )}
    </motion.div>
  );
};
