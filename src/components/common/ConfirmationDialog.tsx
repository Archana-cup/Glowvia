import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EAE3E5]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isDestructive && (
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-lg font-serif font-semibold text-[#29212A]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#71676D] hover:text-[#29212A] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#71676D] leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#EAE3E5] text-sm font-medium text-[#29212A] hover:bg-[#FAF8F7] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#267A50] hover:bg-[#185C3A]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

