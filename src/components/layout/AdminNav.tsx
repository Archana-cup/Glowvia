import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tag, Users, ArrowLeft } from 'lucide-react'

export const AdminNav: React.FC = () => {
  const location = useLocation()

  const tabs = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tag className="w-4 h-4" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="mb-8 border-b border-[#EAE3E5]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#267A50] text-white text-[10px] font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-[#71676D]">Glowvia Store Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A] mt-1">
            Store Management Center
          </h1>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE3E5] bg-white text-xs font-semibold text-[#29212A] hover:bg-[#FAF8F7] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer Storefront</span>
        </Link>
      </div>

      <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto text-xs font-medium pt-2">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              isActive(tab.path)
                ? 'border-[#267A50] text-[#267A50] font-semibold'
                : 'border-transparent text-[#71676D] hover:text-[#29212A]'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

