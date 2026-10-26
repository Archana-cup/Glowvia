import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Package, MapPin, Heart, ChevronRight, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { orderService } from '../../services/orderService'
import { Order } from '../../types'
import { formatINR, formatDate } from '../../utils/formatters'

export const AccountOverviewPage: React.FC = () => {
  const { user, signOut } = useAuth()
  const { wishlistCount } = useWishlist()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      if (user) {
        const list = await orderService.getCustomerOrders(user.id)
        setRecentOrders(list.slice(0, 3))
      }
    }
    load()
  }, [user])

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Welcome Banner */}
      <div className="bg-[#FFF0F5] border border-pink-100 rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#267A50]">
            Member Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A] mt-1">
            Hello, {user.fullName}
          </h1>
          <p className="text-xs text-[#71676D] mt-1">
            Signed in as {user.email} • {user.role === 'admin' ? 'Store Administrator' : 'Glowvia Customer'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full bg-[#267A50] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="px-4 py-2 rounded-full border border-[#EAE3E5] bg-white text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Cards */}
        <div className="space-y-3">
          <Link
            to="/account/orders"
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EAE3E5] hover:border-[#267A50] hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#29212A]">Order History</h3>
                <p className="text-xs text-[#71676D]">View receipts and delivery statuses</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#71676D]" />
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EAE3E5] hover:border-[#267A50] hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#C2185B] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#29212A]">Saved Wishlist</h3>
                <p className="text-xs text-[#71676D]">{wishlistCount} items saved</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#71676D]" />
          </Link>

          <Link
            to="/account/profile"
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EAE3E5] hover:border-[#267A50] hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#29212A]">Profile Settings</h3>
                <p className="text-xs text-[#71676D]">Edit name, phone & password</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#71676D]" />
          </Link>

          <Link
            to="/account/addresses"
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EAE3E5] hover:border-[#267A50] hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#29212A]">Delivery Addresses</h3>
                <p className="text-xs text-[#71676D]">Manage shipping destinations</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#71676D]" />
          </Link>
        </div>

        {/* Recent Orders Overview (2 cols) */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE3E5]">
            <h2 className="font-serif font-semibold text-lg text-[#29212A]">
              Recent Orders
            </h2>
            <Link to="/account/orders" className="text-xs font-semibold text-[#267A50] hover:underline">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#71676D]">
              <Package className="w-8 h-8 mx-auto text-[#71676D]/40 mb-2" />
              <p>You haven't placed any orders yet.</p>
              <Link
                to="/products"
                className="mt-3 inline-block px-4 py-2 rounded-full bg-[#267A50] text-white text-xs font-semibold"
              >
                Start Your First Ritual
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-[#EAE3E5] bg-[#FAF8F7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#29212A]">
                        {order.orderNumber}
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-white border border-[#EAE3E5] font-semibold text-[#267A50]">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[#71676D] mt-1">
                      {formatDate(order.createdAt)} • {order.items.length} items
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#29212A]">
                      {formatINR(order.totalAmount)}
                    </span>
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#EAE3E5] text-[#267A50] font-semibold hover:border-[#267A50]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

