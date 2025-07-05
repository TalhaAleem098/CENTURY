"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const OrderConfirmationModal = dynamic(() => import("./OrderConfirmationModal"), { ssr: false });

const CheckoutModal = ({ isOpen, onClose, orderData }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
    } else if (!/^([0-9\-\+\(\)\s]){10,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        items: orderData.items.map(item => ({
          ...item,
          productImage: orderData.items[0]?.productImage || ''
        })),
        totalItems: orderData.totalItems,
        totalQuantity: orderData.totalQuantity,
        totalAmount: orderData.totalAmount,
        orderDate: orderData.orderDate,
        notes: formData.notes,
        paymentMethod,
      };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
      const result = await response.json();
      if (response.ok) {
        setConfirmedEmail(formData.customerEmail);
        setShowConfirmation(true);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          address: '',
          city: '',
          zipCode: '',
          notes: ''
        });
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  if (showConfirmation) {
    return (
      <OrderConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setConfirmedEmail("");
          onClose();
        }}
        email={confirmedEmail}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div
        className="bg-white shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-sm max-h-none sm:max-h-[90vh] flex flex-col"
        style={{ borderRadius: '0.125rem' }}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sm:px-6 sm:py-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition disabled:opacity-50 text-2xl sm:text-2xl"
            aria-label="Close checkout modal"
            disabled={isSubmitting}
            style={{ lineHeight: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Responsive two-column fields for mobile, with custom grid for phone/zip */}
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 pb-32 sm:pb-0">
            {/* Name and Email in same row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isSubmitting}
                />
                {errors.customerName && <div className="text-red-500 text-xs mt-1">{errors.customerName}</div>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.customerEmail && <div className="text-red-500 text-xs mt-1">{errors.customerEmail}</div>}
              </div>
            </div>
            {/* Phone and ZIP in same row, phone wider */}
            <div className="grid grid-cols-12 gap-4">
  <div className="col-span-8">
    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
      Phone Number <span className="text-red-500">*</span>
    </label>
    <input
      type="tel"
      name="customerPhone"
      value={formData.customerPhone}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
      placeholder="Enter your phone number"
      autoComplete="tel"
      disabled={isSubmitting}
    />
    {errors.customerPhone && <div className="text-red-500 text-xs mt-1">{errors.customerPhone}</div>}
  </div>
  <div className="col-span-4">
    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
      ZIP Code <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="zipCode"
      value={formData.zipCode}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
      placeholder="Enter ZIP code"
      disabled={isSubmitting}
    />
    {errors.zipCode && <div className="text-red-500 text-xs mt-1">{errors.zipCode}</div>}
  </div>
</div>
            {/* City and Address remain single row each */}
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your city"
                disabled={isSubmitting}
              />
              {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your address"
                disabled={isSubmitting}
              />
              {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm md:text-base"
                placeholder="Any special instructions for your order..."
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
        {/* Fixed action buttons at the bottom for mobile */}
        <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex gap-4 sm:static sm:border-none sm:p-0 sm:relative sm:bg-transparent">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-50 disabled:opacity-50 text-xs sm:text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-black text-white rounded-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
