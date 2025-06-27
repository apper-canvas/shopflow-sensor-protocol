import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { useCart } from '@/hooks/useCart'
import { productService } from '@/services/api/productService'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const productData = await productService.getById(id)
      setProduct(productData)
      
      // Initialize selected variants with first option of each variant
      const initialVariants = {}
      productData.variants?.forEach(variant => {
        if (variant.options?.length > 0) {
          initialVariants[variant.Id] = variant.options[0]
        }
      })
      setSelectedVariants(initialVariants)
      
    } catch (err) {
      setError(err.message || 'Failed to load product details.')
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVariantChange = (variantId, option) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantId]: option
    }))
  }

  const handleAddToCart = async () => {
    if (!product?.inStock) return
    
    try {
      setAddingToCart(true)
      
      // Create variant object for selected options
      const selectedVariant = product.variants?.length > 0 ? {
        Id: `${product.Id}-variant`,
        name: Object.values(selectedVariants).join(', '),
        priceModifier: 0 // Could calculate based on selected options
      } : null
      
      addToCart(product, selectedVariant, quantity)
      
      // Brief success animation
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (err) {
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  if (loading) {
    return <Loading type="product-detail" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error message={error} onRetry={loadProduct} />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error message="Product not found" showRetry={false} />
        </div>
      </div>
    )
  }

  const discountPercentage = calculateDiscountPercentage(product.originalPrice, product.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-600 mb-8"
        >
          <button onClick={() => navigate(-1)} className="hover:text-primary-600 transition-colors">
            <ApperIcon name="ArrowLeft" size={16} />
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-soft overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-primary-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {product.featured && (
                <Badge variant="primary" animate>
                  Featured
                </Badge>
              )}
              {product.onSale && (
                <Badge variant="secondary" animate>
                  {discountPercentage > 0 ? `${discountPercentage}% Off` : 'Sale'}
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="danger" animate>
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={20}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.rating}
                </span>
                <span className="text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-display font-bold gradient-text">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.Id} className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {variant.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {variant.options?.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVariantChange(variant.Id, option)}
                      className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                        selectedVariants[variant.Id] === option
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="Minus" size={18} />
                  </motion.button>
                  <span className="px-6 py-3 font-semibold text-lg">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="Plus" size={18} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={!product.inStock}
                loading={addingToCart}
                onClick={handleAddToCart}
                icon="ShoppingCart"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border-2 border-gray-300 rounded-xl hover:border-pink-400 hover:text-pink-500 transition-all duration-200"
              >
                <ApperIcon name="Heart" size={24} />
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <ApperIcon name="Truck" size={20} />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ApperIcon name="RotateCcw" size={20} />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ApperIcon name="Shield" size={20} />
                <span>1-year warranty included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage