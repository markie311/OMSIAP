import React, { useState } from 'react';

import { Spinner } from 'react-bootstrap';

import generateInt32StringsDataType from '../lib/generateInt32StringDataType.js';

import '../../styles/useraccount/useraccount.scss';

const UserAccount = (props) => {


  const [user, setUser] = useState({
    id: 'Blank',
    firstName: 'Blank',
    middleName: 'Blank',
    lastName: 'Blank',
    email: 'Blank',
    phoneNumber: 'Blank',
    balance: 0,
    status: 'Unregistered',
    joinDate: 'Blank',
    birthCertificateFront: null,
    birthCertificateBack: null,
    governmentIdFront: null,
    governmentIdBack: null,
  });

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-001',
      date: '2025-02-25',
      type: 'Purchase',
      amount: -1200.50,
      status: 'Completed',
      products: [
        { id: 'PRD-001', name: 'Premium T-Shirt', price: 299.99, quantity: 1, color: 'Black', size: 'L' },
        { id: 'PRD-002', name: 'Designer Jeans', price: 450.50, quantity: 1, color: 'Blue', size: 'M' },
        { id: 'PRD-003', name: 'Sports Socks', price: 75.00, quantity: 3, color: 'White', size: 'One Size' }
      ]
    },
    {
      id: 'TXN-002',
      date: '2025-02-20',
      type: 'Deposit',
      amount: 3000.00,
      status: 'Completed',
      products: []
    },
    {
      id: 'TXN-003',
      date: '2025-02-15',
      type: 'Purchase',
      amount: -750.25,
      status: 'Completed',
      products: [
        { id: 'PRD-004', name: 'Running Shoes', price: 599.99, quantity: 1, color: 'Red/Black', size: '42' },
        { id: 'PRD-005', name: 'Water Bottle', price: 45.25, quantity: 1, color: 'Blue', size: '750ml' },
        { id: 'PRD-006', name: 'Fitness Band', price: 105.01, quantity: 1, color: 'Black', size: 'Regular' }
      ]
    }
  ]);

  const [depositForm, setDepositForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    amount: '',
    transactionImage: null
  });

  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthCertificateFront: null,
    birthCertificateBack: null,
    governmentIdFront: null,
    governmentIdBack: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewImages, setPreviewImages] = useState({
    birthCertificateFront: user.birthCertificateFront ? URL.createObjectURL(user.birthCertificateFront) : null,
    birthCertificateBack: user.birthCertificateBack ? URL.createObjectURL(user.birthCertificateBack) : null,
    governmentIdFront: user.governmentIdFront ? URL.createObjectURL(user.governmentIdFront) : null,
    governmentIdBack: user.governmentIdBack ? URL.createObjectURL(user.governmentIdBack) : null
  });
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  const handleLogout = () => {
    // In a real app, handle logout logic here
    document.cookie = `id=; path=/; max-age=0`;

  };

  const handleDepositChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'transactionImage' && files && files[0]) {
      setDepositForm({ ...depositForm, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setDepositForm({ ...depositForm, [name]: value });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      setProfileForm({ ...profileForm, [name]: files[0] });
      setPreviewImages({
        ...previewImages,
        [name]: URL.createObjectURL(files[0])
      });
    } else {
      setProfileForm({ ...profileForm, [name]: value });
    }
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, send deposit data to server
    console.log('Deposit submitted:', depositForm);
    
    // Mock successful deposit
    const newTransaction = {
      id: `TXN-00${transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Deposit',
      amount: parseFloat(depositForm.amount),
      status: 'Pending',
      products: []
    };
    
    setTransactions([newTransaction, ...transactions]);
    setUser({
      ...user,
      balance: user.balance + parseFloat(depositForm.amount)
    });
    
    // Reset form
    setDepositForm({
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      amount: '',
      transactionImage: null
    });
    setPreviewImage(null);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, send profile update to server
    console.log('Profile updated:', profileForm);
    
    // Update user state with new profile information
    setUser({
      ...user,
      firstName: profileForm.firstName,
      middleName: profileForm.middleName,
      lastName: profileForm.lastName,
      phoneNumber: profileForm.phoneNumber,
      birthCertificateFront: profileForm.birthCertificateFront || user.birthCertificateFront,
      birthCertificateBack: profileForm.birthCertificateBack || user.birthCertificateBack,
      governmentIdFront: profileForm.governmentIdFront || user.governmentIdFront,
      governmentIdBack: profileForm.governmentIdBack || user.governmentIdBack
    });
    
    // Show success message (in a real app, this would be more sophisticated)
    alert('Profile updated successfully!');
  };

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="dashboard-container"
         style={{display: props.userdashboardmodal}}>
      <header className="dashboard-header">
        <h1>(M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople PROFILE ACCOUNT</h1>
        <div className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} 
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button 
            className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`} 
            onClick={() => setActiveTab('deposit')}
          >
            Deposit
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} 
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('settings')}
          >
            Account Settings
          </button>
        </div>
        <button className="gotohome-btn"><a href={"/"} id="gotohomeatag">Go to home</a></button>
        <button className="logout-btn" onClick={handleLogout}>LOG OUT</button>
        
      </header>
      
      <div className="dashboard-content">
        {/* Account Summary Tab */}
        {activeTab === 'account' && (
          <div className="account-panel">
            <section className="account-summary">
              <h2>Account Summary</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="label">Account ID:</span>
                  <span className="value">{props.user.id}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Name:</span>
                  <span className="value">
                    {props.user.name.firstname} 
                    {props.user.name.middlename  && ` ${props.user.name.middlename} ` }
                    {props.user.name.lastname}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Email:</span>
                  <span className="value">{props.user.contact.emailaddress}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Phone:</span>
                  <span className="value">{props.user.contact.phonenumber}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Status:</span>
                  <span className="value status-active">{props.user.status.indication}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Member Since:</span>
                  <span className="value">{props.user.status.requests[0].date}</span>
                </div>
              </div>
            </section>
            
            <section className="balance-details">
              <h2>Balance Details</h2>
              <div className="balance-amount">
                <span className="currency">$</span>
                <span className="amount">{props.user.credits.omsiapawasto.amount.toFixed(2)}</span>
              </div>
            </section>
            
            {/* Redesigned Document Verification Section */}
            <section className="documents-verification">
              <h2>Document Verification Status</h2>
              <div className="documents-status-grid">
                <div className={`document-card ${user.birthCertificateFront && user.birthCertificateBack ? 'verified' : 'pending'}`}>
                  <div className="document-icon">
                    {user.birthCertificateFront && user.birthCertificateBack ? 
                      <i className="fas fa-check-circle"></i> : 
                      <i className="fas fa-exclamation-circle"></i>
                    }
                  </div>
                  <div className="document-info">
                    <h3 className="document-title">Birth Certificate</h3>
                    <span className={`document-badge ${user.birthCertificateFront && user.birthCertificateBack ? 'verified' : 'pending'}`}>
                      {user.birthCertificateFront && user.birthCertificateBack ? 'Verified' : 'Pending Verification'}
                    </span>
                    {!(user.birthCertificateFront && user.birthCertificateBack) && 
                      <p className="document-action">Please upload your birth certificate in the Settings section</p>
                    }
                  </div>
                </div>

                <div className={`document-card ${user.governmentIdFront && user.governmentIdBack ? 'verified' : 'pending'}`}>
                  <div className="document-icon">
                    {user.governmentIdFront && user.governmentIdBack ? 
                      <i className="fas fa-check-circle"></i> : 
                      <i className="fas fa-exclamation-circle"></i>
                    }
                  </div>
                  <div className="document-info">
                    <h3 className="document-title">Government ID</h3>
                    <span className={`document-badge ${user.governmentIdFront && user.governmentIdBack ? 'verified' : 'pending'}`}>
                      {user.governmentIdFront && user.governmentIdBack ? 'Verified' : 'Pending Verification'}
                    </span>
                    {!(user.governmentIdFront && user.governmentIdBack) && 
                      <p className="document-action">Please upload your government ID in the Settings section</p>
                    }
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className="deposit-panel">
            <section className="deposit-section">
              <h2>Make a Deposit</h2>
              <form className="deposit-form" onSubmit={handleDepositSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={depositForm.firstName}
                      onChange={handleDepositChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="middleName">Middle Name</label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={depositForm.middleName}
                      onChange={handleDepositChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={depositForm.lastName}
                      onChange={handleDepositChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={depositForm.phoneNumber}
                      onChange={handleDepositChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="amount">Deposit Amount</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="1"
                      step="0.01"
                      value={depositForm.amount}
                      onChange={handleDepositChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row image-upload">
                  <div className="form-group">
                    <label htmlFor="transactionImage" className="file-input-label">
                      GCash Transaction Screenshot
                      <div className="image-preview">
                        {previewImage ? (
                          <img src={previewImage} alt="Transaction Screenshot" />
                        ) : (
                          <div className="upload-placeholder">
                            <span>Upload GCash Screenshot</span>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id="transactionImage"
                      name="transactionImage"
                      accept="image/*"
                      onChange={handleDepositChange}
                      required
                      className="file-input"
                    />
                  </div>
                </div>
                
                <button type="submit" className="deposit-btn">Submit Deposit</button>
              </form>
            </section>
          </div>
        )}
        
        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="transactions-panel">
            <section className="transactions-section">
              <h2>Recent Transactions</h2>
              <div className="transactions-list">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-header">
                      <div className="transaction-info">
                        <span className="transaction-id">{transaction.id}</span>
                        <span className="transaction-date">{transaction.date}</span>
                      </div>
                      <div className="transaction-status">
                        <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="transaction-details">
                      <div className="transaction-type">
                        <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                          {transaction.type}
                        </span>
                      </div>
                      <div className="transaction-amount">
                        <span className={transaction.amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}  
                        </span>
                      </div>
                    </div>
                    
                    {transaction.products.length > 0 && (
                      <div className="view-details">
                        <button 
                          className="view-details-btn"
                          onClick={() => openTransactionModal(transaction)}
                        >
                          View {transaction.products.length} items
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-panel">
            <section className="user-settings">
              <h2>Account Settings</h2>
              <form className="profile-form" onSubmit={handleProfileSubmit}>
                <div className="settings-group personal-info">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-firstName">First Name</label>
                      <input
                        type="text"
                        id="profile-firstName"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-middleName">Middle Name</label>
                      <input
                        type="text"
                        id="profile-middleName"
                        name="middleName"
                        value={profileForm.middleName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-lastName">Last Name</label>
                      <input
                        type="text"
                        id="profile-lastName"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-phoneNumber">Phone Number</label>
                      <input
                        type="tel"
                        id="profile-phoneNumber"
                        name="phoneNumber"
                        value={profileForm.phoneNumber}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="settings-group document-uploads">
                  <h3>Identity Verification Documents</h3>
                  
                  <div className="document-section">
                    <h4>Birth Certificate</h4>
                    <div className="form-row document-row">
                      <div className="form-group">
                        <label htmlFor="birthCertificateFront" className="file-input-label">
                          Front of Birth Certificate
                          <div className="image-preview">
                            {previewImages.birthCertificateFront ? (
                              <img src={previewImages.birthCertificateFront} alt="Birth Certificate Front" 
                                   style={{height:'15vh', width:'10vw'}}/>
                            ) : (
                              <div className="upload-placeholder">
                                <span>Upload Front Image</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          id="birthCertificateFront"
                          name="birthCertificateFront"
                          accept="image/*"
                          onChange={handleProfileChange}
                          className="file-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="birthCertificateBack" className="file-input-label">
                          Back of Birth Certificate
                          <div className="image-preview">
                            {previewImages.birthCertificateBack ? (
                              <img src={previewImages.birthCertificateBack} alt="Birth Certificate Back" style={{height:'15vh', width:'10vw'}}/>
                            ) : (
                              <div className="upload-placeholder">
                                <span>Upload Back Image</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          id="birthCertificateBack"
                          name="birthCertificateBack"
                          accept="image/*"
                          onChange={handleProfileChange}
                          className="file-input"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="document-section">
                    <h4>Government ID</h4>
                    <div className="form-row document-row">
                      <div className="form-group">
                        <label htmlFor="governmentIdFront" className="file-input-label">
                          Front of Government ID
                          <div className="image-preview">
                            {previewImages.governmentIdFront ? (
                              <img src={previewImages.governmentIdFront} alt="Government ID Front" style={{height:'15vh', width:'10vw'}} />
                            ) : (
                              <div className="upload-placeholder">
                                <span>Upload Front Image</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          id="governmentIdFront"
                          name="governmentIdFront"
                          accept="image/*"
                          onChange={handleProfileChange}
                          className="file-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="governmentIdBack" className="file-input-label">
                          Back of Government ID
                          <div className="image-preview">
                            {previewImages.governmentIdBack ? (
                              <img src={previewImages.governmentIdBack} alt="Government ID Back" style={{height:'15vh', width:'10vw'}}/>
                            ) : (
                              <div className="upload-placeholder">
                                <span>Upload Back Image</span>
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          id="governmentIdBack"
                          name="governmentIdBack"
                          accept="image/*"
                          onChange={handleProfileChange}
                          className="file-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="settings-actions">
                     <button  type="submit" 
                              className="save-settings-btn">
                          Save changes
                      </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="modal-overlay" onClick={closeTransactionModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="close-modal-btn" onClick={closeTransactionModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="transaction-summary">
                <div className="summary-row">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{selectedTransaction.id}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Date:</span>
                  <span className="value">{selectedTransaction.date}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Type:</span>
                  <span className="value">{selectedTransaction.type}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Status:</span>
                  <span className={`value status-${selectedTransaction.status.toLowerCase()}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="label">Total Amount:</span>
                  <span className={selectedTransaction.amount >= 0 ? 'value amount-positive' : 'value amount-negative'}>
                    {selectedTransaction.amount >= 0 ? '+' : ''}${Math.abs(selectedTransaction.amount).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {selectedTransaction.products.length > 0 && (
                <div className="product-details">
                  <h4>Purchased Merchandise</h4>
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Details</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTransaction.products.map(product => (
                        <tr key={product.id} className="product-row">
                          <td className="product-name">{product.name}</td>
                          <td className="product-details">
                            {product.color && <span>Color: {product.color}</span>}
                            {product.size && <span>Size: {product.size}</span>}
                          </td>
                          <td className="product-quantity">{product.quantity}</td>
                          <td className="product-price">${product.price.toFixed(2)}</td>
                          <td className="product-subtotal">${(product.price * product.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="total-label">Total</td>
                        <td className="total-amount">
                          ${selectedTransaction.products.reduce((sum, product) => 
                            sum + (product.price * product.quantity), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-btn" onClick={closeTransactionModal}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
  
export default UserAccount;