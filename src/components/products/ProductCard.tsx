import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { Product } from '../../types'
import { PriceDisplay } from '../common/PriceDisplay'
import { RatingDisplay } from '../common/RatingDisplay'
import { ImageWithFallback } from '../common/ImageWithFallback'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stockQuantity <= 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#EAE3E5] overflow-hidden hover:shadow-lg hover:border-[#267A50]/30 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F7]">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
            inWishlist
              ? 'bg-[#FFF0F5] text-[#C2185B]'
              : 'bg-white/80 text-[#71676D] hover:text-[#C2185B] hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C2185B]' : ''}`} />
        </button>

        {/* Stock / Tags Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full bg-[#29212A]/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
              Only {product.stockQuantity} Left
            </span>
          ) : product.tags?.[0] ? (
            <span className="px-2.5 py-1 rounded-full bg-[#267A50]/90 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
              {product.tags[0]}
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-[#71676D] mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px] truncate">{product.brand}</span>
            {product.size && <span>{product.size}</span>}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.id}`}
            className="block text-sm sm:text-base font-serif font-semibold text-[#29212A] hover:text-[#267A50] line-clamp-1 transition-colors mb-2"
          >
            {product.name}
          </Link>

          {/* Rating (only when exists) */}
          <div className="mb-3">
            <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-[#FAF8F7] flex items-center justify-between gap-2">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-2xs shrink-0"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}

