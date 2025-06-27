import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { useCart } from '@/hooks/useCart'

const CartItem = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(item.productId, item.variantId)
    } else {
      updateQuantity(item.productId, item.variantId, newQuantity)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {!imageError ? (
            <img
              src={item.productImage}
              alt={item.productTitle}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <ApperIcon name="Image" size={24} className="text-gray-400" />
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {item.productTitle}
          </h3>
          
          {item.variantName !== 'Default' && (
            <p className="text-sm text-gray-600 mt-1">
              {item.variantName}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <ApperIcon name="Minus" size={14} />
              </motion.button>
              
              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <ApperIcon name="Plus" size={14} />
              </motion.button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-bold text-lg gradient-text">
                {formatPrice(item.price * item.quantity)}
              </p>
              <p className="text-sm text-gray-500">
                {formatPrice(item.price)} each
              </p>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => removeFromCart(item.productId, item.variantId)}
          className="flex-shrink-0 w-8 h-8 text-gray-400 hover:text-red-500 transition-colors"
        >
          <ApperIcon name="X" size={18} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CartItem