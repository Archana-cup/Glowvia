import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Verifying administrator credentials..." />
      </div>
    )
  }

  // If not logged in at all, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If logged in but role is not admin, deny access with security message
  if (user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#29212A] mb-2">
            Admin Access Restricted
          </h2>
          <p className="text-sm text-[#71676D] leading-relaxed mb-6">
            Your account ({user.email}) does not possess verified administrator permissions.
            Admin operations require explicit role authorization.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#267A50] text-white text-sm font-medium hover:bg-[#185C3A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Store</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

