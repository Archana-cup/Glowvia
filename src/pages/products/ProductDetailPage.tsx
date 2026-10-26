import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'
import { Product } from '../../types'
import { productService } from '../../services/productService'
import { PriceDisplay } from '../../components/common/PriceDisplay'
import { RatingDisplay } from '../../components/common/RatingDisplay'
import { QuantitySelector } from '../../components/common/QuantitySelector'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ProductCard } from '../../components/products/ProductCard'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'howToUse' | 'shipping'>('details')
  const [loading, setLoading] = useState<boolean>(true)

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      try {
        const prod = await productService.getProductById(id)
        if (prod) {
          setProduct(prod)
          setSelectedImage(prod.imageUrl)
          setQuantity(1)

          // Load related products
          const related = await productService.getProducts({
            category: prod.category,
          })
          setRelatedProducts(related.filter((p) => p.id !== prod.id).slice(0, 4))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return <LoadingSpinner label="Loading formulation details..." className="min-h-[60vh]" />
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#29212A] mb-4">
          Product Not Found
        </h2>
        <p className="text-sm text-[#71676D] mb-6">
          This product may have been archived or is temporarily unavailable.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#267A50] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Explore All Products
        </Link>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stockQuantity <= 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5

  const allImages = product.galleryImages?.length
    ? [product.imageUrl, ...product.galleryImages.filter((img) => img !== product.imageUrl)]
    : [product.imageUrl]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-[#71676D]">
        <Link to="/" className="hover:text-[#267A50] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-[#267A50] transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/categories/${product.category}`} className="hover:text-[#267A50] transition-colors capitalize">
          {product.categoryLabel || product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#29212A] font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#EAE3E5] shadow-sm relative">
            <ImageWithFallback
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-white text-[#29212A] text-xs font-semibold uppercase tracking-wider">
                  Temporarily Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-[#267A50] ring-2 ring-[#267A50]/20'
                      : 'border-[#EAE3E5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing & Cart Action */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#71676D] mb-1">
              <span className="uppercase tracking-widest font-semibold text-[#267A50]">
                {product.brand}
              </span>
              {product.size && (
                <span className="bg-[#FFF0F5] px-2.5 py-0.5 rounded-full text-[#267A50] font-medium">
                  {product.size}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-[#29212A] leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="mt-3">
              <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE3E5]">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            <p className="text-[11px] text-[#71676D] mt-1.5">
              Inclusive of all taxes. Free shipping on orders over ₹799.
            </p>
          </div>

          {/* Short description */}
          <p className="text-sm text-[#71676D] leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Stock Availability Indicator */}
          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Out of Stock — Join waitlist below
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                Low Stock: Only {product.stockQuantity} remaining
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#267A50] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#267A50]"></span>
                In Stock & Ready for Despatch
              </span>
            )}
          </div>

          {/* Action Row: Quantity + Add To Cart + Wishlist */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {!isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                maxStock={product.stockQuantity}
                onChange={setQuantity}
                size="md"
              />
            )}

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => addToCart(product, quantity)}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#267A50] hover:bg-[#185C3A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-full border transition-colors ${
                inWishlist
                  ? 'bg-[#FFF0F5] border-[#C2185B] text-[#C2185B]'
                  : 'bg-white border-[#EAE3E5] text-[#71676D] hover:text-[#C2185B]'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#C2185B]' : ''}`} />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#EAE3E5] text-center text-[11px] text-[#71676D]">
            <div className="p-3 rounded-xl bg-white border border-[#EAE3E5] flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#267A50]" />
              <span>Fast 2-4 Day Delivery</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#EAE3E5] flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#267A50]" />
              <span>100% Authentic Formula</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#EAE3E5] flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#267A50]" />
              <span>Easy 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section (Description, Ingredients, Directions, Shipping) */}
      <div className="mt-16 pt-12 border-t border-[#EAE3E5]">
        <div className="flex border-b border-[#EAE3E5] gap-4 sm:gap-8 overflow-x-auto text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#267A50] text-[#267A50] font-semibold'
                : 'border-transparent text-[#71676D] hover:text-[#29212A]'
            }`}
          >
            Product Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'border-[#267A50] text-[#267A50] font-semibold'
                : 'border-transparent text-[#71676D] hover:text-[#29212A]'
            }`}
          >
            Key Ingredients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('howToUse')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'howToUse'
                ? 'border-[#267A50] text-[#267A50] font-semibold'
                : 'border-transparent text-[#71676D] hover:text-[#29212A]'
            }`}
          >
            How to Use
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-[#267A50] text-[#267A50] font-semibold'
                : 'border-transparent text-[#71676D] hover:text-[#29212A]'
            }`}
          >
            Shipping & Delivery
          </button>
        </div>

        <div className="py-8 max-w-3xl text-sm text-[#71676D] leading-relaxed">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              {product.skinType && (
                <div className="pt-2">
                  <h4 className="font-semibold text-xs text-[#29212A] uppercase tracking-wider mb-2">
                    Suitable For:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.skinType.map((type, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white border border-[#EAE3E5] text-xs text-[#29212A]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-[#29212A] uppercase tracking-wider">
                Full Formulation Transparency:
              </h4>
              <p className="font-mono text-xs bg-white p-4 rounded-xl border border-[#EAE3E5] leading-relaxed">
                {product.ingredients || 'Aqua, Glycerin, Botanical Extracts, Panthenol, Tocopherol.'}
              </p>
              <p className="text-xs text-[#71676D]">
                Free from parabens, synthetic dyes, harsh sulfates, and drying alcohols.
              </p>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-[#29212A] uppercase tracking-wider">
                Application Ritual:
              </h4>
              <p className="bg-white p-4 rounded-xl border border-[#EAE3E5]">
                {product.directions ||
                  'Dispense an appropriate amount onto clean skin. Smooth in upward motions until absorbed.'}
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-[#29212A] uppercase tracking-wider">
                Delivery Timelines:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Orders over ₹799 receive complimentary standard shipping nationwide.</li>
                <li>Metro cities: Delivered in 2-3 business days.</li>
                <li>Rest of India: Delivered in 3-5 business days.</li>
                <li>Carefully packaged in recyclable, FSC-certified eco-cartons.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#EAE3E5]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif font-semibold text-2xl text-[#29212A]">
              Complete Your Ritual
            </h3>
            <Link
              to={`/categories/${product.category}`}
              className="text-xs font-semibold text-[#267A50] hover:underline"
            >
              View More in Category →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
