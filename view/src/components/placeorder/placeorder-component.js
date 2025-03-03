import React, { useState } from 'react';

import { useLocation,
  useNavigate
 } from 'react-router-dom';

import '../../styles/placeorder/placeorder.scss';

const PlaceOrder = () => {
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

  const [orderSummary] = useState({
    merchandiseTotal: 129.99,
    shippingTotal: 4.99,
    tax: 10.40,
    total: 145.38
  });

  const [paymentDetails] = useState({
    accountBalance: 200.00,
    availableCredits: 25.00,
    giftCardBalance: 15.00
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order placed with data:', formData);
    // Here you would typically send the data to your backend
    alert('Order successfully placed!');
  };

  const appliedCredits = Math.min(paymentDetails.availableCredits, orderSummary.total);
  const remainingTotal = orderSummary.total - appliedCredits;

  return (
    <div className="place-order-container">
      <h1>Place Order</h1>
      
      <div className="order-layout">
        <div className="shipping-details">
          <h2>Shipping & Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Details</h3>
              <div className="form-row">
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
              </div>
              <div className="form-row">
                <div className="form-group">
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
              <h3>Shipping Address</h3>
              <div className="form-group">
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
              <div className="form-row">
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
              </div>
              <div className="form-row">
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
              Place Order
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Merchandise Total:</span>
            <span>${orderSummary.merchandiseTotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping Total:</span>
            <span>${orderSummary.shippingTotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Estimated Tax:</span>
            <span>${orderSummary.tax.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
          
          <div className="payment-details">
            <h3>Payment Details</h3>
            <div className="summary-item account-info">
              <span>Account Balance:</span>
              <span>${paymentDetails.accountBalance.toFixed(2)}</span>
            </div>
            <div className="summary-item account-info">
              <span>Available Credits:</span>
              <span>${paymentDetails.availableCredits.toFixed(2)}</span>
            </div>
            <div className="summary-item account-info">
              <span>Gift Card Balance:</span>
              <span>${paymentDetails.giftCardBalance.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="payment-options">
              <h4>Apply Credits</h4>
              <div className="summary-item">
                <span>Credits to Apply:</span>
                <span>${appliedCredits.toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span>Amount to Pay:</span>
                <span>${remainingTotal.toFixed(2)}</span>
              </div>
              
              <div className="credit-toggle">
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
                <span>Use available credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;