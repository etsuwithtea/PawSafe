import { useState } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    const id = `toast-${toastId++}`;
    const newToast: ToastMessage = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
};

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
  variant?: 'default' | 'dark';
}

export default function Toast({ toasts, onRemove, variant = 'default' }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-right-4 duration-200 ${
            variant === 'dark'
              ? 'bg-black'
              : toast.type === 'success'
              ? 'bg-green-500'
              : toast.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ fontFamily: 'Poppins, Anuphan' }}
        >
          <div className="flex items-center justify-between gap-3">
            <span>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-white hover:opacity-70 transition-opacity text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
