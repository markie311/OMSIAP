import React, { useState, useEffect, useMemo } from 'react';

import { useLocation,
  useNavigate
 } from 'react-router-dom';

import '../../styles/placeorder/placeorder.scss';

import axiosCreatedInstance from '../lib/axiosutil.js';

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

const PlaceOrder = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use useMemo to stabilize orderData reference
  const orderData = useMemo(() => 
    location.state?.orderData || { cartItems: [], cartStats: {} },
    [location.state]
  );
  
  // Form data for personal and shipping information
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
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

  // Calculate order summary from order data, using useMemo to prevent recalculation on every render
  const calculatedSummary = useMemo(() => {
    if (orderData && orderData.cartItems && orderData.cartItems.length > 0) {
      // Initialize totals
      let merchandiseTotal = 0;
      let totalTransactionGiveaway = 0;
      let totalOmsiaProfit = 0;
      let totalCapital = 0;
      let totalItems = 0;
      
      // Process each item
      orderData.cartItems.forEach(item => {
        const quantity = item.quantity || (item.orderdetails?.quantity || 0);
        const itemPrice = item.focuseddata?.price?.price || item.price || (item.orderdetails?.product?.price || 0);
        
        // Get values directly from focuseddata.price properties
        const itemTransactionGiveaway = item.focuseddata?.price?.transactiongiveaway || 0;
        const itemOmsiaProfit = item.focuseddata?.price?.omsiapprofit || 0;
        const itemCapital = item.focuseddata?.price?.capital || 0;
        
        // Multiply values by quantity using precise decimal multiplication
        const totalItemPrice = decimalPrecision.multiply(itemPrice, quantity);
        const totalItemTransactionGiveaway = decimalPrecision.multiply(itemTransactionGiveaway, quantity);
        const totalItemOmsiaProfit = decimalPrecision.multiply(itemOmsiaProfit, quantity);
        const totalItemCapital = decimalPrecision.multiply(itemCapital, quantity);
        
        // Add to running totals using precise decimal addition
        merchandiseTotal = decimalPrecision.add(merchandiseTotal, totalItemPrice);
        totalTransactionGiveaway = decimalPrecision.add(totalTransactionGiveaway, totalItemTransactionGiveaway);
        totalOmsiaProfit = decimalPrecision.add(totalOmsiaProfit, totalItemOmsiaProfit);
        totalCapital = decimalPrecision.add(totalCapital, totalItemCapital);
        totalItems += quantity;
      });
      
      // Get shipping and weight from cartStats
      const shippingTotal = orderData.cartStats?.shippingCost || 0;
      const totalWeightGrams = orderData.cartStats?.totalWeightGrams || 0;
      const totalWeightKilos = orderData.cartStats?.totalWeightKilos || 0;
      
      // Calculate final total using precise decimal addition
      const total = decimalPrecision.add(merchandiseTotal, shippingTotal);
      
      // Return formatted values
      return {
        merchandiseTotal: decimalPrecision.formatCurrency(merchandiseTotal),
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

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentDetails.omsiapawastoBalance < orderSummary.total) {
      alert('Insufficient OMSIAPAWASTO balance. Please add funds before placing your order.');
      return;
    }
    
    // Prepare complete order data
    const completeOrderData = {
      personal: formData,
      orderSummary,
      paymentMethod: paymentDetails.selectedPaymentMethod,
      cartItems: orderData.cartItems,
      orderDate: new Date().toISOString()
    };
    
    // Log the data for now (would be sent to backend in production)
    console.log('Complete order data:', completeOrderData);
    
    try {
      // Example API call
      await axiosCreatedInstance.post("/products/order", {
        $order: {
          registrantid: props.user?.id,
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
    }
  };

  // Memoize item calculations to prevent recalculation on each render
  const cartItemsWithCalculatedPrices = useMemo(() => {
    return orderData.cartItems.map(item => {
      const itemPrice = item.focuseddata?.price?.price || item.price || 0;
      const quantity = item.quantity || item.orderdetails?.quantity || 0;
      const totalPrice = decimalPrecision.multiply(itemPrice, quantity);
      
      return {
        ...item,
        calculatedPrice: totalPrice,
        calculatedQuantity: quantity
      };
    });
  }, [orderData.cartItems]);

  // If there's no order data, show a message
  if (!orderData || !orderData.cartItems || orderData.cartItems.length === 0) {
    return (
      <div className="place-order-container">
        <h1>Check out</h1>
        <div className="empty-cart-message">
          <p>No order data available. Please go back to your cart.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/checkout')}
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-container">
      <h1 className="checkout-title">Check out</h1>
      
      <div className="order-grid-layout">
        {/* Left Column: Shipping & Personal Information */}
        <div className="shipping-details-column">
          <div className="info-card">
            <h2 className="card-header">Shipping & Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3 className="section-heading">Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name*</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="middleName">Middle Name</label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name*</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group phone-field">
                    <label htmlFor="phoneNumber">Phone Number*</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-heading">Shipping Address</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">Street Address*</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State/Province*</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">Zip/Postal Code*</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country*</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="place-order-button">
                Confirm Order & Pay with OMSIAPAWASTO
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="order-summary-column">
          <div className="info-card">
            <h2 className="card-header">Order Summary</h2>
            
            <div className="summary-section">
              <h3 className="section-heading">Products ({orderSummary.totalProducts})</h3>
              <div className="cart-items-summary">
                {cartItemsWithCalculatedPrices.map(item => (
                  <div key={item.id} className="cart-item-summary">
                    <div className="item-info">
                      <span className="item-name">{item.name || 'Product'}</span>
                      <span className="item-quantity">x{item.calculatedQuantity}</span>
                    </div>
                    <span className="item-price">
                      ₱{item.calculatedPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="summary-section">
              <h3 className="section-heading">Order Details</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Total Items:</span>
                  <span className="value">{orderSummary.totalItems} units</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Weight:</span>
                  <span className="value">{orderSummary.totalWeightGrams}g ({orderSummary.totalWeightKilos}kg)</span>
                </div>
                <div className="summary-item">
                  <span className="label">Merchandise Total:</span>
                  <span className="value">₱{orderSummary.merchandiseTotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Shipping Total:</span>
                  <span className="value">₱{orderSummary.shippingTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h3 className="section-heading">Financial Breakdown</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Transaction Giveaway:</span>
                  <span className="value">₱{orderSummary.totalTransactionGiveaway.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Omsia Profit:</span>
                  <span className="value">₱{orderSummary.totalOmsiaProfit.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Capital Cost:</span>
                  <span className="value">₱{orderSummary.totalCapital.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-item total">
              <span className="label">Total Amount:</span>
              <span className="value highlight">₱{orderSummary.total.toFixed(2)}</span>
            </div>
            
            <div className="payment-details">
              <h3 className="section-heading">Payment Method</h3>
              <div className="payment-method-selection">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="omsiapawasto"
                    checked={paymentDetails.selectedPaymentMethod === 'omsiapawasto'}
                    onChange={() => setPaymentDetails({...paymentDetails, selectedPaymentMethod: 'omsiapawasto'})}
                  />
                  <div className="method-info">
                    <div className="method-name">OMSIAPAWASTO Currency</div>
                    <div className="method-balance">Balance: ₱{paymentDetails.omsiapawastoBalance.toFixed(2)}</div>
                  </div>
                </label>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="payment-confirmation">
                <div className="summary-item total">
                  <span className="label">Amount to Pay:</span>
                  <span className="value highlight">₱{orderSummary.total.toFixed(2)}</span>
                </div>
                
                {paymentDetails.omsiapawastoBalance < orderSummary.total && (
                  <div className="insufficient-funds-warning">
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

export default PlaceOrder;