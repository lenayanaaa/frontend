import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    images: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, images: [e.target.value] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8800/products", product);
    navigate("/");
  };

  return (
    <div >
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
        <input type="number" name="price" placeholder="Price" onChange={handleChange} />
        <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />
        <input type="text" name="images" placeholder="Image URL" onChange={handleImageChange} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
