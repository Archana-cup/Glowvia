import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionLink?: string
  onActionClick?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mb-4 shadow-sm">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-serif font-semibold text-[#29212A] mb-2">{title}</h3>
      <p className="text-sm text-[#71676D] leading-relaxed mb-6">{description}</p>

      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-medium transition-colors shadow-sm"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionLabel && !actionLink && onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-medium transition-colors shadow-sm"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

