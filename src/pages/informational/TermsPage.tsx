import React from 'react'

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#267A50]">
          Terms of Service
        </span>
        <h1 className="text-3xl font-serif font-semibold text-[#29212A] mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#71676D] mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-10 shadow-xs space-y-6 text-xs text-[#71676D] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or ordering from Glowvia ("the Service"), you agree to abide by these Terms and Conditions. Please read them with care before placing orders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            2. Product Usage & Informational Advice
          </h2>
          <p>
            All content on Glowvia—including ingredients, skin tips, and routine recommendations—is informational. Our cosmetic products are not formulated or intended to diagnose, treat, or cure any medical skin diseases.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            3. Pricing & Currency
          </h2>
          <p>
            All prices are shown in Indian National Rupees (INR) and are inclusive of relevant taxes. Prices and promotional codes are subject to availability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            4. 30-Day Returns Policy
          </h2>
          <p>
            We take pride in our formulations. Unopened or gently sampled products can be returned within 30 days of delivery by reaching out to support@glowvia.com.
          </p>
        </section>
      </div>
    </div>
  )
}

