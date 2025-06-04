"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const CheckoutModal = ({ isOpen, onClose, orderData, cartEntries, products }) => {
  const [shippingData, setShippingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'address', 'city', 'zipCode'];
    for (let field of requiredFields) {
      if (!shippingData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingData.customerEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(shippingData.customerPhone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const finalOrderData = {
      ...shippingData,
      items: orderData.items,
      totalItems: orderData.totalItems,
      totalQuantity: orderData.totalQuantity,
      totalAmount: orderData.totalAmount,
      orderDate: orderData.orderDate,
      status: 'pending'
    };

    try {
      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalOrderData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('=== ORDER SAVED SUCCESSFULLY ===');
        console.log('Order ID:', result.orderId);
        console.log('Order Number:', result.orderNumber);
        console.log('Full Order Data:', JSON.stringify(result.order, null, 2));
        console.log('=== END ORDER DETAILS ===');
        
        toast.success(`Order placed successfully! Order Number: ${result.orderNumber}`);
        
        // Clear cart
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }
        
        onClose();
        
        // Refresh page to update cart state
        window.location.reload();
        
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalAmount = cartEntries.reduce((sum, entry) => {
    const product = products.find(p => p._id === entry.id);
    const salePrice = product?.sale?.percentage 
      ? Math.round(product.price * (1 - product.sale.percentage / 100))
      : product?.price || 0;
    return sum + (salePrice * entry.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Information Form */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={shippingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={shippingData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <textarea
                    value={shippingData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your complete address"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="City"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="ZIP Code"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={shippingData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Any special instructions for your order"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {cartEntries.map((entry, idx) => {
                    const product = products.find(p => p._id === entry.id);
                    if (!product) return null;

                    const salePrice = product?.sale?.percentage 
                      ? Math.round(product.price * (1 - product.sale.percentage / 100))
                      : product?.price || 0;

                    return (
                      <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.images?.[0]?.url || product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            {entry.color} • {entry.size.toUpperCase()} • Qty: {entry.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Rs. {salePrice.toLocaleString()} × {entry.quantity}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            Rs. {(salePrice * entry.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Totals */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items ({cartEntries.length})</span>
                    <span>{cartEntries.reduce((sum, entry) => sum + entry.quantity, 0)} pieces</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - Rs. ${totalAmount.toLocaleString()}`
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
