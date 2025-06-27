import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductFilters from '@/components/organisms/ProductFilters'
import ProductGrid from '@/components/organisms/ProductGrid'
import ApperIcon from '@/components/ApperIcon'
import { productService } from '@/services/api/productService'

const ProductListPage = () => {
  const [searchParams] = useSearchParams()
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

  const searchQuery = searchParams.get('search')
  const saleOnly = searchParams.get('sale') === 'true'

  useEffect(() => {
    loadProducts()
  }, [searchQuery, saleOnly])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      let productsData
      
      if (searchQuery) {
        productsData = await productService.search(searchQuery)
      } else if (saleOnly) {
        productsData = await productService.getOnSale()
      } else {
        productsData = await productService.getAll()
      }
      
      setProducts(productsData)
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      )
    }

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

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    } else if (saleOnly) {
      return 'Sale Items'
    } else {
      return 'All Products'
    }
  }

  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No products found for "${searchQuery}". Try different keywords or browse our categories.`
    } else if (saleOnly) {
      return "No sale items available at the moment. Check back soon for great deals!"
    } else {
      return "No products match your current filters. Try adjusting your search criteria."
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
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-4">
            {getPageTitle()}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${filteredProducts.length} products found`}
            </p>
            
            {(searchQuery || saleOnly) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm"
              >
                <ApperIcon name="Filter" size={16} className="text-gray-500" />
                <span className="text-gray-500">
                  {searchQuery && `Search: ${searchQuery}`}
                  {saleOnly && 'Sale Items Only'}
                </span>
              </motion.div>
            )}
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
              emptyType={searchQuery ? 'search' : 'products'}
              emptyMessage={getEmptyMessage()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage