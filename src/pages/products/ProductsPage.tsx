import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, X } from 'lucide-react'
import { Product, ProductCategory, SkinConcern } from '../../types'
import { productService } from '../../services/productService'
import { SAMPLE_CATEGORIES } from '../../data/categories'
import { ProductGrid } from '../../components/products/ProductGrid'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filters from query params
  const currentCategory = (searchParams.get('category') as ProductCategory) || ''
  const currentConcern = (searchParams.get('concern') as SkinConcern) || ''
  const currentSort = searchParams.get('sort') || 'featured'
  const inStockOnly = searchParams.get('inStock') === 'true'

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const list = await productService.getProducts({
          category: currentCategory || undefined,
          concern: currentConcern || undefined,
          inStockOnly: inStockOnly || undefined,
          sortBy: currentSort as any,
        })
        setProducts(list)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentCategory, currentConcern, currentSort, inStockOnly])

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams)
    if (cat) next.set('category', cat)
    else next.delete('category')
    setSearchParams(next)
  }

  const setConcern = (concern: string) => {
    const next = new URLSearchParams(searchParams)
    if (concern) next.set('concern', concern)
    else next.delete('concern')
    setSearchParams(next)
  }

  const setSort = (sort: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', sort)
    setSearchParams(next)
  }

  const toggleInStock = () => {
    const next = new URLSearchParams(searchParams)
    if (inStockOnly) next.delete('inStock')
    else next.set('inStock', 'true')
    setSearchParams(next)
  }

  const clearAllFilters = () => {
    setSearchParams({})
  }

  const hasActiveFilters = Boolean(currentCategory || currentConcern || inStockOnly)

  const skinConcerns = [
    { slug: 'dry-skin', label: 'Dry Skin' },
    { slug: 'oily-skin', label: 'Oily Skin' },
    { slug: 'combination-skin', label: 'Combination' },
    { slug: 'sensitive-skin', label: 'Sensitive' },
    { slug: 'dull-skin', label: 'Dull-Looking' },
    { slug: 'hair-care', label: 'Hair Care' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 border-b border-[#EAE3E5] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#267A50]">
            The Complete Collection
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[#29212A] mt-1">
            Skincare & Beauty Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-[#71676D] mt-1">
            Showing {products.length} dermatologist-inspired formulations.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-[#EAE3E5] bg-white text-xs font-semibold text-[#29212A]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#267A50]" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71676D] hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#EAE3E5] bg-white text-xs font-medium text-[#29212A] focus:outline-none focus:border-[#267A50]"
            >
              <option value="featured">Featured Rituals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Formulations</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3E5]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#267A50]" />
              <h3 className="font-serif font-semibold text-base text-[#29212A]">Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-[#C2185B] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category filter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#29212A] mb-3">
              Categories
            </h4>
            <div className="space-y-1 text-sm">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                  !currentCategory
                    ? 'bg-[#FFF0F5] text-[#267A50] font-semibold'
                    : 'text-[#71676D] hover:text-[#29212A] hover:bg-white'
                }`}
              >
                All Categories
              </button>
              {SAMPLE_CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                    currentCategory === c.slug
                      ? 'bg-[#FFF0F5] text-[#267A50] font-semibold'
                      : 'text-[#71676D] hover:text-[#29212A] hover:bg-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skin concern filter */}
          <div className="pt-4 border-t border-[#EAE3E5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#29212A] mb-3">
              Skin Concern
            </h4>
            <div className="space-y-1 text-sm">
              <button
                type="button"
                onClick={() => setConcern('')}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                  !currentConcern
                    ? 'bg-[#FFF0F5] text-[#267A50] font-semibold'
                    : 'text-[#71676D] hover:text-[#29212A] hover:bg-white'
                }`}
              >
                All Concerns
              </button>
              {skinConcerns.map((sc) => (
                <button
                  key={sc.slug}
                  type="button"
                  onClick={() => setConcern(sc.slug)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                    currentConcern === sc.slug
                      ? 'bg-[#FFF0F5] text-[#267A50] font-semibold'
                      : 'text-[#71676D] hover:text-[#29212A] hover:bg-white'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* In stock toggle */}
          <div className="pt-4 border-t border-[#EAE3E5]">
            <label className="flex items-center text-xs text-[#29212A] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={toggleInStock}
                className="w-4 h-4 rounded border-[#EAE3E5] text-[#267A50] focus:ring-[#267A50]"
              />
              <span className="ml-2 font-medium">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product listing grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner label="Curating products..." />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>

      {/* Mobile filter slide drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3E5]">
                <h3 className="font-serif font-semibold text-lg text-[#29212A]">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#71676D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-[#29212A] mb-2">Categories</h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('')
                      setMobileFilterOpen(false)
                    }}
                    className="w-full text-left py-1 text-xs text-[#71676D]"
                  >
                    All Categories
                  </button>
                  {SAMPLE_CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => {
                        setCategory(c.slug)
                        setMobileFilterOpen(false)
                      }}
                      className="w-full text-left py-1 text-xs text-[#71676D]"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3E5]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-full bg-[#267A50] text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
