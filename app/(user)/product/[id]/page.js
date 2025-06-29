"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";
import CheckoutModal from "../../cart/components/CheckoutModal";
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);        setProduct(data);
        // Set default color to first available color
        const colors = data.color ? data.color.split(",").map(c => c.trim()).filter(Boolean) : [];
        setSelectedColor(colors.length > 0 ? colors[0] : "");
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Calculate final price
  const finalPrice =
    product?.sale?.percentage > 0
      ? product.price * (1 - product.sale.percentage / 100)
      : product?.price || 0;

  const totalPrice = finalPrice * quantity;  // Available colors (handling multiple colors separated by commas)
  const availableColors = product?.color ? product.color.split(",").map(c => c.trim()).filter(Boolean) : [];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingProductIndex = existingCart.findIndex(item => item.id === product._id);
    
    if (existingProductIndex !== -1) {
      // Product exists, update the sizes
      if (existingCart[existingProductIndex].sizes[selectedSize]) {
        existingCart[existingProductIndex].sizes[selectedSize] += quantity;
      } else {
        existingCart[existingProductIndex].sizes[selectedSize] = quantity;
      }
    } else {
      // Product doesn't exist, add new entry
      existingCart.push({
        id: product._id,
        sizes: {
          [selectedSize]: quantity
        }
      });
    }
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    toast.success(`${product.name} added to cart!`);
  };

  const handlePlaceOrder = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    // Open checkout modal
    setShowCheckoutModal(true);
  };
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <OrbitProgress color="#000000" size="medium" text="" textColor="" />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!product) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Side - Images */}
          <div className="p-8">
            {/* Main Image */}
            <div className="mb-6">
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
            </div>{" "}
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
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
          <div className="p-8">
            {/* Product Title & Brand */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600">{product.brand}</p>
            </div>
            {/* Price */}{" "}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-black">
                  ₨{finalPrice.toLocaleString()}
                </span>
                {product.sale?.percentage > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₨{product.price.toLocaleString()}
                    </span>
                    <span className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {product.sale.percentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <span className="font-semibold text-gray-700">Material:</span>
                <p className="text-gray-600">{product.material || "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Gender:</span>
                <p className="text-gray-600">{product.gender || "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Category:</span>
                <p className="text-gray-600">{product.category}</p>
              </div>
            </div>{" "}
            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 bg-gray-50 rounded-lg min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            {/* Total Price */}{" "}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-black">
                  ₨{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Action Buttons */}{" "}            <div className="space-y-4">
              <button
                onClick={handlePlaceOrder}
                disabled={
                  !selectedSize || !selectedColor || product.stock === 0
                }
                className="w-full py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Place Order Now
              </button>              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedSize || !selectedColor || product.stock === 0
                }
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>{" "}
        {/* Description and Dimensions Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Product Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>
            </div>

            {/* Right Side - Dimensions Table */}
            <div>
              {product.dimensions &&
              Object.keys(product.dimensions).length > 0 ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Size Dimensions
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Height (cm)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Width (cm)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(product.dimensions).map(
                          ([size, dim]) => (
                            <tr key={size}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {size.toUpperCase()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {dim.height}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {dim.width}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    No size dimensions available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderData={{
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
            material: product.material
          }],
          totalItems: 1,
          totalQuantity: quantity,
          totalAmount: totalPrice,
          orderDate: new Date().toISOString()
        }}
        cartEntries={[{
          id: product._id,
          size: selectedSize,
          quantity: quantity,
          color: selectedColor
        }]}
        products={[product]}
      />
    </div>
  );
}
