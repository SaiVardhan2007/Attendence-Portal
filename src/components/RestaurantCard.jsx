import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate()
  const { setSelectedRestaurant } = useAppContext()

  const handleRestaurantClick = () => {
    setSelectedRestaurant(restaurant)
    navigate(`/restaurant/${restaurant.id}`)
  }

  return (
    <div className="restaurant-card" onClick={handleRestaurantClick}>
      <img 
        src={restaurant.image_url || 'https://via.placeholder.com/300x200?text=Restaurant'} 
        alt={restaurant.name}
        className="restaurant-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant'
        }}
      />
      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-description">{restaurant.description}</p>
        
        <div className="restaurant-meta">
          <div className="rating">
            ⭐ {restaurant.rating}
          </div>
          <div className="delivery-info">
            {restaurant.delivery_time} • ${restaurant.delivery_fee} delivery
          </div>
        </div>
        
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.9rem', 
          color: '#666' 
        }}>
          <span>Min order: ${restaurant.min_order}</span>
          <span style={{ 
            marginLeft: '1rem', 
            background: '#f0f0f0', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '10px',
            fontSize: '0.8rem'
          }}>
            {restaurant.cuisine_type}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard