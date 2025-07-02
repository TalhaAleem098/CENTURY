"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";

// Responsive text utility
const responsiveText = "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl";

// Enhanced Checkout Modal Component
const CheckoutModal = ({ isOpen, onClose, orderData, onServerResponse }) => {
  // Use backend-required field names
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
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
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
      toast.error('Please fill in all required fields correctly');
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
        notes: formData.notes
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
        toast.success('Order placed successfully!');
        onServerResponse('Order placed successfully!');
        onClose();
        // Reset form
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
      console.error('Order submission error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  {item.productName} ({item.selectedSize}, {item.selectedColor}) × {item.quantity}
                </span>
                <span className="font-medium">₨{item.totalPrice.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-bold">
                <span>Total Amount:</span>
                <span className="text-lg">₨{orderData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
              {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Any special instructions for your order..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [descriptionState, setDescriptionState] = useState('short'); // 'short', 'medium', 'full'
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProduct(data);
        const colors = data.color ? data.color.split(",").map(c => c.trim()).filter(Boolean) : [];
        setSelectedColor(colors.length > 0 ? colors[0] : "");
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const finalPrice =
    product?.sale?.percentage > 0
      ? product.price * (1 - product.sale.percentage / 100)
      : product?.price || 0;
  const totalPrice = finalPrice * quantity;

  // Available colors (handling multiple colors separated by commas)
  const availableColors = product?.color ? product.color.split(",").map(c => c.trim()).filter(Boolean) : [];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = existingCart.findIndex(item => item.id === product._id);
    if (existingProductIndex !== -1) {
      if (existingCart[existingProductIndex].sizes[selectedSize]) {
        existingCart[existingProductIndex].sizes[selectedSize] += quantity;
      } else {
        existingCart[existingProductIndex].sizes[selectedSize] = quantity;
      }
    } else {
      existingCart.push({
        id: product._id,
        sizes: {
          [selectedSize]: quantity
        }
      });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`${product.name} added to cart!`);
  };

  const handlePlaceOrder = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    setShowCheckoutModal(true);
  };

  const getDescriptionDisplay = () => {
    if (!product?.description) return "No description available for this product.";
    
    const description = product.description;
    const length = description.length;
    
    if (length <= 180) return description;
    
    switch (descriptionState) {
      case 'short':
        return description.slice(0, 180) + '...';
      case 'medium':
        return length > 350 ? description.slice(0, 350) + '...' : description;
      case 'full':
      default:
        return description;
    }
  };

  const getDescriptionButton = () => {
    if (!product?.description || product.description.length <= 180) return null;
    
    const length = product.description.length;
    
    if (length <= 350) {
      return (
        <button
          className="mt-3 text-black hover:text-gray-700 text-sm font-medium underline transition-colors"
          onClick={() => setDescriptionState(descriptionState === 'short' ? 'full' : 'short')}
        >
          {descriptionState === 'short' ? 'Show More' : 'Show Less'}
        </button>
      );
    }
    
    return (
      <div className="mt-3 space-x-4">
        {descriptionState === 'short' && (
          <button
            className="text-black hover:text-gray-700 text-sm font-medium underline transition-colors"
            onClick={() => setDescriptionState(length > 350 ? 'medium' : 'full')}
          >
            Show More
          </button>
        )}
        {descriptionState === 'medium' && (
          <>
            <button
              className="text-black hover:text-gray-700 text-sm font-medium underline transition-colors"
              onClick={() => setDescriptionState('full')}
            >
              Show Full
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 text-sm font-medium underline transition-colors"
              onClick={() => setDescriptionState('short')}
            >
              Show Less
            </button>
          </>
        )}
        {descriptionState === 'full' && (
          <button
            className="text-gray-600 hover:text-gray-800 text-sm font-medium underline transition-colors"
            onClick={() => setDescriptionState('short')}
          >
            Show Less
          </button>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <OrbitProgress color="#000000" size="medium" text="" textColor="" />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10 px-4">{error}</div>;
  if (!product) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Side - Images */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Main Image */}
            <div className="mb-4 sm:mb-6">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={
                      product.images[selectedImage]?.url ||
                      product.images[0]?.url
                    }
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-black ring-2 ring-gray-300 opacity-60"
                        : "border-gray-200 hover:border-gray-400 opacity-100 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Product Title & Brand */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 break-words leading-tight">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 break-words">{product.brand}</p>
            </div>

            {/* Price */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
                  ₨{finalPrice.toLocaleString()}
                </span>
                {product.sale?.percentage > 0 && (
                  <>
                    <span className="text-base sm:text-lg lg:text-xl text-gray-500 line-through">
                      ₨{product.price.toLocaleString()}
                    </span>
                    <span className="bg-gray-100 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {product.sale.percentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Material:</span>
                <p className="text-gray-600 text-sm sm:text-base">{product.material || "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Gender:</span>
                <p className="text-gray-600 text-sm sm:text-base">{product.gender || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Category:</span>
                <p className="text-gray-600 text-sm sm:text-base">{product.category}</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 sm:px-4 py-2 border-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm sm:text-base">No sizes available</span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.length > 0 ? (
                  availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 sm:px-4 py-2 border-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {color}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm sm:text-base">No colors available</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-lg font-medium"
                >
                  -
                </button>
                <span className="px-4 py-2 bg-gray-50 rounded-lg min-w-[50px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-6 sm:mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold">Total:</span>
                <span className="text-xl sm:text-2xl font-bold text-black">
                  ₨{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handlePlaceOrder}
                disabled={
                  !selectedSize || !selectedColor || product.stock === 0
                }
                className="w-full py-3 sm:py-4 bg-black text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Place Order Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedSize || !selectedColor || product.stock === 0
                }
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-base sm:text-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Description and Dimensions Section */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Description */}
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Product Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {getDescriptionDisplay()}
                </p>
                {getDescriptionButton()}
              </div>
            </div>

            {/* Right Side - Dimensions Table */}
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4">
                Size Dimensions
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Height (cm)
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Width (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {product.sizes && product.sizes.length > 0 && product.dimensions && Object.keys(product.dimensions).length > 0 ? (
                      Object.entries(product.dimensions).map(([size, dim]) => (
                        <tr key={size}>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {size.toUpperCase()}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                            {dim.height}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                            {dim.width}
                          </td>
                        </tr>
                      ))
                    ) : (
                      [1, 2, 3].map((row) => (
                        <tr key={row}>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-400">-</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-gray-400">-</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-gray-400">-</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderData={{
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          address: '',
          city: '',
          zipCode: '',
          items: [{
            productId: product._id,
            productName: product.name,
            selectedSize: selectedSize,
            selectedColor: selectedColor,
            quantity: quantity,
            originalPrice: product.price,
            salePercentage: product.sale?.percentage || 0,
            finalPrice: finalPrice,
            totalPrice: totalPrice,
            category: product.category,
            brand: product.brand,
            material: product.material,
            productImage: product.images && product.images.length > 0 ? product.images[0].url : ''
          }],
          totalItems: 1,
          totalQuantity: quantity,
          totalAmount: totalPrice,
          orderDate: new Date().toISOString()
        }}
        onServerResponse={(msg) => toast.info(msg)}
      />
    </div>
  );
}