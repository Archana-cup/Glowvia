import React from 'react'
import { formatINR, calculateDiscount } from '../../utils/formatters'

interface PriceDisplayProps {
  price: number
  compareAtPrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
}) => {
  const discountPercent = calculateDiscount(price, compareAtPrice)

  const sizeClasses = {
    sm: {
      price: 'text-sm font-semibold',
      compare: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      price: 'text-base font-semibold',
      compare: 'text-xs',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      price: 'text-2xl font-serif font-semibold',
      compare: 'text-sm',
      badge: 'text-xs px-2.5 py-0.5',
    },
  }[size]

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`${sizeClasses.price} text-[#29212A]`}>
        {formatINR(price)}
      </span>

      {compareAtPrice && compareAtPrice > price && (
        <>
          <span className={`${sizeClasses.compare} text-[#71676D] line-through`}>
            {formatINR(compareAtPrice)}
          </span>
          <span className={`${sizeClasses.badge} rounded-full bg-[#FFF0F5] text-[#C2185B] font-medium`}>
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  )
}

