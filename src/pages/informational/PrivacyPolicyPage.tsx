import React from 'react'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#267A50]">
          Legal & Privacy
        </span>
        <h1 className="text-3xl font-serif font-semibold text-[#29212A] mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#71676D] mt-1">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3E5] p-6 sm:p-10 shadow-xs space-y-6 text-xs text-[#71676D] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            1. Our Commitment to Your Privacy
          </h2>
          <p>
            At Glowvia, we respect your confidentiality. We collect only the information necessary to fulfill your orders, provide skincare recommendations, and enhance your digital shopping experience.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            2. Information We Collect
          </h2>
          <p>
            We collect contact information (name, email, phone number) and shipping destinations when you create an account or place an order. We do not store plaintext passwords or sensitive financial credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            3. Data Isolation and Protection
          </h2>
          <p>
            Customer profiles and order histories are strictly isolated using PostgreSQL Row Level Security (RLS). Only authenticated account holders and verified store administrators have access to order records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#29212A]">
            4. Contacting Us
          </h2>
          <p>
            If you have questions about your personal data or wish to request data removal, please contact privacy@glowvia.com.
          </p>
        </section>
      </div>
    </div>
  )
}

