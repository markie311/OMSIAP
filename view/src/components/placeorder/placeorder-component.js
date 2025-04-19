import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTruck, FaMoneyBillWave, FaTrashAlt, FaWeightHanging, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import '../../styles/placeorder/placeorder.scss';

const PlaceOrderPage = () => {
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
  
  // Maximum weight limit in kilograms
  const MAX_WEIGHT_LIMIT = 20;
  
  // Initialize cart from location state
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
        } else {
          // Add quantity property if it doesn't exist
          normalizedItem.quantity = 1;
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
      count + (product.quantity || 1), 0);
    
    // Get weight and calculate shipping
    const totalWeightGrams = totalSummary.totalWeightInGrams;
    const totalWeightKilos = totalSummary.totalWeightInKilos;
    const shippingCost = calculateShippingCost(totalWeightKilos);
    
    // Update cart statistics
    setCartStats({
      totalItems: totalItemCount,
      totalWeightGrams,
      totalWeightKilos,
      shippingCost,
      subtotal: totalSummary.totalPrice,
      total: totalSummary.totalPrice + shippingCost,
      exceedsWeightLimit: totalWeightKilos > MAX_WEIGHT_LIMIT
    });
  }, [cartItems]);
  
  // Calculate shipping cost based on weight in kilos
  const calculateShippingCost = (weightInKilos) => {
    // If weight exceeds MAX_WEIGHT_LIMIT, shipping is MAX_WEIGHT_LIMIT * 100 pesos
    if (weightInKilos > MAX_WEIGHT_LIMIT) {
      return MAX_WEIGHT_LIMIT * 100;
    }
    
    // Round up to the next kilo and multiply by 100 pesos
    // e.g., 1.1kg would be rounded up to 2kg = 200 pesos
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
        if (item.authentications?.id === itemId) {
          return { ...item, quantity: intQuantity };
        }
        return item;
      })
    );
  };
  
  // Quantity handlers
  const increaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.authentications?.id === itemId);
    // Get current quantity and ensure it's an integer
    let currentQty = item.quantity || 1;
    currentQty = Math.floor(currentQty);
    updateQuantity(itemId, currentQty + 1);
  };
  
  const decreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.authentications?.id === itemId);
    // Get current quantity and ensure it's an integer
    let currentQty = item.quantity || 1;
    currentQty = Math.floor(currentQty);
    if (currentQty > 1) {
      updateQuantity(itemId, currentQty - 1);
    }
  };
  
  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.authentications?.id !== itemId));
  };
  
  // Validate order
  const validateOrder = () => {
    if (cartItems.length === 0) {
      // Use a more elegant notification
      setShowErrorToast("Your cart is empty");
      return false;
    }
    
    if (!paymentMethod) {
      setShowErrorToast("Please select a payment method");
      return false;
    }
    
    // Check weight limit
    if (cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT) {
      setShowWeightLimitModal(true);
      return false;
    }
    
    return true;
  };
  
  const [showErrorToast, setShowErrorToast] = useState(null);
  
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateOrder()) {
      // Prepare order data
      const orderData = {
        cartItems,
        cartStats,
        paymentMethod,
        combinedPayment
      };
      console.log('Order data:', orderData);
      
      // Immediately redirect to checkout
      navigate('/checkout', { state: { orderData } });
      
      // Since we're not using props anymore, we need another way to update components
      // You might use a global state manager or context to sync changes
      if (window.updateCheckoutComponent) {
        window.updateCheckoutComponent();
      }
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
      // Use quantity from product or default to 1
      let quantity = product.quantity || 1;
      
      // Ensure quantity is an integer
      quantity = Math.floor(quantity);
      if (quantity < 1) quantity = 1;
      
      // Get price data from the new structure
      const price = product.details?.price?.amount || 0;
      const capital = product.details?.price?.capital || 0;
      const transactionGiveaway = product.details?.price?.transactiongiveaway || 0;
      const profit = product.details?.price?.profit || 0;
      
      // Calculate product totals with precise decimal handling
      const productPrice = preciseMultiply(price, quantity);
      const productCapital = preciseMultiply(capital, quantity);
      const productTransactionGiveaway = preciseMultiply(transactionGiveaway, quantity);
      const productOmsiaProfit = preciseMultiply(profit, quantity);
      
      // Calculate weight - ensure we're working with numbers
      const weightInGrams = preciseMultiply(parseFloat(product.details?.weightingrams || 0), quantity);
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
    if (item.images && item.images.length > 0) return item.images[0].url;
    return '../images/market/products/watch.jpg'; // Fallback image
  };
  
  // Function to get product name
  const getProductName = (item) => {
    return item.details?.productname || "Unnamed Product";
  };
  
  // Function to get product price
  const getProductPrice = (item) => {
    return item.details?.price?.amount || 0;
  };
  
  // Weight Limit Modal Component with animation
  const WeightLimitModal = ({ show, onClose }) => {
    if (!show) return null;
    
    return (
      <AnimatePresence>
        {show && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="modal-header">
                <h3><FaExclamationTriangle className="warning-icon" /> Weight Limit Exceeded</h3>
                <button className="close-button" onClick={onClose}>×</button>
              </div>
              <div className="modal-body">
                <p>Your order weight exceeds our limit of {MAX_WEIGHT_LIMIT} kilograms.</p>
                <div className="weight-progress">
                  <div className="weight-bar">
                    <div 
                      className="weight-fill exceeded" 
                      style={{ width: `${(cartStats.totalWeightKilos / MAX_WEIGHT_LIMIT) * 100}%` }}
                    ></div>
                  </div>
                  <div className="weight-labels">
                    <span>0kg</span>
                    <span>{MAX_WEIGHT_LIMIT}kg</span>
                  </div>
                </div>
                <p className="current-weight">Current weight: <strong>{cartStats.totalWeightKilos.toFixed(3)} kg</strong></p>
                <p>Please reduce the quantity of items in your cart to continue.</p>
              </div>
              <div className="modal-footer">
                <button className="btn primary-btn" onClick={onClose}>I Understand</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  // Toast notification component
  const ToastNotification = ({ message, type }) => {
    return (
      <AnimatePresence>
        {message && (
          <motion.div 
            className={`toast-notification ${type}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="toast-icon">
              {type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
            </div>
            <div className="toast-message">{message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  return (
    <div className="placeorder-page">
      {/* Toast Notification */}
      <ToastNotification message={showErrorToast} type="error" />
      
      <div className="placeorder-container">
        <motion.header 
          className="placeorder-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1><FaShoppingCart className="header-icon" /> Place Order</h1>
        </motion.header>
        
        {/* Weight Warning Banner - shows when approaching limit */}
        <AnimatePresence>
          {cartStats.totalWeightKilos > (MAX_WEIGHT_LIMIT * 0.8) && cartStats.totalWeightKilos <= MAX_WEIGHT_LIMIT && (
            <motion.div 
              className="weight-warning-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle className="warning-icon" />
              <p>
                <strong>Warning:</strong> Your order is approaching the {MAX_WEIGHT_LIMIT}kg weight limit.
                Current weight: <strong>{cartStats.totalWeightKilos.toFixed(3)} kg</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Weight Exceeded Banner - shows when over limit */}
        <AnimatePresence>
          {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
            <motion.div 
              className="weight-error-banner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle className="error-icon" />
              <p>
                <strong>Error:</strong> Your order exceeds the {MAX_WEIGHT_LIMIT}kg weight limit.
                Current weight: <strong>{cartStats.totalWeightKilos.toFixed(3)} kg</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit}>
          <div className="placeorder-layout">
            <div className="placeorder-main">
              {/* Cart Summary */}
              <motion.section 
                className="card cart-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="card-header">
                  <h2><FaShoppingCart className="section-icon" /> Cart Summary</h2>
                  <span className="item-count">{cartItems.length} products ({cartStats.totalItems} items)</span>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        repeat: 2, 
                        repeatType: "reverse", 
                        duration: 1 
                      }}
                    >
                      <FaShoppingCart className="empty-cart-icon" />
                    </motion.div>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cartItems.map((item, index) => (
                      <motion.div 
                        key={item.authentications?.id} 
                        className="cart-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="item-image">
                          <img src={getProductImage(item)} alt={getProductName(item)} />
                        </div>
                        
                        <div className="item-details">
                          <div className="item-name">{getProductName(item)}</div>
                          <div className="item-price">
                            ₱{getProductPrice(item).toFixed(2)}
                          </div>
                          
                          <div className="item-actions">
                            <div className="quantity-control">
                              <motion.button 
                                type="button" 
                                className="quantity-btn"
                                onClick={() => decreaseQuantity(item.authentications?.id)}
                                whileTap={{ scale: 0.9 }}
                              >
                                -
                              </motion.button>
                              <span className="quantity">{Math.floor(item.quantity || 1)}</span>
                              <motion.button 
                                type="button" 
                                className="quantity-btn"
                                onClick={() => increaseQuantity(item.authentications?.id)}
                                whileTap={{ scale: 0.9 }}
                              >
                                +
                              </motion.button>
                            </div>
                            
                            <motion.button 
                              type="button" 
                              className="remove-btn"
                              onClick={() => removeItem(item.authentications?.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTrashAlt /> Remove
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="item-total">
                          ₱{(getProductPrice(item) * Math.floor(item.quantity || 1)).toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>
              
              {/* Shipping Information */}
              <motion.section 
                className="card shipping-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="card-header">
                  <h2><FaTruck className="section-icon" /> Shipping Information</h2>
                </div>
                
                <div className="shipping-details">
                  <div className="shipping-info-row">
                    <span><FaTruck /> Weight-based shipping:</span>
                    <span className="shipping-value">₱{cartStats.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="shipping-info-row">
                    <span><FaWeightHanging /> Total Weight:</span>
                    <span className={`shipping-value ${cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT ? "text-error" : ""}`}>
                      {cartStats.totalWeightGrams.toFixed(2)}g ({cartStats.totalWeightKilos.toFixed(3)}kg)
                      {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
                        <span className="weight-exceed-marker">
                          <FaExclamationTriangle /> Exceeds {MAX_WEIGHT_LIMIT}kg limit!
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="shipping-info-row">
                    <span>Shipping Rate:</span>
                    <span className="shipping-value">₱100 per 1kg (Any fraction of a kg counts as a full kg)</span>
                  </div>
                  
                  <div className="shipping-info-row">
                    <span>Example:</span>
                    <span className="shipping-value">1.1kg = 2kg = ₱200</span>
                  </div>
                  
                  <div className="shipping-info-row weight-limit-note">
                    <FaExclamationTriangle className="note-icon" />
                    <span>Orders are limited to a maximum of {MAX_WEIGHT_LIMIT}kg per order.</span>
                  </div>
                </div>
              </motion.section>
            </div>
            
            <div className="placeorder-sidebar">
              {/* Order Summary */}
              <motion.section 
                className="card order-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="card-header">
                  <h2><FaMoneyBillWave className="section-icon" /> Order Summary</h2>
                </div>
                
                <div className="summary-content">
                  <div className="summary-row">
                    <span>Products</span>
                    <span>{cartItems.length} items</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Total Quantity</span>
                    <span>{cartStats.totalItems} units</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Total Weight</span>
                    <span className={cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT ? "text-error" : ""}>
                      {cartStats.totalWeightGrams.toFixed(2)}g 
                      ({cartStats.totalWeightKilos.toFixed(3)}kg)
                      {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
                        <FaExclamationTriangle className="inline-warning-icon" />
                      )}
                    </span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₱{cartStats.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>₱{cartStats.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <motion.div 
                    className="summary-row total"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <span>Total</span>
                    <span>₱{(cartStats.subtotal + cartStats.shippingCost).toFixed(2)}</span>
                  </motion.div>
                  
                  <motion.button 
                    type="submit" 
                    className="checkout-button"
                    disabled={cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT 
                      ? (
                        <>
                          <FaExclamationTriangle className="button-icon" />
                          Order Exceeds {MAX_WEIGHT_LIMIT}kg Weight Limit
                        </>
                      ) 
                      : (
                        <>
                          <FaCheckCircle className="button-icon" />
                          Place Order And Proceed To Payment
                        </>
                      )
                    }
                  </motion.button>
                  
                  {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
                    <motion.div 
                      className="weight-limit-error-message"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FaExclamationTriangle className="error-icon" />
                      Please reduce your order weight to continue.
                    </motion.div>
                  )}
                </div>
              </motion.section>
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

export default PlaceOrderPage;