import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, WishlistItem } from '../types'
import { useCart } from './CartContext'
import { useToast } from './ToastContext'

interface WishlistContextType {
  items: WishlistItem[]
  wishlistCount: number
  isInWishlist: (productId: string) => boolean
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (product: Product) => void
  moveToCart: (product: Product) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'glowvia_user_wishlist'

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { addToCart } = useCart()
  const { success, info } = useToast()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      localStorage.removeItem(WISHLIST_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const isInWishlist = (productId: string): boolean => {
    return items.some((item) => item.productId === productId)
  }

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      const newItem: WishlistItem = {
        id: `wish-${Date.now()}-${product.id}`,
        productId: product.id,
        product,
        addedAt: new Date().toISOString(),
      }
      setItems((prev) => [...prev, newItem])
      success(`Saved ${product.name} to wishlist`)
    }
  }

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
    info('Removed from wishlist')
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const moveToCart = (product: Product) => {
    const added = addToCart(product, 1)
    if (added) {
      removeFromWishlist(product.id)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

