"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i._id === item._id &&
          i.size === item.size &&
          i.color === item.color
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + item.quantity,
        };
        return updated;
      } else {
        return [...prev, { ...item, quantity: item.quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((item) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i._id === item._id &&
            i.size === item.size &&
            i.color === item.color
          )
      )
    );
  }, []);

  const updateQuantity = useCallback((item, quantity) => {
    if (quantity <= 0) {
      removeFromCart(item);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i._id === item._id && i.size === item.size && i.color === item.color
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, []);

  const cartCount = cart.length;
  const totalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalQuantity,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}