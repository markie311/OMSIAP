import React, { useState } from 'react';

import { Spinner } from 'react-bootstrap';

import generateInt32StringsDataType from '../lib/generateInt32StringDataType.js';

import { FaMoneyBillWave, FaExclamationTriangle, FaReceipt, FaClock, FaInfoCircle } from 'react-icons/fa';

import '../../styles/useraccount/useraccount.scss';

import { useNavigate } from 'react-router-dom';

import axiosCreatedInstance from '../lib/axiosutil.js';

const UserAccount = (props) => {

  const navigate = useNavigate()

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
      products: [],
      transactionDetails: {
        receiptNumber: 'RCPT-2345',
        paymentMethod: 'GCash',
        receiptImage: 'https://placeholder.com/receipt.jpg',
        notes: 'Monthly deposit'
      }
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
    },
    {
      id: 'TXN-004',
      date: '2025-02-10',
      type: 'Withdrawal',
      amount: -500.00,
      status: 'Completed',
      products: [],
      transactionDetails: {
        receiptNumber: 'WDRL-8765',
        withdrawalMethod: 'GCash',
        accountNumber: '09XX-XXX-XX89',
        notes: 'Weekly withdrawal'
      }
    }
  ]);

  const [withdrawalForm, setWithdrawalForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    amount: '',
    password: ''
  });

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

  const [currencyexchangeloadingindication, currencyexchangeloadingindicationcb] = useState(false)

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalForm({ ...withdrawalForm, [name]: value });
  };

  const handleLogout = () => {

    // In a real app, handle logout logic here
    document.cookie = `id=; path=/; max-age=0`;
    navigate('/mfatip/loginregister')

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

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const openImageModal = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setImageModalOpen(true);
  };
  
  const closeImageModal = () => {
    setImageModalOpen(false);
    setModalImageSrc(null);
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
      products: [],
      transactionDetails: {
        receiptNumber: `RCPT-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: 'GCash',
        receiptImage: previewImage,
        notes: 'Deposit via GCash'
      }
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
  
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, send withdrawal data to server
    console.log('Withdrawal submitted:', withdrawalForm);
    
    // Mock successful withdrawal
    const newTransaction = {
      id: `TXN-00${transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Withdrawal',
      amount: -parseFloat(withdrawalForm.amount),
      status: 'Pending',
      products: [],
      transactionDetails: {
        receiptNumber: `WDRL-${Math.floor(1000 + Math.random() * 9000)}`,
        withdrawalMethod: 'GCash',
        accountNumber: withdrawalForm.phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, '**-***-$3'),
        notes: 'Withdrawal to GCash'
      }
    };
    
    setTransactions([newTransaction, ...transactions]);
    setUser({
      ...user,
      balance: user.balance - parseFloat(withdrawalForm.amount)
    });
    
    // Reset form
    setWithdrawalForm({
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      amount: '',
      password: ''
    });
  };
// Initial state for the exchange form
const [exchangeForm, setExchangeForm] = useState({
  phpAmount: '',
  referenceNumber: '',
  transactionImage: null
});

const [formError, setFormError] = useState('');

// Preset PHP amounts and their OMSIAPAS equivalents
const presetAmounts = [
  { php: 210, omsiapawas: 200 },
  { php: 525, omsiapawas: 500 },
  { php: 1050, omsiapawas: 1000 },
  { php: 1260, omsiapawas: 1200 },
  { php: 1575, omsiapawas: 1500 },
  { php: 2100, omsiapawas: 2000 },
  { php: 3150, omsiapawas: 3000 },
  { php: 4200, omsiapawas: 4000 },
  { php: 5250, omsiapawas: 5000 }
];

// Handle preset amount button clicks
const handlePresetAmountClick = (amount) => {
  setExchangeForm({
    ...exchangeForm,
    phpAmount: amount
  });
  
  // Clear any previous form errors
  setFormError('');
};

// Handle changes to the exchange form
const handleExchangeChange = (e) => {
  const { name, value, files } = e.target;
  
  if (name === 'transactionImage' && files && files[0]) {
    // Handle file upload
    const file = files[0];
    setExchangeForm({
      ...exchangeForm,
      transactionImage: file
    });
    
    // Generate preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  } else if (name === 'phpAmount') {
    // Allow any input, but we'll validate on submission
    setExchangeForm({
      ...exchangeForm,
      [name]: value
    });
    
    // Clear any previous form errors
    setFormError('');
  } else {
    // Handle regular inputs
    setExchangeForm({
      ...exchangeForm,
      [name]: value
    });
  }
};

// Calculate OMSIAPAS amount from PHP amount
const calculateOmsiapasAmount = (phpAmount) => {
  // Check if amount is one of the preset amounts for exact conversion
  const presetMatch = presetAmounts.find(preset => preset.php === Number(phpAmount));
  if (presetMatch) {
    return presetMatch.omsiapawas;
  }
  
  // Otherwise calculate based on the rate
  if (phpAmount >= 210) {
    return Math.floor(phpAmount / 210 * 200);
  }
  return 0;
};


const handleExchangeSubmit = async (e) => {
  e.preventDefault();
  
  // Get response message element and reset it
  const responseMessageElement = document.querySelectorAll(".userdashboard-currencyexchange-responsemessage")[0];
  responseMessageElement.innerText = "";
  responseMessageElement.style.color = "white";
  
  // Show loading indicator
  currencyexchangeloadingindicationcb(true);
  
  // Clear previous form errors
  setFormError('');
  
  // Validate PHP amount
  if (!exchangeForm.phpAmount || exchangeForm.phpAmount < 210) {
    setFormError('Please enter an amount of at least ₱210');
    currencyexchangeloadingindicationcb(false);
    return;
  }
  
  if (exchangeForm.phpAmount > 5015) {
    setFormError('The maximum amount allowed is ₱5,015');
    currencyexchangeloadingindicationcb(false);
    return;
  }
  
  // Validate reference number
  if (!exchangeForm.referenceNumber || exchangeForm.referenceNumber.trim() === "") {
    setFormError('Please enter a valid reference number');
    currencyexchangeloadingindicationcb(false);
    return;
  }
  
  // Validate transaction image
  if (!exchangeForm.transactionImage) {
    setFormError('Please upload your transaction receipt');
    currencyexchangeloadingindicationcb(false);
    return;
  }
  
  // Calculate OMSIAPAS to be received
  const omsiapasAmount = calculateOmsiapasAmount(exchangeForm.phpAmount);
  
  // Create form data for file upload
  const formData = new FormData();
  
  // Add form fields to FormData
  formData.append('phpAmount', exchangeForm.phpAmount);
  formData.append('exchangeamount', omsiapasAmount);
  formData.append('referenceNumber', exchangeForm.referenceNumber);
  formData.append('transactionImage', exchangeForm.transactionImage);
  
  // Add user information
  const userInfo = {
    id: props.user.id,
    _id: props.user._id,
    name: {
      firstname: props.user.name.firstname,
      middlename: props.user.name.middlename || "",
      lastname: props.user.name.lastname,
      nickname: props.user.name.nickname || ""
    },
    contact: {
      phonenumber: props.user.contact.phonenumber || "123456-6789-0",
      telephonenumber: props.user.contact.telephonenumber || "",
      emailaddress: props.user.contact.emailaddress || "emailaddress@gmail.com",
      address: {
        street: props.user.contact.address?.street || "",
        trademark: props.user.contact.address?.trademark || "",
        baranggay: props.user.contact.address?.baranggay || "",
        city: props.user.contact.address?.city || "",
        province: props.user.contact.address?.province || "",
        postal_zip_code: props.user.contact.address?.postal_zip_code || "",
        country: props.user.contact.address?.country || ""
      }
    }
  };
  
  // Convert user object to JSON string and append to form data
  formData.append('transactionmadeby', JSON.stringify(userInfo));
  
  try {
    // Submit form data with file
    const response = await axiosCreatedInstance.post("/omsiap/currencyexchange", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Handle response status and display appropriate message
    handleResponseStatus(response.data);
    
    // Log success
    console.log('Exchange submitted:', {
      ...exchangeForm,
      omsiapasToReceive: omsiapasAmount,
      userName: `${props.user.name.firstname} ${props.user.name.middlename || ''} ${props.user.name.lastname}`,
      userPhone: props.user.contact.phonenumber,
      currentBalance: props.user.credits.omsiapawasto.amount
    });
    
    // Reset form on success
    if (response.data.success) {
      setExchangeForm({ phpAmount: '', referenceNumber: '', transactionImage: null });
      setPreviewImage(null);
    }
    
  } catch (error) {
    console.error('Exchange submission error:', error);
    
    // Get error message and status from response if available
    const errorMessage = error.response?.data?.message || 'An error occurred while processing your request.';
    const errorStatus = error.response?.data?.status || 'SERVER_ERROR';
    
    // Handle error response
    handleResponseStatus({
      success: false,
      status: errorStatus,
      message: errorMessage
    });
    
  } finally {
    // Hide loading indicator
    currencyexchangeloadingindicationcb(false);
  }
};

// Function to handle different response statuses
const handleResponseStatus = (responseData) => {

  const responseMessageElement = document.querySelectorAll(".userdashboard-currencyexchange-responsemessage")[0];
  
  if (!responseMessageElement) {
    console.error("Response message element not found");
    return;
  }
  
  // Default error message if no response data
  if (!responseData) {
    responseMessageElement.innerText = "An unexpected error occurred. Please try again.";
    responseMessageElement.style.color = "#ff5252";
    return;
  }
  
  // Handle different response statuses
  switch (responseData.status) {
    // Success cases
    case 'EXCHANGE_PENDING':
      responseMessageElement.innerText = "Your exchange request has been submitted and is pending approval.";
      responseMessageElement.style.color = "#4caf50";
      break;
    
    // Error cases
    case 'MISSING_FIELDS':
      responseMessageElement.innerText = "Please fill in all required fields.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    case 'INVALID_AMOUNT':
      responseMessageElement.innerText = "The exchange amount is invalid. Please check and try again.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    case 'INVALID_REFERENCE':
      responseMessageElement.innerText = "Invalid reference number. Please check and try again.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    case 'IMAGE_UPLOAD_FAILED':
      responseMessageElement.innerText = "Failed to upload your transaction image. Please try again.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    case 'NOT_FOUND':
      responseMessageElement.innerText = "System data not found. Please contact support.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    case 'DUPLICATE_REFERENCE':
      responseMessageElement.innerText = "This reference number has already been used. Please check and try again.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    case 'SERVER_ERROR':
      responseMessageElement.innerText = "A server error occurred. Please try again later or contact support.";
      responseMessageElement.style.color = "#ff5252";
      break;
      
    default:
      // Display the message from the response or a default message
      responseMessageElement.innerText = responseData.message || 
        (responseData.success ? "Operation completed successfully." : "An error occurred. Please try again.");
      responseMessageElement.style.color = responseData.success ? "#4caf50" : "#ff5252";
  }
};



const getOMSIAPASAmount = (phpAmount) => {
  // Convert to number to ensure proper comparison
  const amount = Number(phpAmount);
  
  // Match exact preset amounts
  switch (amount) {
    case 210: return 200;
    case 515: return 500;
    case 1020: return 1000;
    case 2015: return 2000;
    case 3015: return 3000;
    case 4015: return 4000;
    case 5015: return 5000;
    default:
      // Fallback calculation for custom amounts
      return Math.floor((amount * 200) / 210);
  }
};


  return (

    <div className="userdashboard-dashboard-container"
    style={{display: props.userdashboardmodal}}>
    <header className="userdashboard-dashboard-header">
    <h1>(M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople PROFILE</h1>
    <div className="userdashboard-nav-tabs">
    <button 
      className={`userdashboard-tab-btn ${activeTab === 'account' ? 'userdashboard-active' : ''}`} 
      onClick={() => setActiveTab('account')}
    >
      Account
    </button>
    <button 
      className={`userdashboard-tab-btn ${activeTab === 'deposit' ? 'userdashboard-active' : ''}`} 
      onClick={() => setActiveTab('deposit')}
    >
      Exchange Currency
    </button>
    <button 
      className={`userdashboard-tab-btn ${activeTab === 'withdrawal' ? 'userdashboard-active' : ''}`} 
      onClick={() => setActiveTab('withdrawal')}
    >
      Withdrawal
    </button>
    <button 
      className={`userdashboard-tab-btn ${activeTab === 'transactions' ? 'userdashboard-active' : ''}`} 
      onClick={() => setActiveTab('transactions')}
    >
      Transactions
    </button>
    <button 
      className={`userdashboard-tab-btn ${activeTab === 'settings' ? 'userdashboard-active' : ''}`} 
      onClick={() => setActiveTab('settings')}
    >
      Account Settings
    </button>
    </div>
    <button className="userdashboard-gotohome-btn"><a href={"/"} id="gotohomeatag">Go to home</a></button>
    {
    props.user.loginstatus === "logged in" ?
    (
      <button className="userdashboard-logout-btn" onClick={handleLogout}>LOG OUT</button>
    )
    :
    (
      <button className="userdashboard-login-btn" onClick={()=> {
        navigate('/mfatip/loginregister')
      }}>LOG IN</button>
    )
    }

    </header>

    <div className="userdashboard-dashboard-content">

    {/* Account Summary Tab */}
    {activeTab === 'account' && (

    <div className="userdashboard-account-panel">

      <section className="userdashboard-account-summary">
        <h2>Account Summary</h2>
        <div className="userdashboard-summary-details">
          <div className="userdashboard-summary-item" style={{"--item-index": 1}}>
            <span className="userdashboard-label">Account ID:</span>
            <span className="userdashboard-value">{props.user.id}</span>
          </div>
          <div className="userdashboard-summary-item" style={{"--item-index": 2}}>
            <span className="userdashboard-label">Name:</span>
            <span className="userdashboard-value">
              {props.user.name.firstname} 
              {props.user.name.middlename  && ` ${props.user.name.middlename} ` }
              {props.user.name.lastname}
            </span>
          </div>
          <div className="userdashboard-summary-item" style={{"--item-index": 3}}>
            <span className="userdashboard-label">Email:</span>
            <span className="userdashboard-value">{props.user.contact.emailaddress}</span>
          </div>
          <div className="userdashboard-summary-item" style={{"--item-index": 4}}>
            <span className="userdashboard-label">Phone:</span>
            <span className="userdashboard-value">{props.user.contact.phonenumber}</span>
          </div>
          <div className="userdashboard-summary-item" style={{"--item-index": 5}}>
            <span className="userdashboard-label">Status:</span>
            <span className="userdashboard-value userdashboard-status-active">{props.user.status.indication}</span>
          </div>
          <div className="userdashboard-summary-item" style={{"--item-index": 6}}>
            <span className="userdashboard-label">Member Since:</span>
            <span className="userdashboard-value">{props.user.status.requests[0].date}</span>
          </div>
        </div>
      </section>
      
      <section className="userdashboard-balance-details">
        <h2>Balance Details</h2>
        <div className="userdashboard-balance-amount">
          <span className="userdashboard-currency">$</span>
          <span className="userdashboard-amount">{props.user.credits.omsiapawasto.amount.toFixed(2)}</span>
        </div>
      </section>
      
      {/* Redesigned Document Verification Section */}
      <section className="userdashboard-documents-verification">
        <h2>Document Verification Status</h2>
        <div className="userdashboard-documents-status-grid">
          <div className={`userdashboard-document-card ${user.birthCertificateFront && user.birthCertificateBack ? 'userdashboard-verified' : 'userdashboard-pending'}`} style={{"--card-index": 1}}>
            <div className="userdashboard-document-icon">
              {user.birthCertificateFront && user.birthCertificateBack ? 
                <i className="fas fa-check-circle"></i> : 
                <i className="fas fa-exclamation-circle"></i>
              }
            </div>
            <div className="userdashboard-document-info">
              <h3 className="userdashboard-document-title">Birth Certificate</h3>
              <span className={`userdashboard-document-badge ${user.birthCertificateFront && user.birthCertificateBack ? 'userdashboard-verified' : 'userdashboard-pending'}`}>
                {user.birthCertificateFront && user.birthCertificateBack ? 'Verified' : 'Pending Verification'}
              </span>
              {!(user.birthCertificateFront && user.birthCertificateBack) && 
                <p className="userdashboard-document-action">Please upload your birth certificate in the Settings section</p>
              }
            </div>
          </div>

          <div className={`userdashboard-document-card ${user.governmentIdFront && user.governmentIdBack ? 'userdashboard-verified' : 'userdashboard-pending'}`} style={{"--card-index": 2}}>
            <div className="userdashboard-document-icon">
              {user.governmentIdFront && user.governmentIdBack ? 
                <i className="fas fa-check-circle"></i> : 
                <i className="fas fa-exclamation-circle"></i>
              }
            </div>
            <div className="userdashboard-document-info">
              <h3 className="userdashboard-document-title">Government ID</h3>
              <span className={`userdashboard-document-badge ${user.governmentIdFront && user.governmentIdBack ? 'userdashboard-verified' : 'userdashboard-pending'}`}>
                {user.governmentIdFront && user.governmentIdBack ? 'Verified' : 'Pending Verification'}
              </span>
              {!(user.governmentIdFront && user.governmentIdBack) && 
                <p className="userdashboard-document-action">Please upload your government ID in the Settings section</p>
              }
            </div>
          </div>
        </div>
      </section>

    </div>
    
    )}

    {/* Currency Exchange Tab */}
    {activeTab === 'deposit' && (
      <div className="userdashboard-exchange-panel">
        <section className="userdashboard-exchange-user-info">
          <h2>Your Information</h2>
          <br/>
          <br/>
          <div className="userdashboard-user-details">
            <div className="userdashboard-user-info-row">
              <div className="userdashboard-user-info-item">
                <span className="info-label">Full Name:</span>
                <span className="info-value">
                  {props.user.name.firstname} {props.user.name.middlename ? props.user.name.middlename + ' ' : ''}
                  {props.user.name.lastname}
                </span>
              </div>
              <div className="userdashboard-user-info-item">
                <span className="info-label">Phone Number:</span>
                <span className="info-value">{props.user.contact.phonenumber}</span>
              </div>
            </div>
            <br/>
            <div className="userdashboard-user-info-row">
              <div className="userdashboard-user-info-item">
                <span className="info-label">Current&nbsp;  
                  <span className="tooltip-container">
                    OMSIAPAWAS
                    <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                  </span> &nbsp; Balance:
                </span>
                <span className="info-value omsiapas-balance">{props.user.credits.omsiapawasto.amount} 
                  <span className="tooltip-container">
                  &nbsp;OMSIAPAWAS
                    <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="userdashboard-exchange-notice">
          <h2>Important Notice</h2>
          <div className="userdashboard-notice-content">
          <ul className="exchange-info">
            <li style={{color:"white"}}className="exchange-rate fade-in">
              The exchange rate is{' '}
              <strong>
                210 PESO CURRENCY = 200{' '}
                <span className="tooltip-container">
                  OMSIAPAWAS
                  <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                </span>
              </strong>
              ,{' '}
              <strong>
                525 PESO CURRENCY = 500{' '}
                <span className="tooltip-container">
                  OMSIAPAWAS
                  <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                </span>
              </strong>
              ,{' '}
              <strong>
                1050 PESO CURRENCY = 1000{' '}
                <span className="tooltip-container">
                  OMSIAPAWAS
                  <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                </span>
              </strong>
              ,{' '}
              <strong>
                1575 PESO CURRENCY = 1500{' '}
                <span className="tooltip-container">
                  OMSIAPAWAS
                  <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                </span>
              </strong>
              , and so on until reaching the maximum transaction exchange amount.
            </li>
            <li className="min-amount slide-in">
              <FaInfoCircle className="icon" />
              Minimum transaction amount is <strong>210 PHP</strong> equivalent to <strong>200 OMSIAPAWAS</strong> per exchange.
            </li>
            <li className="max-amount slide-in">
              <FaInfoCircle className="icon" />
              Maximum transaction amount is <strong>5,250 PHP</strong> equivalent to <strong>5,000 OMSIAPAWAS</strong> per exchange.
            </li>
            <li className="process-info bounce-in">
              <FaMoneyBillWave className="icon" />
              All exchanges are processed through GCash payment integration and will be validated by OMSIAP personnel through the OMSIAP database management system.
            </li>
            <li style={{color:"green"}}className="important-notice pulse">
              <FaExclamationTriangle className="icon warning" />
              Failure to send the exact amounts specified in the form will result in your money being returned to your GCash account with a 50-peso deduction for processing, or disciplinary action for not following instructions.
            </li>
            <li style={{color:"white"}}className="receipt-info fade-in">
              <FaReceipt className="icon" />
              All transactions require a valid GCash receipt screenshot for validation and comparison by OMSIAP personnel.
            </li>
            <li className="reference-info slide-in">
              <FaInfoCircle className="icon" />
              Please ensure the GCash transaction reference number is clearly visible in your screenshot.
            </li>
            <li className="processing-time bounce-in">
              <FaClock className="icon" />
              Processing may take up to 24 hours during business days.
            </li>
          </ul>
          </div>
        </section>

        <section className="userdashboard-exchange-form-section">
          <h2>Currency Exchange Form</h2>
          <form className="userdashboard-exchange-form" onSubmit={handleExchangeSubmit}>
            <div className="userdashboard-preset-amounts">
              <h3>Select Amount to Exchange</h3>
              <div className="userdashboard-preset-buttons">
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 210 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(210)}
                >
                  ₱210 = 200 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 525 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(525)}
                >
                  ₱525 = 500 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 1050 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(1050)}
                >
                  ₱1,050 = 1,000 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 1260 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(1260)}
                >
                  ₱1,260 = 1,200 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 1575 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(1575)}
                >
                  ₱1,575 = 1,500 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 2100 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(2100)}
                >
                  ₱2,100 = 2,000 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 3150 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(3150)}
                >
                  ₱3,150 = 3,000 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 4200 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(4200)}
                >
                  ₱4,200 = 4,000 OMSIAPAWAS
                </button>
                <button 
                  type="button" 
                  className={`preset-btn ${exchangeForm.phpAmount === 5250 ? 'active' : ''}`}
                  onClick={() => handlePresetAmountClick(5250)}
                >
                  ₱5,250 = 5,000 OMSIAPAWAS
                </button>
              </div>
             
            </div>

            <div className="userdashboard-payment-instructions">
              <h3>Payment Instructions</h3>
              <p>
                Please send <strong>₱{exchangeForm.phpAmount || 0}</strong> to the GCash accounts: 
                <strong> Of Macky'S Ink And Paper</strong> (OMSIAP)
              </p>
              <ul style={{color:"black"}}>
                <br/>
                <li className="userdashboard-omsiapgcashnumber">(1.) 09-1230123-123</li>
                <br/>
                <li className="userdashboard-omsiapgcashnumber">(2.) 09-123-1231-123</li>
                <br/>
                <li className="userdashboard-omsiapgcashnumber">(3.) 09-123012312-12</li>
              </ul>
            </div>
            <p style={{color:"black"}}>After sending the amount,</p>
            <p style={{color:"black"}}>1. Copy and paste the reference number in your transaction reciept and paste it on the gcash reference number field</p>
            <p style={{color:"black"}}>2. Take a screenshot of the Gcash transaction and upload it here</p>
            <p style={{color:"black"}}>3. The process exchange button will be available after selecting an amount on the currency exchange form, click process exchange after following the procedure 1 and 2. The process exchange button will be not be summited if procedure 1 and 2 is not followed.</p>
            <div className="userdashboard-form-row">
              <div className="userdashboard-form-group">
                <label htmlFor="referenceNumber">GCash Reference Number</label>
                <input
                  type="text"
                  id="referenceNumber"
                  name="referenceNumber"
                  placeholder="e.g. 1234567890"
                  value={exchangeForm.referenceNumber}
                  onChange={handleExchangeChange}
                  required
                />
              </div>
            </div>

            <div className="userdashboard-form-row userdashboard-image-upload">
              <div className="userdashboard-form-group">
                <label htmlFor="transactionImage" className="userdashboard-file-input-label">
                  GCash Transaction Screenshot
                  <div className="userdashboard-image-preview">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Transaction Screenshot"
                        onClick={() => openImageModal(previewImage)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <div className="userdashboard-upload-placeholder">
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
                  onChange={handleExchangeChange}
                  required
                  className="userdashboard-file-input"
                />
              </div>
            </div>
          
             <h3 className="userdashboard-currencyexchange-responsemessage"></h3>

            {
              currencyexchangeloadingindication ? 
              (
                <Spinner animation="border" variant="success" />
              )
              :
              (
                <button 
                  type="submit" 
                  className={`userdashboard-exchange-btn ${(!exchangeForm.phpAmount || exchangeForm.phpAmount < 210 || exchangeForm.phpAmount > 5250) ? 'disabled-btn' : ''}`}
                  disabled={!exchangeForm.phpAmount || exchangeForm.phpAmount < 210 || exchangeForm.phpAmount > 5250}
                >
                  Process Exchange
               </button>
              )
            }
          </form>
        </section>
        
      </div>
    )}

    {/* Withdrawal Tab */}
    {activeTab === 'withdrawal' && (
    <div className="userdashboard-withdrawal-panel">
      <section className="userdashboard-withdrawal-section">
        <h2>Make a Withdrawal</h2>
        <form className="userdashboard-withdrawal-form" onSubmit={handleWithdrawalSubmit}>
          <div className="userdashboard-form-row">
            <div className="userdashboard-form-group">
              <label htmlFor="w-firstName">First Name</label>
              <input
                type="text"
                id="w-firstName"
                name="firstName"
                value={withdrawalForm.firstName}
                onChange={handleWithdrawalChange}
                required
              />
            </div>
            <div className="userdashboard-form-group">
              <label htmlFor="w-middleName">Middle Name</label>
              <input
                type="text"
                id="w-middleName"
                name="middleName"
                value={withdrawalForm.middleName}
                onChange={handleWithdrawalChange}
              />
            </div>
          </div>
          
          <div className="userdashboard-form-row">
            <div className="userdashboard-form-group">
              <label htmlFor="w-lastName">Last Name</label>
              <input
                type="text"
                id="w-lastName"
                name="lastName"
                value={withdrawalForm.lastName}
                onChange={handleWithdrawalChange}
                required
              />
            </div>
            <div className="userdashboard-form-group">
              <label htmlFor="w-phoneNumber">GCash Phone Number</label>
              <input
                type="tel"
                id="w-phoneNumber"
                name="phoneNumber"
                value={withdrawalForm.phoneNumber}
                onChange={handleWithdrawalChange}
                required
              />
            </div>
          </div>
          
          <div className="userdashboard-form-row">
            <div className="userdashboard-form-group">
              <label htmlFor="w-amount">Withdrawal Amount</label>
              <input
                type="number"
                id="w-amount"
                name="amount"
                min="1"
                step="0.01"
                value={withdrawalForm.amount}
                onChange={handleWithdrawalChange}
                required
              />
            </div>
            <div className="userdashboard-form-group">
              <label htmlFor="w-password">Account Password</label>
              <input
                type="password"
                id="w-password"
                name="password"
                value={withdrawalForm.password}
                onChange={handleWithdrawalChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="userdashboard-withdrawal-btn">Submit Withdrawal</button>
        </form>
      </section>
    </div>
    )}

    {/* Transactions Tab */}
    {activeTab === 'transactions' && (
    <div className="userdashboard-transactions-panel">
      <section className="userdashboard-transactions-section">
        <h2>Recent Transactions</h2>
        <div className="userdashboard-transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="userdashboard-transaction-item">
              <div className="userdashboard-transaction-header">
                <div className="userdashboard-transaction-info">
                  <span className="userdashboard-transaction-id">{transaction.id}</span>
                  <span className="userdashboard-transaction-date">{transaction.date}</span>
                </div>
                <div className="userdashboard-transaction-status">
                  <span className={`userdashboard-status-badge userdashboard-${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
              
              <div className="userdashboard-transaction-details">
                <div className="userdashboard-transaction-type">
                  <span className={`userdashboard-type-badge userdashboard-${transaction.type.toLowerCase()}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="userdashboard-transaction-amount">
                  <span className={transaction.amount >= 0 ? 'userdashboard-amount-positive' : 'userdashboard-amount-negative'}>
                    {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}  
                  </span>
                </div>
              </div>
              
              <div className="userdashboard-view-details">
              <button 
                className="userdashboard-view-details-btn"
                onClick={() => openTransactionModal(transaction)}
              >
                {transaction.products.length > 0 
                  ? `View ${transaction.products.length} items` 
                  : "View transaction details"}
              </button>
            </div>

            </div>
          ))}
        </div>
      </section>
    </div>
    )}

    {/* Settings Tab */}
    {activeTab === 'settings' && (
    <div className="userdashboard-settings-panel">
      <section className="userdashboard-user-settings">
        <h2>Account Settings</h2>
        <form className="userdashboard-profile-form" onSubmit={handleProfileSubmit}>
          <div className="userdashboard-settings-group userdashboard-personal-info">
            <h3>Personal Information</h3>
            <div className="userdashboard-form-row">
              <div className="userdashboard-form-group">
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
              <div className="userdashboard-form-group">
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
            
            <div className="userdashboard-form-row">
              <div className="userdashboard-form-group">
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
              <div className="userdashboard-form-group">
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
          
          <div className="userdashboard-settings-group userdashboard-document-uploads">
            <h3>Identity Verification Documents</h3>
            
            <div className="userdashboard-document-section">
              <h4>Birth Certificate</h4>
              <div className="userdashboard-form-row userdashboard-document-row">
                <div className="userdashboard-form-group">
                  <label htmlFor="birthCertificateFront" className="userdashboard-file-input-label">
                    Front of Birth Certificate
                    <div className="userdashboard-image-preview">
                      {previewImages.birthCertificateFront ? (
                        <img src={previewImages.birthCertificateFront} alt="Birth Certificate Front" 
                              style={{height:'15vh', width:'10vw'}}/>
                      ) : (
                        <div className="userdashboard-upload-placeholder">
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
                    className="userdashboard-file-input"
                  />
                </div>
                
                <div className="userdashboard-form-group">
                  <label htmlFor="birthCertificateBack" className="userdashboard-file-input-label">
                    Back of Birth Certificate
                    <div className="userdashboard-image-preview">
                      {previewImages.birthCertificateBack ? (
                        <img src={previewImages.birthCertificateBack} alt="Birth Certificate Back" style={{height:'15vh', width:'10vw'}}/>
                      ) : (
                        <div className="userdashboard-upload-placeholder">
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
                    className="userdashboard-file-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="userdashboard-document-section">
              <h4>Government ID</h4>
              <div className="userdashboard-form-row userdashboard-document-row">
                <div className="userdashboard-form-group">
                  <label htmlFor="governmentIdFront" className="userdashboard-file-input-label">
                    Front of Government ID
                    <div className="userdashboard-image-preview">
                      {previewImages.governmentIdFront ? (
                        <img src={previewImages.governmentIdFront} alt="Government ID Front" style={{height:'15vh', width:'10vw'}} />
                      ) : (
                        <div className="userdashboard-upload-placeholder">
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
                    className="userdashboard-file-input"
                  />
                </div>
                
                <div className="userdashboard-form-group">
                  <label htmlFor="governmentIdBack" className="userdashboard-file-input-label">
                    Back of Government ID
                    <div className="userdashboard-image-preview">
                      {previewImages.governmentIdBack ? (
                        <img src={previewImages.governmentIdBack} alt="Government ID Back" style={{height:'15vh', width:'10vw'}}/>
                      ) : (
                        <div className="userdashboard-upload-placeholder">
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
                    className="userdashboard-file-input"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="userdashboard-settings-actions">
                <button  type="submit" 
                        className="userdashboard-save-settings-btn">
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
    <div className="userdashboard-modal-overlay" onClick={closeTransactionModal}>
    <div className="userdashboard-modal-content" onClick={e => e.stopPropagation()}>
      <div className="userdashboard-modal-header">
        <h3>Transaction Details</h3>
        <button className="userdashboard-close-modal-btn" onClick={closeTransactionModal}>×</button>
      </div>

      <div className="userdashboard-modal-body">
        <div className="userdashboard-transaction-summary">
          <div className="userdashboard-summary-row">
            <span className="userdashboard-label">Transaction ID:</span>
            <span className="userdashboard-value">{selectedTransaction.id}</span>
          </div>
          <div className="userdashboard-summary-row">
            <span className="userdashboard-label">Date:</span>
            <span className="userdashboard-value">{selectedTransaction.date}</span>
          </div>
          <div className="userdashboard-summary-row">
            <span className="userdashboard-label">Type:</span>
            <span className="userdashboard-value">{selectedTransaction.type}</span>
          </div>
          <div className="userdashboard-summary-row">
            <span className="userdashboard-label">Status:</span>
            <span className={`userdashboard-value userdashboard-status-${selectedTransaction.status.toLowerCase()}`}>
              {selectedTransaction.status}
            </span>
          </div>
          <div className="userdashboard-summary-row">
            <span className="userdashboard-label">Total Amount:</span>
            <span className={selectedTransaction.amount >= 0 ? 'userdashboard-value userdashboard-amount-positive' : 'userdashboard-value userdashboard-amount-negative'}>
              {selectedTransaction.amount >= 0 ? '+' : ''}${Math.abs(selectedTransaction.amount).toFixed(2)}
            </span>
          </div>
          
          {/* Additional details for deposits and withdrawals */}
          {selectedTransaction.transactionDetails && (
            <>
              {selectedTransaction.transactionDetails.receiptNumber && (
                <div className="userdashboard-summary-row">
                  <span className="userdashboard-label">Receipt Number:</span>
                  <span className="userdashboard-value">{selectedTransaction.transactionDetails.receiptNumber}</span>
                </div>
              )}
              
              {selectedTransaction.transactionDetails.paymentMethod && (
                <div className="userdashboard-summary-row">
                  <span className="userdashboard-label">Payment Method:</span>
                  <span className="userdashboard-value">{selectedTransaction.transactionDetails.paymentMethod}</span>
                </div>
              )}
              
              {selectedTransaction.transactionDetails.withdrawalMethod && (
                <div className="userdashboard-summary-row">
                  <span className="userdashboard-label">Withdrawal Method:</span>
                  <span className="userdashboard-value">{selectedTransaction.transactionDetails.withdrawalMethod}</span>
                </div>
              )}
              
              {selectedTransaction.transactionDetails.accountNumber && (
                <div className="userdashboard-summary-row">
                  <span className="userdashboard-label">Account Number:</span>
                  <span className="userdashboard-value">{selectedTransaction.transactionDetails.accountNumber}</span>
                </div>
              )}
              
              {selectedTransaction.transactionDetails.notes && (
                <div className="userdashboard-summary-row">
                  <span className="userdashboard-label">Notes:</span>
                  <span className="userdashboard-value">{selectedTransaction.transactionDetails.notes}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Display receipt image for deposits if available */}
        {selectedTransaction.transactionDetails && selectedTransaction.transactionDetails.receiptImage && (
          <div className="userdashboard-receipt-image-container">
            <h4>Transaction Receipt</h4>
            <img 
              src={selectedTransaction.transactionDetails.receiptImage} 
              alt="Transaction Receipt"
              className="userdashboard-receipt-image"
              onClick={() => openImageModal(selectedTransaction.transactionDetails.receiptImage)}
              style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '200px' }}
            />
            <p className="userdashboard-image-hint">Click on image to view full size</p>
          </div>
        )}
        
        {/* Show product details for purchase transactions */}
        {selectedTransaction.products.length > 0 && (
          <div className="userdashboard-product-details">
            <h4>Purchased Merchandise</h4>
            <table className="userdashboard-product-table">
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
                  <tr key={product.id} className="userdashboard-product-row">
                    <td className="userdashboard-product-name">{product.name}</td>
                    <td className="userdashboard-product-details">
                      {product.color && <span>Color: {product.color}</span>}
                      {product.size && <span>Size: {product.size}</span>}
                    </td>
                    <td className="userdashboard-product-quantity">{product.quantity}</td>
                    <td className="userdashboard-product-price">${product.price.toFixed(2)}</td>
                    <td className="userdashboard-product-subtotal">${(product.price * product.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="userdashboard-total-label">Total</td>
                  <td className="userdashboard-total-amount">
                    ${selectedTransaction.products.reduce((sum, product) => 
                      sum + (product.price * product.quantity), 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
      
      <div className="userdashboard-modal-footer">
        <button className="userdashboard-modal-btn" onClick={closeTransactionModal}>Close</button>
      </div>
    </div>
    </div>
    )}


    {/* Full-size Image Modal */}
    {imageModalOpen && modalImageSrc && (
    <div className="userdashboard-modal-overlay userdashboard-full-size-modal" onClick={closeImageModal}>
    <div className="userdashboard-modal-content userdashboard-image-modal-content" onClick={e => e.stopPropagation()}>
      <button className="userdashboard-close-modal-btn" onClick={closeImageModal}>×</button>
      <img src={modalImageSrc} alt="Full size image" className="userdashboard-full-size-image" />
    </div>
    </div>
    )}

    </div>

  );
};
  
export default UserAccount;