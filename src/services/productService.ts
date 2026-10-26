import { Product, ProductCategory, SkinConcern } from '../types'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LOCAL_PRODUCTS_KEY = 'glowvia_products_inventory'

/**
 * Initialize or get local inventory
 */
function getLocalInventory(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY)
    if (raw) {
      const products: Product[] = JSON.parse(raw)
      // Local development data has no review backend, so discard old sample ratings.
      return products.map(({ rating: _rating, reviewCount: _reviewCount, ...product }) => product)
    }
  } catch {
    // fallback
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS))
  return SAMPLE_PRODUCTS
}

function saveLocalInventory(products: Product[]): void {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products))
}

export const productService = {
  /**
   * Fetch all active products
   */
  async getProducts(options?: {
    category?: ProductCategory
    concern?: SkinConcern
    searchQuery?: string
    minPrice?: number
    maxPrice?: number
    inStockOnly?: boolean
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest'
  }): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('products').select('*').eq('is_active', true)

        if (options?.category) {
          query = query.eq('category_slug', options.category)
        }

        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            brand: d.brand,
            category: d.category_slug,
            categoryLabel: d.category_slug,
            description: d.description,
            shortDescription: d.short_description,
            price: Number(d.price),
            compareAtPrice: d.compare_at_price ? Number(d.compare_at_price) : undefined,
            imageUrl: d.image_url,
            galleryImages: d.gallery_images || [],
            ingredients: d.ingredients,
            directions: d.directions,
            size: d.size,
            skinType: d.skin_types || [],
            concerns: d.concerns || [],
            stockQuantity: d.stock_quantity,
            isActive: d.is_active,
            rating: d.rating ? Number(d.rating) : undefined,
            reviewCount: d.review_count || 0,
            tags: d.tags || [],
            createdAt: d.created_at,
          }))
        }
      } catch (err) {
        console.warn('Falling back to local product data:', err)
      }
    }

    // Local in-memory / localStorage data
    let list = getLocalInventory()

    if (options?.category) {
      list = list.filter((p) => p.category === options.category)
    }

    if (options?.concern) {
      list = list.filter((p) => p.concerns?.includes(options.concern!))
    }

    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (options?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= options.minPrice!)
    }

    if (options?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= options.maxPrice!)
    }

    if (options?.inStockOnly) {
      list = list.filter((p) => p.stockQuantity > 0)
    }

    if (options?.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          list.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'featured':
        default:
          break
      }
    }

    return list
  },

  /**
   * Fetch single product by ID or Slug
   */
  async getProductById(idOrSlug: string): Promise<Product | null> {
    const list = await this.getProducts()
    return list.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
  },

  /**
   * Admin: Add new product
   */
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const current = getLocalInventory()
    saveLocalInventory([newProduct, ...current])
    return newProduct
  },

  /**
   * Admin: Update product
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const current = getLocalInventory()
    const index = current.findIndex((p) => p.id === id)
    if (index === -1) return null

    const updated = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    current[index] = updated
    saveLocalInventory(current)
    return updated
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id: string): Promise<boolean> {
    const current = getLocalInventory()
    const filtered = current.filter((p) => p.id !== id)
    saveLocalInventory(filtered)
    return true
  },
}

