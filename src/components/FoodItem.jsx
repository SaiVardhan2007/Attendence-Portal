import React, { useState } from 'react';
import './FoodItem.css';

const FoodItem = ({ 
  item, 
  onAddToCart, 
  cartQuantity = 0, 
  onUpdateQuantity,
  showFullDescription = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item);
  };

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.id, cartQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (cartQuantity > 1) {
      onUpdateQuantity(item.id, cartQuantity - 1);
    } else {
      onUpdateQuantity(item.id, 0); // This will remove from cart
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const renderBadges = () => {
    const badges = [];
    
    if (item.is_vegetarian) {
      badges.push(
        <span key="veg" className="food-badge veg-badge">
          🌱 Veg
        </span>
      );
    }
    
    if (item.is_vegan) {
      badges.push(
        <span key="vegan" className="food-badge vegan-badge">
          🌿 Vegan
        </span>
      );
    }
    
    if (item.is_spicy) {
      badges.push(
        <span key="spicy" className="food-badge spicy-badge">
          🌶️ Spicy
        </span>
      );
    }
    
    if (item.is_popular) {
      badges.push(
        <span key="popular" className="food-badge popular-badge">
          ⭐ Popular
        </span>
      );
    }

    if (item.is_new) {
      badges.push(
        <span key="new" className="food-badge new-badge">
          ✨ New
        </span>
      );
    }
    
    return badges;
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '';
    if (showFullDescription || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="food-item">
      {/* Food Image */}
      <div className="food-image-container">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="image-loading">Loading...</div>
          </div>
        )}
        <img 
          src={imageError ? '/default-food.jpg' : (item.image_url || '/default-food.jpg')}
          alt={item.name}
          className={`food-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Badges Overlay */}
        <div className="food-badges">
          {renderBadges()}
        </div>

        {/* Discount Badge */}
        {item.discount && (
          <div className="discount-badge">
            {item.discount}% OFF
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="food-details">
        <div className="food-header">
          <h3 className="food-name">{item.name}</h3>
          {item.rating && (
            <div className="food-rating">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{item.rating}</span>
            </div>
          )}
        </div>

        <p className="food-description">
          {truncateDescription(item.description)}
        </p>

        {/* Additional Info */}
        <div className="food-info">
          {item.prep_time && (
            <span className="prep-time">
              🕒 {item.prep_time} mins
            </span>
          )}
          {item.calories && (
            <span className="calories">
              🔥 {item.calories} cal
            </span>
          )}
          {item.serves && (
            <span className="serves">
              👥 Serves {item.serves}
            </span>
          )}
        </div>

        {/* Ingredients/Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="allergen-info">
            <span className="allergen-label">⚠️ Contains:</span>
            <span className="allergens">{item.allergens.join(', ')}</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="food-footer">
          <div className="price-section">
            {item.original_price && item.original_price > item.price && (
              <span className="original-price">${item.original_price.toFixed(2)}</span>
            )}
            <span className="current-price">${item.price.toFixed(2)}</span>
          </div>

          <div className="food-actions">
            {cartQuantity === 0 ? (
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <span className="btn-icon">➕</span>
                Add to Cart
              </button>
            ) : (
              <div className="quantity-controls">
                <button 
                  className="quantity-btn decrease"
                  onClick={handleDecreaseQuantity}
                >
                  ➖
                </button>
                <span className="quantity-display">{cartQuantity}</span>
                <button 
                  className="quantity-btn increase"
                  onClick={handleIncreaseQuantity}
                >
                  ➕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customization Note */}
        {item.customizable && (
          <div className="customization-note">
            <span className="customization-icon">⚙️</span>
            <span>Customization available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;