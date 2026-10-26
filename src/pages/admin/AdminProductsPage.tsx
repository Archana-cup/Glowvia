import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, AlertTriangle, Check, Eye } from 'lucide-react'
import { AdminNav } from '../../components/layout/AdminNav'
import { productService } from '../../services/productService'
import { Product } from '../../types'
import { formatINR } from '../../utils/formatters'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { useToast } from '../../contexts/ToastContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<Product | null>(null)

  const { success, error } = useToast()

  const loadProducts = async () => {
    setLoading(true)
    try {
      const list = await productService.getProducts()
      setProducts(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!selectedProductToDelete) return
    try {
      await productService.deleteProduct(selectedProductToDelete.id)
      success(`Product "${selectedProductToDelete.name}" deleted successfully.`)
      setSelectedProductToDelete(null)
      loadProducts()
    } catch {
      error('Failed to delete product.')
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminNav />

      {/* Header & Controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, brand, category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] bg-white"
          />
          <Search className="w-4 h-4 text-[#71676D] absolute left-3 top-2.5" />
        </div>

        <Link
          to="/admin/products/new"
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading catalogue inventory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-[#EAE3E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F7] border-b border-[#EAE3E5] text-[#71676D] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F7]">
                {filteredProducts.map((p) => {
                  const isLow = p.stockQuantity > 0 && p.stockQuantity <= 5
                  const isOut = p.stockQuantity <= 0

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F7]/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#FAF8F7] overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-[#29212A] block">{p.name}</span>
                            <span className="text-[11px] text-[#71676D]">{p.brand} {p.size && `• ${p.size}`}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 capitalize text-[#71676D]">
                        {p.category.replace('-', ' ')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#29212A]">{formatINR(p.price)}</span>
                        {p.compareAtPrice && (
                          <span className="block text-[10px] text-[#71676D] line-through">
                            {formatINR(p.compareAtPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-[10px]">
                            Out of Stock (0)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            Low ({p.stockQuantity})
                          </span>
                        ) : (
                          <span className="font-medium text-[#267A50]">
                            {p.stockQuantity} units
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#267A50] font-semibold text-[10px]">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${p.id}`}
                            target="_blank"
                            className="p-1.5 text-[#71676D] hover:text-[#267A50] rounded-md transition-colors"
                            title="View on store"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-[#71676D] hover:text-[#267A50] rounded-md transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSelectedProductToDelete(p)}
                            className="p-1.5 text-[#71676D] hover:text-red-600 rounded-md transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(selectedProductToDelete)}
        title="Delete Formulation?"
        message={`Are you sure you want to delete "${selectedProductToDelete?.name}"? This action cannot be reversed.`}
        confirmLabel="Yes, Delete"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedProductToDelete(null)}
      />
    </div>
  )
}

