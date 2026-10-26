import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Lock,
  ChevronLeft,
} from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { orderService } from '../../services/orderService'
import { formatINR } from '../../utils/formatters'
import { PaymentMethod } from '../../types'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  addressLine: z.string().min(5, 'Address line is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().min(6, 'Valid 6-digit PIN code required'),
  country: z.string().default('India'),
  paymentMethod: z.enum(['cod', 'card_dev', 'upi_dev']),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shippingFee, discountAmount, totalAmount, clearCart, appliedCoupon } = useCart()
  const { user, isLiveSupabase } = useAuth()
  const { error } = useToast()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedDelivery = {
    id: 'standard',
    name: 'Standard Insured Delivery',
    price: shippingFee,
    estimatedDays: '3-5 Business Days',
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      addressLine: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India',
      paymentMethod: 'cod',
    },
  })

  const selectedPaymentMethod = watch('paymentMethod')

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      error('Your bag is empty.')
      navigate('/cart')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await orderService.createOrder({
        userId: user?.id || 'guest-' + Date.now(),
        customerName: values.fullName,
        customerEmail: values.email,
        customerPhone: values.phone,
        cartItems: items,
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          addressLine: values.addressLine,
          apartment: values.apartment,
          city: values.city,
          state: values.state,
          pinCode: values.pinCode,
          country: values.country,
        },
        deliveryMethod: selectedDelivery,
        paymentMethod: values.paymentMethod as PaymentMethod,
        couponCode: appliedCoupon?.code,
        discountAmount,
      })

      if (res.success && res.order) {
        clearCart()
        navigate('/order-success', { state: { order: res.order } })
      } else {
        error(res.error || 'Failed to place order. Please review your details.')
      }
    } catch {
      error('An error occurred during order submission.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#29212A] mb-3">
          Your Bag is Empty
        </h2>
        <p className="text-sm text-[#71676D] mb-6">
          Add items to your bag before heading to checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#267A50] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Explore Formulations
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {isLiveSupabase && (
        <div role="status" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          Live checkout is not available yet. Trusted server-side order, price, and stock validation must be configured before this store can accept orders.
        </div>
      )}
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71676D] hover:text-[#267A50]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Checkout Form (7 cols) */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3E5] shadow-xs">
            <h2 className="text-lg font-serif font-semibold text-[#29212A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#267A50] text-white text-xs flex items-center justify-center font-sans font-bold">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aditi Sharma"
                  {...register('fullName')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.fullName && (
                  <p className="text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.email && (
                  <p className="text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.phone && (
                  <p className="text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3E5] shadow-xs">
            <h2 className="text-lg font-serif font-semibold text-[#29212A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#267A50] text-white text-xs flex items-center justify-center font-sans font-bold">
                2
              </span>
              <span>Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="House / Flat No., Street, Landmark"
                  {...register('addressLine')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.addressLine && (
                  <p className="text-red-600 mt-1">{errors.addressLine.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  {...register('city')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.city && <p className="text-red-600 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  {...register('state')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.state && <p className="text-red-600 mt-1">{errors.state.message}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  placeholder="400001"
                  {...register('pinCode')}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
                />
                {errors.pinCode && (
                  <p className="text-red-600 mt-1">{errors.pinCode.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#29212A] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3E5] bg-gray-50 text-[#71676D]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3E5] shadow-xs">
            <h2 className="text-lg font-serif font-semibold text-[#29212A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#267A50] text-white text-xs flex items-center justify-center font-sans font-bold">
                3
              </span>
              <span>Payment Selection</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'cod'
                    ? 'border-[#267A50] bg-[#FFF0F5]'
                    : 'border-[#EAE3E5] hover:bg-[#FAF8F7]'
                }`}
              >
                <input
                  type="radio"
                  value="cod"
                  {...register('paymentMethod')}
                  className="mt-1 text-[#267A50] focus:ring-[#267A50]"
                />
                <div className="ml-3">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#29212A]">
                    <Banknote className="w-4 h-4 text-[#267A50]" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-xs text-[#71676D] mt-0.5">
                    Pay securely in cash or UPI QR scan upon courier arrival at your doorstep.
                  </p>
                </div>
              </label>

              {/* Option 2: Labelled Development Card Payment */}
              <label
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'card_dev'
                    ? 'border-[#267A50] bg-[#FFF0F5]'
                    : 'border-[#EAE3E5] hover:bg-[#FAF8F7]'
                }`}
              >
                <input
                  type="radio"
                  value="card_dev"
                  {...register('paymentMethod')}
                  className="mt-1 text-[#267A50] focus:ring-[#267A50]"
                />
                <div className="ml-3">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#29212A]">
                    <CreditCard className="w-4 h-4 text-[#267A50]" />
                    <span>Credit / Debit Card (Development Test Mode)</span>
                  </div>
                  <p className="text-xs text-[#71676D] mt-0.5">
                    Clearly labelled development test simulation. Real gateway (Razorpay/Stripe) connects via backend credentials.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLiveSupabase}
            className="w-full py-4 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-base font-semibold tracking-wide transition-all shadow-lg shadow-[#267A50]/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLiveSupabase ? (
              <span>Checkout Setup Required</span>
            ) : isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order • {formatINR(totalAmount)}</span>
              </>
            )}
          </button>
        </form>

        {/* Order Review Sidebar (5 cols) */}
        <aside
          aria-label="Order summary breakdown"
          className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3E5] shadow-sm space-y-6 lg:sticky lg:top-28"
        >
          <div className="flex items-center justify-between border-b border-[#EAE3E5] pb-4">
            <h3 className="font-serif font-semibold text-lg text-[#29212A]">
              Items In Your Bag ({items.length})
            </h3>
            <Link to="/cart" className="text-xs text-[#267A50] hover:underline">
              Edit
            </Link>
          </div>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#FAF8F7] overflow-hidden shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-[#29212A] truncate">{item.product.name}</p>
                    <p className="text-[#71676D]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-[#29212A] shrink-0">
                  {formatINR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-[#EAE3E5] text-xs">
            <div className="flex justify-between text-[#71676D]">
              <span>Subtotal</span>
              <span className="text-[#29212A] font-medium">{formatINR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#C2185B]">
                <span>Discount ({appliedCoupon?.code})</span>
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
              <span className="font-semibold text-sm text-[#29212A]">Total Amount</span>
              <span className="font-serif font-bold text-xl text-[#267A50]">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF0F5] text-[11px] text-[#71676D] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#267A50] shrink-0 mt-0.5" />
            <span>
              All transactions are encrypted and safeguarded. Prices reflect verified inventory pricing.
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}
