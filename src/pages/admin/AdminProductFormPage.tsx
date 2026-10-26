import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { AdminNav } from '../../components/layout/AdminNav'
import { productService } from '../../services/productService'
import { ProductCategory } from '../../types'
import { SAMPLE_CATEGORIES } from '../../data/categories'
import { useToast } from '../../contexts/ToastContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('Glowvia Botanics')
  const [category, setCategory] = useState<ProductCategory>('face-wash')
  const [price, setPrice] = useState<number>(799)
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(999)
  const [stockQuantity, setStockQuantity] = useState<number>(30)
  const [size, setSize] = useState('50 ml')
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
  )
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [directions, setDirections] = useState('')

  useEffect(() => {
    async function loadProduct() {
      if (!id) return
      setLoading(true)
      try {
        const p = await productService.getProductById(id)
        if (p) {
          setName(p.name)
          setBrand(p.brand)
          setCategory(p.category)
          setPrice(p.price)
          setCompareAtPrice(p.compareAtPrice)
          setStockQuantity(p.stockQuantity)
          setSize(p.size || '')
          setImageUrl(p.imageUrl)
          setShortDescription(p.shortDescription || '')
          setDescription(p.description)
          setIngredients(p.ingredients || '')
          setDirections(p.directions || '')
        }
      } finally {
        setLoading(false)
      }
    }

    if (isEditing) {
      loadProduct()
    }
  }, [id, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      error('Product title is required')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: brand.trim(),
        category,
        categoryLabel: category.replace('-', ' '),
        description: description.trim() || 'A nourishing and restorative skincare formula.',
        shortDescription: shortDescription.trim(),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        imageUrl: imageUrl.trim(),
        size: size.trim(),
        ingredients: ingredients.trim(),
        directions: directions.trim(),
        stockQuantity: Number(stockQuantity),
        isActive: true,
      }

      if (isEditing && id) {
        await productService.updateProduct(id, payload)
        success('Product updated successfully!')
      } else {
        await productService.createProduct(payload)
        success('New product created and added to inventory!')
      }

      navigate('/admin/products')
    } catch {
      error('Failed to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdminNav />
        <LoadingSpinner label="Loading formulation details..." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminNav />

      <div className="mb-6">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-[#71676D] hover:text-[#267A50]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h2 className="text-2xl font-serif font-semibold text-[#29212A] mt-2">
          {isEditing ? 'Edit Formulation' : 'Add New Formulation'}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-8 shadow-xs space-y-6 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ceramide Radiance Cream"
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] bg-white capitalize"
            >
              {SAMPLE_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Price (INR ₹) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Compare at Price / MRP (INR ₹)
            </label>
            <input
              type="number"
              min={0}
              value={compareAtPrice || ''}
              onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Leave empty if not on discount"
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Volume / Size
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. 50 ml or 100 g"
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Product Image URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Short Summary Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One-line tagline or brief overview"
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Ingredients
            </label>
            <textarea
              rows={2}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Aqua, Glycerin, Ceramide NP..."
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#29212A] mb-1.5">
              Directions for Use
            </label>
            <textarea
              rows={2}
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
              placeholder="How customer should apply this product..."
              className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE3E5]">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-full border border-[#EAE3E5] font-semibold text-[#71676D] hover:bg-[#FAF8F7]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
