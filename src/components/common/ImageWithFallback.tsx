import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  alt: string
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#FFF0F5] border border-[#EAE3E5] text-[#71676D] p-4 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full bg-[#267A50]/10 text-[#267A50] flex items-center justify-center mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="text-xs font-serif italic text-[#267A50]">Glowvia Ritual</span>
        <span className="text-[11px] text-[#71676D] truncate max-w-[140px] mt-0.5">{alt}</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#FAF8F7] animate-pulse flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-[#267A50] border-t-transparent animate-spin"></span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  )
}

