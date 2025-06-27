import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import CartItem from '@/components/molecules/CartItem'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { useCart } from '@/hooks/useCart'

const CartPage = () => {
  const { items, getCartTotal, clearCart } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Empty type="cart" />
        </div>
      </div>
    )
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            {items.length > 0 && (
              <Button
                variant="ghost"
                onClick={clearCart}
                icon="Trash2"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.variantId}`}
                  item={item}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-soft p-8 sticky top-24"
            >
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-display font-bold text-gray-900">
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Notice */}
              {subtotal < 50 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Truck" size={20} className="text-amber-600" />
                    <div>
                      <p className="text-amber-800 font-semibold text-sm">
                        Add {formatPrice(50 - subtotal)} more for free shipping!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Checkout Button */}
              <Button
                as={Link}
                to="/checkout"
                size="lg"
                className="w-full mb-4"
                icon="CreditCard"
              >
                Proceed to Checkout
              </Button>

              <Button
                as={Link}
                to="/products"
                variant="outline"
                size="lg"
                className="w-full"
                icon="ArrowLeft"
                iconPosition="left"
              >
                Continue Shopping
              </Button>

              {/* Security Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Shield" size={16} />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Lock" size={16} />
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage