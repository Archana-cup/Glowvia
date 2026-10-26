import React from 'react'
import { ShieldCheck, Heart, Leaf } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#267A50]">
          Our Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#29212A]">
          Beauty Begins With You.
        </h1>
        <p className="text-sm sm:text-base text-[#71676D] max-w-xl mx-auto leading-relaxed">
          Glowvia was founded to strip away the noise from modern skincare rituals.
          We create intentional formulations that prioritize your natural skin barrier.
        </p>
      </div>

      <div className="aspect-16/9 rounded-3xl overflow-hidden mb-12 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
          alt="Glowvia skincare laboratory"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-8 text-sm text-[#71676D] leading-relaxed">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE3E5]">
          <h2 className="font-serif font-semibold text-xl text-[#29212A] mb-3">
            Mindful Formulations
          </h2>
          <p>
            We believe that radiant skin comes from steady care rather than aggressive treatments.
            Every serum, cream, and cleanser in our collection is formulated without unnecessary fillers,
            drying alcohols, or artificial fragrances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white border border-[#EAE3E5]">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-semibold text-base text-[#29212A] mb-1">
              Pure Botanicals
            </h3>
            <p className="text-xs text-[#71676D]">
              Ethically sourced camellia, jojoba, rosemary, and green tea extracts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE3E5]">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-semibold text-base text-[#29212A] mb-1">
              Barrier-First Science
            </h3>
            <p className="text-xs text-[#71676D]">
              Bio-compatible ceramides and hyaluronic acid designed for daily skin harmony.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE3E5]">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#267A50] flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-semibold text-base text-[#29212A] mb-1">
              Cruelty Free
            </h3>
            <p className="text-xs text-[#71676D]">
              Never tested on animals. Thoughtfully packaged in recyclable materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
