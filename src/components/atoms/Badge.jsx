import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-semibold rounded-full"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    outline: "border-2 border-primary-200 text-primary-700 bg-primary-50",
    ghost: "text-gray-600 bg-gray-100"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  const BadgeContent = () => (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <BadgeContent />
      </motion.div>
    )
  }

  return <BadgeContent />
}

export default Badge