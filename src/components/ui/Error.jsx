import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-premium">
          <ApperIcon name="AlertTriangle" size={48} className="text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 w-8 h-8 border-2 border-red-300 border-t-red-500 rounded-full"
        />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={20} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error