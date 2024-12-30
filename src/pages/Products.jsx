import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Products = ({ searchResult }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    price: "",
    rating: "",
    category: "",
  });
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.role === "Admin") {
        setIsAdmin(true);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!searchResult) {
      const fetchProducts = async () => {
        const res = await axios.get("http://localhost:8800/products");
        setProducts(res.data);
        setFilteredProducts(res.data);

        const uniqueCategories = [...new Set(res.data.map((product) => product.category))];
        setCategories(uniqueCategories);
      };
      fetchProducts();
    }
  }, [searchResult]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8800/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
    } else {
      try {
         await axios.post(
      "http://localhost:8800/cart", 
      { productID: product.id, quantity: 1 },  // Pass the correct body
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Ensure token is set in header
        },
      }
        );
        
        alert(`${product.title} has been added to your cart.`);
      } catch (err) {
        console.log(token); 
        console.error("Error adding product to cart:", err);
      }
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
    } else {
      try {
        await axios.post(
          "http://localhost:8800/wishlist",
          { productId: product.id }
        );
        alert(`${product.title} has been added to your wishlist.`);
      } catch (err) {
        console.error("Error adding product to wishlist:", err);
      }
    }
  };

  const handleBuyNow = (product) => {
    if (!token) {
      alert("You need to log in first.");
      navigate("/login");
    } else {
      navigate("/checkout", { state: { product } });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    let updatedProducts = products;

    if (filters.price) {
      updatedProducts = updatedProducts.filter((product) => product.price <= parseFloat(filters.price));
    }

    if (filters.rating) {
      updatedProducts = updatedProducts.filter((product) => product.rating >= parseFloat(filters.rating));
    }

    if (filters.category) {
      updatedProducts = updatedProducts.filter((product) => product.category === filters.category);
    }

    setFilteredProducts(updatedProducts);
  };

  const displayProducts = searchResult || filteredProducts;

  return (
    <div>
      <h1>Products</h1>
      {!searchResult && (
        <div className="filters">
          <h3>Filter Products</h3>
          <label>
            Price (up to):
            <input type="number" name="price" value={filters.price} onChange={handleFilterChange} />
          </label>
          <label>
            Rating (minimum):
            <input type="number" step="0.1" name="rating" value={filters.rating} onChange={handleFilterChange} />
          </label>
          <label>
            Category:
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {isAdmin && (
        <Link to="/add">
          <button>
            <i className="fas fa-plus"></i> Add Product
          </button>
        </Link>
      )}

      <div className="product-list">
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.title}</h2>
              <img src={JSON.parse(product.images)[0]} alt={product.title} />
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>

              {isAdmin ? (
                <>
                  <Link to={`/update/${product.id}`}>
                    <button>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(product.id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </>
              ) : (
                <>
                  <i onClick={() => handleAddToWishlist(product)}>
                    <i className="fas fa-heart"></i>
                  </i>
                  <button onClick={() => handleAddToCart(product)}>
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                  <button onClick={() => handleBuyNow(product)}>
                    <i className="fas fa-bolt"></i> Buy Now
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
