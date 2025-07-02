import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  restaurant, 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Store cart and restaurant data for checkout
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('restaurant', JSON.stringify(restaurant));
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = restaurant?.delivery_fee || 2.99;
  const tax = calculateSubtotal() * 0.08; // 8% tax
  const total = calculateSubtotal() + deliveryFee + tax;

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Your Order</h3>
          <div className="cart-header-actions">
            <span className="cart-count">{getTotalItems()} items</span>
            <button className="close-cart" onClick={onClose}>×</button>
          </div>
        </div>

        {restaurant && (
          <div className="cart-restaurant-info">
            <img 
              src={restaurant.image_url || '/default-restaurant.jpg'} 
              alt={restaurant.name}
              className="cart-restaurant-image"
            />
            <div>
              <h4>{restaurant.name}</h4>
              <p>🕒 {restaurant.delivery_time || '30-45'} min</p>
            </div>
          </div>
        )}

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Your cart is empty</p>
              <p className="empty-cart-subtitle">Add some delicious items to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img 
                        src={item.image_url || '/default-food.jpg'} 
                        alt={item.name}
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                      
                      <div className="cart-item-controls">
                        <button 
                          className="quantity-btn decrease"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn increase"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button 
                  className="continue-shopping"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;