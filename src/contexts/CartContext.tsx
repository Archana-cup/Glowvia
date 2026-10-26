import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { CartItem, Product, Coupon } from '../types'
import { AVAILABLE_COUPONS } from '../data/coupons'
import { useToast } from './ToastContext'

interface CartContextType {
  items: CartItem[]
  totalItemsCount: number
  subtotal: number
  shippingFee: number
  freeShippingThreshold: number
  amountUntilFreeShipping: number
  discountAmount: number
  appliedCoupon: Coupon | null
  totalAmount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => boolean
  updateQuantity: (cartItemId: string, newQuantity: number) => boolean
  removeFromCart: (cartItemId: string) => void
  clearCart: () => void
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'glowvia_shopping_cart'
const FREE_SHIPPING_THRESHOLD = 799 // INR
const STANDARD_SHIPPING_FEE = 99 // INR

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { success, error } = useToast()

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [])

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
  }, [items])

  // Total items count in cart
  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0)
  }, [items])

  // Shipping calculation
  const shippingFee = useMemo(() => {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0
    }
    return STANDARD_SHIPPING_FEE
  }, [subtotal])

  const amountUntilFreeShipping = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
    return FREE_SHIPPING_THRESHOLD - subtotal
  }, [subtotal])

  // Coupon discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minSpend) {
      return 0
    }
    let calculated = (subtotal * appliedCoupon.discountPercent) / 100
    if (appliedCoupon.maxDiscount && calculated > appliedCoupon.maxDiscount) {
      calculated = appliedCoupon.maxDiscount
    }
    return Math.round(calculated)
  }, [subtotal, appliedCoupon])

  // Final total
  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee)
  }, [subtotal, discountAmount, shippingFee])

  // Add to cart with stock validation
  const addToCart = (product: Product, quantity = 1, selectedSize?: string): boolean => {
    if (product.stockQuantity <= 0) {
      error(`"${product.name}" is currently out of stock.`)
      return false
    }

    const cartItemId = `${product.id}-${selectedSize || 'default'}`
    const existingIndex = items.findIndex((item) => item.id === cartItemId)

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity
      if (currentQty + quantity > product.stockQuantity) {
        error(`Only ${product.stockQuantity} items available in stock.`)
        return false
      }

      setItems((prev) => {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: currentQty + quantity,
        }
        return next
      })
    } else {
      if (quantity > product.stockQuantity) {
        error(`Only ${product.stockQuantity} items available in stock.`)
        return false
      }

      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        quantity,
        selectedSize: selectedSize || product.size,
        unitPrice: product.price,
      }
      setItems((prev) => [...prev, newItem])
    }

    success(`Added ${product.name} to your bag`)
    setIsCartOpen(true)
    return true
  }

  // Update item quantity
  const updateQuantity = (cartItemId: string, newQuantity: number): boolean => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
      return true
    }

    const item = items.find((i) => i.id === cartItemId)
    if (!item) return false

    if (newQuantity > item.product.stockQuantity) {
      error(`Cannot add more. Only ${item.product.stockQuantity} units in stock.`)
      return false
    }

    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i))
    )
    return true
  }

  // Remove single item
  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId))
    success('Item removed from bag')
  }

  // Clear entire cart
  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
  }

  // Apply coupon code
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase()
    const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === trimmed)

    if (!found) {
      return { success: false, message: 'Invalid promo code. Try "GLOW10" for 10% off.' }
    }

    if (subtotal < found.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum spend of ₹${found.minSpend}.`,
      }
    }

    setAppliedCoupon(found)
    return { success: true, message: `Coupon "${found.code}" applied successfully!` }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    success('Coupon removed')
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
        discountAmount,
        appliedCoupon,
        totalAmount,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

