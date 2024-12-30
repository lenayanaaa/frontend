import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateOrder = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("Pending");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(`http://localhost:8800/orders/${id}`);
      setStatus(res.data.status);
    };
    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    await axios.put(`http://localhost:8800/orders/${id}`, { status });
    navigate("/orders");
  };

  return (
    <div>
      <h1>Update Order Status</h1>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </label>
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
};

export default UpdateOrder;
