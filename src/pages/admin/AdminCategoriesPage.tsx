import React from 'react'
import { Link } from 'react-router-dom'
import { AdminNav } from '../../components/layout/AdminNav'
import { SAMPLE_CATEGORIES } from '../../data/categories'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ArrowUpRight } from 'lucide-react'

export const AdminCategoriesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminNav />

      <div className="mb-6">
        <h2 className="text-xl font-serif font-semibold text-[#29212A]">
          Store Categories ({SAMPLE_CATEGORIES.length})
        </h2>
        <p className="text-xs text-[#71676D] mt-0.5">
          Curated skincare departments and taxonomy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {SAMPLE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-3xl bg-white border border-[#EAE3E5] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="aspect-16/9 rounded-2xl overflow-hidden bg-[#FAF8F7] mb-4">
                <ImageWithFallback
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif font-semibold text-base text-[#29212A]">{cat.name}</h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F7] text-[#71676D]">
                  /{cat.slug}
                </span>
              </div>
              <p className="text-xs text-[#71676D] leading-relaxed">{cat.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF8F7] flex items-center justify-between text-xs">
              <span className="text-[#71676D]">Active in navigation</span>
              <Link
                to={`/categories/${cat.slug}`}
                target="_blank"
                className="text-[#267A50] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Department</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

