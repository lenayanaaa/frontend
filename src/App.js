import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Products from "./pages/Products";
import Add from "./pages/AddProduct";
import Update from "./pages/UpdateProduct";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import RegisterUser from "./pages/RegisterUser";
import LoginUser from "./pages/LoginUser";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

function App() {
  const token = localStorage.getItem("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const res = await axios.get("http://localhost:8800/users/me", {
            headers: {
              Authorization: token,
            },
          });
          setUserInfo(res.data);
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      };
      fetchUserInfo();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8800/products/search?name=${searchQuery}`);
      setSearchResult(res.data.length > 0 ? res.data : null);
    } catch (err) {
      console.error("Error searching for product:", err);
      setSearchResult(null);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <h1>Calye Sinco</h1>

          <div className="nav-tabs">
            <a href="/">Home</a>
            <a href="/">Shop</a>
            <a href="/orders">Orders</a>
            <a href="/contact">Contact</a>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </i>
          </div>

          <div className="user-icons">
            <i className="fas fa-heart" onClick={() => (window.location.href = "/wishlist")}></i>
            <i
              className="fas fa-shopping-cart"
              onClick={() => (window.location.href = "/cart")}
            ></i>

            <div className="profile-container">
              <i
                className="fas fa-user-circle profile-icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              ></i>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  {!token ? (
                    <>
                      <button
                        className="profile-dropdown-btn"
                        onClick={() => (window.location.href = "/login")}
                      >
                        <i className="fas fa-sign-in-alt"></i> Login
                      </button>
                      <button
                        className="profile-dropdown-btn"
                        onClick={() => (window.location.href = "/register")}
                      >
                        <i className="fas fa-user-plus"></i> Register
                      </button>
                    </>
                  ) : (
                    <>
                      {userInfo && (
                        <div className="profile-info">
                          <p>
                            <strong>User Info:</strong>
                          </p>
                          <p>Name: {userInfo.name}</p>
                          <p>Email: {userInfo.email}</p>
                          <p>Role: {userInfo.role || "Customer"}</p>
                        </div>
                      )}
                      <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={<Products searchResult={searchResult} />}
          />
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
