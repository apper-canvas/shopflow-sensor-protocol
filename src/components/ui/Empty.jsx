import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  type = "products", 
  title, 
  message, 
  actionText = "Start Shopping", 
  actionLink = "/products" 
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'cart':
        return {
          icon: 'ShoppingCart',
          title: 'Your cart is empty',
          message: 'Looks like you haven\'t added any items to your cart yet. Start shopping to fill it up!',
          actionText: 'Browse Products',
          actionLink: '/products'
        }
      case 'search':
        return {
          icon: 'Search',
          title: 'No products found',
          message: 'We couldn\'t find any products matching your search. Try different keywords or browse our categories.',
          actionText: 'View All Products',
          actionLink: '/products'
        }
      case 'category':
        return {
          icon: 'Package',
          title: 'No products in this category',
          message: 'This category is currently empty, but we\'re always adding new products. Check back soon!',
          actionText: 'Browse Other Categories',
          actionLink: '/products'
        }
      default:
        return {
          icon: 'Package',
          title: 'No products available',
          message: 'We\'re currently updating our inventory. Please check back soon for amazing products!',
          actionText: 'Retry',
          actionLink: '/products'
        }
    }
  }

  const content = {
    icon: type === 'custom' ? 'Package' : getDefaultContent().icon,
    title: title || getDefaultContent().title,
    message: message || getDefaultContent().message,
    actionText: actionText || getDefaultContent().actionText,
    actionLink: actionLink || getDefaultContent().actionLink
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center shadow-premium mb-4">
          <ApperIcon name={content.icon} size={64} className="text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gradient-to-r from-primary-300 to-pink-300 rounded-full opacity-30"
        />
      </div>
      
      <h3 className="text-3xl font-display font-bold gradient-text mb-4">
        {content.title}
      </h3>
      
      <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
        {content.message}
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={content.actionLink}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-display font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg"
        >
          <ApperIcon name="ArrowRight" size={20} />
          {content.actionText}
        </Link>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mt-12 text-gray-400"
      >
        <ApperIcon name="Sparkles" size={24} />
      </motion.div>
    </motion.div>
  )
}

export default Empty