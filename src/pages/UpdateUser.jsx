import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const [user, setUser] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8800/users/1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8800/users/1", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={user.address}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateUser;
