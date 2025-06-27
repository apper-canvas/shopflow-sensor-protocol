import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PriceRange = ({ min = 0, max = 1000, value, onChange, className = '' }) => {
  const [localValue, setLocalValue] = useState(value || [min, max])

  useEffect(() => {
    if (value) {
      setLocalValue(value)
    }
  }, [value])

  const handleMinChange = (e) => {
    const newMin = Math.max(min, Math.min(Number(e.target.value), localValue[1] - 1))
    const newValue = [newMin, localValue[1]]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleMaxChange = (e) => {
    const newMax = Math.min(max, Math.max(Number(e.target.value), localValue[0] + 1))
    const newValue = [localValue[0], newMax]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between text-sm font-semibold text-gray-700">
        <span>{formatPrice(localValue[0])}</span>
        <span>{formatPrice(localValue[1])}</span>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="w-full h-2 bg-gray-200 rounded-full relative">
          <motion.div
            className="absolute h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              width: `${((localValue[1] - localValue[0]) / (max - min)) * 100}%`
            }}
            layoutId="price-range-fill"
          />
        </div>

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />

        {/* Min Thumb */}
        <motion.div
          className="absolute w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-lg top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `${((localValue[0] - min) / (max - min)) * 100}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Max Thumb */}
        <motion.div
          className="absolute w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-lg top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `${((localValue[1] - min) / (max - min)) * 100}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min={min}
          max={localValue[1] - 1}
          value={localValue[0]}
          onChange={handleMinChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <input
          type="number"
          min={localValue[0] + 1}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    </div>
  )
}

export default PriceRange