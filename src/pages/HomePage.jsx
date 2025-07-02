import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { fetchRestaurants } from '../utils/supabaseClient'
import RestaurantCard from '../components/RestaurantCard'

const HomePage = () => {
  const { 
    restaurants, 
    setRestaurants, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useAppContext()

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await fetchRestaurants()
      
      if (error) {
        setError('Failed to load restaurants. Please try again.')
        console.error('Error fetching restaurants:', error)
      } else {
        setRestaurants(data || [])
      }
    } catch (err) {
      setError('An unexpected error occurred.')
      console.error('Unexpected error:', err)
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading delicious restaurants...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message" style={{ margin: '2rem 0' }}>
          {error}
          <button 
            onClick={loadRestaurants}
            style={{ 
              marginLeft: '1rem', 
              background: '#ff6b6b', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <section style={{ padding: '2rem 0' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          fontSize: '2.5rem',
          color: '#333'
        }}>
          🍽️ Discover Amazing Restaurants
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '1.1rem',
          marginBottom: '3rem'
        }}>
          Order your favorite food from the best restaurants in town
        </p>
        
        {restaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            No restaurants available at the moment. Please check back later.
          </div>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage