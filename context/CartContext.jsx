import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from AsyncStorage when the app starts
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedCartItems = await AsyncStorage.getItem("@shoppy_cart_items");
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  // Save cart items to AsyncStorage whenever they change
  const saveCartItems = async (items) => {
    setCartItems(items);
    try {
      await AsyncStorage.setItem("@shoppy_cart_items", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    const unitPrice = product.priceInINR || Math.round((product.price || 10) * 85);
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);

    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
    } else {
      updated = [
        ...cartItems,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          category: product.category,
          price: unitPrice,
          quantity,
        },
      ];
    }
    saveCartItems(updated);
  };

  // Update quantity (+1 / -1)
  const updateQuantity = (productId, delta) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCartItems(updated);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    saveCartItems(updated);
  };

  // Clear cart
  const clearCart = () => {
    saveCartItems([]);
  };

  // Get total number of items in cart
  const getItemsCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Get total price of items in cart
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemsCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
