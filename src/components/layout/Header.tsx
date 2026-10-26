import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Shield,
  Package,
} from 'lucide-react'
import { Logo } from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

export const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const { totalItemsCount, openCart } = useCart()
  const { wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { name: 'Face Wash', path: '/categories/face-wash' },
    { name: 'Serums', path: '/categories/serums' },
    { name: 'Moisturizers', path: '/categories/moisturizers' },
    { name: 'Sunscreen', path: '/categories/sunscreen' },
    { name: 'Haircare', path: '/categories/haircare' },
    { name: 'Body Care', path: '/categories/body-care' },
    { name: 'About Us', path: '/about' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE3E5]">
      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#29212A] hover:text-[#267A50] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Glowvia Logo */}
          <Logo size="md" showTagline={false} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {navLinks.slice(0, 7).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 ${
                  isActive(link.path)
                    ? 'text-[#267A50] border-b-2 border-[#267A50] font-semibold'
                    : 'text-[#29212A] hover:text-[#267A50]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#29212A] hover:text-[#267A50] hover:bg-[#FFF0F5] rounded-full transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#29212A] hover:text-[#267A50] hover:bg-[#FFF0F5] rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C2185B] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon with dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="p-2 text-[#29212A] hover:text-[#267A50] hover:bg-[#FFF0F5] rounded-full transition-colors flex items-center gap-1"
                aria-label="Account options"
              >
                <UserIcon className="w-5 h-5" />
                {user?.role === 'admin' && (
                  <span className="w-2 h-2 rounded-full bg-[#267A50] ring-2 ring-white"></span>
                )}
              </button>

              {accountDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EAE3E5] py-2 z-40 text-sm">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-[#EAE3E5]">
                          <p className="font-semibold text-[#29212A] truncate">{user.fullName}</p>
                          <p className="text-xs text-[#71676D] truncate">{user.email}</p>
                          {user.role === 'admin' && (
                            <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#267A50]/10 text-[#267A50]">
                              Store Admin
                            </span>
                          )}
                        </div>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-[#267A50] hover:bg-[#FFF0F5] font-medium"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/account"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#29212A] hover:bg-[#FAF8F7]"
                        >
                          <UserIcon className="w-4 h-4 text-[#71676D]" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#29212A] hover:bg-[#FAF8F7]"
                        >
                          <Package className="w-4 h-4 text-[#71676D]" />
                          <span>Order History</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setAccountDropdownOpen(false)
                            signOut()
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left border-t border-[#EAE3E5] mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs text-[#71676D]">
                          Welcome to Glowvia
                        </div>
                        <Link
                          to="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#267A50] font-medium hover:bg-[#FFF0F5]"
                        >
                          <span>Sign In</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#29212A] hover:bg-[#FAF8F7]"
                        >
                          <span>Create Account</span>
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart Bag Icon with count badge */}
            <button
              type="button"
              onClick={openCart}
              className="p-2 text-[#29212A] hover:text-[#267A50] hover:bg-[#FFF0F5] rounded-full transition-colors relative"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#267A50] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar slide-down */}
        {searchOpen && (
          <div className="py-3 border-t border-[#EAE3E5] animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cleansers, hyaluronic serum, ceramides, SPF..."
                autoFocus
                className="w-full pl-10 pr-24 py-2.5 rounded-full border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] focus:ring-1 focus:ring-[#267A50] text-sm bg-white"
              />
              <Search className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 rounded-full bg-[#267A50] text-white text-xs font-semibold hover:bg-[#185C3A] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3E5] mb-6">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#71676D] hover:text-[#29212A] rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-[#FFF0F5] text-[#267A50] font-semibold'
                        : 'text-[#29212A] hover:bg-[#FAF8F7]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#EAE3E5] space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 bg-[#FAF8F7] rounded-lg mb-2">
                    <p className="text-sm font-semibold text-[#29212A]">{user.fullName}</p>
                    <p className="text-xs text-[#71676D]">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-3 text-[#267A50] font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 text-[#29212A]"
                  >
                    <UserIcon className="w-4 h-4 text-[#71676D]" />
                    <span>My Account</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut()
                    }}
                    className="w-full flex items-center gap-2 py-2 px-3 text-red-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold rounded-full border border-[#267A50] text-[#267A50]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold rounded-full bg-[#267A50] text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

