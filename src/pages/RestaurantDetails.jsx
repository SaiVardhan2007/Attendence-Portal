import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRestaurantDetails();
    fetchMenuItems();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRestaurant(data);
    } catch (error) {
      setError('Failed to fetch restaurant details');
      console.error('Error:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);

      if (error) throw error;
      setMenuItems(data);
    } catch (error) {
      setError('Failed to fetch menu items');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCategories = () => {
    const categories = ['all', ...new Set(menuItems.map(item => item.category))];
    return categories;
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Store cart in localStorage for checkout page
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('restaurant', JSON.stringify(restaurant));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="error-container">
        <p>Restaurant not found</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-details">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back
        </button>
        <div className="restaurant-hero">
          <img 
            src={restaurant.image_url || '/default-restaurant.jpg'} 
            alt={restaurant.name}
            className="restaurant-image"
          />
          <div className="restaurant-info">
            <h1>{restaurant.name}</h1>
            <p className="restaurant-description">{restaurant.description}</p>
            <div className="restaurant-meta">
              <span className="rating">⭐ {restaurant.rating || '4.5'}</span>
              <span className="delivery-time">🕒 {restaurant.delivery_time || '30-45'} min</span>
              <span className="delivery-fee">🚚 ${restaurant.delivery_fee || '2.99'} delivery</span>
            </div>
            <p className="restaurant-address">📍 {restaurant.address}</p>
          </div>
        </div>
      </div>

      <div className="restaurant-content">
        {/* Menu Section */}
        <div className="menu-section">
          <h2>Menu</h2>
          
          {/* Category Filter */}
          <div className="category-filter">
            {getCategories().map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="menu-items">
            {getFilteredItems().map(item => {
              const cartItem = cart.find(cartItem => cartItem.id === item.id);
              return (
                <div key={item.id} className="menu-item">
                  <img 
                    src={item.image_url || '/default-food.jpg'} 
                    alt={item.name}
                    className="menu-item-image"
                  />
                  <div className="menu-item-info">
                    <h3>{item.name}</h3>
                    <p className="menu-item-description">{item.description}</p>
                    <div className="menu-item-details">
                      <span className="price">${item.price}</span>
                      {item.is_vegetarian && <span className="veg-badge">🌱 Veg</span>}
                      {item.is_spicy && <span className="spicy-badge">🌶️ Spicy</span>}
                    </div>
                  </div>
                  <div className="menu-item-actions">
                    {cartItem ? (
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{cartItem.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(item)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {getFilteredItems().length === 0 && (
            <p className="no-items">No items found in this category.</p>
          )}
        </div>

        {/* Cart Sidebar */}
        {cart.length > 0 && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Your Order</h3>
              <span className="cart-count">{cart.length} items</span>
            </div>
            
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-btn"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <strong>Total: ${getTotalPrice()}</strong>
              </div>
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;