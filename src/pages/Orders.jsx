import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token"); // Get the token for authentication

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8800/orders", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (err.response && err.response.status === 403) {
          alert("You do not have permission to view this resource. Please log in or contact support.");
        }
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div>
      <h1>Orders</h1>
      <Link to="/products">
        <button>Place New Order</button>
      </Link>
      <ul>
        {orders.map((order) => (
          <li key={order.orderID}>
            <p>Order #{order.orderID}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount}</p>
            <p>Items: {JSON.parse(order.items).length} products</p>
            <p>Shipping Address: {order.shippingAddress}</p>
            <div className="order-actions">
              <Link to={`/update-order/${order.orderID}`}>
                <button>Update Status</button>
              </Link>
              <Link to={`/order-details/${order.orderID}`}>
                <button>View Details</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
