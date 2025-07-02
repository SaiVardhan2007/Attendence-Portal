import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase, getCurrentUser } from '../utils/supabaseClient'

// Create context
const AppContext = createContext()

// Initial state
const initialState = {
  user: null,
  cartItems: [],
  isCartOpen: false,
  restaurants: [],
  selectedRestaurant: null,
  foodItems: [],
  coupons: [],
  appliedCoupon: null,
  loading: false,
  error: null
}

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_RESTAURANTS: 'SET_RESTAURANTS',
  SET_SELECTED_RESTAURANT: 'SET_SELECTED_RESTAURANT',
  SET_FOOD_ITEMS: 'SET_FOOD_ITEMS',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  SET_COUPONS: 'SET_COUPONS',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON'
}

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload }
    
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    
    case ACTIONS.SET_RESTAURANTS:
      return { ...state, restaurants: action.payload }
    
    case ACTIONS.SET_SELECTED_RESTAURANT:
      return { ...state, selectedRestaurant: action.payload }
    
    case ACTIONS.SET_FOOD_ITEMS:
      return { ...state, foodItems: action.payload }
    
    case ACTIONS.ADD_TO_CART:
      const existingItem = state.cartItems.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
        }
      }
    
    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      }
    
    case ACTIONS.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      }
    
    case ACTIONS.CLEAR_CART:
      return { ...state, cartItems: [], appliedCoupon: null }
    
    case ACTIONS.TOGGLE_CART:
      return { ...state, isCartOpen: !state.isCartOpen }
    
    case ACTIONS.SET_COUPONS:
      return { ...state, coupons: action.payload }
    
    case ACTIONS.APPLY_COUPON:
      return { ...state, appliedCoupon: action.payload }
    
    case ACTIONS.REMOVE_COUPON:
      return { ...state, appliedCoupon: null }
    
    default:
      return state
  }
}

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Check for authenticated user on mount
  useEffect(() => {
    checkUser()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          dispatch({ type: ACTIONS.SET_USER, payload: session.user })
        } else {
          dispatch({ type: ACTIONS.SET_USER, payload: null })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await getCurrentUser()
      dispatch({ type: ACTIONS.SET_USER, payload: user })
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  // Action creators
  const actions = {
    setUser: (user) => dispatch({ type: ACTIONS.SET_USER, payload: user }),
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setRestaurants: (restaurants) => dispatch({ type: ACTIONS.SET_RESTAURANTS, payload: restaurants }),
    setSelectedRestaurant: (restaurant) => dispatch({ type: ACTIONS.SET_SELECTED_RESTAURANT, payload: restaurant }),
    setFoodItems: (items) => dispatch({ type: ACTIONS.SET_FOOD_ITEMS, payload: items }),
    addToCart: (item) => dispatch({ type: ACTIONS.ADD_TO_CART, payload: item }),
    removeFromCart: (itemId) => dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: itemId }),
    updateCartQuantity: (itemId, quantity) => dispatch({ 
      type: ACTIONS.UPDATE_CART_QUANTITY, 
      payload: { id: itemId, quantity } 
    }),
    clearCart: () => dispatch({ type: ACTIONS.CLEAR_CART }),
    toggleCart: () => dispatch({ type: ACTIONS.TOGGLE_CART }),
    setCoupons: (coupons) => dispatch({ type: ACTIONS.SET_COUPONS, payload: coupons }),
    applyCoupon: (coupon) => dispatch({ type: ACTIONS.APPLY_COUPON, payload: coupon }),
    removeCoupon: () => dispatch({ type: ACTIONS.REMOVE_COUPON })
  }

  // Calculate cart totals
  const cartTotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemsCount = state.cartItems.reduce((count, item) => count + item.quantity, 0)

  const value = {
    ...state,
    ...actions,
    cartTotal,
    cartItemsCount
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}