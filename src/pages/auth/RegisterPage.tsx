import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Logo } from '../../components/common/Logo'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.literal(true, {
      message: 'You must agree to the Terms of Service & Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  const { signUp } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true)
    setRegError(null)

    try {
      const res = await signUp(values.email, values.password, values.fullName)
      if (res.success) {
        success(res.message || 'Registration successful! Welcome to Glowvia.')
        navigate('/', { replace: true })
      } else {
        setRegError(res.error || 'Failed to create account. Please try again.')
      }
    } catch {
      setRegError('An unexpected error occurred during account creation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-[#FFF0F5] selection:text-[#267A50]">
      {/* Left Column: Register Form */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-xl mx-auto w-full">
        <div>
          <Logo size="md" showTagline={true} />
        </div>

        <div className="my-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#29212A] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm text-[#71676D] mt-2 leading-relaxed">
              Join the Glowvia circle for tailored skincare recommendations, order tracking, and exclusive ritual drops.
            </p>
          </div>

          {regError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
              {regError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Aditi Sharma"
                  {...register('fullName')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.fullName ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.email ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-1.5">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.password ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#71676D] hover:text-[#29212A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.confirmPassword ? 'border-red-400' : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-[#71676D] hover:text-[#29212A]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Agree Terms */}
            <div className="pt-2">
              <label className="flex items-start text-xs text-[#71676D] cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="w-4 h-4 mt-0.5 rounded border-[#EAE3E5] text-[#267A50] focus:ring-[#267A50]"
                />
                <span className="ml-2 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-[#267A50] underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-[#267A50] underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.agreeTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-4 border-t border-[#EAE3E5] text-center text-xs text-[#71676D]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#267A50] hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      {/* Right Column: Editorial Showcase */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-16 bg-[#FFF0F5] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
            alt="Botanical skincare"
            className="w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#29212A]/85 via-[#29212A]/30 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium w-fit border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Glowvia Membership</span>
        </div>

        <div className="relative z-10 max-w-md text-white space-y-4">
          <h2 className="text-3xl xl:text-4xl font-serif font-normal leading-tight">
            Elevate your everyday ritual.
          </h2>
          <p className="text-sm font-serif italic text-white/90">
            Beauty Begins With You.
          </p>
          <div className="pt-4 flex items-center gap-6 text-xs text-white/80 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FFF0F5]" />
              <span>Free Delivery on ₹799+</span>
            </div>
            <div>•</div>
            <div>Member Offers</div>
            <div>•</div>
            <div>Curated Rituals</div>
          </div>
        </div>
      </div>
    </div>
  )
}

