import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { Check, Mail, ShieldCheck, Truck, RefreshCw } from 'lucide-react'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-white border-t border-[#EAE3E5] text-[#29212A] pt-16 pb-8">
      {/* Brand value pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#EAE3E5]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-base text-[#29212A]">Complimentary Shipping</h4>
              <p className="text-xs text-[#71676D] mt-0.5">Free standard shipping on all orders over ₹799.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-base text-[#29212A]">Formulated With Care</h4>
              <p className="text-xs text-[#71676D] mt-0.5">Transparent ingredient lists with zero hidden fillers.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-base text-[#29212A]">30-Day Happiness Guarantee</h4>
              <p className="text-xs text-[#71676D] mt-0.5">Effortless customer support and hassle-free returns.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-[#71676D] leading-relaxed max-w-sm mt-3">
              Glowvia was founded on a simple philosophy: beauty is personal, gentle, and transformative.
              We craft skincare formulations that support your barrier and enhance your authentic glow.
            </p>
            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#29212A] mb-2">
                Join The Glow Ritual
              </h5>
              <p className="text-xs text-[#71676D] mb-3">
                Receive secret previews, beauty rituals, and 10% off your next order.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF0F5] text-[#267A50] text-xs font-medium">
                  <Check className="w-4 h-4" />
                  <span>Thank you! You are subscribed to Glowvia Rituals.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#71676D] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-full border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="font-serif font-semibold text-sm text-[#29212A] tracking-wider mb-4 uppercase">
              Shop Essentials
            </h5>
            <ul className="space-y-2 text-xs text-[#71676D]">
              <li>
                <Link to="/products" className="hover:text-[#267A50] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories/face-wash" className="hover:text-[#267A50] transition-colors">
                  Face Wash & Cleansers
                </Link>
              </li>
              <li>
                <Link to="/categories/serums" className="hover:text-[#267A50] transition-colors">
                  Targeted Serums
                </Link>
              </li>
              <li>
                <Link to="/categories/moisturizers" className="hover:text-[#267A50] transition-colors">
                  Daily Moisturizers
                </Link>
              </li>
              <li>
                <Link to="/categories/sunscreen" className="hover:text-[#267A50] transition-colors">
                  Sunscreen & SPF
                </Link>
              </li>
              <li>
                <Link to="/categories/haircare" className="hover:text-[#267A50] transition-colors">
                  Haircare Rituals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h5 className="font-serif font-semibold text-sm text-[#29212A] tracking-wider mb-4 uppercase">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs text-[#71676D]">
              <li>
                <Link to="/faq" className="hover:text-[#267A50] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#267A50] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-[#267A50] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#267A50] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#267A50] transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h5 className="font-serif font-semibold text-sm text-[#29212A] tracking-wider mb-4 uppercase">
              About & Legal
            </h5>
            <ul className="space-y-2 text-xs text-[#71676D]">
              <li>
                <Link to="/about" className="hover:text-[#267A50] transition-colors">
                  About Glowvia
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#267A50] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#267A50] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-[#71676D]">support@glowvia.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#EAE3E5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71676D] gap-4">
        <p>© 2026 Glowvia Skincare. All rights reserved. Beauty Begins With You.</p>
        <p className="text-[11px]">
          Prices listed in Indian National Rupees (₹). Crafted for gentle daily rituals.
        </p>
      </div>
    </footer>
  )
}

