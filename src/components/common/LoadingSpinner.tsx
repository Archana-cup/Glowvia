import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading your beauty essentials...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size]

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div
        className={`${sizeClasses} rounded-full border-[#EAE3E5] border-t-[#267A50] animate-spin mb-3`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-xs sm:text-sm text-[#71676D] font-medium">{label}</p>}
    </div>
  )
}

