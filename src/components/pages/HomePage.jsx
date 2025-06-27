import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ProductGrid from '@/components/organisms/ProductGrid'
import ApperIcon from '@/components/ApperIcon'
import { productService } from '@/services/api/productService'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [onSaleProducts, setOnSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [featured, onSale] = await Promise.all([
        productService.getFeatured(),
        productService.getOnSale()
      ])
      
      setFeaturedProducts(featured.slice(0, 4))
      setOnSaleProducts(onSale.slice(0, 4))
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      href: '/category/electronics',
      icon: 'Smartphone'
    },
    {
      name: 'Clothing',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      href: '/category/clothing',
      icon: 'Shirt'
    },
    {
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      href: '/category/home',
      icon: 'Home'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
      href: '/category/sports',
      icon: 'Dumbbell'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                Discover
                <span className="block bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                  Premium
                </span>
                Products
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-xl">
                Experience modern shopping with curated collections, premium quality, and exceptional design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="secondary" icon="ShoppingBag">
                  Shop Now
                </Button>
                <Button size="xl" variant="outline" icon="ArrowRight">
                  Explore Categories
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-amber-400">10K+</div>
                  <div className="text-gray-300">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-pink-400">500+</div>
                  <div className="text-gray-300">Premium Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary-400">4.9★</div>
                  <div className="text-gray-300">Average Rating</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop"
                  alt="Shopping Experience"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold gradient-text mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed for modern living
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={category.href} className="block">
                  <div className="relative bg-white rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                          <ApperIcon name={category.icon} size={32} />
                        </div>
                        <h3 className="text-2xl font-display font-bold">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold gradient-text mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked premium products that define quality and style
            </p>
          </motion.div>
          
          <ProductGrid
            products={featuredProducts}
            loading={loading}
            error={error}
            onRetry={loadProducts}
            emptyType="featured"
            emptyMessage="No featured products available at the moment."
          />
          
          {featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                as={Link}
                to="/products"
                size="lg"
                variant="primary"
                icon="ArrowRight"
                iconPosition="right"
              >
                View All Products
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Special Offers
            </h2>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Don't miss out on these amazing deals and limited-time offers
            </p>
          </motion.div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <ProductGrid
              products={onSaleProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
              emptyType="sale"
              emptyMessage="No sale items available at the moment."
            />
          </div>
          
          {onSaleProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                as={Link}
                to="/products?sale=true"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600"
                icon="Tag"
                iconPosition="left"
              >
                View All Sale Items
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-pink-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Stay in the Loop
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Be the first to know about new arrivals, exclusive deals, and special events
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Button size="lg" variant="secondary">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-gray-300 mt-4">
              No spam, just premium deals and updates. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage