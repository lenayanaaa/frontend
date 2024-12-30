import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]); // State for wishlist items
  const [loading, setLoading] = useState(true); // Loading indicator
  const navigate = useNavigate(); // Hook for navigation

  // Fetch wishlist items from the backend
  useEffect(() => {
    const fetchWishlistItems = async () => {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        setLoading(false); // Stop loading if no token
        return;
      }

      try {
        const response = await axios.get("http://localhost:8800/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.error("Access forbidden: You are not authorized to view the wishlist.");
        } else {
          console.error("Error fetching wishlist items:", error.message);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchWishlistItems();
  }, []);

  // Handle item deletion
  const handleDelete = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8800/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item from wishlist:", error.message);
    }
  };

  // Handle Buy Now action
  const handleBuyNow = (item) => {
    navigate("/checkout", { state: { product: item } });
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      {loading ? (
        <p>Loading...</p>
      ) : wishlistItems.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div>
          {wishlistItems.map((item) => (
            <div
              key={item.id}
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
                src={item.images?.[0] || "placeholder-image-url.jpg"} // Handle missing images gracefully
                alt={item.title}
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "15px",
                }}
              />
              <div style={{ flex: 1 }}>
                <p>{item.title}</p>
                <p>Price: ${item.price}</p>
              </div>
              <div>
                <button
                  onClick={() => handleBuyNow(item)}
                  style={{
                    padding: "8px 16px",
                    marginRight: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
