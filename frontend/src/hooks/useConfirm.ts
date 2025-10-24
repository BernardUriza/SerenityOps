/**
 * Custom hook for modern confirm dialogs
 * Replaces window.confirm with React state management
 */

import { useState, useCallback } from 'react';
import type { DialogType } from '../components/ui/ConfirmDialog';

export interface ConfirmOptions {
  type?: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  loading: boolean;
  resolve: ((value: boolean) => void) | null;
}

export const useConfirm = () => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    loading: false,
    type: 'warning',
    title: '',
    message: '',
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        loading: false,
        ...options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));
    setTimeout(() => {
      state.resolve?.(true);
      setState(prev => ({ ...prev, isOpen: false, loading: false, resolve: null }));
    }, 100);
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState(prev => ({ ...prev, isOpen: false, resolve: null }));
  }, [state.resolve]);

  return {
    confirm,
    confirmState: state,
    handleConfirm,
    handleCancel,
  };
};
