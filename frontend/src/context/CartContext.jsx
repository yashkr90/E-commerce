import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (user) {
      cartAPI.getCart(user.id).then(res => setCart(res.data)).catch(() => {});
    } else {
      setCart(null);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return;
    const res = await cartAPI.addItem(user.id, { productId, quantity });
    setCart(res.data);
  };

  const updateItem = async (itemId, quantity) => {
    if (!user) return;
    const res = await cartAPI.updateItem(user.id, itemId, { productId: itemId, quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    if (!user) return;
    const res = await cartAPI.removeItem(user.id, itemId);
    setCart(res.data);
  };

  const refreshCart = async () => {
    if (!user) return;
    const res = await cartAPI.getCart(user.id);
    setCart(res.data);
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
