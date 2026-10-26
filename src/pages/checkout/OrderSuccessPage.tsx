import React from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { CheckCircle2, Package, MapPin } from 'lucide-react'
import { Order } from '../../types'
import { formatINR, formatDate } from '../../utils/formatters'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation()
  const order = (location.state as any)?.order as Order | undefined

  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-[#EAE3E5] shadow-lg p-6 sm:p-10 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#267A50]">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#29212A] mt-2 mb-3">
          Thank you for choosing Glowvia.
        </h1>
        <p className="text-sm text-[#71676D] max-w-md mx-auto leading-relaxed">
          Your skincare ritual has been registered. A confirmation message has been dispatched to{' '}
          <strong className="text-[#29212A]">{order.customerEmail}</strong>.
        </p>

        {/* Order Meta Pill */}
        <div className="mt-8 p-4 rounded-2xl bg-[#FAF8F7] border border-[#EAE3E5] max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[#71676D]">Order Reference:</span>
            <span className="ml-1.5 font-mono font-bold text-sm text-[#267A50]">
              {order.orderNumber}
            </span>
          </div>
          <div>
            <span className="text-[#71676D]">Order Date:</span>
            <span className="ml-1.5 font-medium text-[#29212A]">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Purchased Products Snapshot */}
        <div className="mt-10 text-left border-t border-[#EAE3E5] pt-8">
          <h3 className="font-serif font-semibold text-lg text-[#29212A] mb-4">
            Items in This Order
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#EAE3E5] bg-[#FAF8F7] text-xs gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-[#29212A] truncate">{item.productName}</p>
                    <p className="text-[#71676D]">
                      {item.brand} • Qty: {item.quantity} {item.size && `(${item.size})`}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#29212A] shrink-0">
                  {formatINR(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Breakdown & Delivery Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-xs border-t border-[#EAE3E5] pt-8">
          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EAE3E5] space-y-2">
            <h4 className="font-semibold text-sm text-[#29212A] flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-[#267A50]" />
              <span>Delivery Destination</span>
            </h4>
            <p className="font-medium text-[#29212A]">{order.shippingAddress.fullName}</p>
            <p className="text-[#71676D]">
              {order.shippingAddress.addressLine}
              {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
            </p>
            <p className="text-[#71676D]">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
            </p>
            <p className="text-[#71676D]">Contact: {order.shippingAddress.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F7] border border-[#EAE3E5] space-y-2">
            <h4 className="font-semibold text-sm text-[#29212A] flex items-center gap-1.5 mb-2">
              <Package className="w-4 h-4 text-[#267A50]" />
              <span>Payment & Summary</span>
            </h4>
            <div className="flex justify-between">
              <span className="text-[#71676D]">Payment Method:</span>
              <span className="font-semibold uppercase text-[#29212A]">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / Card'}
              </span>
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
            <div className="flex justify-between font-bold text-sm text-[#29212A] pt-2 border-t border-[#EAE3E5]">
              <span>Final Total:</span>
              <span className="text-[#267A50] font-serif text-base">
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/account/orders"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            View Order In History
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#EAE3E5] bg-white hover:bg-[#FAF8F7] text-[#29212A] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
