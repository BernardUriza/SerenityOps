/**
 * ResizeHandle - Draggable handle for resizing sidebar
 * 2026 Trend: User-customizable adaptive layouts
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useSidebarState, SIDEBAR_WIDTH } from '../../hooks/useSidebarState';

export const ResizeHandle: React.FC = () => {
  const { width, setWidth, setIsResizing, isCollapsed } = useSidebarState();
  const handleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const newWidth = e.clientX;

      // Clamp width between MIN and MAX
      if (newWidth >= SIDEBAR_WIDTH.MIN && newWidth <= SIDEBAR_WIDTH.MAX) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === handleRef.current || handleRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        isDraggingRef.current = true;
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      }
    };

    // Attach listeners
    const handle = handleRef.current;
    handle?.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      handle?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setWidth, setIsResizing]);

  // Don't show in collapsed mode
  if (isCollapsed) return null;

  return (
    <motion.div
      ref={handleRef}
      className="absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:w-1.5 transition-all"
      whileHover={{ backgroundColor: 'rgba(10, 132, 255, 0.3)' }}
    >
      {/* Visual indicator on hover */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-macAccent/10 rounded-l-lg">
        <GripVertical size={14} className="text-macAccent" />
      </div>

      {/* Width indicator tooltip on drag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 px-2 py-1 bg-macPanel/95 backdrop-blur-xl rounded-md shadow-lg border border-macBorder/40 text-[10px] font-bold text-macAccent pointer-events-none"
      >
        {width}px
      </motion.div>
    </motion.div>
  );
};
