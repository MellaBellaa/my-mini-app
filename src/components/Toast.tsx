import React from 'react'
import type { ToastMessage } from '../types'
import { Icon } from './Icon'

export const ToastContainer: React.FC<{
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-neutral-900/95 text-white p-4 shadow-2xl backdrop-blur-md border border-white/10 transition-all duration-300 animate-slide-up"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-violet-600 text-white mt-0.5">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-neutral-300 leading-relaxed truncate">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white transition p-1 text-sm leading-none"
            aria-label="Dismiss toast"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
