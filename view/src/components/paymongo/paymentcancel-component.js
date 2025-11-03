import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/paymongo/paymentcancel.scss'

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="payment-cancel-page">
      <h1>❌ Payment Cancelled</h1>
      <p>Your cash-in transaction was not completed. Please try again.</p>
      <button onClick={() => navigate('/useraccount')}>
        Go Back
      </button>
    </div>
  );
}