/**
 * Currency and date formatting utilities for Glowvia
 */

/**
 * Formats a number into Indian Rupee currency format (e.g., ₹1,499)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats an ISO date string into readable date (e.g., 25 Oct 2026)
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return isoDate
  }
}

/**
 * Formats date and time
 */
export function formatDateTime(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return isoDate
  }
}

/**
 * Generates a clean readable order number like "GV-2026-8492"
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `GV-${year}-${random}`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

