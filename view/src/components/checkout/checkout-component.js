import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/checkout/checkout.scss';
import axiosCreatedInstance from '../lib/axiosutil.js';
import { FaUser, FaPhone, FaHome, FaCity, FaGlobe, FaMapMarkerAlt, FaBox, FaShoppingCart, FaMoneyBillWave, FaTruck, FaLock, FaLandmark, FaMapPin, FaMapMarkedAlt, FaEnvelope } from 'react-icons/fa';

// Move decimal precision utility outside the component to prevent recreation on each render
const decimalPrecision = {
  // Convert a number to a precise decimal string representation
  toDecimal: (num, precision = 10) => {
    return Number(parseFloat(num).toFixed(precision));
  },
  
  // Add two numbers with precise decimal handling
  add: (a, b) => {
    // Convert to strings to determine decimal places
    const aStr = a.toString();
    const bStr = b.toString();
    
    // Determine decimal places
    const aDecimals = aStr.includes('.') ? aStr.split('.')[1].length : 0;
    const bDecimals = bStr.includes('.') ? bStr.split('.')[1].length : 0;
    const maxDecimals = Math.max(aDecimals, bDecimals);
    
    // Use a multiplier based on the maximum decimal places
    const multiplier = Math.pow(10, maxDecimals);
    
    // Convert to integers, perform addition, then convert back
    const result = (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier;
    return result;
  },
  
  // Multiply two numbers with precise decimal handling
  multiply: (a, b) => {
    // Convert to strings
    const aStr = a.toString();
    const bStr = b.toString();
    
    // Determine decimal places
    const aDecimals = aStr.includes('.') ? aStr.split('.')[1].length : 0;
    const bDecimals = bStr.includes('.') ? bStr.split('.')[1].length : 0;
    
    // Calculate combined decimal places
    const totalDecimals = aDecimals + bDecimals;
    
    // Remove decimal points, multiply as integers, then adjust the result
    const aInt = parseInt(aStr.replace('.', ''));
    const bInt = parseInt(bStr.replace('.', ''));
    
    let result = (aInt * bInt) / Math.pow(10, totalDecimals);
    return result;
  },
  
  // Format currency to 2 decimal places correctly
  formatCurrency: (amount) => {
    return parseFloat(amount.toFixed(2));
  }
};

const CheckoutPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use useMemo to stabilize orderData reference
  const orderData = useMemo(() => {
    const data = location.state?.orderData || { cartItems: [], cartStats: {} };
    console.log("Received order data:", data);
    return data;
  }, [location.state]);
  
  // Form data for personal and shipping information with corrected schema field names
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    street: '',        // Matches schema
    trademark: '',     // Matches schema
    baranggay: '',     // Updated from barangay to baranggay to match schema
    city: '',          // Matches schema
    province: '',      // Matches schema
    zipCode: '',       // Note: schema uses zipcode (lowercase) in shippinginfo
    country: ''        // Matches schema
  });

  // Order summary state that will be calculated from orderData
  const [orderSummary, setOrderSummary] = useState({
    merchandiseTotal: 0,
    shippingTotal: 0,
    totalTransactionGiveaway: 0,
    totalOmsiaProfit: 0,
    totalCapital: 0,
    totalItems: 0,
    totalProducts: 0,
    totalWeightGrams: 0,
    totalWeightKilos: 0,
    total: 0
  });

  // Payment details using OMSIAPAWASTO currency
  const [paymentDetails, setPaymentDetails] = useState({
    omsiapawastoBalance: 1000, // Example balance
    selectedPaymentMethod: 'omsiapawasto'
  });

  // Animation states
  const [showSummary, setShowSummary] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => {
      setShowSummary(true);
    }, 300);
  }, []);

  // Calculate order summary from order data, using useMemo to prevent recalculation on every render
  const calculatedSummary = useMemo(() => {
    if (orderData && orderData.cartItems && orderData.cartItems.length > 0) {
      // Get values directly from cartStats for some totals
      const subtotal = orderData.cartStats?.subtotal || 0;
      const shippingTotal = orderData.cartStats?.shippingCost || 0;
      const totalWeightGrams = orderData.cartStats?.totalWeightGrams || 0;
      const totalWeightKilos = orderData.cartStats?.totalWeightKilos || 0;
      const totalItems = orderData.cartStats?.totalItems || 0;
      
      // Initialize other totals that may not be in cartStats
      let totalTransactionGiveaway = 0;
      let totalOmsiaProfit = 0;
      let totalCapital = 0;
      
      // Process each item to get financial breakdown
      orderData.cartItems.forEach(item => {
        const quantity = item.quantity || 1;
        
        // Extract values from the item's details.price structure
        const itemTransactionGiveaway = item.details?.price?.transactiongiveaway || 0;
        const itemProfit = item.details?.price?.profit || 0;
        const itemCapital = item.details?.price?.capital || 0;
        
        // Multiply values by quantity using precise decimal multiplication
        const totalItemTransactionGiveaway = decimalPrecision.multiply(itemTransactionGiveaway, quantity);
        const totalItemOmsiaProfit = decimalPrecision.multiply(itemProfit, quantity);
        const totalItemCapital = decimalPrecision.multiply(itemCapital, quantity);
        
        // Add to running totals using precise decimal addition
        totalTransactionGiveaway = decimalPrecision.add(totalTransactionGiveaway, totalItemTransactionGiveaway);
        totalOmsiaProfit = decimalPrecision.add(totalOmsiaProfit, totalItemOmsiaProfit);
        totalCapital = decimalPrecision.add(totalCapital, totalItemCapital);
      });
      
      // Calculate final total using precise decimal addition
      const total = decimalPrecision.add(subtotal, shippingTotal);
      
      // Return formatted values
      return {
        merchandiseTotal: decimalPrecision.formatCurrency(subtotal),
        shippingTotal: decimalPrecision.formatCurrency(shippingTotal),
        totalTransactionGiveaway: decimalPrecision.formatCurrency(totalTransactionGiveaway),
        totalOmsiaProfit: decimalPrecision.formatCurrency(totalOmsiaProfit),
        totalCapital: decimalPrecision.formatCurrency(totalCapital),
        totalItems,
        totalProducts: orderData.cartItems.length,
        totalWeightGrams: parseFloat(totalWeightGrams.toFixed(2)),
        totalWeightKilos: parseFloat(totalWeightKilos.toFixed(3)),
        total: decimalPrecision.formatCurrency(total)
      };
    }
    
    // Return default values if no cart items
    return {
      merchandiseTotal: 0,
      shippingTotal: 0,
      totalTransactionGiveaway: 0,
      totalOmsiaProfit: 0,
      totalCapital: 0,
      totalItems: 0,
      totalProducts: 0,
      totalWeightGrams: 0,
      totalWeightKilos: 0,
      total: 0
    };
  }, [orderData]);

  // Update order summary state only when calculated summary changes
  useEffect(() => {
    setOrderSummary(calculatedSummary);
  }, [calculatedSummary]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Get product name consistently
  const getProductName = (item) => {
    return item.details?.productname || "Unnamed Product";
  };

  // Get product price consistently
  const getProductPrice = (item) => {
    return item.details?.price?.amount || 0;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (paymentDetails.omsiapawastoBalance < orderSummary.total) {
      alert('Insufficient OMSIAPAWASTO balance. Please add funds before placing your order.');
      setFormSubmitted(false);
      return;
    }
    
    // Prepare complete order data
    const completeOrderData = {
      personal: formData,
      orderSummary: {
        ...orderSummary,
        // Include data from original cartStats that might be useful
        shippingMethod: "weight-based",
        paymentMethod: orderData.paymentMethod || 'omsiapawasto'
      },
      paymentMethod: paymentDetails.selectedPaymentMethod,
      cartItems: orderData.cartItems,
      orderDate: new Date().toISOString()
    };
    
    try {
      // Example API call
      await axiosCreatedInstance.post("/products/order", {
        $order: {
          // registrantid: props.user?.id,
          registrantid: props.user._id,
          products: orderData.cartItems,
          personalInfo: formData,
          paymentInfo: {
            method: paymentDetails.selectedPaymentMethod,
            amount: orderSummary.total
          },
          orderSummary
        },
      });
      
      // Show success message
      alert('Order successfully placed using OMSIAPAWASTO currency!');
      // Navigate to order confirmation page or dashboard
      // navigate('/order-confirmation', { state: { orderReference: 'ORD' + Date.now() } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setFormSubmitted(false);
    }
  };

  // Memoize item calculations to prevent recalculation on each render
  const cartItemsWithCalculatedPrices = useMemo(() => {
    return orderData.cartItems.map(item => {
      const itemPrice = getProductPrice(item);
      const quantity = item.quantity || 1;
      const totalPrice = decimalPrecision.multiply(itemPrice, quantity);
      
      return {
        ...item,
        calculatedPrice: totalPrice,
        calculatedQuantity: quantity,
        displayName: getProductName(item)
      };
    });
  }, [orderData.cartItems]);

  // If there's no order data, show a message
  if (!orderData || !orderData.cartItems || orderData.cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Check out</h1>
        <div className="checkout-empty-cart">
          <FaShoppingCart className="checkout-empty-icon" />
          <p>No order data available. Please go back to your cart.</p>
          <button 
            className="checkout-back-button"
            onClick={() => navigate('/checkout')}
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title" style={{color:'black'}}>
        <FaLock className="checkout-secure-icon" /> Secure Checkout
      </h1>
      
      <div className="checkout-grid-layout">
        {/* Left Column: Shipping & Personal Information */}
        <div className="checkout-shipping-column">
          <div className="checkout-info-card checkout-fade-in">
            <h2 className="checkout-card-header">
              <FaUser className="checkout-header-icon" /> 
              Shipping & Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="checkout-form-section">
                <h3 className="checkout-section-heading">Personal Details</h3>
                <div className="checkout-form-grid">
                  <div className="checkout-form-group">
                    <label>
                      <FaUser className="checkout-input-icon" /> First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>
                      <FaUser className="checkout-input-icon" /> Middle Name
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>
                      <FaUser className="checkout-input-icon" /> Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group checkout-phone-field">
                    <label>
                      <FaPhone className="checkout-input-icon" /> Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-form-section">
                <h3 className="checkout-section-heading">
                  <FaHome className="checkout-section-icon" /> Shipping Address
                </h3>
                <div className="checkout-form-grid">
                  <div className="checkout-form-group checkout-full-width">
                    <label>
                      <FaMapMarkerAlt className="checkout-input-icon" /> Street*
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                      placeholder="House/Unit No., Street Name"
                    />
                  </div>
                  
                  <div className="checkout-form-group checkout-full-width">
                    <label htmlFor="trademark">
                      <FaLandmark className="checkout-input-icon" /> Landmark/Trademark
                    </label>
                    <input
                      type="text"
                      id="trademark"
                      name="trademark"
                      value={formData.trademark}
                      onChange={handleChange}
                      className="checkout-input"
                      placeholder="Near landmark or building (optional)"
                    />
                  </div>
                  
                  <div className="checkout-form-group">
                    <label>
                      <FaMapPin className="checkout-input-icon" /> Baranggay*
                    </label>
                    <input
                      type="text"
                      id="baranggay"
                      name="baranggay"
                      value={formData.baranggay}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  
                  <div className="checkout-form-group">
                    <label>
                      <FaCity className="checkout-input-icon" /> City/Municipality*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  
                  <div className="checkout-form-group">
                    <label>
                      <FaMapMarkedAlt className="checkout-input-icon" /> Province*
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  
                  <div className="checkout-form-group">
                    <label>
                      <FaEnvelope className="checkout-input-icon" /> Postal Zipcode*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  
                  <div className="checkout-form-group">
                    <label>
                      <FaGlobe className="checkout-input-icon" /> Country*
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                      placeholder="e.g., Philippines"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`checkout-button ${formSubmitted ? 'checkout-loading' : ''}`}
                disabled={formSubmitted}
              >
                {formSubmitted ? (
                  <>Processing Order...</>
                ) : (
                  <>Confirm Order & Pay with OMSIAPAWASTO</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={`checkout-summary-column ${showSummary ? 'checkout-slide-in' : ''}`}>
          <div className="checkout-info-card">
            <h2 className="checkout-card-header">
              <FaShoppingCart className="checkout-header-icon" /> Order Summary
            </h2>
            
            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaBox className="checkout-section-icon" /> Products ({orderSummary.totalProducts})
              </h3>
              <div className="checkout-cart-items">
                {cartItemsWithCalculatedPrices.map((item, index) => (
                  <div key={item.authentications?.id || index} className="checkout-cart-item">
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.displayName}</span>
                      <span className="checkout-item-quantity">x{item.calculatedQuantity}</span>
                    </div>
                    <span className="checkout-item-price">
                      ₱{item.calculatedPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaTruck className="checkout-section-icon" /> Order Details
              </h3>
              <div className="checkout-summary-grid">
                <div className="checkout-summary-item">
                  <span className="checkout-label">Total Items:</span>
                  <span className="checkout-value">{orderSummary.totalItems} units</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Total Weight:</span>
                  <span className="checkout-value">{orderSummary.totalWeightGrams}g ({orderSummary.totalWeightKilos}kg)</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Merchandise Total:</span>
                  <span className="checkout-value">₱{orderSummary.merchandiseTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Shipping Total:</span>
                  <span className="checkout-value">₱{orderSummary.shippingTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaMoneyBillWave className="checkout-section-icon" /> Financial Breakdown
              </h3>
              <div className="checkout-summary-grid">
                <div className="checkout-summary-item">
                  <span className="checkout-label">Transaction Giveaway:</span>
                  <span className="checkout-value">₱{orderSummary.totalTransactionGiveaway.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Omsia Profit:</span>
                  <span className="checkout-value">₱{orderSummary.totalOmsiaProfit.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Capital Cost:</span>
                  <span className="checkout-value">₱{orderSummary.totalCapital.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="checkout-divider"></div>
            
            <div className="checkout-summary-item checkout-total">
              <span className="checkout-label">Total Amount:</span>
              <span className="checkout-value checkout-highlight">₱{orderSummary.total.toFixed(2)}</span>
            </div>
            
            <div className="checkout-payment-details">
              <h3 className="checkout-section-heading">
                <FaMoneyBillWave className="checkout-section-icon" /> Payment Method
              </h3>
              <div className="checkout-payment-selection">
                <label className="checkout-payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="omsiapawasto"
                    checked={paymentDetails.selectedPaymentMethod === 'omsiapawasto'}
                    onChange={() => setPaymentDetails({...paymentDetails, selectedPaymentMethod: 'omsiapawasto'})}
                  />
                  <div className="checkout-method-info">
                    <div className="checkout-method-name">OMSIAPAWASTO Currency</div>
                    <div className="checkout-method-balance">Balance: ₱{paymentDetails.omsiapawastoBalance.toFixed(2)}</div>
                  </div>
                </label>
              </div>
              
              <div className="checkout-divider"></div>
              
              <div className="checkout-payment-confirmation">
                <div className="checkout-summary-item checkout-total">
                  <span className="checkout-label">Amount to Pay:</span>
                  <span className="checkout-value checkout-highlight">₱{orderSummary.total.toFixed(2)}</span>
                </div>
                
                {paymentDetails.omsiapawastoBalance < orderSummary.total && (
                  <div className="checkout-insufficient-funds">
                    <span className="checkout-warning-icon">⚠️</span>
                    Warning: Insufficient OMSIAPAWASTO balance. Please add funds before placing your order.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;