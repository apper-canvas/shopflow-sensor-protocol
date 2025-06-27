import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from "@/components/ApperIcon";
import { productService } from '@/services/api/productService'
import ProductGrid from '@/components/organisms/ProductGrid'
import ProductFilters from '@/components/organisms/ProductFilters'
const CategoryPage = () => {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    sort: 'featured',
    priceRange: [0, 500],
    categories: [],
    inStock: false,
    onSale: false
  })

  useEffect(() => {
    if (category) {
      loadProducts()
    }
  }, [category])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const productsData = await productService.getByCategory(category)
      setProducts(productsData)
    } catch (err) {
      setError('Failed to load category products. Please try again.')
      console.error('Error loading category products:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      )
    }

    // Apply in stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Apply on sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.onSale)
    }

    // Apply sorting
    switch (filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
        break
    }

    setFilteredProducts(filtered)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      sort: 'featured',
      priceRange: [0, 500],
      categories: [],
      inStock: false,
      onSale: false
    })
  }

  const getCategoryDisplayName = () => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return 'Smartphone'
      case 'clothing':
        return 'Shirt'
      case 'home':
        return 'Home'
      case 'food':
        return 'Coffee'
      case 'sports':
        return 'Dumbbell'
      case 'accessories':
        return 'Watch'
      default:
        return 'Package'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
>
<div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ApperIcon name={getCategoryIcon()} size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                {getCategoryDisplayName()}
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Loading...' : `${filteredProducts.length} products available`}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
              emptyType="category"
              emptyMessage={`No products found in the ${getCategoryDisplayName().toLowerCase()} category. Check back soon for new arrivals!`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage