import React, { useState } from 'react'
import { Info, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export const DevModeBanner: React.FC = () => {
  const { isLiveSupabase, user, demoLogin } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (isLiveSupabase || dismissed) {
    return null
  }

  return (
    <div className="bg-[#FFF0F5] border-b border-[#EAE3E5] px-4 py-2 text-xs text-[#29212A]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-[#267A50] text-white text-[10px] uppercase tracking-wider shrink-0">
            <Info className="w-3 h-3" />
            Dev Mode
          </span>
          <span className="text-[#71676D]">
            Explore Glowvia with sample skincare catalogue & instant test accounts. To connect Supabase, see <code className="bg-white px-1.5 py-0.5 rounded border border-[#EAE3E5] text-[#29212A]">.env.example</code>.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!user && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => demoLogin('customer')}
                className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3E5] hover:border-[#267A50] text-[#267A50] font-medium transition-colors text-[11px]"
              >
                Login as Customer
              </button>
              <button
                type="button"
                onClick={() => demoLogin('admin')}
                className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3E5] hover:border-[#267A50] text-[#185C3A] font-medium transition-colors text-[11px]"
              >
                Login as Admin
              </button>
            </div>
          )}

          {user && (
            <span className="text-[11px] font-medium text-[#267A50] bg-white px-2 py-0.5 rounded border border-[#EAE3E5]">
              Signed in as: {user.fullName} ({user.role})
            </span>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-[#71676D] hover:text-[#29212A] rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
