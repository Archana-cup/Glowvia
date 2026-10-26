import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatINR } from '../../utils/formatters'
import { QuantitySelector } from '../common/QuantitySelector'
import { ImageWithFallback } from '../common/ImageWithFallback'

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalItemsCount,
    subtotal,
    amountUntilFreeShipping,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart()

  const navigate = useNavigate()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Shopping bag drawer"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#EAE3E5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#267A50]" />
              <h2 className="text-lg font-serif font-semibold text-[#29212A]">
                Your Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-[#71676D] hover:text-[#29212A] hover:bg-[#FAF8F7] rounded-full transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="bg-[#FFF0F5] px-6 py-2.5 border-b border-pink-100/60 text-xs text-[#29212A]">
            {amountUntilFreeShipping > 0 ? (
              <p className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#267A50] shrink-0" />
                <span>
                  Add <strong className="text-[#267A50]">{formatINR(amountUntilFreeShipping)}</strong> more to unlock <strong>Free Shipping</strong>!
                </span>
              </p>
            ) : (
              <p className="flex items-center gap-1.5 font-semibold text-[#267A50]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Congratulations! You qualify for Free Delivery.</span>
              </p>
            )}
          </div>

          {/* Items list or empty state */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#29212A] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#71676D] max-w-xs mb-6">
                  Explore our pure botanicals and dermatologically designed formulas.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart()
                    navigate('/products')
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Discover Essentials
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-[#EAE3E5] bg-white hover:border-[#267A50]/40 transition-colors"
                >
                  <Link
                    to={`/products/${item.product.id}`}
                    onClick={closeCart}
                    className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#FAF8F7]"
                  >
                    <ImageWithFallback
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.product.id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-[#29212A] hover:text-[#267A50] truncate transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#71676D] hover:text-red-600 transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#71676D]">{item.selectedSize || item.product.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <QuantitySelector
                        size="sm"
                        quantity={item.quantity}
                        maxStock={item.product.stockQuantity}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                      />
                      <span className="text-sm font-semibold text-[#29212A]">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#EAE3E5] bg-[#FAF8F7]">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-[#71676D]">Subtotal</span>
                <span className="font-serif font-bold text-lg text-[#29212A]">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#71676D] mb-4 text-center">
                Taxes and coupon codes calculated at checkout.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    closeCart()
                    navigate('/checkout')
                  }}
                  className="w-full py-3 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCart()
                    navigate('/cart')
                  }}
                  className="w-full py-2.5 rounded-full border border-[#EAE3E5] bg-white hover:bg-[#FAF8F7] text-[#29212A] text-xs font-medium transition-colors"
                >
                  View Full Bag & Apply Coupons
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

