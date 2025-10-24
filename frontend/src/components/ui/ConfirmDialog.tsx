/**
 * Modern Confirm Dialog Component
 * Replaces window.confirm with beautiful modal
 */

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from './Button';

export type DialogType = 'warning' | 'info' | 'danger';

export interface ConfirmDialogProps {
  isOpen: boolean;
  type?: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const typeConfig: Record<DialogType, { icon: React.ReactNode; color: string }> = {
  warning: {
    icon: <AlertTriangle size={24} className="text-warning" />,
    color: 'warning',
  },
  info: {
    icon: <Info size={24} className="text-macAccent" />,
    color: 'macAccent',
  },
  danger: {
    icon: <AlertTriangle size={24} className="text-error" />,
    color: 'error',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  type = 'warning',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative liquid-glass rounded-2xl p-6 max-w-md w-full shadow-2xl border border-macBorder/40 animate-scaleIn">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-macPanel/60 flex items-center justify-center">
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-macText mb-2">{title}</h3>
            <p className="text-sm text-macSubtext leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
