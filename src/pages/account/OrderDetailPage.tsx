import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Package, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { orderService } from '../../services/orderService'
import { Order } from '../../types'
import { formatINR, formatDateTime } from '../../utils/formatters'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!id || !user) return
      setLoading(true)
      try {
        const ord = await orderService.getOrderById(id, user.id, user.role === 'admin')
        setOrder(ord)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user])

  if (loading) {
    return <LoadingSpinner label="Loading order receipt..." className="min-h-[50vh]" />
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#29212A] mb-2">Order Not Found</h2>
        <p className="text-xs text-[#71676D] mb-6">
          This order does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/account/orders"
          className="px-6 py-2.5 rounded-full bg-[#267A50] text-white text-xs font-semibold uppercase"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const timelineSteps = [
    { key: 'pending', label: 'Order Confirmed', completed: true },
    {
      key: 'processing',
      label: 'Formulation Prepared',
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
    },
    {
      key: 'shipped',
      label: 'Dispatched with Courier',
      completed: ['shipped', 'delivered'].includes(order.status),
    },
    {
      key: 'delivered',
      label: 'Delivered',
      completed: order.status === 'delivered',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#71676D] hover:text-[#267A50]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3E5]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#267A50]">
              Order Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A] mt-1">
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-[#71676D] mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="capitalize px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0F5] text-[#267A50] border border-pink-100">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div>
          <h3 className="font-serif font-semibold text-base text-[#29212A] mb-4">
            Fulfillment Progress
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timelineSteps.map((step, idx) => (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  step.completed
                    ? 'border-[#267A50] bg-[#FFF0F5] text-[#267A50]'
                    : 'border-[#EAE3E5] bg-[#FAF8F7] text-[#71676D]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold mb-1">
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-[#267A50]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#71676D]" />
                  )}
                  <span>Step {idx + 1}</span>
                </div>
                <p className="font-medium text-[11px] leading-tight text-[#29212A]">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="font-serif font-semibold text-base text-[#29212A] mb-4">
            Purchased Products
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#EAE3E5] bg-[#FAF8F7] text-xs gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-white overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-sm text-[#29212A] truncate">
                      {item.productName}
                    </p>
                    <p className="text-[#71676D]">
                      {item.brand} • Quantity: {item.quantity} {item.size && `• Size: ${item.size}`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-semibold text-sm text-[#29212A]">
                    {formatINR(item.lineTotal)}
                  </span>
                  <span className="block text-[10px] text-[#71676D]">
                    ({formatINR(item.unitPrice)} each)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#EAE3E5] text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EAE3E5] space-y-2">
            <h4 className="font-semibold text-sm text-[#29212A] flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-[#267A50]" />
              <span>Shipping Address</span>
            </h4>
            <p className="font-semibold text-[#29212A]">{order.shippingAddress.fullName}</p>
            <p className="text-[#71676D]">{order.shippingAddress.addressLine}</p>
            <p className="text-[#71676D]">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.pinCode}
            </p>
            <p className="text-[#71676D]">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EAE3E5] space-y-2">
            <h4 className="font-semibold text-sm text-[#29212A] flex items-center gap-1.5 mb-2">
              <Package className="w-4 h-4 text-[#267A50]" />
              <span>Payment & Receipt</span>
            </h4>
            <div className="flex justify-between">
              <span className="text-[#71676D]">Payment Method:</span>
              <span className="uppercase font-semibold">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71676D]">Payment Status:</span>
              <span className="capitalize font-semibold text-[#267A50]">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71676D]">Subtotal:</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#C2185B]">
                <span>Discount:</span>
                <span>-{formatINR(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#EAE3E5] font-bold text-sm text-[#29212A]">
              <span>Order Total:</span>
              <span className="text-[#267A50] font-serif text-base">
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
