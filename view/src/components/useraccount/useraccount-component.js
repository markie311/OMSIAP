import React, { useState } from 'react';
import '../../styles/useraccount/useraccount.scss';

const UserAccount = () => {

  // Sample user data (in a real app, this would come from an API)
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    accountNumber: "4257-8895-3300",
    balance: 2543.87,
    transactions: [
      { id: 1, date: "2025-02-20", description: "Grocery Store", amount: -78.52, type: "debit" },
      { id: 2, date: "2025-02-18", description: "Salary Deposit", amount: 2450.00, type: "credit" },
      { id: 3, date: "2025-02-15", description: "Electric Bill", amount: -145.30, type: "debit" },
      { id: 4, date: "2025-02-10", description: "Online Purchase", amount: -59.99, type: "debit" },
      { id: 5, date: "2025-02-05", description: "Restaurant", amount: -42.75, type: "debit" },
      { id: 6, date: "2025-01-30", description: "Gas Station", amount: -35.80, type: "debit" },
      { id: 7, date: "2025-01-25", description: "Interest", amount: 3.24, type: "credit" }
    ]
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="user-account-container">
      <header className="account-header">
        <h1>My Account</h1>
        <div className="user-greeting">Welcome back, {userData.name}</div>
      </header>

      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Account Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Account Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-container">
            <div className="account-card">
              <h2>Account Summary</h2>
              <div className="account-details">
                <div className="detail-item">
                  <span className="detail-label">Account Number:</span>
                  <span className="detail-value">{userData.accountNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Balance:</span>
                  <span className="detail-value balance">{formatCurrency(userData.balance)}</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-button">Transfer Money</button>
                <button className="action-button">Pay Bills</button>
                <button className="action-button">Download Statement</button>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="transaction-list">
                {userData.transactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-details">
                      <div className="transaction-date">{formatDate(transaction.date)}</div>
                      <div className="transaction-description">{transaction.description}</div>
                    </div>
                    <div className="transaction-amount">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
                <button 
                  className="view-all-button"
                  onClick={() => setActiveTab('transactions')}
                >
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-container">
            <h2>Transaction History</h2>
            <div className="filter-options">
              <select defaultValue="all" className="filter-select">
                <option value="all">All Transactions</option>
                <option value="credit">Deposits Only</option>
                <option value="debit">Withdrawals Only</option>
              </select>
              <input type="text" placeholder="Search transactions..." className="search-input" />
            </div>
            <div className="transaction-list full">
              {userData.transactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-details">
                    <div className="transaction-date">{formatDate(transaction.date)}</div>
                    <div className="transaction-description">{transaction.description}</div>
                  </div>
                  <div className="transaction-amount">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-container">
            <h2>Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue={userData.name} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue={userData.email} />
              </div>
              <div className="form-group">
                <label>Notification Preferences</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input type="checkbox" id="emailNotif" defaultChecked />
                    <label htmlFor="emailNotif">Email Notifications</label>
                  </div>
                  <div className="checkbox-item">
                    <input type="checkbox" id="smsNotif" defaultChecked />
                    <label htmlFor="smsNotif">SMS Notifications</label>
                  </div>
                  <div className="checkbox-item">
                    <input type="checkbox" id="pushNotif" />
                    <label htmlFor="pushNotif">Push Notifications</label>
                  </div>
                </div>
              </div>
              <button className="save-button">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;