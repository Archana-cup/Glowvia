import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#EAE3E5] p-8 sm:p-12 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="font-serif font-bold text-5xl text-[#267A50]">404</span>
        <h1 className="font-serif font-semibold text-2xl text-[#29212A]">
          Page Not Found
        </h1>
        <p className="text-xs text-[#71676D] leading-relaxed">
          The page or formulation you are searching for might have moved or is no longer available.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Glowvia</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

