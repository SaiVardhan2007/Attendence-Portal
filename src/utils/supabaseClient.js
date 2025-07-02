import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const signUpUser = async (email, password, fullName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    
    if (error) throw error
    
    // Create user profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
          }
        ])
      
      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signInUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user session
export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

// Fetch restaurants
export const fetchRestaurants = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Fetch food items for a restaurant
export const fetchFoodItems = async (restaurantId) => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Fetch coupons
export const fetchCoupons = async () => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .gte('expiry_date', new Date().toISOString().split('T')[0])
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Create order
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Create order items
export const createOrderItems = async (orderItems) => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}