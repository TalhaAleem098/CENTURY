"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const CheckoutModal = dynamic(() => import("../product/[id]/CheckoutModal"), { ssr: false });
const OrderConfirmationModal = dynamic(() => import("../product/[id]/OrderConfirmationModal"), { ssr: false });
import { FaShoppingCart } from "react-icons/fa";

const CartPage = () => {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [cartEntries, setCartEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");

  useEffect(() => {
    setLoading(false);
  }, [cart]);
  useEffect(() => {
    if (!cart || cart.length === 0) {
      setProducts([]);
      setCartEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ids = cart.map((item) => item._id).join(",");
    fetch(`/api/cart-products?ids=${ids}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          toast(`Error: ${data.error || res.status}`);
          setProducts([]);
        } else {
          setProducts(data.products || []);
          // Map cart items to entries for display
          const entries = cart.map((item) => {
            const product = data.products.find((p) => p._id === item._id);
            const availableColors = product?.color?.split(",").map(c => c.trim()).filter(Boolean) || [];
            const availableSizes = product?.sizes?.filter(Boolean) || [];
            return {
              _id: item._id,
              size: item.size || (availableSizes[0] || ""),
              quantity: item.quantity || 1,
              color: item.color || (availableColors[0] || ""),
            };
          });
          setCartEntries(entries);
        }
      })
      .catch((err) => {
        toast("Failed to fetch cart products");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cart]);

  const handleAddEntry = (_id, currentIndex) => {
    const product = products.find(p => p._id === _id);
    const availableColors = product?.color?.split(",").map(c => c.trim()).filter(Boolean) || [];
    const availableSizes = product?.sizes?.filter(Boolean) || [];
    const defaultColor = availableColors.length > 0 ? availableColors[0] : "";
    const defaultSize = availableSizes.length > 0 ? availableSizes[0] : "";
    setCartEntries((prev) => {
      const newEntry = { _id, size: defaultSize, quantity: 1, color: defaultColor };
      const newEntries = [...prev];
      newEntries.splice(currentIndex + 1, 0, newEntry);
      return newEntries;
    });
  };

  const handleEntryChange = (idx, field, value) => {
    setCartEntries((prev) =>
      prev.map((entry, i) => {
        if (i === idx) {
          const product = products.find(p => p._id === entry._id);
          if (field === 'color') {
            const availableColors = product?.color?.split(",").map(c => c.trim()).filter(Boolean) || [];
            const validColor = availableColors.includes(value) ? value : (availableColors[0] || "");
            return { ...entry, color: validColor };
          } else if (field === 'size') {
            const availableSizes = product?.sizes?.filter(Boolean) || [];
            const validSize = availableSizes.includes(value) ? value : (availableSizes[0] || "");
            return { ...entry, size: validSize };
          }
          return { ...entry, [field]: value };
        }
        return entry;
      })
    );
  };

  const handleRemoveEntry = (idx) => {
    setCartEntries((prev) => {
      const newEntries = prev.filter((_, i) => i !== idx);
      return newEntries;
    });
  };

  const updateLocalStorageCart = (entries) => {
    if (typeof window !== "undefined") {
      // Group entries by product ID and create cart structure
      const cartItems = {};
      
      entries.forEach(entry => {
        if (!cartItems[entry.id]) {
          cartItems[entry.id] = {
            id: entry.id,
            sizes: {}
          };
        }
        
        // Add size and quantity to the product
        if (entry.size) {
          cartItems[entry.id].sizes[entry.size] = (cartItems[entry.id].sizes[entry.size] || 0) + entry.quantity;
        }
      });
      
      // Convert to array format
      const cartArray = Object.values(cartItems).map(item => ({
        id: item.id,
        sizes: item.sizes
      }));
      
      localStorage.setItem("cart", JSON.stringify(cartArray));
    }
  };

  const handleClearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      setCart([]);
      setCartEntries([]);
      setProducts([]);
      toast("Cart cleared successfully!");
    }
  };

  const handlePlaceOrder = () => {
    // Validate that all items have size and color selected
    const invalidItems = cartEntries.filter(entry => !entry.size || !entry.color);
    if (invalidItems.length > 0) {
      const invalidProductNames = invalidItems.map(entry => {
        const product = products.find(p => p._id === entry._id);
        return product?.name || 'Unknown Product';
      });
      toast(`Please select size and color for: ${invalidProductNames.join(', ')}`);
      return;
    }
    setShowCheckoutModal(true);
  };

  // Called when checkout is successful
  const handleCheckoutSuccess = (email) => {
    // Reset cart state and localStorage immediately after order is placed
    setCart(null); // Set to null for full reset
    setCartEntries([]);
    setProducts([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    setShowCheckoutModal(false);
    setConfirmedEmail(email);
    setShowConfirmationModal(true);
  };

  // Called when confirmation modal closes
  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    // Give a short delay for modal close animation, then reload
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  const tshirtProducts = products.filter((p) => p.category === "TShirt");

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full px-4 pt-8 pb-4 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2 leading-tight" style={{letterSpacing: '-0.02em'}}>
          <span className="inline-block align-middle mr-2">
            <FaShoppingCart className="inline-block text-black text-2xl sm:text-3xl md:text-4xl align-middle mb-1" />
          </span>
          Your Cart
        </h1>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-2 font-medium leading-relaxed">
          All your selected T-Shirts are listed below. You can add, remove, or adjust sizes and quantities for each product. Checkout is just a tap away!
        </p>
       
      </header>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Loading your cart...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch your items
            </p>
          </div>
        ) : cartEntries.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingCart className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500">Add some T-Shirts to get started!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 mb-8 w-full mx-auto">
              {cartEntries.map((entry, idx) => {
                const product = products.find((p) => p._id === entry._id);
                if (!product) return null;

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-sm border-2 border-black shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300 w-full`}
                  >
                    <button 
                      onClick={() => handleAddEntry(product._id, idx)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-black text-white rounded-sm px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-bold hover:bg-gray-800 transition-colors shadow-lg"
                      title={`Add another ${product.name}`}
                    >
                      Duplicate
                    </button>

                    <div className="grid grid-cols-3 h-full transform transition-all duration-300 ease-in-out">
                      <div className="col-span-1 bg-gray-100 flex items-center justify-center p-2 sm:p-4 relative">
                        {product.sale && product.sale.percentage && (
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 bg-red-500 text-white px-1 py-0.5 rounded-sm text-xs font-bold shadow-lg">
                            -{product.sale.percentage}%
                          </div>
                        )}
                        <Image
                          src={product.images?.[0]?.url || product.image}
                          alt={product.name}
                          width={520}
                          height={550}
                          className="w-full h-auto object-cover rounded-sm border border-black"
                          style={{ minHeight: "120px", maxHeight: "180px" }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="col-span-2 p-2 sm:p-4 flex flex-col justify-between">
                        <div className="pr-6 sm:pr-8">
                          <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 truncate" title={product.name}>
                            {product.name}
                          </h3>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-2 sm:mb-3">
                          {product.sale && product.sale.percentage ? (
                            <div className="text-red-600 font-medium">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="line-through text-gray-500 text-xs sm:text-sm">
                                  Rs. {product.price}
                                </span>
                                <span className="font-bold text-sm sm:text-base lg:text-lg text-red-600">
                                  Rs.{" "}
                                  {Math.round(
                                    product.price *
                                      (1 - product.sale.percentage / 100)
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 hidden sm:block">
                                You save Rs.{" "}
                                {product.price -
                                  Math.round(
                                    product.price *
                                      (1 - product.sale.percentage / 100)
                                  )}
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                              Rs. {product.price}
                            </div>
                          )}
                        </div>
                        
                        {/* Color Selection Row */}
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                          <label className="font-medium text-gray-700 text-xs min-w-fit">
                            Color:
                          </label>
                          <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: "thin" }}>
                            {product.color?.split(",").map((color) => (
                              <button
                                key={color.trim()}
                                onClick={() =>
                                  handleEntryChange(
                                    idx,
                                    "color",
                                    color.trim()
                                  )
                                }
                                className={`px-1.5 sm:px-2 lg:px-3 py-1 rounded border-2 font-medium text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                                  entry.color === color.trim()
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-black hover:bg-gray-100"
                                }`}
                              >
                                {color.trim()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Size Selection Row */}
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                          <label className="font-medium text-gray-700 text-xs min-w-fit">
                            Size:
                          </label>
                          <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: "thin" }}>
                            {product.sizes?.map((size) => (
                              <button
                                key={size}
                                onClick={() =>
                                  handleEntryChange(idx, "size", size)
                                }
                                className={`px-1.5 sm:px-2 lg:px-3 py-1 rounded border-2 font-medium text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                                  entry.size === size
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-black hover:bg-gray-100"
                                }`}
                              >
                                {size.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity and Remove Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <label className="font-medium text-gray-700 text-xs">
                              Qty:
                            </label>
                            <div className="flex items-center border-2 border-black rounded">
                              <button
                                onClick={() =>
                                  handleEntryChange(
                                    idx,
                                    "quantity",
                                    Math.max(1, entry.quantity - 1)
                                  )
                                }
                                className="px-1.5 sm:px-2 lg:px-3 py-1 hover:bg-gray-100 font-bold text-xs"
                                disabled={entry.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-1.5 sm:px-2 lg:px-3 py-1 font-medium min-w-[25px] sm:min-w-[30px] lg:min-w-[40px] text-center text-xs">
                                {entry.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleEntryChange(
                                    idx,
                                    "quantity",
                                    Math.min(
                                      entry.quantity + 1,
                                      product.stock || 10
                                    )
                                  )
                                }
                                className="px-1.5 sm:px-2 lg:px-3 py-1 hover:bg-gray-100 font-bold text-xs"
                                disabled={
                                  entry.quantity >= (product.stock || 10)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveEntry(idx)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs border border-red-600 hover:border-red-800 rounded px-2 sm:px-3 lg:px-4 py-1 lg:py-2 transition-all duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Bill Section */}
            <div className="bg-white rounded-sm shadow-lg p-4 sm:p-6 sm:max-w-md w-full mx-auto mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              {/* Calculate subtotal and delivery charges */}
              {(() => {
                const subtotal = cartEntries.reduce((sum, entry) => {
                  const product = products.find(p => p._id === entry._id);
                  const salePrice = product?.sale?.percentage 
                    ? Math.round(product.price * (1 - product.sale.percentage / 100))
                    : product?.price || 0;
                  return sum + (salePrice * entry.quantity);
                }, 0);
                const deliveryCharges = subtotal > 0 && subtotal < 4999 ? 250 : 0;
                const total = subtotal + deliveryCharges;
                const youSave = cartEntries.reduce((sum, entry) => {
                  const product = products.find(p => p._id === entry._id);
                  if (product?.sale?.percentage) {
                    const originalPrice = product.price * entry.quantity;
                    const salePrice = Math.round(product.price * (1 - product.sale.percentage / 100)) * entry.quantity;
                    return sum + (originalPrice - salePrice);
                  }
                  return sum;
                }, 0);
                return (
                  <>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Items ({cartEntries.length})</span>
                        <span>{cartEntries.reduce((sum, entry) => sum + entry.quantity, 0)} pieces</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      {deliveryCharges > 0 ? (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Delivery Charges</span>
                          <span>Rs. {deliveryCharges.toLocaleString()}</span>
                        </div>
                      ) : subtotal >= 4999 && subtotal > 0 ? (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Delivery</span>
                          <span>FREE</span>
                        </div>
                      ) : null}
                      {youSave > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>You Save</span>
                          <span>Rs. {youSave.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Place Order Button */}
            <div className="text-center max-w-md mx-auto">
              <button 
                onClick={handlePlaceOrder}
                className="bg-black text-white font-semibold text-base px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full shadow-lg"
              >
                Place Order ({cartEntries.length} item{cartEntries.length > 1 ? "s" : ""})
              </button>
            </div>
          </>
        )}
      </div>


      {/* New Checkout Modal usage */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderData={(() => {
          const subtotal = cartEntries.reduce((sum, entry) => {
            const product = products.find(p => p._id === entry._id);
            const salePrice = product?.sale?.percentage 
              ? Math.round(product.price * (1 - product.sale.percentage / 100))
              : product?.price || 0;
            return sum + (salePrice * entry.quantity);
          }, 0);
          const deliveryCharges = subtotal > 0 && subtotal < 4999 ? 250 : 0;
          const total = subtotal + deliveryCharges;
          return {
            items: cartEntries.map(entry => {
              const product = products.find(p => p._id === entry._id);
              const salePrice = product?.sale?.percentage 
                ? Math.round(product.price * (1 - product.sale.percentage / 100))
                : product?.price || 0;
              return {
                productId: entry._id,
                productName: product?.name || 'Unknown Product',
                selectedSize: entry.size || 'Not Selected',
                selectedColor: entry.color || 'Not Selected',
                quantity: entry.quantity,
                originalPrice: product?.price || 0,
                salePercentage: product?.sale?.percentage || 0,
                finalPrice: salePrice,
                totalPrice: salePrice * entry.quantity,
                category: product?.category || 'Unknown',
                brand: product?.brand || 'Unknown',
                material: product?.material || 'Unknown'
              };
            }),
            totalItems: cartEntries.length,
            totalQuantity: cartEntries.reduce((sum, entry) => sum + entry.quantity, 0),
            subtotal,
            deliveryCharges,
            totalAmount: total,
            orderDate: new Date().toISOString()
          };
        })()}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Confirmation Modal, shown after successful checkout */}
      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmationClose}
        email={confirmedEmail}
      />

    </div>
  );
};

export default CartPage;
