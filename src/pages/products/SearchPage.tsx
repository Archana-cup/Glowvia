import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { Product } from '../../types'
import { productService } from '../../services/productService'
import { ProductGrid } from '../../components/products/ProductGrid'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSearchTerm(query)
    async function executeSearch() {
      if (!query.trim()) {
        setProducts([])
        return
      }
      setLoading(true)
      try {
        const results = await productService.getProducts({
          searchQuery: query.trim(),
        })
        setProducts(results)
      } finally {
        setLoading(false)
      }
    }
    executeSearch()
  }, [query])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-serif font-semibold text-[#29212A] mb-4">
          Search Glowvia
        </h1>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ingredient, product name, or category..."
            className="w-full pl-12 pr-28 py-3.5 rounded-full border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] bg-white text-sm shadow-sm"
          />
          <SearchIcon className="w-5 h-5 text-[#71676D] absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-xs text-[#71676D] mt-3">
            Showing results for "<strong className="text-[#29212A]">{query}</strong>" (
            {products.length} found)
          </p>
        )}
      </div>

      {loading ? (
        <LoadingSpinner label="Searching products..." />
      ) : (
        <ProductGrid
          products={products}
          emptyTitle="No results found"
          emptyDescription={`We couldn't find any products matching "${query}". Try searching for keywords like "serum", "ceramide", "cleanser", or "SPF".`}
        />
      )}
    </div>
  )
}
