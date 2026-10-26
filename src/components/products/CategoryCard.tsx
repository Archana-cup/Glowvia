import React from 'react'
import { Link } from 'react-router-dom'
import { CategoryInfo } from '../../types'
import { ImageWithFallback } from '../common/ImageWithFallback'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: CategoryInfo
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[#EAE3E5] hover:shadow-md hover:border-[#267A50]/40 transition-all duration-300"
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-[#FAF8F7]">
        <ImageWithFallback
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-semibold text-base sm:text-lg text-[#29212A] group-hover:text-[#267A50] transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-[#71676D] mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#267A50]">
          <span>Shop Category</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

