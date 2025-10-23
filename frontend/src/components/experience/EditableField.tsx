"use client";

/**
 * EditableField - Inline editable text component
 * Supports single-line and multi-line (contentEditable)
 * GitHub dark theme styling
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  placeholder = 'Click to edit',
  multiline = false,
  className = '',
  as = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || '';
    setLocalValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      contentRef.current?.blur();
    }
  };

  const Component = motion[as];

  return (
    <Component
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`
        outline-none cursor-text transition-all duration-200
        ${isEditing ? 'ring-2 ring-sky-500/50 bg-slate-800/50 rounded px-2 py-1' : ''}
        ${!localValue && !isEditing ? 'text-slate-500' : 'text-slate-200'}
        ${className}
      `}
      whileTap={{ scale: 0.99 }}
    >
      {localValue || placeholder}
    </Component>
  );
};
