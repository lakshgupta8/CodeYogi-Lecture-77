import { useState, useMemo, useCallback, useEffect } from "react";
import { getProduct, saveCart, getCart } from "../api";
import { CartContext } from "./CartContext";
import { useUser } from "./UserContext";

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});
  const [pendingQuantities, setPendingQuantities] = useState({});
  const [cartItemsData, setCartItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useUser();
  const token = isLoggedIn ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    if (isLoggedIn) {
      getCart(token)
        .then((data) => {
          setCartItems(data.cart || {});
        })
        .catch(() => {
          setCartItems({});
        });
    } else {
      const saved = localStorage.getItem("cartItems");
      setCartItems(saved ? JSON.parse(saved) : {});
    }
  }, [isLoggedIn, token]);

  const itemIds = useMemo(
    () => Object.keys(cartItems).filter((key) => cartItems[key] > 0),
    [cartItems]
  );

  const count = useMemo(
    () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0),
    [cartItems]
  );

  useEffect(() => {
    if (itemIds.length === 0) {
      setCartItemsData([]);
      setLoading(false);
      return;
    }

    Promise.allSettled(
      itemIds.map((id) =>
        getProduct(id).then((product) => ({
          ...product,
          quantity: cartItems[id],
        }))
      )
    )
      .then((results) => {
        const fulfilled = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        setCartItemsData(fulfilled);
      })
      .catch(() => {
        setCartItemsData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [itemIds, cartItems]);

  const displayCartItemsData = useMemo(() => {
    return cartItemsData.map((item) => ({
      ...item,
      quantity: pendingQuantities[item.id] ?? item.quantity,
    }));
  }, [cartItemsData, pendingQuantities]);

  const subtotal = useMemo(() => {
    return cartItemsData.reduce(
      (sum, item) => sum + item.price * (cartItems[item.id] ?? 0),
      0
    );
  }, [cartItemsData, cartItems]);

  const addToCart = useCallback(
    (productId, count = 1) => {
      setCartItems((prev) => {
        const current = prev[productId] || 0;
        const updated = { ...prev, [productId]: current + count };
        if (isLoggedIn) {
          saveCart(updated, token);
          localStorage.removeItem("cartItems");
        } else {
          localStorage.setItem("cartItems", JSON.stringify(updated));
        }
        return updated;
      });
    },
    [isLoggedIn, token]
  );

  const removeFromCart = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const updated = { ...prev, [productId]: 0 };
        if (isLoggedIn) {
          saveCart(updated, token);
          localStorage.removeItem("cartItems");
        } else {
          localStorage.setItem("cartItems", JSON.stringify(updated));
        }
        return updated;
      });
      setPendingQuantities((prev) => {
        const newPending = { ...prev };
        delete newPending[productId];
        return newPending;
      });
    },
    [isLoggedIn, token]
  );

  const updateQuantity = useCallback((productId, newQty) => {
    setPendingQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, newQty),
    }));
  }, []);

  const updateCart = useCallback(() => {
    const hasChanges = Object.entries(pendingQuantities).some(([id, qty]) => {
      const currentQty = cartItems[id] || 0;
      return currentQty !== qty;
    });

    if (!hasChanges) {
      setPendingQuantities({});
      return;
    }

    setLoading(true);
    setCartItems((prevCart) => {
      let hasChanges = false;
      const updatedCart = { ...prevCart };

      for (const [productId, newQty] of Object.entries(pendingQuantities)) {
        if (newQty <= 0) {
          if (productId in updatedCart) {
            delete updatedCart[productId];
            hasChanges = true;
          }
        } else if (updatedCart[productId] !== newQty) {
          updatedCart[productId] = newQty;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        if (isLoggedIn) {
          saveCart(updatedCart, token);
          localStorage.removeItem("cartItems");
        } else {
          localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        }
      }

      return hasChanges ? updatedCart : prevCart;
    });

    setPendingQuantities({});
  }, [pendingQuantities, token, isLoggedIn, cartItems]);

  const getItemSubtotal = useCallback((price, quantity) => {
    return price * Number(quantity);
  }, []);

  const resetPendingQuantities = useCallback(function () {
    setPendingQuantities({});
  }, []);

  const value = useMemo(
    () => ({
      cartItemsData: displayCartItemsData,
      loading,
      count,
      subtotal,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCart,
      getItemSubtotal,
      resetPendingQuantities,
    }),
    [
      displayCartItemsData,
      loading,
      count,
      subtotal,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCart,
      getItemSubtotal,
      resetPendingQuantities,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
