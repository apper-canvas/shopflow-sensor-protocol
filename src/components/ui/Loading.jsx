import { motion } from 'framer-motion'

const Loading = ({ type = 'products' }) => {
  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse" />
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  )

  const ProductDetailSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5 animate-pulse" />
          </div>
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )

  if (type === 'product-detail') {
    return <ProductDetailSkeleton />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

export default Loading