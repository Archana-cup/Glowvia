import React from 'react'
import { Sparkles } from 'lucide-react'

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Promotional announcement"
      className="bg-[#267A50] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 select-none"
    >
      <Sparkles className="w-3.5 h-3.5 text-[#FFF0F5] shrink-0" />
      <span className="truncate">
        Beauty Begins With You — Free Shipping on Orders Over ₹799 | Code: <strong className="underline underline-offset-2">GLOW10</strong> for 10% Off
      </span>
    </aside>
  )
}

