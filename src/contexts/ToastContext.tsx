import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast])
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast])
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-white border-[#267A50]/20 text-[#29212A] shadow-[#267A50]/10'
                : toast.type === 'error'
                ? 'bg-white border-red-200 text-[#29212A] shadow-red-500/10'
                : 'bg-white border-blue-200 text-[#29212A] shadow-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && (
                <div className="w-7 h-7 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
              )}
              <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#71676D] hover:text-[#29212A] p-1 rounded-md transition-colors ml-2"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

