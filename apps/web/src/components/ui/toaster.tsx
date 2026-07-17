'use client';

import { useToast } from './use-toast';

export function Toaster() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-5 ${
            toast.variant === 'destructive'
              ? 'border-red-500/50 bg-red-500/10 text-red-400'
              : 'border-indigo-500/30 bg-slate-900/90 text-slate-200'
          }`}
        >
          {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
          {toast.description && <p className="text-sm opacity-80">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}
