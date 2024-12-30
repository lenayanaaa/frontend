import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleDelete = async (itemId) => {
    setCartItems(cartItems.filter((item) => item.cartID !== itemId));
    localStorage.setItem("cart", JSON.stringify(cartItems.filter((item) => item.cartID !== itemId)));

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8800/cart/${itemId}`);
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const handleBuyNow = (item) => {
    navigate("/checkout", { state: { product: item } });
  };

  const handleQuantityChange = async (itemId, delta) => {
    const updatedCart = cartItems.map(item =>
      item.cartID === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const item = updatedCart.find(item => item.cartID === itemId);
      await axios.patch(
        `http://localhost:8800/cart/${itemId}`,
        { quantity: item.quantity }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.cartID || `${item.id}_${item.title}`}
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <img
                src={item.images[0]}
                alt={item.title}
                style={{ width: "50px", height: "50px", marginRight: "15px" }}
              />
              <div style={{ flex: 1 }}>
                <p>{item.title}</p>
                <p>Price: ${item.price}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => handleQuantityChange(item.cartID, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.cartID, 1)}>+</button>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <button onClick={() => handleBuyNow(item)}>Buy Now</button>
                <button onClick={() => handleDelete(item.cartID)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
