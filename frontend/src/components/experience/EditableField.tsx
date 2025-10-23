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
        outline-none cursor-text transition-all duration-300 ease-mac
        ${isEditing ? 'ring-1 ring-macAccent/50 bg-macPanel/70 backdrop-blur-md rounded-mac px-1 py-0.5 shadow-[inset_0_0_6px_rgba(10,132,255,0.1)]' : ''}
        ${!localValue && !isEditing ? 'text-macSubtext' : 'text-macText'}
        ${className}
      `}
      whileTap={{ scale: 0.99 }}
    >
      {localValue || placeholder}
    </Component>
  );
};
