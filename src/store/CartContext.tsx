'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartAction } from '@/types';

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateTotals(items: CartItem[]) {
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.product.id
      );
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === action.payload.product.id
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      return { items: newItems, ...calculateTotals(newItems) };
    }
    case 'REMOVE_ITEM':
      newItems = state.items.filter((i) => i.product.id !== action.payload);
      return { items: newItems, ...calculateTotals(newItems) };
    case 'UPDATE_QUANTITY':
      newItems = state.items.map((i) =>
        i.product.id === action.payload.productId
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i
      );
      return { items: newItems, ...calculateTotals(newItems) };
    case 'CLEAR_CART':
      return { items: [], itemCount: 0, subtotal: 0 };
    default:
      return state;
  }
}

function getInitialState(): CartState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jubilee-cart');
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[];
        return { items, ...calculateTotals(items) };
      } catch {}
    }
  }
  return { items: [], itemCount: 0, subtotal: 0 };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem('jubilee-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
