import React from 'react'
import { Link } from 'react-router-dom'

interface LogoProps {
  showWordmark?: boolean
  showTagline?: boolean
  size?: 'sm' | 'md' | 'lg'
  linkTo?: string
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  showWordmark = true,
  showTagline = false,
  size = 'md',
  linkTo = '/',
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      badge: 'w-8 h-8 text-lg',
      title: 'text-lg',
      tagline: 'text-[9px]',
    },
    md: {
      badge: 'w-10 h-10 text-xl',
      title: 'text-2xl',
      tagline: 'text-[10px]',
    },
    lg: {
      badge: 'w-14 h-14 text-3xl',
      title: 'text-3xl',
      tagline: 'text-xs',
    },
  }[size]

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Minimal single uppercase G logo in green (#267A50) */}
      <div
        className={`${sizeClasses.badge} rounded-full bg-[#267A50] text-white flex items-center justify-center font-serif font-bold tracking-tight shadow-sm transition-transform duration-200 group-hover:scale-105 select-none`}
        aria-hidden="true"
      >
        G
      </div>

      {showWordmark && (
        <div className="flex flex-col text-left">
          <span className={`${sizeClasses.title} font-serif font-medium tracking-tight text-[#29212A] leading-none`}>
            Glowvia
          </span>
          {showTagline && (
            <span className={`${sizeClasses.tagline} font-sans tracking-widest uppercase text-[#71676D] font-medium mt-1`}>
              Beauty Begins With You
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#267A50] rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

