import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Product, ProductCategory } from '../../types'
import { productService } from '../../services/productService'
import { SAMPLE_CATEGORIES } from '../../data/categories'
import { ProductGrid } from '../../components/products/ProductGrid'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ChevronRight } from 'lucide-react'

export const CategoryProductsPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categoryInfo = SAMPLE_CATEGORIES.find((c) => c.slug === categorySlug)

  useEffect(() => {
    async function load() {
      if (!categorySlug) return
      setLoading(true)
      try {
        const list = await productService.getProducts({
          category: categorySlug as ProductCategory,
        })
        setProducts(list)
      } finally {
        setLoading(false)
      }
    }
    load()
    window.scrollTo(0, 0)
  }, [categorySlug])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#71676D]">
        <Link to="/" className="hover:text-[#267A50]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-[#267A50]">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#29212A] font-medium capitalize">
          {categoryInfo ? categoryInfo.name : categorySlug}
        </span>
      </nav>

      {/* Category Header Banner */}
      <div className="rounded-3xl bg-[#FFF0F5] border border-pink-100 p-8 sm:p-12 mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#267A50]">
          Curated Category
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#29212A] mt-2 mb-3">
          {categoryInfo ? categoryInfo.name : categorySlug}
        </h1>
        <p className="text-xs sm:text-sm text-[#71676D] max-w-2xl leading-relaxed">
          {categoryInfo?.description ||
            'Explore gentle, targeted botanical formulations designed for your everyday skincare ritual.'}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading category formulations..." />
      ) : (
        <ProductGrid
          products={products}
          emptyTitle={`No products currently in ${categoryInfo?.name || categorySlug}`}
          emptyDescription="We are constantly formulating new rituals. Check back soon or explore our other collections."
        />
      )}
    </div>
  )
}

