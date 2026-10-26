import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Heart, Droplets, Sun, Sparkle, Shield } from 'lucide-react'
import { Product } from '../../types'
import { productService } from '../../services/productService'
import { SAMPLE_CATEGORIES } from '../../data/categories'
import { ProductCard } from '../../components/products/ProductCard'
import { CategoryCard } from '../../components/products/CategoryCard'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const HomePage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const all = await productService.getProducts()
        setBestSellers(all.slice(0, 4))
        setNewArrivals(all.slice(4, 8))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const skinConcerns = [
    {
      id: 'dry-skin',
      name: 'Dry Skin',
      desc: 'Nourishing botanical lipids & multi-weight hyaluronic acid.',
      icon: <Droplets className="w-5 h-5 text-[#267A50]" />,
    },
    {
      id: 'oily-skin',
      name: 'Oily Skin',
      desc: 'Lightweight niacinamide & clarifying zinc PCA balance.',
      icon: <Sparkle className="w-5 h-5 text-[#267A50]" />,
    },
    {
      id: 'combination-skin',
      name: 'Combination Skin',
      desc: 'Smart equilibrium formulas for T-zone and cheeks.',
      icon: <Sparkles className="w-5 h-5 text-[#267A50]" />,
    },
    {
      id: 'sensitive-skin',
      name: 'Sensitive Skin',
      desc: 'Explore products suited to a gentle, simple routine.',
      icon: <Heart className="w-5 h-5 text-[#267A50]" />,
    },
    {
      id: 'dull-skin',
      name: 'Dull-Looking Skin',
      desc: 'Gentle fruit enzymes and antioxidant radiance boosters.',
      icon: <Sun className="w-5 h-5 text-[#267A50]" />,
    },
    {
      id: 'hair-care',
      name: 'Hair Care',
      desc: 'Rosemary scalp infusions & botanical shine restorers.',
      icon: <Shield className="w-5 h-5 text-[#267A50]" />,
    },
  ]

  const routineSteps = [
    {
      step: '01',
      title: 'Cleanse',
      description: 'Use a gentle cleanser to wash your face, then rinse thoroughly.',
      tag: 'Morning & Night',
    },
    {
      step: '02',
      title: 'Treat',
      description: 'Apply a serum according to its product directions.',
      tag: 'Targeted Focus',
    },
    {
      step: '03',
      title: 'Moisturize',
      description: 'Choose a moisturizer that suits your preferences and routine.',
      tag: 'Lock & Replenish',
    },
    {
      step: '04',
      title: 'Protect',
      description: 'Use sunscreen according to the product label when sun protection is needed.',
      tag: 'Morning Essential',
    },
  ]

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#FFF0F5] border-b border-[#EAE3E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE3E5] text-[#267A50] text-xs font-semibold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thoughtful Beauty Essentials</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#29212A] tracking-tight leading-[1.15]">
                Discover Your <br />
                <span className="italic text-[#267A50]">Natural Glow</span>
              </h1>

              <p className="text-base sm:text-lg text-[#71676D] max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                Thoughtfully chosen beauty essentials for your everyday ritual. Explore skincare, haircare, and makeup in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white font-medium text-sm transition-all shadow-md shadow-[#267A50]/20 flex items-center justify-center gap-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/categories/serums"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF8F7] text-[#29212A] border border-[#EAE3E5] font-medium text-sm transition-colors text-center"
                >
                  Explore Skincare
                </Link>
              </div>
            </div>
            {/* Right Hero Image Collage */}
            <div className="relative mx-auto max-w-md lg:max-w-none w-full">
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80"
                  alt="Glowvia pure skincare collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 text-[#29212A] shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-serif font-bold text-[#267A50] uppercase tracking-wider">
                      Featured Formula
                    </p>
                    <p className="text-sm font-semibold text-[#29212A]">Ceramide Cloud Cream</p>
                  </div>
                  <Link
                    to="/products/prod-003"
                    className="px-3 py-1.5 rounded-full bg-[#267A50] text-white text-xs font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A]">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#71676D] mt-1">
              Find formulas thoughtfully matched to every step of your ritual.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#267A50] hover:underline"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {SAMPLE_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#267A50] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A]">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#267A50] hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading customer favorites..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Shop by Concern */}
      <section className="bg-[#FAF8F7] py-12 border-y border-[#EAE3E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A]">
              Shop by Concern
            </h2>
            <p className="text-xs sm:text-sm text-[#71676D] mt-2">
              Every complexion has unique needs. Explore curated botanicals targeted for comfort and balance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skinConcerns.map((concern) => (
              <Link
                key={concern.id}
                to={`/products?concern=${concern.id}`}
                className="p-5 rounded-2xl bg-white border border-[#EAE3E5] hover:border-[#267A50] hover:shadow-sm transition-all group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-[#FFF0F5] text-[#267A50] shrink-0 group-hover:scale-105 transition-transform">
                  {concern.icon}
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-base text-[#29212A] group-hover:text-[#267A50] transition-colors">
                    {concern.name}
                  </h4>
                  <p className="text-xs text-[#71676D] mt-1 leading-relaxed">
                    {concern.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Promotional Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#267A50] to-[#185C3A] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Seasonal Ritual Offer
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-normal mt-4 mb-2">
              Enjoy 10% Off Your Everyday Essentials
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6">
              Use promo code <strong className="underline decoration-pink-300">GLOW10</strong> during checkout on any order above ₹500. Complimentary nationwide shipping included on orders over ₹799.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="px-6 py-2.5 rounded-full bg-white text-[#267A50] font-semibold text-xs tracking-wider uppercase hover:bg-[#FFF0F5] transition-colors"
              >
                Claim Your Ritual
              </Link>
              <span className="text-xs text-white/80">Code auto-applies at cart</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#267A50] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just In</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A]">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#267A50] hover:underline"
          >
            <span>See New Formulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading new arrivals..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Beauty Routine Guide Section */}
      <section className="bg-white py-16 border-y border-[#EAE3E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#267A50]">
              The 4-Step Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A] mt-1">
              Your Daily Beauty Routine
            </h2>
            <p className="text-xs sm:text-sm text-[#71676D] mt-2">
              A balanced sequence designed to respect skin biology and optimize active ingredient absorption.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {routineSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-[#FAF8F7] border border-[#EAE3E5] flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif font-bold text-3xl text-[#267A50]">{step.step}</span>
                  <h4 className="font-serif font-semibold text-lg text-[#29212A] mt-2 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#71676D] leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#EAE3E5] text-[11px] font-semibold text-[#267A50]">
                  {step.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews are intentionally empty until verified review data is connected. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#29212A]">
            Customer Community
          </h2>
          <p className="text-xs sm:text-sm text-[#71676D] mt-2">
            Customer reviews will appear here when verified review data is available.
          </p>
        </div>

        <div className="max-w-xl mx-auto rounded-2xl bg-white border border-[#EAE3E5] p-8 text-center text-sm text-[#71676D]">
          We do not have customer-submitted reviews yet.
        </div>
      </section>
    </div>
  )
}

