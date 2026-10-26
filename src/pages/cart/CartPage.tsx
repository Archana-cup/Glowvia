import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ArrowLeft } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatINR } from '../../utils/formatters'
import { QuantitySelector } from '../../components/common/QuantitySelector'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { EmptyState } from '../../components/common/EmptyState'

export const CartPage: React.FC = () => {
  const {
    items,
    subtotal,
    shippingFee,
    amountUntilFreeShipping,
    discountAmount,
    appliedCoupon,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const navigate = useNavigate()

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError(null)
    if (!couponInput.trim()) return

    const res = applyCoupon(couponInput.trim())
    if (!res.success) {
      setCouponError(res.message)
    } else {
      setCouponInput('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-[#267A50]" />}
          title="Your Bag is Empty"
          description="Looks like you haven't added any beauty rituals yet. Explore our botanical formulations."
          actionLabel="Explore Best Sellers"
          actionLink="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 border-b border-[#EAE3E5] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#29212A]">
            Your Shopping Bag
          </h1>
          <p className="text-xs text-[#71676D] mt-1">
            Review your selected beauty items before continuing to checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClearDialog(true)}
          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear bag</span>
        </button>
      </div>

      {/* Free shipping banner */}
      <div className="bg-[#FFF0F5] rounded-2xl p-4 border border-pink-100 mb-8 flex items-center justify-between text-xs sm:text-sm">
        {amountUntilFreeShipping > 0 ? (
          <div className="flex items-center gap-2 text-[#29212A]">
            <Sparkles className="w-4 h-4 text-[#267A50] shrink-0" />
            <span>
              Add <strong className="text-[#267A50]">{formatINR(amountUntilFreeShipping)}</strong> more of your favorite essentials to unlock <strong>Free Standard Shipping</strong>!
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#267A50] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>You have qualified for Free Shipping nationwide!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-[#EAE3E5] shadow-xs"
            >
              <Link
                to={`/products/${item.product.id}`}
                className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#FAF8F7]"
              >
                <ImageWithFallback
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#267A50] tracking-wider">
                        {item.product.brand}
                      </span>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="block font-serif font-semibold text-base text-[#29212A] hover:text-[#267A50] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#71676D] hover:text-red-600 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#71676D] mt-0.5">
                    Size: {item.selectedSize || item.product.size}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#FAF8F7]">
                  <QuantitySelector
                    quantity={item.quantity}
                    maxStock={item.product.stockQuantity}
                    onChange={(qty) => updateQuantity(item.id, qty)}
                    size="sm"
                  />

                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#29212A]">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="block text-[11px] text-[#71676D]">
                        ({formatINR(item.unitPrice)} each)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#267A50] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE3E5] shadow-sm space-y-6">
          <h2 className="font-serif font-semibold text-xl text-[#29212A]">
            Order Summary
          </h2>

          {/* Coupon Code Box */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#29212A] mb-2">
              Promo Code / Voucher
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF0F5] border border-pink-100 text-xs text-[#267A50]">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <div>
                    <span className="font-bold tracking-wider">{appliedCoupon.code}</span>
                    <p className="text-[10px] text-[#71676D]">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Try GLOW10"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                <p className="text-[11px] text-[#71676D]">Use code "GLOW10" for 10% off.</p>
              </form>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 pt-4 border-t border-[#EAE3E5] text-xs sm:text-sm">
            <div className="flex justify-between text-[#71676D]">
              <span>Bag Subtotal</span>
              <span className="text-[#29212A] font-medium">{formatINR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#C2185B]">
                <span>Discount Applied</span>
                <span>-{formatINR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#71676D]">
              <span>Standard Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <strong className="text-[#267A50]">FREE</strong>
                ) : (
                  formatINR(shippingFee)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#EAE3E5] flex justify-between items-baseline">
              <span className="font-semibold text-sm sm:text-base text-[#29212A]">Total Amount</span>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#267A50]">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showClearDialog}
        title="Empty your shopping bag?"
        message="Are you sure you want to remove all items from your bag? This cannot be undone."
        confirmLabel="Yes, Clear Bag"
        isDestructive={true}
        onConfirm={() => {
          clearCart()
          setShowClearDialog(false)
        }}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  )
}

