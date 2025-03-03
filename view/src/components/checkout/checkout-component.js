import React, { useState } from 'react';

import { useLocation,
  useNavigate
 } from 'react-router-dom';

import '../../styles/checkout/checkout.scss';


const CheckoutPage = () => {

  const navigate = useNavigate();

    // Sample cart data with product images
    const [cartItems, setCartItems] = useState([
      { 
        id: 1, 
        name: 'Premium Headphones', 
        price: 159.99, 
        quantity: 1, 
        image: '../images/market/products/watch.jpg' 
      },
      { 
        id: 2, 
        name: 'Smartphone Case', 
        price: 29.99, 
        quantity: 2, 
        image: '../images/market/products/watch.jpg' 
      },
      { 
        id: 3, 
        name: 'Wireless Charger', 
        price: 49.99, 
        quantity: 1, 
        image: '../images/market/products/watch.jpg' 
      },
    ]);
  
    // Shipping options
    const shippingOptions = [
      { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '3-5 days' },
      { id: 'express', name: 'Express Shipping', price: 12.99, days: '2 days' },
      { id: 'overnight', name: 'Overnight Shipping', price: 19.99, days: '1 day' },
    ];
  
    // Payment state
    const [selectedShipping, setSelectedShipping] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('omsiapawasto');
    const [combinedPayment, setCombinedPayment] = useState('none');
    
    // Calculate totals
    const calculateSubtotal = () => {
      return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    const getShippingCost = () => {
      const selected = shippingOptions.find(option => option.id === selectedShipping);
      return selected ? selected.price : 0;
    };
    
    const calculateTotal = () => {
      return calculateSubtotal() + getShippingCost();
    };
    
    // Quantity handlers
    const increaseQuantity = (itemId) => {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    };
    
    const decreaseQuantity = (itemId) => {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
      );
    };
    
    const removeItem = (itemId) => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };
    
    // Validate order
    const validateOrder = () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty');
        return false;
      }
      
      if (!selectedShipping) {
        alert('Please select a shipping option');
        return false;
      }
      
      if (!paymentMethod) {
        alert('Please select a payment method');
        return false;
      }
      
      alert('Order validated! Proceeding to payment...');
      return true;
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateOrder()) {
        // In a real app, you would process payment here
        console.log({
          cartItems,
          subtotal: calculateSubtotal(),
          shipping: {
            method: selectedShipping,
            cost: getShippingCost()
          },
          total: calculateTotal(),
          paymentMethod,
          combinedPayment
        });
      }
    };
  
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <header className="checkout-header">
            <h1>Checkout</h1>
          </header>
          
          <form onSubmit={handleSubmit}>
            <div className="checkout-layout">
              <div className="checkout-main">
                {/* Cart Summary */}
                <section className="card cart-summary">
                  <div className="card-header">
                    <h2>Cart Summary</h2>
                    <span className="item-count">{cartItems.length} items</span>
                  </div>
                  
                  {cartItems.length === 0 ? (
                    <div className="empty-cart">
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="cart-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          
                          <div className="item-details">
                            <div className="item-name">{item.name}</div>
                            <div className="item-price">${item.price.toFixed(2)}</div>
                            
                            <div className="item-actions">
                              <div className="quantity-control">
                                <button 
                                  type="button" 
                                  className="quantity-btn"
                                  onClick={() => decreaseQuantity(item.id)}
                                >
                                  -
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button 
                                  type="button" 
                                  className="quantity-btn"
                                  onClick={() => increaseQuantity(item.id)}
                                >
                                  +
                                </button>
                              </div>
                              
                              <button 
                                type="button" 
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          <div className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                
                {/* Shipping Options */}
                <section className="card shipping-options">
                  <div className="card-header">
                    <h2>Shipping</h2>
                  </div>
                  
                  <div className="shipping-methods">
                    {shippingOptions.map(option => (
                      <label key={option.id} className="shipping-method">
                        <input
                          type="radio"
                          name="shipping"
                          id="shipping-method-input"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={() => setSelectedShipping(option.id)}
                        />
                        <div className="method-details">
                          <div className="method-name">{option.name}</div>
                          <div className="method-info">
                            <span className="delivery-time">{option.days}</span>
                            <span className="shipping-price">${option.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
                
                {/* Payment Options */}
                <section className="card payment-options">
                  <div className="card-header">
                    <h2>Payment</h2>
                  </div>
                  
                  <div className="payment-methods">
                    <div className="payment-section">
                      <h3>Primary Payment Method</h3>
                      <div className="radio-group">
                        <label className="payment-method">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="omsiapawasto"
                            checked={paymentMethod === 'omsiapawasto'}
                            onChange={() => setPaymentMethod('omsiapawasto')}
                          />
                          <div className="method-name">Omsiapawasto Currency</div>
                        </label>
                        
                        <label className="payment-method">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="funds"
                            checked={paymentMethod === 'funds'}
                            onChange={() => setPaymentMethod('funds')}
                          />
                          <div className="method-name">Funds</div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="payment-section">
                      <h3>Combined Payment Options</h3>
                      <div className="radio-group">
                        <label className="payment-method">
                          <input
                            type="radio"
                            name="combinedPayment"
                            value="omsiapawasto_to_funds"
                            checked={combinedPayment === 'omsiapawasto_to_funds'}
                            onChange={() => setCombinedPayment('omsiapawasto_to_funds')}
                          />
                          <div className="method-name">Omsiapawasto added to Funds</div>
                        </label>
                        
                        <label className="payment-method">
                          <input
                            type="radio"
                            name="combinedPayment"
                            value="funds_to_omsiapawasto"
                            checked={combinedPayment === 'funds_to_omsiapawasto'}
                            onChange={() => setCombinedPayment('funds_to_omsiapawasto')}
                          />
                          <div className="method-name">Funds added to Omsiapawasto</div>
                        </label>
                        
                        <label className="payment-method">
                          <input
                            type="radio"
                            name="combinedPayment"
                            value="none"
                            checked={combinedPayment === 'none'}
                            onChange={() => setCombinedPayment('none')}
                          />
                          <div className="method-name">No combined payment</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              
              <div className="checkout-sidebar">
                {/* Order Summary */}
                <section className="card order-summary">
                  <div className="card-header">
                    <h2>Order Summary</h2>
                  </div>
                  
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>${getShippingCost().toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <button type="submit" className="checkout-button"
                            onClick={()=> {
                              navigate("/placeorder")
                            }}>
                      Place Order
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default CheckoutPage;