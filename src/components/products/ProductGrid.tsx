import React from 'react'
import { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { EmptyState } from '../common/EmptyState'

interface ProductGridProps {
  products: Product[]
  emptyTitle?: string
  emptyDescription?: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search keywords or filter criteria.',
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="View All Products"
        actionLink="/products"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

