"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    setCart(stored ? JSON.parse(stored) : []);
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i._id === item._id &&
          i.size === item.size &&
          (item.color ? i.color === item.color : true)
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
    setCart((prev) => {
      // Remove by _id, size, and color if present, else fallback to _id and size
      let removed = false;
      const filtered = prev.filter((i) => {
        if (!removed && i._id === item._id && i.size === item.size && (item.color ? i.color === item.color : true)) {
          removed = true;
          return false;
        }
        // Fallback: if color is not present in either, match only _id and size
        if (!removed && i._id === item._id && i.size === item.size && (!i.color && !item.color)) {
          removed = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
  }, []);
  const updateQuantity = useCallback((item, quantity) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === item._id && i.size === item.size && (item.color ? i.color === item.color : true)
          ? { ...i, quantity }
          : i
      )
    );
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
        cartCount,
        totalQuantity,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}