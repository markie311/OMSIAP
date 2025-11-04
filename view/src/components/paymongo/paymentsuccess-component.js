import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/paymongo/paymentsuccess.scss'

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="payment-success-page">
      <h1>🎉 Payment Successful!</h1>
      <p>Your cash-in transaction was successful.</p>
      <button onClick={() => navigate('/useraccount')}>
        Return to Dashboard
      </button>
    </div>
  );
}