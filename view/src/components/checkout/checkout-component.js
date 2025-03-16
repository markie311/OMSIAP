import React, { useState, useEffect } from 'react';

import { useLocation,
  useNavigate
 } from 'react-router-dom';

import '../../styles/checkout/checkout.scss';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('weight-based');
  const [paymentMethod, setPaymentMethod] = useState('omsiapawasto');
  const [combinedPayment, setCombinedPayment] = useState('none');
  const [showWeightLimitModal, setShowWeightLimitModal] = useState(false);
  const [cartStats, setCartStats] = useState({
    totalItems: 0,
    totalWeightGrams: 0,
    totalWeightKilos: 0,
    shippingCost: 0,
    subtotal: 0,
    total: 0,
    exceedsWeightLimit: false
  });
  
  // Initialize cart from location state instead of props
  useEffect(() => {
    // Access cart from location.state
    const cart = location.state?.cart || [];
    
    if (cart.length > 0) {
      // Ensure all quantities are integers
      const normalizedCart = cart.map(item => {
        const normalizedItem = { ...item };
        
        // Ensure quantity is an integer
        if (normalizedItem.quantity) {
          normalizedItem.quantity = Math.floor(normalizedItem.quantity);
          if (normalizedItem.quantity < 1) normalizedItem.quantity = 1;
        }
        
        // Also update orderdetails.quantity if it exists
        if (normalizedItem.orderdetails && normalizedItem.orderdetails.quantity) {
          normalizedItem.orderdetails.quantity = Math.floor(normalizedItem.orderdetails.quantity);
          if (normalizedItem.orderdetails.quantity < 1) normalizedItem.orderdetails.quantity = 1;
        }
        
        return normalizedItem;
      });
      
      setCartItems(normalizedCart);
    }
  }, [location.state]);
  
  // Calculate cart statistics whenever cartItems changes
  useEffect(() => {
    if (cartItems.length === 0) return;
    
    const { totalSummary } = calculateProductDetails(cartItems);
    
    // Calculate total number of items
    const totalItemCount = cartItems.reduce((count, product) => 
      count + (product.quantity || product.orderdetails?.quantity || 0), 0);
    
    // Get weight and calculate shipping
    const totalWeightGrams = totalSummary.totalWeightInGrams;
    const totalWeightKilos = totalSummary.totalWeightInKilos;
    const shippingCost = calculateShippingCost(totalWeightGrams);
    
    // Update cart statistics
    setCartStats({
      totalItems: totalItemCount,
      totalWeightGrams,
      totalWeightKilos,
      shippingCost,
      subtotal: totalSummary.totalPrice,
      total: totalSummary.totalPrice + shippingCost,
      exceedsWeightLimit: totalWeightKilos > 10
    });
  }, [cartItems]);
  
  // Calculate shipping cost based on weight in grams
  const calculateShippingCost = (weightInGrams) => {
    // Convert to kilos for easier calculation
    const weightInKilos = weightInGrams / 1000;
    
    // If weight exceeds 10 kilos or is 9.999 kilos or more, shipping is 1000 pesos
    if (weightInKilos >= 9.999) {
      return 1000;
    }
    
    // Otherwise, calculate based on weight brackets
    // 0-1000g: 100 pesos
    // 1001-2000g: 200 pesos
    // And so on...
    const weightBracket = Math.ceil(weightInKilos);
    return weightBracket * 100;
  };
  
  // Update cart item quantity - ensure integer values
  const updateQuantity = (itemId, newQuantity) => {
    // Ensure quantity is a valid integer
    const intQuantity = Math.floor(newQuantity);
    
    // Don't allow quantities less than 1
    if (intQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          // Update both item.quantity and orderdetails.quantity if it exists
          const updatedItem = { ...item, quantity: intQuantity };
          if (updatedItem.orderdetails) {
            updatedItem.orderdetails.quantity = intQuantity;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };
  
  // Quantity handlers
  const increaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    // Get current quantity and ensure it's an integer
    let currentQty = item.quantity || item.orderdetails?.quantity || 0;
    currentQty = Math.floor(currentQty);
    updateQuantity(itemId, currentQty + 1);
  };
  
  const decreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    // Get current quantity and ensure it's an integer
    let currentQty = item.quantity || item.orderdetails?.quantity || 0;
    currentQty = Math.floor(currentQty);
    if (currentQty > 1) {
      updateQuantity(itemId, currentQty - 1);
    }
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
    
    if (!paymentMethod) {
      alert('Please select a payment method');
      return false;
    }
    
    // Check weight limit
    if (cartStats.totalWeightKilos > 10) {
      setShowWeightLimitModal(true);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateOrder()) {
      // In a real app, you would process payment here
      const orderData = {
        cartItems,
        cartStats,
        paymentMethod,
        combinedPayment
      };
      console.log('Order data:', orderData);
      navigate('/placeorder', { state: { orderData } });
      
      // Since we're not using props anymore, we need another way to update components
      // You might use a global state manager or context to sync changes
      // For now, let's assume there's a function to call in window
      if (window.updateCheckoutComponent) {
        window.updateCheckoutComponent();
      }
      alert("Synced");
    }
  };
  
  // Calculate product details without modifying the original cart items
  function calculateProductDetails(products) {
    // Make a deep copy of the products to avoid mutating the original data
    const updatedProducts = JSON.parse(JSON.stringify(products));
    
    // Total calculations across all products
    let totalSummary = {
      totalPrice: 0,
      totalCapital: 0,
      totalTransactionGiveaway: 0,
      totalOmsiaProfit: 0,
      totalWeightInGrams: 0,
      totalWeightInKilos: 0
    };
    
    // Helper function for precise multiplication of decimals
    function preciseMultiply(a, b) {
      const aString = a.toString();
      const bString = b.toString();
      
      const aDecimals = aString.includes('.') ? aString.split('.')[1].length : 0;
      const bDecimals = bString.includes('.') ? bString.split('.')[1].length : 0;
      
      const factor = Math.pow(10, aDecimals + bDecimals);
      
      const aInt = Number(aString.replace('.', ''));
      const bInt = Number(bString.replace('.', ''));
      
      return (aInt * bInt) / factor;
    }
    
    // Helper function for precise addition of decimals
    function preciseAdd(a, b) {
      const aString = a.toString();
      const bString = b.toString();
      
      const aDecimals = aString.includes('.') ? aString.split('.')[1].length : 0;
      const bDecimals = bString.includes('.') ? bString.split('.')[1].length : 0;
      
      const maxDecimals = Math.max(aDecimals, bDecimals);
      const factor = Math.pow(10, maxDecimals);
      
      return (Math.round(a * factor) + Math.round(b * factor)) / factor;
    }
    
    // Process each product
    updatedProducts.forEach(product => {
      // Use quantity directly from product if available, otherwise use orderdetails.quantity
      let quantity = product.quantity || (product.orderdetails ? product.orderdetails.quantity : 0) || 0;
      
      // Ensure quantity is an integer
      quantity = Math.floor(quantity);
      if (quantity < 1) quantity = 1;
      
      // Get price data, handling possible structure differences
      const priceData = product.focuseddata ? product.focuseddata.price : {
        price: product.price || 0,
        capital: 0,
        transactiongiveaway: 0,
        omsiapprofit: 0
      };
      
      // Calculate product totals with precise decimal handling
      const productPrice = preciseMultiply(priceData.price, quantity);
      const productCapital = preciseMultiply(priceData.capital || 0, quantity);
      const productTransactionGiveaway = preciseMultiply(priceData.transactiongiveaway || 0, quantity);
      const productOmsiaProfit = preciseMultiply(priceData.omsiapprofit || 0, quantity);
      
      // Calculate weight - ensure we're working with numbers
      const weightInGrams = preciseMultiply(parseFloat(product.weightingrams || 0), quantity);
      const weightInKilos = preciseMultiply(weightInGrams, 0.001); // Convert to kilos
      
      // Add to total summary with precise addition
      totalSummary.totalPrice = preciseAdd(totalSummary.totalPrice, productPrice);
      totalSummary.totalCapital = preciseAdd(totalSummary.totalCapital, productCapital);
      totalSummary.totalTransactionGiveaway = preciseAdd(totalSummary.totalTransactionGiveaway, productTransactionGiveaway);
      totalSummary.totalOmsiaProfit = preciseAdd(totalSummary.totalOmsiaProfit, productOmsiaProfit);
      totalSummary.totalWeightInGrams = preciseAdd(totalSummary.totalWeightInGrams, weightInGrams);
      totalSummary.totalWeightInKilos = preciseAdd(totalSummary.totalWeightInKilos, weightInKilos);
    });
    
    // Format total summary to appropriate decimal places
    totalSummary = {
      totalPrice: Number(totalSummary.totalPrice.toFixed(2)),
      totalCapital: Number(totalSummary.totalCapital.toFixed(2)),
      totalTransactionGiveaway: Number(totalSummary.totalTransactionGiveaway.toFixed(2)),
      totalOmsiaProfit: Number(totalSummary.totalOmsiaProfit.toFixed(2)),
      totalWeightInGrams: Number(totalSummary.totalWeightInGrams.toFixed(2)),
      totalWeightInKilos: Number(totalSummary.totalWeightInKilos.toFixed(3))
    };
    
    return {
      updatedProducts,
      totalSummary
    };
  }
  
  // Function to get product image
  const getProductImage = (item) => {
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return '../images/market/products/watch.jpg'; // Fallback image
  };
  
  // Weight Limit Modal Component
  const WeightLimitModal = ({ show, onClose }) => {
    if (!show) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Weight Limit Exceeded</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p>Your order weight exceeds our limit of 10 kilograms.</p>
            <p>Current weight: {cartStats.totalWeightKilos.toFixed(3)} kg</p>
            <p>Please reduce the quantity of items in your cart to continue.</p>
          </div>
          <div className="modal-footer">
            <button className="btn primary-btn" onClick={onClose}>Understand</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <h1 style={{color:"white"}}>Place Order</h1>
        </header>
        
        {/* Weight Warning Banner - shows when approaching limit */}
        {cartStats.totalWeightKilos > 8 && cartStats.totalWeightKilos <= 10 && (
          <div className="weight-warning-banner">
            <p>
              <strong>Warning:</strong> Your order is approaching the 10kg weight limit.
              Current weight: {cartStats.totalWeightKilos.toFixed(3)} kg
            </p>
          </div>
        )}
        
        {/* Weight Exceeded Banner - shows when over limit */}
        {cartStats.totalWeightKilos > 10 && (
          <div className="weight-error-banner">
            <p>
              <strong>Error:</strong> Your order exceeds the 10kg weight limit.
              Current weight: {cartStats.totalWeightKilos.toFixed(3)} kg
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-main">
              {/* Cart Summary */}
              <section className="card cart-summary">
                <div className="card-header">
                  <h2>Cart Summary</h2>
                  <span className="item-count">{cartItems.length} products ({cartStats.totalItems} items)</span>
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
                          <img src={getProductImage(item)} alt={item.name} />
                        </div>
                        
                        <div className="item-details">
                          <div className="item-name" style={{color:"black"}}>{item.name}</div>
                          <div className="item-price" style={{color:"black"}}>
                            ₱{(item.focuseddata?.price?.price || item.price).toFixed(2)}
                          </div>
                          
                          <div className="item-actions">
                            <div className="quantity-control">
                              <button 
                                type="button" 
                                className="quantity-btn"
                                onClick={() => decreaseQuantity(item.id)}
                              >
                                -
                              </button>
                              <span className="quantity" style={{color:"black"}}>{Math.floor(item.quantity || item.orderdetails?.quantity || 0)}</span>
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
                        
                        <div className="item-total" style={{color:"black"}}>
                          ₱{((item.focuseddata?.price?.price || item.price) * 
                             Math.floor(item.quantity || item.orderdetails?.quantity || 0)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              
              {/* Shipping Information */}
              <section className="card shipping-options">
                <div className="card-header">
                  <h2>Shipping Information</h2>
                </div>
                
                <div className="shipping-details" style={{padding: "20px"}}>
                  <div className="shipping-info-row">
                    <span style={{color:"black"}}>Weight-based shipping:</span>
                    <span> </span>
                     <span style={{color:"black"}}>₱{cartStats.shippingCost.toFixed(2)}</span>
                  </div>
                  <br />
                  <div className="shipping-info-row">
                    <span style={{color:"black"}}>Total Weight:</span>
                    <span> </span>
                     <span style={{color:"black"}} className={cartStats.totalWeightKilos > 10 ? "text-error" : ""}>
                       {cartStats.totalWeightGrams.toFixed(2)}g ({cartStats.totalWeightKilos.toFixed(3)}kg)
                       {cartStats.totalWeightKilos > 10 && " - Exceeds 10kg limit!"}
                     </span>
                  </div>
                  <br />
                  <div className="shipping-info-row">
                    <span style={{color:"black"}}>Shipping Rate:</span>
                    <span> </span>
                     <span style={{color:"black"}}>₱100 per 1kg (Max ₱1,000 for 10kg+)</span>
                  </div>
                  <div className="shipping-info-row weight-limit-note">
                    <strong>Note:</strong> Orders are limited to a maximum of 10kg per order.
                  </div>
                </div>
              </section>
              {/* Payment Options section commented out in original code */}
            </div>
            
            <div className="checkout-sidebar">
              {/* Order Summary */}
              <section className="card order-summary">
                <div className="card-header">
                  <h2>Order Summary</h2>
                </div>
                
                <div className="summary-content">
                  <div className="summary-row">
                    <span style={{color:"black"}}>Products</span>
                    <span style={{color:"black"}}>{cartItems.length} items</span>
                  </div>
                  
                  <div className="summary-row">
                    <span style={{color:"black"}}>Total Quantity</span>
                    <span style={{color:"black"}}>{cartStats.totalItems} units</span>
                  </div>
                  
                  <div className="summary-row">
                    <span style={{color:"black"}}>Total Weight</span>
                    <span style={{color:"black"}} className={cartStats.totalWeightKilos > 10 ? "text-error" : ""}>
                      {cartStats.totalWeightGrams.toFixed(2)}g 
                      ({cartStats.totalWeightKilos.toFixed(3)}kg)
                    </span>
                  </div>
                  
                  <div className="summary-row">
                    <span style={{color:"black"}}>Subtotal</span>
                    <span style={{color:"black"}}>₱{cartStats.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span style={{color:"black"}}>Shipping</span>
                    <span style={{color:"black"}}>₱{cartStats.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total">
                    <span style={{color:"black"}}>Total</span>
                    <span style={{color:"black"}}>₱{(cartStats.subtotal + cartStats.shippingCost).toFixed(2)}</span>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="checkout-button"
                    disabled={cartStats.totalWeightKilos > 10}
                  >
                    {cartStats.totalWeightKilos > 10 
                      ? "Order Exceeds 10kg Weight Limit" 
                      : "Place Order And Proceed To Check Out For Payments"}
                  </button>
                  
                  {cartStats.totalWeightKilos > 10 && (
                    <div className="weight-limit-error-message">
                      Please reduce your order weight to continue.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </form>
        
        {/* Weight Limit Modal */}
        <WeightLimitModal 
          show={showWeightLimitModal} 
          onClose={() => setShowWeightLimitModal(false)} 
        />
      </div>
    </div>
  );
};

export default CheckoutPage;