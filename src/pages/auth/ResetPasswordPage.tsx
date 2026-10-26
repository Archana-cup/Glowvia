import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Logo } from '../../components/common/Logo'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useToast } from '../../contexts/ToastContext'

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ResetFormValues = z.infer<typeof resetSchema>

export const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { success } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (values: ResetFormValues) => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        })
        if (error) {
          setErrorMsg(error.message)
          return
        }
      }

      setIsSuccess(true)
      success('Password updated successfully!')
      setTimeout(() => navigate('/login'), 2500)
    } catch {
      setErrorMsg('Failed to update password. Session may have expired.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-[#EAE3E5] shadow-lg">
        <div className="text-center mb-8">
          <Logo size="md" showTagline={false} />
          <h2 className="mt-6 text-2xl font-serif font-semibold text-[#29212A]">
            Set New Password
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71676D]">
            Please enter and confirm your new secure password.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#29212A]">
              Your password has been successfully reset!
            </p>
            <p className="text-xs text-[#71676D]">Redirecting you to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs">{errorMsg}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.password ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#71676D]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.confirmPassword ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
