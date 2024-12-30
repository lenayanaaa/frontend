import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteUser = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:8800/users/1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted!");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Delete Account</h1>
      <button onClick={handleDelete}>Delete My Account</button>
    </div>
  );
};

export default DeleteUser;
