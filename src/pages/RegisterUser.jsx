import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    role: "Customer", // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/users/register", userData);
      alert(res.data.message);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      console.error("Error response: ", err.response);
      alert("Registration failed, please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        
        {/* Role Dropdown */}
        <select
          name="role"
          value={userData.role}
          onChange={handleChange}
        >
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
