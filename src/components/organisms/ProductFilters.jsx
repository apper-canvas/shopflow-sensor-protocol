import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import PriceRange from '@/components/molecules/PriceRange'
import ApperIcon from '@/components/ApperIcon'

const ProductFilters = ({ filters, onFiltersChange, onClearFilters, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    'Electronics',
    'Clothing', 
    'Home',
    'Food',
    'Sports',
    'Accessories'
  ]

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category]
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handleInStockChange = (inStock) => {
    onFiltersChange({
      ...filters,
      inStock: inStock ? true : undefined
    })
  }

  const handleOnSaleChange = (onSale) => {
    onFiltersChange({
      ...filters,
      onSale: onSale ? true : undefined
    })
  }

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
          Sort By
        </h3>
        <select
          value={filters.sort || 'featured'}
          onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
          Price Range
        </h3>
        <PriceRange
          min={0}
          max={500}
          value={filters.priceRange || [0, 500]}
          onChange={(range) => onFiltersChange({ ...filters, priceRange: range })}
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category) || false}
                onChange={() => handleCategoryChange(category)}
                className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
          Availability
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
              In Stock Only
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={(e) => handleOnSaleChange(e.target.checked)}
              className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
              On Sale
            </span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="w-full"
        icon="RotateCcw"
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsOpen(true)}
          icon="Filter"
          variant="outline"
          className="w-full"
        >
          Filters & Sort
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">
              Filters
            </h2>
            <ApperIcon name="Filter" size={20} className="text-gray-600" />
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-gray-900">
                    Filters & Sort
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </motion.button>
                </div>
                
                <FilterContent />
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductFilters