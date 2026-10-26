import React from 'react'
import { Star } from 'lucide-react'

interface RatingDisplayProps {
  rating?: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  className = '',
}) => {
  // If no rating or review data exists, don't show fabricated rating stars
  if (!rating || rating <= 0) {
    return null
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-[#267A50]">
        <Star className={`${iconSize} fill-[#267A50] stroke-[#267A50]`} />
      </div>
      <span className={`${textSize} font-semibold text-[#29212A]`}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className={`${textSize} text-[#71676D]`}>
          ({reviewCount})
        </span>
      )}
    </div>
  )
}

