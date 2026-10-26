import { Order, OrderStatus, CartItem, PaymentMethod } from '../types'
import { generateOrderNumber } from '../utils/formatters'
import { productService } from './productService'
import { isSupabaseConfigured } from '../lib/supabase'

const ORDERS_STORAGE_KEY = 'glowvia_orders_store'

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // fallback
  }
  return []
}

function saveLocalOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export const orderService = {
  /**
   * Create a new order with stock validation and price verification
   */
  async createOrder(params: {
    userId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    cartItems: CartItem[]
    shippingAddress: Order['shippingAddress']
    deliveryMethod: Order['deliveryMethod']
    paymentMethod: PaymentMethod
    couponCode?: string
    discountAmount: number
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    if (isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Checkout is disabled for the connected store until trusted server-side order creation and stock validation are configured.',
      }
    }

    if (!params.cartItems.length) {
      return { success: false, error: 'Your bag is empty.' }
    }

    // Verify stock and fetch live unit prices
    let calculatedSubtotal = 0
    const snapshotItems = []

    for (const item of params.cartItems) {
      const liveProduct = await productService.getProductById(item.productId)
      if (!liveProduct) {
        return { success: false, error: `Product "${item.product.name}" is no longer available.` }
      }

      if (liveProduct.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${liveProduct.name}". Only ${liveProduct.stockQuantity} remaining.`,
        }
      }

      const unitPrice = liveProduct.price
      const lineTotal = unitPrice * item.quantity
      calculatedSubtotal += lineTotal

      snapshotItems.push({
        id: `item-${Date.now()}-${item.productId}`,
        productId: liveProduct.id,
        productName: liveProduct.name,
        brand: liveProduct.brand,
        imageUrl: liveProduct.imageUrl,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
        size: item.selectedSize,
      })

      // Decrement stock quantity
      await productService.updateProduct(liveProduct.id, {
        stockQuantity: Math.max(0, liveProduct.stockQuantity - item.quantity),
      })
    }

    const shippingAmount = calculatedSubtotal >= 799 ? 0 : 99
    const totalAmount = Math.max(0, calculatedSubtotal - params.discountAmount + shippingAmount)

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: generateOrderNumber(),
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      items: snapshotItems,
      subtotal: calculatedSubtotal,
      shippingAmount,
      discountAmount: params.discountAmount,
      totalAmount,
      shippingAddress: params.shippingAddress,
      deliveryMethod: params.deliveryMethod,
      paymentMethod: params.paymentMethod,
      // Development payment choices never represent a confirmed payment.
      paymentStatus: 'pending',
      status: 'pending',
      couponCode: params.couponCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const orders = getLocalOrders()
    saveLocalOrders([newOrder, ...orders])

    return { success: true, order: newOrder }
  },

  /**
   * Get orders for specific authenticated customer
   */
  async getCustomerOrders(userId: string): Promise<Order[]> {
    const orders = getLocalOrders()
    return orders.filter((o) => o.userId === userId)
  },

  /**
   * Get order by ID or order number (with access check)
   */
  async getOrderById(orderIdOrNumber: string, userId?: string, isAdmin = false): Promise<Order | null> {
    const orders = getLocalOrders()
    const order = orders.find((o) => o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber)
    if (!order) return null

    // Enforce data isolation: only the owner or an admin can access
    if (!isAdmin && userId && order.userId !== userId) {
      return null
    }

    return order
  },

  /**
   * Admin: Get all orders across the platform
   */
  async getAllOrders(): Promise<Order[]> {
    return getLocalOrders()
  },

  /**
   * Admin: Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = getLocalOrders()
    const index = orders.findIndex((o) => o.id === orderId)
    if (index === -1) return false

    orders[index].status = status
    orders[index].updatedAt = new Date().toISOString()
    saveLocalOrders(orders)
    return true
  },
}

