import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { orderService } from '../../services/orderService'
import { Order } from '../../types'
import { formatINR, formatDate } from '../../utils/formatters'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { EmptyState } from '../../components/common/EmptyState'

export const OrdersPage: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      setLoading(true)
      try {
        const list = await orderService.getCustomerOrders(user.id)
        setOrders(list)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between border-b border-[#EAE3E5] pb-4">
        <div>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-xs text-[#71676D] hover:text-[#267A50] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="text-3xl font-serif font-semibold text-[#29212A]">
            Order History
          </h1>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Retrieving your orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-[#267A50]" />}
          title="No Orders Yet"
          description="Your placed orders and delivery tracking will appear here once you make a purchase."
          actionLabel="Explore Formulations"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-4 max-w-4xl">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white border border-[#EAE3E5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#267A50]">
                    {order.orderNumber}
                  </span>
                  <span className="capitalize px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0F5] text-[#267A50]">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-[#71676D]">
                  Placed on {formatDate(order.createdAt)} • {order.items.length} items
                </p>
                <p className="text-xs text-[#29212A]">
                  Recipient: {order.shippingAddress.fullName} ({order.shippingAddress.city})
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-[#FAF8F7]">
                <div className="text-right">
                  <span className="text-xs text-[#71676D] block">Total Amount</span>
                  <span className="font-serif font-bold text-base text-[#29212A]">
                    {formatINR(order.totalAmount)}
                  </span>
                </div>

                <Link
                  to={`/account/orders/${order.id}`}
                  className="px-4 py-2 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

