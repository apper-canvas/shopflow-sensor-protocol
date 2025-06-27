import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { useCart } from '@/hooks/useCart'

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addToCart } = useCart()

  const handleQuickAdd = () => {
    addToCart(product)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${product.Id}`}>
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <ApperIcon name="Image" size={48} className="text-gray-400" />
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.onSale && (
            <Badge variant="secondary" size="sm" animate>
              Sale
            </Badge>
          )}
          {product.featured && (
            <Badge variant="primary" size="sm" animate>
              Featured
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="danger" size="sm" animate>
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Plus" size={20} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Link to={`/products/${product.Id}`}>
          <h3 className="font-display font-bold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <ApperIcon
                  key={i}
                  name="Star"
                  size={16}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold gradient-text">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={handleQuickAdd}
            className="min-w-0"
          >
            <ApperIcon name="ShoppingCart" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard