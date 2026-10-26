import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Are Glowvia products suitable for sensitive skin?',
      a: 'Yes. Our entire philosophy centers on skin barrier support. All formulas are dermatologically tested, pH-balanced (5.0 - 5.5), and free from synthetic fragrances, harsh sulfates, and drying alcohols.',
    },
    {
      q: 'How does nationwide delivery work?',
      a: 'We offer complimentary standard shipping on all orders over ₹799. Orders are packed within 24 hours. Metro deliveries arrive in 2–3 business days, while other locations arrive in 3–5 business days.',
    },
    {
      q: 'What is your return policy?',
      a: 'We stand by a 30-day happiness guarantee. If a formula does not suit your skin, simply reach out to support@glowvia.com with your order number for an exchange or refund.',
    },
    {
      q: 'Do you test on animals?',
      a: 'Never. Glowvia is 100% cruelty-free. We only test on willing human volunteers under the supervision of independent dermatologists.',
    },
    {
      q: 'How can I redeem my promo code?',
      a: 'Enter your code in the promo box in your shopping bag or during checkout. Try "GLOW10" for 10% off your order.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#267A50]">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#29212A]">
          Your Questions, Answered
        </h1>
        <p className="text-xs sm:text-sm text-[#71676D] max-w-md mx-auto">
          Everything you need to know about our formulations, packaging, and orders.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#EAE3E5] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-semibold text-base text-[#29212A]"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#267A50] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#71676D] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#71676D] leading-relaxed border-t border-[#FAF8F7]">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

