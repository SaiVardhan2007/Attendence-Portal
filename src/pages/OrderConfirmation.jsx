import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDeliveryTime = () => {
    const estimatedTime = new Date(order.estimatedDelivery);
    const now = new Date();
    const diffMinutes = Math.ceil((estimatedTime - now) / (1000 * 60));
    return diffMinutes > 0 ? `${diffMinutes} minutes` : 'Soon';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We're preparing your delicious meal!
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-semibold">Order #: {order.id}</p>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Delivery Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Delivery Address</p>
                <p className="text-gray-600">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-800">Contact Number</p>
                <p className="text-gray-600">{order.phoneNumber}</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 font-semibold">
                Estimated Delivery: {getEstimatedDeliveryTime()}
              </p>
              <p className="text-blue-600 text-sm">
                Expected by {formatTime(order.estimatedDelivery)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={`${item.id}-${item.size || 'default'}`} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  {item.size && (
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                  )}
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total Paid</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Payment Method: <span className="font-medium capitalize">{order.paymentMethod}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Instructions</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {order.specialInstructions}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Order More Food
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            View All Orders
          </button>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              <div className="relative flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">Order Confirmed</p>
                  <p className="text-sm text-gray-600">{formatTime(order.orderTime)}</p>
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center relative z-10">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">Preparing Your Order</p>
                  <p className="text-sm text-gray-600">Restaurant is preparing your food</p>
                </div>
              </div>
              <div className="relative flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center relative z-10">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">Out for Delivery</p>
                  <p className="text-sm text-gray-600">Your order is on the way</p>
                </div>
              </div>
              <div className="relative flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center relative z-10">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">Delivered</p>
                  <p className="text-sm text-gray-600">Enjoy your meal!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;