import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
    // Prevent duplicate toasts with the same message and type
    const duplicate = (prev: ToastMessage[]) => prev.some((t) => t.message === message && t.type === type);

    if (duplicate((toasts as ToastMessage[]))) {
      return null as any;
    }

    const id = `toast-${toastId++}`;
    const newToast: ToastMessage = { id, message, type, duration };

    setToasts((prev) => {
      if (duplicate(prev)) return prev;
      return [...prev, newToast];
    });

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
  variant?: 'default' | 'dark' | 'top';
}

export default function Toast({ toasts, onRemove, variant = 'default' }: ToastProps) {
  const isTopVariant = variant === 'top';
  
  const container = (
    <div
      className={`fixed flex flex-col gap-2 ${isTopVariant ? 'top-0 left-0 right-0' : 'top-4 right-4'}`}
      style={{ zIndex: 99999 }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} variant={variant} />
      ))}
    </div>
  );

  if (typeof document === 'undefined') return container;
  return createPortal(container, document.body);
}

function ToastItem({ toast, onRemove, variant }: { toast: ToastMessage; onRemove: (id: string) => void; variant?: 'default' | 'dark' | 'top' }) {
  const [timeLeft, setTimeLeft] = useState(toast.duration || 3000);
  const isTopVariant = variant === 'top';

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration]);

  const bgColor =
    variant === 'dark' || isTopVariant
      ? toast.type === 'error'
        ? 'bg-red-500'
        : toast.type === 'success'
        ? 'bg-green-500'
        : toast.type === 'warning'
        ? 'bg-yellow-500'
        : 'bg-blue-500'
      : toast.type === 'success'
      ? 'bg-green-500'
      : toast.type === 'error'
      ? 'bg-red-500'
      : toast.type === 'warning'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  const progressPercent = toast.duration ? (timeLeft / (toast.duration || 1)) * 100 : 0;

  if (isTopVariant) {
    return (
      <div
        className={`w-full px-4 py-3 shadow-lg text-white font-medium animate-in slide-in-from-top-0 duration-300 ${bgColor}`}
        style={{ fontFamily: 'Poppins, Anuphan' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-white hover:opacity-70 transition-opacity text-lg font-bold shrink-0"
          >
            ✕
          </button>
        </div>
        {toast.duration && toast.duration > 0 && (
          <div className="w-full h-1 bg-white bg-opacity-30 mt-2">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-right-4 duration-200 ${bgColor}`}
      style={{ fontFamily: 'Poppins, Anuphan' }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span>{toast.message}</span>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-white hover:opacity-70 transition-opacity text-lg font-bold"
        >
          ✕
        </button>
      </div>
      {toast.duration && toast.duration > 0 && (
        <div className="w-full h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white bg-opacity-70 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
