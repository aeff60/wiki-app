import { useEffect } from 'react';
import { useUiStore } from '../../store/uiStore.js';

function ToastItem({ toast }) {
  const removeToast = useUiStore((s) => s.removeToast);

  useEffect(() => {
    const id = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(id);
  }, [toast.id, removeToast]);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <div className={`${colors[toast.type] || 'bg-gray-800'} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-64`}>
      <span className="flex-1 text-sm">{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} className="text-white/70 hover:text-white">&times;</button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
