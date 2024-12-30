import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    images: [], // Initialize as an empty array
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/products/${id}`);
        const fetchedProduct = res.data;

        // Parse `images` field to ensure it is an array
        let imagesArray = [];
        if (fetchedProduct.images) {
          try {
            imagesArray = JSON.parse(fetchedProduct.images); // Attempt to parse JSON
          } catch (e) {
            console.warn("Images field is not valid JSON. Treating as string.");
            imagesArray = typeof fetchedProduct.images === "string" 
              ? [fetchedProduct.images] 
              : [];
          }
        }

        setProduct({ ...fetchedProduct, images: imagesArray });
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const updatedImages = e.target.value.split(",").map((img) => img.trim()); // Split and trim input
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/products/${id}`, {
        ...product,
        images: JSON.stringify(product.images), // Convert images array to JSON string
      });
      navigate("/"); // Redirect to product list after update
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div>
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={product.title}
          placeholder="Title"
          onChange={handleChange}
        />
        <textarea
          name="description"
          value={product.description}
          placeholder="Description"
          onChange={handleChange}
        ></textarea>
        <input
          type="number"
          name="price"
          value={product.price}
          placeholder="Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          placeholder="Quantity"
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          value={product.category}
          placeholder="Category"
          onChange={handleChange}
        />
        <input
          type="text"
          name="images"
          value={product.images.join(", ")} // Join array to display as comma-separated string
          placeholder="Image URLs (comma-separated)"
          onChange={handleImageChange}
        />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
