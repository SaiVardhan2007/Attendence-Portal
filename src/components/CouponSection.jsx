import React, { useState } from 'react';
import './CouponSection.css';

const CouponSection = ({ onApplyCoupon, appliedCoupon, subtotal }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  // Sample coupons - in a real app, these would come from your backend
  const availableCoupons = [
    {
      code: 'WELCOME10',
      description: 'Welcome offer - 10% off',
      discount: 0.10,
      minOrder: 25,
      type: 'percentage'
    },
    {
      code: 'SAVE5',
      description: 'Flat $5 off',
      discount: 5,
      minOrder: 30,
      type: 'fixed'
    },
    {
      code: 'FREESHIP',
      description: 'Free delivery',
      discount: 2.99,
      minOrder: 20,
      type: 'delivery'
    },
    {
      code: 'FIRST20',
      description: 'First order - 20% off',
      discount: 0.20,
      minOrder: 15,
      type: 'percentage'
    }
  ];

  const validateCoupon = (code) => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }
    
    if (subtotal < coupon.minOrder) {
      return { 
        valid: false, 
        error: `Minimum order of $${coupon.minOrder} required` 
      };
    }
    
    return { valid: true, coupon };
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    const validation = validateCoupon(couponCode);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    onApplyCoupon(validation.coupon);
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setError('');
  };

  const calculateDiscount = (coupon) => {
    if (coupon.type === 'percentage') {
      return subtotal * coupon.discount;
    } else if (coupon.type === 'fixed') {
      return Math.min(coupon.discount, subtotal);
    } else if (coupon.type === 'delivery') {
      return coupon.discount;
    }
    return 0;
  };

  const handleCouponSelect = (coupon) => {
    setCouponCode(coupon.code);
    setError('');
  };

  return (
    <div className="coupon-section">
      <div className="coupon-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="coupon-title">
          <span className="coupon-icon">🎫</span>
          <span>Apply Coupon</span>
        </div>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div className="coupon-content">
          {/* Applied Coupon Display */}
          {appliedCoupon && (
            <div className="applied-coupon">
              <div className="applied-coupon-info">
                <span className="coupon-code">{appliedCoupon.code}</span>
                <span className="coupon-desc">{appliedCoupon.description}</span>
                <span className="coupon-savings">
                  -${calculateDiscount(appliedCoupon).toFixed(2)}
                </span>
              </div>
              <button 
                className="remove-coupon"
                onClick={handleRemoveCoupon}
              >
                ×
              </button>
            </div>
          )}

          {/* Coupon Input */}
          {!appliedCoupon && (
            <div className="coupon-input-section">
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setError('');
                  }}
                  className="coupon-input"
                />
                <button 
                  className="apply-coupon-btn"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>
              {error && <p className="coupon-error">{error}</p>}
            </div>
          )}

          {/* Available Coupons */}
          {!appliedCoupon && (
            <div className="available-coupons">
              <h4>Available Offers</h4>
              <div className="coupons-list">
                {availableCoupons.map((coupon, index) => (
                  <div 
                    key={index}
                    className={`coupon-card ${subtotal < coupon.minOrder ? 'disabled' : ''}`}
                    onClick={() => subtotal >= coupon.minOrder && handleCouponSelect(coupon)}
                  >
                    <div className="coupon-left">
                      <div className="coupon-code-display">{coupon.code}</div>
                      <div className="coupon-description">{coupon.description}</div>
                      <div className="coupon-condition">
                        Min order: ${coupon.minOrder}
                      </div>
                    </div>
                    <div className="coupon-right">
                      <div className="coupon-discount">
                        {coupon.type === 'percentage' 
                          ? `${(coupon.discount * 100)}% OFF`
                          : coupon.type === 'fixed'
                          ? `${coupon.discount} OFF`
                          : 'FREE DELIVERY'
                        }
                      </div>
                      {subtotal >= coupon.minOrder ? (
                        <button className="use-coupon-btn">Use</button>
                      ) : (
                        <span className="coupon-unavailable">
                          Add ${(coupon.minOrder - subtotal).toFixed(2)} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponSection;