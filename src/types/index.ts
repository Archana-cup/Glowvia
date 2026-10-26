export type UserRole = 'customer' | 'admin'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  phone?: string
  role: UserRole
  createdAt: string
  updatedAt?: string
}

export interface Address {
  id: string
  userId: string
  fullName: string
  phone: string
  addressLine: string
  apartment?: string
  city: string
  state: string
  pinCode: string
  country: string
  isDefault: boolean
}

export interface Brand {
  id: string
  name: string
  slug: string
  origin: 'Indian' | 'International'
  description?: string
  logoUrl?: string
  website?: string
  isActive: boolean
  productCount?: number
}

export type ProductCategory = 
  | 'skincare'
  | 'face-wash'
  | 'serums'
  | 'moisturizers'
  | 'sunscreen'
  | 'makeup'
  | 'haircare'
  | 'body-care'
  | 'fragrance'
  | 'sets-combos'
  | string

export interface SubcategoryInfo {
  id: string
  slug: string
  name: string
  description?: string
  categorySlug: string
}

export interface CategoryInfo {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string
  productCount?: number
  subcategories?: SubcategoryInfo[]
}

export type SkinConcern = 
  | 'dry-skin'
  | 'oily-skin'
  | 'combination-skin'
  | 'sensitive-skin'
  | 'dull-skin'
  | 'acne-prone'
  | 'hair-care'
  | string

export interface ProductVariant {
  id: string
  name: string // e.g. "50ml", "Shade 01 Nude Glam", "100g"
  type: 'shade' | 'size' | 'default'
  shadeName?: string
  shadeCode?: string // HEX color code or shade number like "#D48B70" or "02"
  size?: string
  price: number // in INR
  compareAtPrice?: number // in INR
  stockQuantity: number
  imageUrl?: string
  sku?: string
  isAvailable?: boolean
}

export interface Review {
  id: string
  productId: string
  userName: string
  rating: number
  title: string
  comment: string
  isVerifiedBuyer: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  brandId?: string
  category: ProductCategory
  categoryLabel: string
  subcategory?: string
  productType?: string // e.g. "Liquid Lipstick", "Barrier Cream", "Mineral Sunscreen"
  description: string
  shortDescription?: string
  price: number // Actual selling price in INR
  compareAtPrice?: number // Verified original MRP in INR if discounted
  imageUrl: string
  galleryImages?: string[]
  ingredients?: string
  directions?: string
  usageInstructions?: string
  precautions?: string
  size?: string // e.g. "50 ml", "100 g"
  skinType?: string[] // e.g. ["All Skin Types", "Sensitive", "Oily"]
  hairType?: string[] // e.g. ["Straight", "Curly", "Color-Treated"]
  concerns?: SkinConcern[]
  shadeName?: string
  shadeCode?: string
  variants?: ProductVariant[]
  tags?: string[]
  keywords?: string[] // Searchable keywords
  stockQuantity: number
  isActive: boolean
  isAvailable?: boolean
  reviews?: Review[]
  rating?: number // Calculated only from genuine reviews
  reviewCount?: number
  createdAt: string
  updatedAt?: string
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  selectedVariant?: ProductVariant
  selectedSize?: string
  selectedShade?: {
    name: string
    code?: string
  }
  quantity: number
  unitPrice: number
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'cod' | 'card_dev' | 'upi_dev'

export interface OrderItemSnapshot {
  id: string
  productId: string
  productName: string
  brand: string
  imageUrl: string
  unitPrice: number
  quantity: number
  lineTotal: number
  size?: string
  variantName?: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItemSnapshot[]
  subtotal: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  shippingAddress: {
    fullName: string
    phone: string
    addressLine: string
    apartment?: string
    city: string
    state: string
    pinCode: string
    country: string
  }
  deliveryMethod: {
    id: string
    name: string
    price: number
    estimatedDays: string
  }
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  couponCode?: string
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  code: string
  discountPercent: number
  maxDiscount?: number
  minSpend: number
  description: string
}

export interface SearchSuggestion {
  text: string
  type: 'product' | 'brand' | 'category' | 'shade'
  id?: string
  category?: string
}
