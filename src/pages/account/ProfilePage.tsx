import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, requestPasswordReset } = useAuth()
  const { success, error } = useToast()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [isSaving, setIsSaving] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  if (!user) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      error('Full name is required')
      return
    }

    setIsSaving(true)
    try {
      const res = await updateProfile({ fullName: fullName.trim(), phone: phone.trim() })
      if (res.success) {
        success('Profile updated successfully!')
      } else {
        error(res.error || 'Failed to update profile')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    const res = await requestPasswordReset(user.email)
    setResetSent(true)
    success(res.message || 'Password reset email sent!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-xs text-[#71676D] hover:text-[#267A50]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
        <h1 className="text-3xl font-serif font-semibold text-[#29212A] mt-2">
          Profile Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div>
              <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
                Email Address (Account Identifier)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3E5] bg-gray-50 text-[#71676D] text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-[#71676D] mt-1">
                Your email cannot be changed directly for security purposes.
              </p>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-2xs"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Security Card */}
        <div className="bg-white rounded-3xl border border-[#EAE3E5] p-6 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-semibold text-base text-[#29212A]">
            Password & Security
          </h3>
          <p className="text-xs text-[#71676D] leading-relaxed">
            Need to update your access credentials? Request a secure password reset link to be sent to your email.
          </p>

          {resetSent ? (
            <div className="p-3 rounded-xl bg-[#FFF0F5] text-[#267A50] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Reset link dispatched to {user.email}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="w-full py-2.5 rounded-full border border-[#EAE3E5] hover:border-[#267A50] text-xs font-semibold text-[#29212A] transition-colors"
            >
              Send Password Reset Link
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

