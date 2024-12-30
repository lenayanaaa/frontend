import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(`http://localhost:8800/orders/${id}`);
      setOrder(res.data);
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{order.orderID}</h1>
      <p>User ID: {order.userID}</p>
      <p>Status: {order.status}</p>
      <p>Total: ${order.totalAmount}</p>
      <p>Shipping Address: {order.shippingAddress}</p>
      <h2>Items:</h2>
      <ul>
        {JSON.parse(order.items).map((item, index) => (
          <li key={index}>
            Product ID: {item.productID}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
