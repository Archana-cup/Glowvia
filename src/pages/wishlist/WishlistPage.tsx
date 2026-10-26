import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../../contexts/WishlistContext'
import { formatINR } from '../../utils/formatters'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { EmptyState } from '../../components/common/EmptyState'

export const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist, moveToCart } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={<Heart className="w-8 h-8 text-[#C2185B]" />}
          title="Your Wishlist is Empty"
          description="Save the formulas and rituals you adore to keep track of them for later."
          actionLabel="Discover Formulations"
          actionLink="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 border-b border-[#EAE3E5] pb-4">
        <h1 className="text-3xl font-serif font-semibold text-[#29212A]">
          Saved Rituals ({items.length})
        </h1>
        <p className="text-xs text-[#71676D] mt-1">
          Your saved skincare and beauty favorites ready to add to bag anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const isOutOfStock = item.product.stockQuantity <= 0

          return (
            <div
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl border border-[#EAE3E5] overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              <div className="relative aspect-square w-full bg-[#FAF8F7]">
                <Link to={`/products/${item.product.id}`}>
                  <ImageWithFallback
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#71676D] hover:text-red-600 transition-colors shadow-2xs"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#267A50] tracking-wider">
                    {item.product.brand}
                  </span>
                  <Link
                    to={`/products/${item.product.id}`}
                    className="block font-serif font-semibold text-sm text-[#29212A] hover:text-[#267A50] truncate mt-0.5"
                  >
                    {item.product.name}
                  </Link>
                  <span className="text-sm font-semibold text-[#29212A] mt-2 block">
                    {formatINR(item.product.price)}
                  </span>
                </div>

                <div className="pt-4 mt-3 border-t border-[#FAF8F7]">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => moveToCart(item.product)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#267A50] hover:bg-[#185C3A] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
