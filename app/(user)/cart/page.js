"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { FaShoppingCart } from "react-icons/fa";

// Use the CheckoutModal from the product folder, not the local one
const CheckoutModal = dynamic(() => import("../product/[id]/CheckoutModal"), {
  ssr: false,
});
const OrderConfirmationModal = dynamic(
  () => import("../product/[id]/OrderConfirmationModal"),
  { ssr: false }
);

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [removingItems, setRemovingItems] = useState(new Set());
  const [error, setError] = useState(null);
  const [fetchedProductIds, setFetchedProductIds] = useState(new Set());

  // Calculate visible cart items (excluding items being removed)
  const visibleCart = useMemo(() => {
    if (!cart || cart.length === 0) return [];
    return cart.filter(
      (cartItem) => {
        const cartKey = `${cartItem._id}-${cartItem.size}-${cartItem.color}`;
        return !removingItems.has(cartKey);
      }
    );
  }, [cart, removingItems]);

  // Get unique product IDs that need to be fetched
  const neededProductIds = useMemo(() => {
    if (!cart || cart.length === 0) return [];
    const uniqueIds = [...new Set(cart.map((item) => item._id))];
    return uniqueIds.filter(id => !fetchedProductIds.has(id));
  }, [cart, fetchedProductIds]);

  // Fetch only new products that haven't been fetched yet
  const fetchNewProducts = useCallback(async (productIds) => {
    if (!productIds || productIds.length === 0) return;

    try {
      const idsString = productIds.join(",");
      const response = await fetch(`/api/cart-products?ids=${idsString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const newProducts = data.products || [];
      
      // Add new products to existing products (merge, don't replace)
      setProducts(prevProducts => {
        const existingIds = new Set(prevProducts.map(p => p._id));
        const productsToAdd = newProducts.filter(p => !existingIds.has(p._id));
        return [...prevProducts, ...productsToAdd];
      });

      // Mark these product IDs as fetched
      setFetchedProductIds(prev => new Set([...prev, ...productIds]));
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch cart products';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Initial fetch and handle new products
  useEffect(() => {
    const fetchProducts = async () => {
      if (neededProductIds.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      await fetchNewProducts(neededProductIds);
      setLoading(false);
    };

    fetchProducts();
  }, [neededProductIds, fetchNewProducts]);

  // Clean up products that are no longer in cart
  useEffect(() => {
    if (!cart || cart.length === 0) {
      setProducts([]);
      setFetchedProductIds(new Set());
      return;
    }

    const currentProductIds = new Set(cart.map(item => item._id));
    
    // Remove products that are no longer in cart
    setProducts(prevProducts => 
      prevProducts.filter(product => currentProductIds.has(product._id))
    );
    
    // Update fetched product IDs
    setFetchedProductIds(prev => 
      new Set([...prev].filter(id => currentProductIds.has(id)))
    );
  }, [cart]);

  // Calculate order summary
  const orderSummary = useMemo(() => {
    if (!visibleCart.length || !products.length) {
      return {
        subtotal: 0,
        deliveryCharges: 0,
        total: 0,
        totalItems: 0,
        totalQuantity: 0,
        youSave: 0,
      };
    }

    const calculations = visibleCart.reduce((acc, cartItem) => {
      const product = products.find((p) => p._id === cartItem._id);
      if (!product) return acc;

      const originalPrice = product.price || 0;
      const salePrice = product.sale?.percentage
        ? Math.round(originalPrice * (1 - product.sale.percentage / 100))
        : originalPrice;
      
      const itemTotal = salePrice * cartItem.quantity;
      const savedAmount = product.sale?.percentage
        ? (originalPrice - salePrice) * cartItem.quantity
        : 0;

      return {
        subtotal: acc.subtotal + itemTotal,
        youSave: acc.youSave + savedAmount,
        totalQuantity: acc.totalQuantity + cartItem.quantity,
      };
    }, { subtotal: 0, youSave: 0, totalQuantity: 0 });

    const deliveryCharges = calculations.subtotal > 0 && calculations.subtotal < 4999 ? 250 : 0;
    const total = calculations.subtotal + deliveryCharges;

    return {
      ...calculations,
      deliveryCharges,
      total,
      totalItems: visibleCart.length,
    };
  }, [visibleCart, products]);

  // Handle quantity change with optimistic updates
  const handleQuantityChange = useCallback((cartItem, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItem);
      return;
    }
    
    updateQuantity(cartItem, newQuantity);
    toast.success("Quantity updated");
  }, [updateQuantity]);

  // Handle remove item with smooth animation
  const handleRemoveItem = useCallback((cartItem) => {
    const cartKey = `${cartItem._id}-${cartItem.size}-${cartItem.color}`;
    
    // Add item to removing set for immediate UI update
    setRemovingItems(prev => new Set([...prev, cartKey]));
    
    // Remove from cart after animation
    setTimeout(() => {
      removeFromCart(cartItem);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartKey);
        return newSet;
      });
    }, 300); // Match this with CSS animation duration
    
    toast.success("Item removed from cart");
  }, [removeFromCart]);

  // Handle clear cart
  const handleClearCart = useCallback(() => {
    // Mark all items as removing for animation
    const allCartKeys = visibleCart.map(item => 
      `${item._id}-${item.size}-${item.color}`
    );
    setRemovingItems(new Set(allCartKeys));
    
    // Clear cart after animation
    setTimeout(() => {
      clearCart();
      setProducts([]);
      setFetchedProductIds(new Set());
      setRemovingItems(new Set());
    }, 300);
    
    toast.success("Cart cleared successfully!");
  }, [clearCart, visibleCart]);

  // Handle attribute change (size/color) with optimistic updates
  const handleAttributeChange = useCallback((cartItem, attribute, value) => {
    const oldCartKey = `${cartItem._id}-${cartItem.size}-${cartItem.color}`;
    const newCartItem = {
      ...cartItem,
      [attribute]: value,
    };
    
    // Mark old item as removing
    setRemovingItems(prev => new Set([...prev, oldCartKey]));
    
    // Remove old item and add new one
    removeFromCart(cartItem);
    addToCart(newCartItem);
    
    // Clean up removing state
    setTimeout(() => {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(oldCartKey);
        return newSet;
      });
    }, 100);
    
    toast.success(`${attribute} updated`);
  }, [removeFromCart, addToCart]);

  // Handle duplicate item
  const handleDuplicateItem = useCallback((product) => {
    const availableColors = product?.color
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean) || [];
    const availableSizes = product?.sizes?.filter(Boolean) || [];
    
    const defaultColor = availableColors.length > 0 ? availableColors[0] : "";
    const defaultSize = availableSizes.length > 0 ? availableSizes[0] : "";

    const newCartItem = {
      _id: product._id,
      name: product.name,
      price: product.sale?.percentage
        ? Math.round(product.price * (1 - product.sale.percentage / 100))
        : product.price,
      image: product.images?.[0]?.url || "",
      category: product.category,
      brand: product.brand,
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
    };

    addToCart(newCartItem);
    toast.success("Item duplicated successfully!");
  }, [addToCart]);

  // Handle place order
  const handlePlaceOrder = useCallback(() => {
    // Validate that all items have size and color selected
    const invalidItems = visibleCart.filter((item) => !item.size || !item.color);
    
    if (invalidItems.length > 0) {
      const invalidProductNames = invalidItems.map((item) => {
        const product = products.find((p) => p._id === item._id);
        return product?.name || "Unknown Product";
      });
      toast.error(`Please select size and color for: ${invalidProductNames.join(", ")}`);
      return;
    }

    if (visibleCart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setShowCheckoutModal(true);
  }, [visibleCart, products]);

  // Handle checkout success
  const handleCheckoutSuccess = useCallback((email) => {
    clearCart();
    setProducts([]);
    setFetchedProductIds(new Set());
    setRemovingItems(new Set());
    setShowCheckoutModal(false);
    setConfirmedEmail(email);
    setShowConfirmationModal(true);
    toast.success("Order placed successfully!");
  }, [clearCart]);

  // Handle confirmation close
  const handleConfirmationClose = useCallback(() => {
    setShowConfirmationModal(false);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }, []);

  // Prepare order data for checkout
  const orderData = useMemo(() => {
    return {
      items: visibleCart.map((cartItem) => {
        const product = products.find((p) => p._id === cartItem._id);
        const originalPrice = product?.price || 0;
        const salePrice = product?.sale?.percentage
          ? Math.round(originalPrice * (1 - product.sale.percentage / 100))
          : originalPrice;

        return {
          productId: cartItem._id,
          productName: product?.name || "Unknown Product",
          selectedSize: cartItem.size || "Not Selected",
          selectedColor: cartItem.color || "Not Selected",
          quantity: cartItem.quantity,
          originalPrice,
          salePercentage: product?.sale?.percentage || 0,
          finalPrice: salePrice,
          totalPrice: salePrice * cartItem.quantity,
          category: product?.category || "Unknown",
          brand: product?.brand || "Unknown",
          material: product?.material || "Unknown",
          productImage: product?.images?.[0]?.url || cartItem.image || "",
        };
      }),
      totalItems: orderSummary.totalItems,
      totalQuantity: orderSummary.totalQuantity,
      subtotal: orderSummary.subtotal,
      deliveryCharges: orderSummary.deliveryCharges,
      totalAmount: orderSummary.total,
      orderDate: new Date().toISOString(),
    };
  }, [visibleCart, products, orderSummary]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="w-full px-4 pt-8 pb-4 flex flex-col items-center text-center">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2 leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="inline-block align-middle mr-2">
            <FaShoppingCart className="inline-block text-black text-2xl sm:text-3xl md:text-4xl align-middle mb-1" />
          </span>
          Your Cart
        </h1>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-2 font-medium leading-relaxed">
          All your selected T-Shirts are listed below. You can add, remove, or
          adjust sizes and quantities for each product. Checkout is just a tap
          away!
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
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Error loading cart
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setFetchedProductIds(new Set());
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : visibleCart.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingCart className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500">Add some T-Shirts to get started!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 mb-8 w-full mx-auto">
              {visibleCart.map((cartItem) => {
                const product = products.find((p) => p._id === cartItem._id);
                const cartKey = `${cartItem._id}-${cartItem.size}-${cartItem.color}`;
                const isRemoving = removingItems.has(cartKey);
                
                if (!product) return null;

                return (
                  <div
                    key={cartKey}
                    className={`bg-white rounded-sm border-2 border-black shadow-lg overflow-hidden relative hover:shadow-xl transition-all duration-300 w-full ${
                      isRemoving ? 'opacity-0 scale-95 transform' : 'opacity-100 scale-100'
                    }`}
                    style={{
                      transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                      transform: isRemoving ? 'scale(0.95)' : 'scale(1)',
                    }}
                  >
                    <button
                      onClick={() => handleDuplicateItem(product)}
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
                          src={product.images?.[0]?.url || product.image || '/placeholder-image.jpg'}
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
                          <h3
                            className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 truncate"
                            title={product.name}
                          >
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
                          <div
                            className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{ scrollbarWidth: "thin" }}
                          >
                            {product.color?.split(",").map((color) => (
                              <button
                                key={color.trim()}
                                onClick={() => handleAttributeChange(cartItem, 'color', color.trim())}
                                className={`px-1.5 sm:px-2 lg:px-3 py-1 rounded border-2 font-medium text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                                  cartItem.color === color.trim()
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
                          <div
                            className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{ scrollbarWidth: "thin" }}
                          >
                            {product.sizes?.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleAttributeChange(cartItem, 'size', size)}
                                className={`px-1.5 sm:px-2 lg:px-3 py-1 rounded border-2 font-medium text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                                  cartItem.size === size
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
                                  handleQuantityChange(
                                    cartItem,
                                    cartItem.quantity - 1
                                  )
                                }
                                className="px-1.5 sm:px-2 lg:px-3 py-1 hover:bg-gray-100 font-bold text-xs"
                                disabled={cartItem.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-1.5 sm:px-2 lg:px-3 py-1 font-medium min-w-[25px] sm:min-w-[30px] lg:min-w-[40px] text-center text-xs">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    cartItem,
                                    cartItem.quantity + 1
                                  )
                                }
                                className="px-1.5 sm:px-2 lg:px-3 py-1 hover:bg-gray-100 font-bold text-xs"
                                disabled={
                                  cartItem.quantity >= (product.stock || 10)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(cartItem)}
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

            {/* Order Summary */}
            <div className="bg-white rounded-sm shadow-lg p-4 sm:p-6 sm:max-w-md w-full mx-auto mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items ({orderSummary.totalItems})</span>
                  <span>{orderSummary.totalQuantity} pieces</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {orderSummary.subtotal.toLocaleString()}</span>
                </div>
                {orderSummary.deliveryCharges > 0 ? (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charges</span>
                    <span>Rs. {orderSummary.deliveryCharges.toLocaleString()}</span>
                  </div>
                ) : orderSummary.subtotal >= 4999 && orderSummary.subtotal > 0 ? (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Delivery</span>
                    <span>FREE</span>
                  </div>
                ) : null}
                {orderSummary.youSave > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save</span>
                    <span>Rs. {orderSummary.youSave.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {orderSummary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center max-w-md mx-auto space-y-2">
              <button
                onClick={handlePlaceOrder}
                className="bg-black text-white font-semibold text-base px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full shadow-lg"
                disabled={visibleCart.length === 0}
              >
                Place Order ({visibleCart.length} item{visibleCart.length > 1 ? "s" : ""})
              </button>
              {visibleCart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-600 hover:border-red-800 rounded px-4 py-2 transition-all duration-200 w-full"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderData={orderData}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleConfirmationClose}
        email={confirmedEmail}
      />
    </div>
  );
};

export default CartPage;