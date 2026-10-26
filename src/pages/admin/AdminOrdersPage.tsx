import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { AdminNav } from '../../components/layout/AdminNav'
import { orderService } from '../../services/orderService'
import { Order, OrderStatus } from '../../types'
import { formatINR, formatDate } from '../../utils/formatters'
import { useToast } from '../../contexts/ToastContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { success, error } = useToast()

  const loadOrders = async () => {
    setLoading(true)
    try {
      const list = await orderService.getAllOrders()
      setOrders(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const ok = await orderService.updateOrderStatus(orderId, newStatus)
      if (ok) {
        success(`Order status updated to "${newStatus}"`)
        loadOrders()
      } else {
        error('Failed to update order status.')
      }
    } catch {
      error('An error occurred updating the order.')
    }
  }

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminNav />

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#29212A]">
            Customer Orders Management
          </h2>
          <p className="text-xs text-[#71676D] mt-0.5">
            Update fulfillment statuses and view customer delivery instructions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#71676D]">Filter status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-[#EAE3E5] bg-white focus:outline-none focus:border-[#267A50]"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading customer orders..." />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EAE3E5] p-12 text-center text-xs text-[#71676D]">
          No orders match the selected filter.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EAE3E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F7] border-b border-[#EAE3E5] text-[#71676D] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F7]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F7]/60">
                    <td className="py-3 px-4 font-mono font-bold text-[#267A50]">
                      {order.orderNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#29212A] block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-[#71676D] block">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#71676D]">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase text-[#29212A] block">
                        {order.paymentMethod}
                      </span>
                      <span className="capitalize text-[10px] text-[#267A50]">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#29212A]">
                      {formatINR(order.totalAmount)}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="py-1 px-2.5 rounded-lg border border-[#EAE3E5] bg-white text-xs font-semibold capitalize focus:outline-none focus:border-[#267A50]"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="p-1.5 text-[#267A50] hover:text-[#185C3A] inline-flex items-center gap-1 font-semibold"
                        title="View receipt"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
