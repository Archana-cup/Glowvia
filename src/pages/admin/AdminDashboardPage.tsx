import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, AlertTriangle, Plus } from 'lucide-react'
import { AdminNav } from '../../components/layout/AdminNav'
import { productService } from '../../services/productService'
import { orderService } from '../../services/orderService'
import { Product, Order } from '../../types'
import { formatINR, formatDate } from '../../utils/formatters'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [prodList, ordList] = await Promise.all([
          productService.getProducts(),
          orderService.getAllOrders(),
        ])
        setProducts(prodList)
        setOrders(ordList)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdminNav />
        <LoadingSpinner label="Loading administration metrics..." />
      </div>
    )
  }

  const lowStockCount = products.filter((p) => p.stockQuantity <= 5).length
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminNav />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Products count */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71676D] uppercase tracking-wider">
              Total Products
            </span>
            <p className="font-serif font-bold text-3xl text-[#29212A] mt-1">{products.length}</p>
            <Link
              to="/admin/products"
              className="text-[11px] text-[#267A50] font-semibold hover:underline mt-2 inline-block"
            >
              Manage Catalogue →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Orders count */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71676D] uppercase tracking-wider">
              Total Orders
            </span>
            <p className="font-serif font-bold text-3xl text-[#29212A] mt-1">{orders.length}</p>
            <p className="text-[11px] text-[#71676D] mt-2">
              Revenue: <strong className="text-[#267A50]">{formatINR(totalRevenue)}</strong>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Registered customers */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71676D] uppercase tracking-wider">
              Customers
            </span>
            <p className="font-serif font-bold text-3xl text-[#29212A] mt-1">
              {Math.max(1, new Set(orders.map((o) => o.customerEmail)).size + 2)}
            </p>
            <Link
              to="/admin/customers"
              className="text-[11px] text-[#267A50] font-semibold hover:underline mt-2 inline-block"
            >
              View Customers →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#267A50] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71676D] uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <p className="font-serif font-bold text-3xl text-amber-600 mt-1">{lowStockCount}</p>
            <span className="text-[11px] text-[#71676D] mt-2 inline-block">
              Threshold: ≤ 5 units
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="mb-8 p-6 rounded-3xl bg-[#FFF0F5] border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-semibold text-base text-[#29212A]">
            Product Catalogue Quick Actions
          </h3>
          <p className="text-xs text-[#71676D] mt-0.5">
            Add new formulations, replenish existing stocks, or update product descriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-full border border-[#EAE3E5] bg-white text-xs font-semibold text-[#29212A] hover:bg-[#FAF8F7] transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3E5] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE3E5]">
          <h3 className="font-serif font-semibold text-lg text-[#29212A]">
            Recent Customer Orders
          </h3>
          <Link to="/admin/orders" className="text-xs font-semibold text-[#267A50] hover:underline">
            View All Orders ({orders.length}) →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-[#71676D] text-center py-6">
            No orders placed yet. Orders created via the storefront will appear here instantly.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE3E5] text-[#71676D] uppercase font-semibold">
                  <th className="pb-3 pr-4">Order No.</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F7]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F7]">
                    <td className="py-3 pr-4 font-mono font-bold text-[#267A50]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-medium text-[#29212A]">{order.customerName}</span>
                      <span className="block text-[11px] text-[#71676D]">{order.customerEmail}</span>
                    </td>
                    <td className="py-3 pr-4 text-[#71676D]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-[#29212A]">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#267A50] font-semibold text-[11px]">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="text-[#267A50] font-semibold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
