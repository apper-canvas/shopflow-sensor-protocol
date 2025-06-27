import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { useCart } from '@/hooks/useCart'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const steps = [
    { id: 1, name: 'Shipping', icon: 'Truck' },
    { id: 2, name: 'Payment', icon: 'CreditCard' },
    { id: 3, name: 'Review', icon: 'CheckCircle' }
  ]

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    // Validate shipping form
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode']
    const isValid = requiredFields.every(field => shippingInfo[field].trim() !== '')
    
    if (!isValid) {
      toast.error('Please fill in all required shipping fields')
      return
    }
    
    setCurrentStep(2)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    // Validate payment form
    const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName']
    const isValid = requiredFields.every(field => paymentInfo[field].trim() !== '')
    
    if (!isValid) {
      toast.error('Please fill in all required payment fields')
      return
    }
    
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    try {
      setProcessing(true)
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart and show success
      clearCart()
      toast.success('Order placed successfully!')
      
      // Redirect to success page (or home)
      navigate('/', { replace: true })
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order error:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ApperIcon name="ShoppingCart" size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some products to your cart before checking out.
            </p>
            <Button as="a" href="/products" icon="ArrowLeft" iconPosition="left">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-6">
            Checkout
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= step.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <ApperIcon name={step.icon} size={20} />
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-6 h-0.5 w-16 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-soft p-8"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Email Address"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                  
                  <Input
                    label="Street Address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      required
                    />
                    <Input
                      label="State"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" icon="ArrowRight" iconPosition="right">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-soft p-8"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <Input
                    label="Cardholder Name"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                    required
                  />
                  
                  <Input
                    label="Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      label="Expiry Date"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                      required
                    />
                    <Input
                      label="CVV"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      placeholder="123"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      icon="ArrowLeft"
                    >
                      Back to Shipping
                    </Button>
                    <Button type="submit" size="lg" icon="ArrowRight" iconPosition="right">
                      Review Order
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-soft p-8"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Order Review
                </h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">{item.productTitle}</h3>
                        {item.variantName !== 'Default' && (
                          <p className="text-sm text-gray-600">{item.variantName}</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    icon="ArrowLeft"
                  >
                    Back to Payment
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    loading={processing}
                    size="lg"
                    icon="CreditCard"
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-soft p-8 sticky top-24"
            >
              <h3 className="text-xl font-display font-bold text-gray-900 mb-6">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
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
              
              {/* Security Info */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <ApperIcon name="Shield" size={16} />
                  <span>Your payment information is secure</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ApperIcon name="Truck" size={16} />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage