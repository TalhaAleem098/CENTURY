"use client";
import React from "react";

const OrderConfirmationModal = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-40 p-2 sm:p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 max-h-[95vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-green-100 rounded-full">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 text-center">Order Placed Successfully</h2>
        <p className="text-gray-700 text-center mb-2">Thank you for your order!</p>
        <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">You will receive a confirmation call very soon.</p>
        <div className="w-full bg-gray-50 rounded p-3 mb-4 text-center">
          <div className="text-base font-semibold text-gray-900 break-all">{email}</div>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-sm hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
