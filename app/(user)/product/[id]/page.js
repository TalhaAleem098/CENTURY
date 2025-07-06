"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";
const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });
import dynamic from "next/dynamic";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoading, setMainImageLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [descriptionState, setDescriptionState] = useState("short");
  const [quantity, setQuantity] = useState(1);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState([]);

  // Ref for size selection section
  const sizeSectionRef = useRef(null);

  // Carousel drag state
  const [dragStartX, setDragStartX] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (product?.images) {
      setImageLoaded(Array(product.images.length).fill(false));
    }
  }, [product]);

  // When selectedImage changes, set mainImageLoading to true if not loaded, else false
  useEffect(() => {
    // Defensive: If imageLoaded is not initialized, don't set loading
    if (!Array.isArray(imageLoaded) || imageLoaded.length === 0) {
      setMainImageLoading(true);
      return;
    }
    // If the image is already loaded, stop loading
    if (imageLoaded[selectedImage]) {
      setMainImageLoading(false);
    } else {
      // If the image element is in the DOM, but not loaded, check if it is already complete
      const imgEl = document.querySelector(
        `img[alt='${product?.name ? product.name.replace(/'/g, "\\'") : ''} ${selectedImage + 1}']`
      );
      if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
        // If the image is already loaded by the browser, update state
        setImageLoaded((prev) => {
          const arr = [...prev];
          arr[selectedImage] = true;
          return arr;
        });
        setMainImageLoading(false);
      } else {
        setMainImageLoading(true);
      }
    }
  }, [selectedImage, imageLoaded, product]);
  const handleImageLoad = (idx) => {
    setImageLoaded((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
    if (idx === selectedImage) {
      setMainImageLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProduct(data);
        const colors = data.color
          ? data.color
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [];
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
  const availableColors = product?.color
    ? product.color
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.info("Please select a size first.");
      if (sizeSectionRef.current) {
        sizeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (!selectedColor) {
      toast.info("Please select a color.");
      return;
    }
    // Note: In a real app, you'd use proper state management instead of localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = existingCart.findIndex(
      (item) => item.id === product._id
    );
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
          [selectedSize]: quantity,
        },
      });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`${product.name} added to cart!`);
  };

  const handlePlaceOrder = () => {
    if (!selectedSize) {
      toast.info("Please select a size first.");
      if (sizeSectionRef.current) {
        sizeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (!selectedColor) {
      toast.info("Please select a color.");
      return;
    }
    setShowCheckoutModal(true);
  };

  // Render product description with real line breaks
  const getDescriptionDisplay = () => {
    if (!product?.description)
      return "No description available for this product.";
    return product.description.split(/\r?\n/).map((line, idx, arr) => (
      <span key={idx}>
        {line}
        {idx !== arr.length - 1 && <br />}
      </span>
    ));
  };

  const getDescriptionButton = () => null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <OrbitProgress color="#000000" size="medium" text="" textColor="" />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10 px-4">{error}</div>;
  if (!product) return null;

  // Handle carousel navigation
  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setMainImageLoading(true);
    setSelectedImage((prev) => (prev + 1) % product.images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setMainImageLoading(true);
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle drag start
  const handleDragStart = (e) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setDragStartX(e.type === "touchstart" ? e.touches[0].clientX : e.clientX);
    setDragDelta(0);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging || isTransitioning) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    setDragDelta(clientX - dragStartX);
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging || isTransitioning) return;
    setIsDragging(false);

    if (Math.abs(dragDelta) > 50) {
      if (dragDelta < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setDragDelta(0);
  };

  // Handle image click
  const handleImageClick = (idx) => {
    if (!imageLoaded[idx] || isDragging || isTransitioning) return;
    if (idx !== selectedImage) {
      setIsTransitioning(true);
      setMainImageLoading(true);
      setSelectedImage(idx);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Calculate opacity based on distance from center
  const getOpacityForPosition = (offset) => {
    const absOffset = Math.abs(offset);
    if (absOffset === 0) return 1; // Main image
    if (absOffset === 1) return 0.8; // Adjacent images
    if (absOffset === 2) return 0.5; // Far images
    return 0.3; // Very far images
  };

  // Calculate scale based on distance from center
  const getScaleForPosition = (offset) => {
    const absOffset = Math.abs(offset);
    if (absOffset === 0) return 1; // Main image
    if (absOffset === 1) return 0.85; // Adjacent images
    if (absOffset === 2) return 0.7; // Far images
    return 0.55; // Very far images
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 bg-white rounded-sm overflow-hidden">
          {/* Left Side - Images */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              {product.images && product.images.length > 0 ? (
                <div className="relative w-full flex flex-col items-center">
                  <div
                    className="relative flex items-center justify-center w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
                    style={{
                      height: "20rem",
                      minHeight: "16rem",
                      touchAction: "pan-y",
                    }}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    {(() => {
                      const total = product.images.length;
                      const windowSize = Math.min(5, total); // Show max 5 images
                      const sideCount = Math.floor(windowSize / 2);
                      const visible = [];
                      for (let i = -sideCount; i <= sideCount; i++) {
                        let idx = (selectedImage + i + total) % total;
                        visible.push({ idx, offset: i });
                      }
                      return visible.map(({ idx, offset }) => {
                        const image = product.images[idx];
                        const isMain = offset === 0;
                        const absOffset = Math.abs(offset);
                        const baseSize = {
                          width: isMain
                            ? "w-44 sm:w-56 md:w-64 lg:w-72"
                            : "w-32 sm:w-40 md:w-48 lg:w-56",
                          height: isMain
                            ? "h-54 sm:h-56 md:h-64 lg:h-72"
                            : "h-42 sm:h-40 md:h-48 lg:h-56",
                        };
                        const scale = getScaleForPosition(offset);
                        const opacity = getOpacityForPosition(offset);
                        const zIndex = isMain ? 10 : 10 - absOffset;
                        const baseGap = 16; // Base gap between images
                        const imageWidth = isMain ? 176 : 128; // Approximate width in pixels
                        const spacing = imageWidth * 0.6 + baseGap;
                        let translateX = offset * spacing;
                        if (isDragging && isMain) {
                          translateX += dragDelta * 0.8; // Dampened drag effect
                        }
                        return (
                          <div
                            key={idx}
                            className={`absolute top-1/2 left-1/2 flex-shrink-0 cursor-pointer border-2 rounded-sm bg-gray-100 overflow-hidden ${baseSize.width} ${baseSize.height}`}
                            style={{
                              zIndex,
                              borderColor: isMain ? "#000" : "transparent",
                              boxShadow: isMain
                                ? "0 4px 20px rgba(0,0,0,0.15)"
                                : "0 2px 10px rgba(0,0,0,0.1)",
                              transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                              opacity: opacity,
                              transition: isDragging
                                ? "none"
                                : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              cursor: isDragging ? "grabbing" : "pointer",
                              filter: isMain ? "none" : "brightness(0.9)",
                            }}
                            onClick={() => handleImageClick(idx)}
                          >
                            {mainImageLoading && isMain && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-20">
                                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}

                            <Image
                              src={image.url}
                              alt={`${product.name} ${idx + 1}`}
                              width={600}
                              height={600}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${
                                mainImageLoading && isMain
                                  ? "opacity-0"
                                  : "opacity-100"
                              }`}
                              draggable={false}
                              onLoad={() => handleImageLoad(idx)}
                              onError={() => handleImageLoad(idx)}
                              priority={absOffset <= 1}
                            />

                            {/* Loading overlay for side images */}
                            {!imageLoaded[idx] && !isMain && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-20">
                                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 aspect-square bg-gray-100 rounded-xl">
                  No Image Available
                </div>
              )}
            </div>
            <div className="hidden md:block">
              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex gap-3">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    Gender:
                  </span>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {product.gender || "N/A"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    Category:
                  </span>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {product.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">
                  Material:
                </span>
                <p className="text-gray-600 text-sm sm:text-base">
                  {product.material || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Product Title & Brand */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 break-words leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center">
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
                    ₨ {finalPrice.toLocaleString()}
                  </span>
                  {product.sale?.percentage > 0 && (
                    <>
                      <span className="text-base sm:text-lg lg:text-xl text-gray-500 line-through">
                        ₨ {product.price.toLocaleString()}
                      </span>
                      <span className="bg-gray-100 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {product.sale.percentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-lg sm:text-base lg:text-lg text-gray-600 break-words">
                {product.brand}
              </p>
            </div>
            <div className="md:hidden block">
              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Gender:
                    </span>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {product.gender || "N/A"}
                    </p>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Category:
                    </span>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    Material:
                  </span>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {product.material || "N/A"}
                  </p>
                </div>
              </div>

              {/* Size Selection */}
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
                  <span className="text-gray-400 italic text-sm sm:text-base">
                    No colors available
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4 sm:mb-6" ref={sizeSectionRef}>
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
                  <span className="text-gray-400 italic text-sm sm:text-base">
                    No sizes available
                  </span>
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
                <span className="text-base sm:text-lg font-semibold">
                  Total:
                </span>
                <span className="text-xl sm:text-2xl font-bold text-black">
                  ₨{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-black text-white rounded-sm font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors"
              >
                Place Order Now
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-sm font-semibold hover:bg-gray-50 transition-colors text-base sm:text-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="pb-16">
           <h1 className="text-center underline underline-offset-4 pt-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4 sm:px-6 lg:px-8 bg-white">
            Details
           </h1>
           {/* Description and Dimensions Section */}
        <div className="bg-white rounded-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Description */}
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Product Description
              </h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg whitespace-pre-line">
                  {getDescriptionDisplay()}
                </div>
                {getDescriptionButton()}
              </div>
            </div>

            {/* Right Side - Dimensions Table */}
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-4">
                Size Dimensions
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Height (Inches)
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Width (Inches)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {product.sizes &&
                    product.sizes.length > 0 &&
                    product.dimensions &&
                    Object.keys(product.dimensions).length > 0
                      ? Object.entries(product.dimensions).map(
                          ([size, dim]) => (
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
                          )
                        )
                      : [1, 2, 3].map((row) => (
                          <tr key={row}>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-400">
                              -
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-gray-400">
                              -
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-gray-400">
                              -
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
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
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          address: "",
          city: "",
          zipCode: "",
          items: [
            {
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
              productImage:
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "",
            },
          ],
          totalItems: 1,
          totalQuantity: quantity,
          totalAmount: totalPrice,
          orderDate: new Date().toISOString(),
        }}
      />
    </div>
  );
}
