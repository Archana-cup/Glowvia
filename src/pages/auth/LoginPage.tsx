import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Logo } from '../../components/common/Logo'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const { signIn, demoLogin, isLiveSupabase } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Where to redirect after login (default to homepage '/')
  const from = (location.state as any)?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    setAuthError(null)

    try {
      const res = await signIn(values.email, values.password)
      if (res.success) {
        success('Welcome back to Glowvia!')
        navigate(from, { replace: true })
      } else {
        setAuthError(res.error || 'Invalid credentials. Please check your details.')
      }
    } catch {
      setAuthError('An unexpected error occurred during sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setValue('email', 'customer@glowvia.com')
      setValue('password', 'Customer@123')
    } else {
      setValue('email', 'admin@glowvia.com')
      setValue('password', 'Admin@123')
    }
    demoLogin(role)
    success(`Signed in as demo ${role}!`)
    navigate(role === 'admin' ? '/admin' : from, { replace: true })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-[#FFF0F5] selection:text-[#267A50]">
      {/* Left Column: Form & Brand Controls */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-xl mx-auto w-full">
        {/* Header / Brand Logo */}
        <div>
          <Logo size="md" showTagline={true} />
        </div>

        {/* Center: Sign In Box */}
        <div className="my-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#29212A] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-[#71676D] mt-2 leading-relaxed">
              Your beauty journey continues here. Sign in to access your curated ritual, saved wishlist, and recent orders.
            </p>
          </div>

          {/* Development Quick-Login Helper */}
          {!isLiveSupabase && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FFF0F5] border border-pink-100 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#267A50] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Development Mode Demo Logins:</span>
              </div>
              <p className="text-[#71676D] mb-3 leading-relaxed">
                Supabase credentials not yet configured. Use one-click demo access to test the store:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="py-2 px-3 rounded-lg bg-white border border-[#EAE3E5] hover:border-[#267A50] text-[#267A50] font-semibold text-center transition-colors shadow-2xs"
                >
                  Demo Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="py-2 px-3 rounded-lg bg-white border border-[#EAE3E5] hover:border-[#185C3A] text-[#185C3A] font-semibold text-center transition-colors shadow-2xs"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#29212A] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#267A50] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-colors focus:outline-none bg-white ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#EAE3E5] focus:border-[#267A50]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#71676D] hover:text-[#29212A]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-[#EAE3E5] text-[#267A50] focus:ring-[#267A50]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-[#71676D] select-none">
                Remember me on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest exploration link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-[#71676D] hover:text-[#267A50] transition-colors"
            >
              ← Continue browsing as guest
            </Link>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-6 border-t border-[#EAE3E5] text-center text-xs text-[#71676D]">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-[#267A50] hover:underline">
            Create an account
          </Link>
        </div>
      </div>

      {/* Right Column: Premium Skincare Photo Showcase */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-16 bg-[#FFF0F5] overflow-hidden">
        {/* Background photo with subtle beauty overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80"
            alt="Glowvia pure skincare ritual"
            className="w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#29212A]/85 via-[#29212A]/30 to-transparent"></div>
        </div>

        {/* Top badge */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium w-fit border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Formulated For Mindful Self-Care</span>
        </div>

        {/* Bottom Editorial Content */}
        <div className="relative z-10 max-w-md text-white space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#267A50] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
            G
          </div>
          <h2 className="text-3xl xl:text-4xl font-serif font-normal leading-tight">
            "Your glow. Your ritual. Your Glowvia."
          </h2>
          <p className="text-sm font-serif italic text-white/90">
            Beauty Begins With You.
          </p>
          <div className="pt-4 flex items-center gap-6 text-xs text-white/80 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FFF0F5]" />
              <span>Clean Formulations</span>
            </div>
            <div>•</div>
            <div>Cruelty-Free</div>
            <div>•</div>
            <div>Barrier-First</div>
          </div>
        </div>
      </div>
    </div>
  )
}

