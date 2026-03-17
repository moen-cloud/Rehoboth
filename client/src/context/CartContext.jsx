import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Get cart key specific to logged in user
  const getCartKey = (userId) => userId ? `cartItems_${userId}` : null;

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      const key = getCartKey(user._id);
      const items = localStorage.getItem(key);
      setCartItems(items ? JSON.parse(items) : []);
    } else {
      // Clear cart from state when logged out
      setCartItems([]);
    }
  }, [user]);

  // Save cart to localStorage only when user is logged in
  useEffect(() => {
    if (user) {
      const key = getCartKey(user._id);
      localStorage.setItem(key, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product) => {
    if (!user) return;
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...x, quantity: x.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((x) => (x._id === id ? { ...x, quantity } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(getCartKey(user._id));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};