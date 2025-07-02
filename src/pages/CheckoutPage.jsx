import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ cartItems, user, onOrderComplete, appliedCoupon, totalAmount }) => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
    paymentMethod: 'cash',
    specialInstructions: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  const calculateDeliveryFee = () => {
    return 2.99; // Fixed delivery fee
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateDiscount = () => {
    if (appliedCoupon) {
      const subtotal = calculateSubtotal();
      if (appliedCoupon.type === 'percentage') {
        return subtotal * (appliedCoupon.value / 100);
      } else {
        return Math.min(appliedCoupon.value, subtotal);
      }
    }
    return 0;
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = calculateDeliveryFee();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + deliveryFee + tax - discount;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!orderData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }
    
    if (!orderData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(orderData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        subtotal: calculateSubtotal(),
        deliveryFee: calculateDeliveryFee(),
        tax: calculateTax(),
        discount: calculateDiscount(),
        total: calculateFinalTotal(),
        deliveryAddress: orderData.deliveryAddress,
        phoneNumber: orderData.phoneNumber,
        paymentMethod: orderData.paymentMethod,
        specialInstructions: orderData.specialInstructions,
        status: 'confirmed',
        orderTime: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        user: user
      };

      // Call parent component's order completion handler
      if (onOrderComplete) {
        onOrderComplete(order);
      }

      // Redirect to order confirmation
      navigate('/order-confirmation', { state: { order } });
      
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={orderData.deliveryAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="3"
                  placeholder="Enter your complete delivery address"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={orderData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={orderData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="wallet">Digital Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={orderData.specialInstructions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Any special instructions for the restaurant or delivery"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size || 'default'}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    {item.size && (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{calculateDeliveryFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{calculateFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Order...
                </div>
              ) : (
                `Place Order - ₹${calculateFinalTotal().toFixed(2)}`
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                ← Back to Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;