import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.payload }
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId && 
                item.variantId === action.payload.variantId
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId && 
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && 
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId && 
                   item.variantId === action.payload.variantId)
        )
      }
    
    case 'CLEAR_CART':
      return { ...state, items: [] }
    
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopflow-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopflow-cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product, variant = null, quantity = 1) => {
    const cartItem = {
      productId: product.Id,
      variantId: variant?.Id || 'default',
      productTitle: product.title,
      productImage: product.images[0],
      variantName: variant?.name || 'Default',
      price: variant ? product.price + variant.priceModifier : product.price,
      quantity
    }
    
    dispatch({ type: 'ADD_ITEM', payload: cartItem })
    toast.success(`${product.title} added to cart!`)
  }

  const updateQuantity = (productId, variantId, quantity) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { productId, variantId, quantity } 
    })
  }

  const removeFromCart = (productId, variantId) => {
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: { productId, variantId } 
    })
    toast.info('Item removed from cart')
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
  }

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    items: state.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}