import { useUiStore } from '../store/uiStore.js';

export function useToast() {
  const addToast = useUiStore((s) => s.addToast);
  return {
    success: (message) => addToast({ type: 'success', message }),
    error: (message) => addToast({ type: 'error', message }),
    info: (message) => addToast({ type: 'info', message }),
  };
}
