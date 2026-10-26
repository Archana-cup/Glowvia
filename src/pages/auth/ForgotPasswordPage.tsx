import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Logo } from '../../components/common/Logo'
import { useAuth } from '../../contexts/AuthContext'

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null)
  const { requestPasswordReset } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (values: ForgotFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await requestPasswordReset(values.email)
      setSubmittedMessage(
        res.message ||
          'If an account exists with this email, password reset instructions have been dispatched.'
      )
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#71676D] leading-relaxed">
            Enter the email address associated with your Glowvia account, and we will send you a link to reset your password.
          </p>
        </div>

        {submittedMessage ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#29212A] leading-relaxed">{submittedMessage}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#267A50] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.email ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71676D] hover:text-[#267A50]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

