import { Coupon } from '../types'

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'GLOW10',
    discountPercent: 10,
    minSpend: 500,
    description: '10% off on orders above ₹500',
  },
  {
    code: 'BEAUTYBEGINS',
    discountPercent: 15,
    maxDiscount: 400,
    minSpend: 1000,
    description: '15% off up to ₹400 on orders above ₹1,000',
  },
  {
    code: 'FIRSTGLOW',
    discountPercent: 20,
    maxDiscount: 500,
    minSpend: 1500,
    description: '20% off up to ₹500 for your beauty ritual',
  },
]

