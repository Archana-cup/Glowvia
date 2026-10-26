import React from 'react'
import { Plus, Minus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  maxStock: number
  onChange: (newQuantity: number) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxStock,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < maxStock) {
      onChange(quantity + 1)
    }
  }

  const btnClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
  const textClasses = size === 'sm' ? 'text-xs w-6' : 'text-sm w-8'

  return (
    <div className="inline-flex items-center rounded-lg border border-[#EAE3E5] bg-white p-0.5 shadow-2xs">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className={`${btnClasses} flex items-center justify-center rounded-md text-[#71676D] hover:bg-[#FAF8F7] hover:text-[#29212A] disabled:opacity-30 disabled:pointer-events-none transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className={`${textClasses} text-center font-medium text-[#29212A] select-none`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxStock}
        className={`${btnClasses} flex items-center justify-center rounded-md text-[#71676D] hover:bg-[#FAF8F7] hover:text-[#29212A] disabled:opacity-30 disabled:pointer-events-none transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

