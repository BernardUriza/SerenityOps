/**
 * SidebarFooter - Extracted footer component with stats
 * Single Responsibility: Display statistics and status
 */

import React from 'react';

export interface SidebarFooterProps {
  chatCount: number;
  messageCount: number;
  archivedCount: number;
  isOnline?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  chatCount,
  messageCount,
  archivedCount,
  isOnline = true,
}) => {
  return (
    <div className="h-12 px-4 border-t border-macBorder/30 bg-macPanel/40 backdrop-blur-xl flex items-center justify-between text-xs font-medium">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-error'}`} />
        <span className="text-macText font-semibold">{chatCount}</span>
        <span className="text-macSubtext">chats</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-macText font-semibold">{messageCount}</span>
          <span className="text-macSubtext">msgs</span>
        </div>

        {archivedCount > 0 && (
          <div className="px-2.5 py-1 bg-macAccent/10 text-macAccent rounded-lg text-[10px] font-bold">
            {archivedCount} archived
          </div>
        )}
      </div>
    </div>
  );
};
