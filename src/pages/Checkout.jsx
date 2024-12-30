import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the passed product from the location state
  const [cartItems, setCartItems] = useState(location.state ? [location.state.product] : []);
  const [address, setAddress] = useState({ street: '', city: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const token = localStorage.getItem('token'); // Get token for authentication

  // Calculate the total amount based on cart items
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cartItems]);

  // Update quantity for a product
  const handleQuantityChange = (productId, increment) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + increment) } // Prevent quantity from going below 1
          : item
      )
    );
  };

  // Handle Delete Item
  const handleDeleteItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId)); // Remove item from the cart
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitOrder = async () => {
    if (!address.street || !address.city || !address.postalCode || !paymentMethod) {
      alert('Please fill in all the details');
      return;
    }

    // Prepare order data to send to the backend
    const orderData = {
      items: cartItems, // The items in the cart
      totalAmount,
      shippingAddress: `${address.street}, ${address.city}, ${address.postalCode}`,
      paymentMethod,
      userID: JSON.parse(atob(token.split('.')[1])).userID, // Assuming the user ID is in the JWT token
    };

    try {
      const response = await axios.post('http://localhost:8800/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      console.log('Order placed successfully', response.data);
      // Redirect user to the order confirmation page or orders page
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again later.');
    }
  };

  return (
    <div className="checkout-container" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      
      {/* Cart Items List */}
      <div className="cart-summary">
        <h3>Your Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p>{item.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Quantity Adjustment Buttons */}
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <p style={{ margin: '0 10px' }}>Quantity: {item.quantity}</p>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                </div>
                <div>
                  <p>Price: ${item.price}</p>
                  <p>Total: ${item.price * item.quantity}</p>
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteItem(item.id)} 
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Address Form */}
      <div className="address-form">
        <h3>Shipping Address</h3>
        <form>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            placeholder="Street Address"
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
          />
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            placeholder="City"
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
          />
          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={handleAddressChange}
            placeholder="Postal Code"
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
          />
        </form>
      </div>

      {/* Payment Method */}
      <div className="payment-method">
        <h3>Payment Method</h3>
        <select value={paymentMethod} onChange={handlePaymentChange} style={{ padding: '8px', width: '100%' }}>
          <option value="">Select Payment Method</option>
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="cashOnDelivery">Cash on Delivery</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="order-summary" style={{ marginTop: '20px' }}>
        <h3>Order Summary</h3>
        <div>
          <p><strong>Total Amount:</strong> ${totalAmount}</p>
        </div>
      </div>

      {/* Submit Order Button */}
      <div className="submit-order">
        <button
          onClick={handleSubmitOrder}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
