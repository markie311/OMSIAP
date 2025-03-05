import React, { useState } from 'react';

import { Spinner } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import generateInt32StringsDataType from '../lib/generateInt32StringDataType.js';
import { timestamp } from "../lib/timestamps.js"

import '../../styles/registrationpage/registrationpage.scss';

import axiosCreatedInstance from '../lib/axiosutil.js';

const RegistrationPage = (props) => {

  const navigate = useNavigate();

  const [signinbuttonloadingindication, signinbuttonloadingindicationcb] = useState(false);
  const [registerbuttonloadingindication, registerbuttonloadingindicationcb] = useState(false); 
  const [refresh, setRefresh] = useState(false);
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [registrationresponsemessage, registrationresponsemessagecb] = useState({
    status: "",
    indication: "",
    bulletpoint1: "",
    bulletpoint2: "",
    advice: ""
  });
  const [registrationresponsemessagetextcolorindication, registrationresponsemessagetextcolorindicationcb] = useState("green");

  // Verification state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Mock accounts for verification
  const [userAccounts, setUserAccounts] = useState([
    {
      id: 1,
      fullName: 'John Smith',
      birthDate: '1985-04-12',
      registrationDate: '2023-08-15',
      password: 'password123' // In a real app, you would never store passwords in plain text
    },
    {
      id: 2,
      fullName: 'John Smith',
      birthDate: '1990-06-22',
      registrationDate: '2024-01-28',
      password: 'smith1990' // In a real app, you would never store passwords in plain text
    }
  ]);
  
  // Form state for registration modal
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleSignIn = async (e) => {
    e.preventDefault();
    signinbuttonloadingindicationcb(true);

    if (!fullname || !password) {
      setError('Please fill in all fields');
      signinbuttonloadingindicationcb(false);
      return;
    }

    const _parsedfullname = parseFullName(fullname);
    alert(JSON.stringify(_parsedfullname))
  
    {/*
    // Simulate API call
    setTimeout(() => {
      // Check if the user has multiple accounts with the same name
      const matchingAccounts = userAccounts.filter(account => 
        account.fullName.toLowerCase() === fullname.toLowerCase()
      );
      
      if (matchingAccounts.length > 1) {
        // Show verification modal if multiple accounts exist
        setShowVerificationModal(true);
        signinbuttonloadingindicationcb(false);
      } else if (matchingAccounts.length === 1) {
        // Show password confirmation modal for single account
        setSelectedAccount(matchingAccounts[0]);
        setShowPasswordModal(true);
        signinbuttonloadingindicationcb(false);
      } else {
        // No matching accounts
        setError('No account found with that name');
        signinbuttonloadingindicationcb(false);
      }
    }, 1000);
     */}

     await axiosCreatedInstance.post("/people/login", {
       $firstname: _parsedfullname.firstName,
       $middlename: _parsedfullname.middleName,
       $lastname: _parsedfullname.lastName,
       $password: password
     }).then((response)=> {
       console.log(response.data)
       const _responsemessage = response.data.message;
       const _registrant = response.data.registrant;
       switch(_responsemessage) {
          case "No user found with the provided name details":
            setError('No account found with that name');
            signinbuttonloadingindicationcb(false);
          break;
          case "Login successful":
              alert(_registrant.id)
              // Save nickname and encrypted password in cookies for 1 year (365 days)
              const oneYearFromNow = 365 * 24 * 60 * 60;
              document.cookie = `id=${_registrant.id}; path=/; max-age=${oneYearFromNow}`;
              // In a real application, you would never store passwords in cookies
              // This is just for demonstration purposes
              // Normally you would handle authentication via a secure backend
              // document.cookie = `auth=true; path=/; max-age=${oneYearFromNow}`;
              //   props.usercb(_registrant)
              document.querySelectorAll(".loginpage-responsemessagecontainer")[0].style.display = "block";
          break;
          case "Incorrect password":
            setError('Incorrect password');
            signinbuttonloadingindicationcb(false);
          break;
       }

     //  document.querySelector("#registration-results").style.display = "block";
       registerbuttonloadingindicationcb(false);
     })


  };

  const completeSignIn = () => {
    const _userid = `${generateInt32StringsDataType(16)}-A-1`;
    const oneYearFromNow = 365 * 24 * 60 * 60;
    document.cookie = `id=${_userid}; path=/; max-age=${oneYearFromNow}`;
    
    document.querySelector("#successfullyloggedin-headerindication").style.display = "block";
    document.querySelector("#gobacktohome-atag").style.display = "block";

    setError('');
    setVerificationComplete(true);
    setShowVerificationModal(false);
    setShowPasswordModal(false);
    signinbuttonloadingindicationcb(false);
    setVerificationPassword('');
    setPasswordError('');

    props.handleLoadingIndicatorModal && props.handleLoadingIndicatorModal();
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
  };

  const handleVerification = () => {
    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }
    
    // Proceed to password verification after account selection
    setShowVerificationModal(false);
    setShowPasswordModal(true);
  };

  const handlePasswordVerification = () => {
    setPasswordLoading(true);
    setPasswordError('');
    
    // Simulate password verification
    setTimeout(() => {
      // In a real app, you would verify against hashed passwords
      if (verificationPassword === selectedAccount.password) {
        completeSignIn();
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
      setPasswordLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  function parseFullName(fullName) {
    // Trim whitespace and handle empty input
    if (!fullName || typeof fullName !== 'string') {
      return {
        firstName: '',
        middleName: '',
        lastName: ''
      };
    }
    
    // Trim and split the full name by spaces
    const nameParts = fullName.trim().split(/\s+/);
    
    // Handle different cases based on the number of parts
    if (nameParts.length === 1) {
      // Just a first name
      return {
        firstName: nameParts[0],
        middleName: '',
        lastName: ''
      };
    } else if (nameParts.length === 2) {
      // First and last name only
      return {
        firstName: nameParts[0],
        middleName: '',
        lastName: nameParts[1]
      };
    } else {
      // First name, middle name(s), and last name
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      // Everything between first and last name is considered middle name
      const middleName = nameParts.slice(1, nameParts.length - 1).join(' ');
      
      return {
        firstName,
        middleName,
        lastName
      };
    }
  }

  const handleRegistration = async (e) => {

     e.preventDefault();
     registerbuttonloadingindicationcb(false);

    const validationErrors = validateForm();
 
    if (Object.keys(validationErrors).length === 0) {

      {/*
      // Simulate registration processing
      setTimeout(() => {
        // Create a new account entry
        const newAccount = {
          id: userAccounts.length + 1,
          fullName: `${formData.firstName} ${formData.lastName}`,
          birthDate: formData.birthDate,
          registrationDate: new Date().toISOString().split('T')[0],
          password: formData.password // In a real app, this would be hashed
        };
        
        // Add to accounts (in a real app, this would be sent to a server)
        setUserAccounts([...userAccounts, newAccount]);
        
        document.querySelector("#registration-results").style.display = "block";
        registerbuttonloadingindicationcb(false);
      }, 1500);
      */}

       const _registeringdate = `${timestamp.getDay()}, ${timestamp.getMonth()}, ${timestamp.getDate()},${timestamp.getFullYear()}, ${timestamp.getHour()}:${timestamp.getMinutes()}:${timestamp.getSeconds()},`

       const _registrant =  { 
        id: `${generateInt32StringsDataType(16)}-A-1`,
        loginstatus: "logged out",
        status: {
          indication: "Trying to register",
          requests: [
           { 
             purpose: "Registration",
             message: "Attempting for registering for the MFATIP PROGRAM",
             status: "FIRST REGISTRATION. STATUS REGISTERING",
             date: _registeringdate
           }
         ]
        },
        name: {
          firstname: formData.firstName,
          middlename: formData.middleName,
          lastname: formData.lastName,
          nickname: ""
        },
        contact: {
          phonenumber: formData.phoneNumber,
          telephonenumber: "",
          emailaddress: formData.email,
          address: {
            street: "",
            baranggay: "",
            trademark: "",
            city: "",
            province: "",
            country: ''
          }
        },
        personalinformation: {
          age: 0,
          sex: "",
          bloodtype: "",
          dob: "",
          citizenship: "",
          civil_status: "",
          government_issued_identification: "" 
        },
        passwords: {
         account: {
          password: formData.confirmPassword
         }
        },
        credits: {
          omsiapawasto: {
            id: `${generateInt32StringsDataType(16)}-A-1`,
            amount: 0,
            transactions: {
              deposits: [],
              widthdrawals: [],
              successful_deposits: [],
              successful_widthdrawals: []
            }
          }
        },
        order: {
          name: {
            firstname: "",
            middlename: "",
            lastname: ""
          },
          shippingdetails: {
            street: "",
            baranggay: "",
            city: "",
            province: "",
            country: "",
            postal_zipcode: ""
          },
          paymentdetails: {
            merchandise_total: 0,
            merchandise_total_weight: 0,
            merchandise_count: 0,
            total_payment: 0,
            totalshipment: 0,
          },
          products: []
        }
       }

       await axiosCreatedInstance.post("/people/registration", {
         $registrant: _registrant
        }).then((response)=> {
          console.log(response.data)
          const _responsemessage = response.data.message 
          switch(_responsemessage) {
             case "Registrant registered":
              registrationresponsemessagetextcolorindicationcb("green");
              registrationresponsemessagecb({
                status: "Successfully REGISTERED",
                indication: "You may now continue logging in your account and do not forger to submit these documents later",
                bulletpoint1: "Front and back photo of your birth certificate",
                bulletpoint2: "Front and back photo of your one valid government ID",
                advice: "These documents really ensures that there will be no lazy duplicate accounts on OMSIAP"
              })
             break;
             case "Same passwords":
              registrationresponsemessagetextcolorindicationcb("red");
              registrationresponsemessagecb({
                status: "Same password",
                indication: "Registration failed. The registration will only succeed if you change your password making sure there are no duplicate accounts",
                bulletpoint1: "Change your password within the registration form to make sure you have no duplicate acccounts here on OMSIAP",
                bulletpoint2: "Minimun of 8 characters",
                advice: "Try changing your password first before clicking register button again"
              })
             break;
          }

          document.querySelector("#registration-results").style.display = "block";
          registerbuttonloadingindicationcb(false);
        })
  

    } else {
      setErrors(validationErrors);
      registerbuttonloadingindicationcb(false);
    }

  };

  // Utility function (mocked)
  const generateInt32StringsDataType = (length) => {
    return Array.from({ length }, () => 
      Math.floor(Math.random() * 10)
    ).join('');
  };

  return (
    <div className="auth-container"
         style={{display: props.authcontainer}}>
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome</h1>
          <p>Sign in to access your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignIn} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullname">Full name</label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your fullname"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="loginpage-responsemessagecontainer">
              <p className="loginpage-responsemessagecontainer-responsemessageheaderindication">Succesfully logged in</p>
              <p className="loginpage-responsemessagecontainer-responsemessageheaderindication">You know process to Home</p>
              <a href={"/"}>Go to home</a>
          </div>

          <div className="forgot-password">
            <a href="#reset">Forgot Password?</a>
          </div>
          
          <h4 id="successfullyloggedin-headerindication">Successfully logged in</h4>
          <a href="/" id="gobacktohome-atag">Go back to home</a>
          <button type="submit" className="auth-button">
            {
              signinbuttonloadingindication ? 
              (
                <Spinner animation="border" variant="light" />
              )
              :
              (
                <span>Sign In</span>
              )
            }
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <button onClick={() => setShowModal(true)} className="text-button">Sign Up</button></p>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Your Account</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleRegistration} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <span className="error">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Enter middle name (optional)"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastName">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <span className="error">{errors.lastName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number*</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="birthDate">Birth Date*</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && <span className="error">{errors.birthDate}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="regPassword">Password*</label>
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
              </div>
              
              <div className="document-notice">
                <h3>Important Notice:</h3>
                <p>To complete your registration, you will need to submit:</p>
                <ul>
                  <li>Front and back photos of your birth certificate</li>
                  <li>Front and back photos of your one of your valid government ID</li>
                </ul>
                <p>
                  You can register now and submit these documents later. 
                  These documents are used to validate your identity and 
                  prevent duplicate accounts.
                </p>
              </div>

              <div className="document-notice" id="registration-results">
                <h3 className="registration-results-registrationresultsheaderindication">Registration results:</h3>
                <h4 className="registration-results-registrationresultsheaderindication"
                    style={{color: registrationresponsemessagetextcolorindication}}>{registrationresponsemessage.status}</h4>
               
                <p>
                {registrationresponsemessage.indication}
                  <ul>
                    <li>{registrationresponsemessage.bulletpoint1}</li>
                    <li>{registrationresponsemessage.bulletpoint2}</li>
                  </ul>
                </p>
                <p>
                {registrationresponsemessage.advice}
                </p>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-button">
                  {
                    registerbuttonloadingindication ? 
                    (
                      <Spinner animation="border" variant="primary" />
                    )
                    :
                    (   
                      <span>Register</span>
                    )
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Verification Modal */}
      {showVerificationModal && (
        <div className="modal-overlay">
          <div className="modal-content verification-modal">
            <div className="modal-header">
              <h2>Verify Your Account</h2>
              <button className="close-button" onClick={() => setShowVerificationModal(false)}>&times;</button>
            </div>
            
            <div className="verification-content">
              <p>We found multiple accounts with the name <strong>{fullname}</strong>.</p>
              <p>Please select your account to continue:</p>
              
              <div className="account-selection">
                {userAccounts.filter(account => 
                  account.fullName.toLowerCase() === fullname.toLowerCase()
                ).map(account => (
                  <div 
                    key={account.id} 
                    className={`account-option ${selectedAccount === account ? 'selected' : ''}`}
                    onClick={() => handleSelectAccount(account)}
                  >
                    <div className="account-details">
                      <span className="account-name">{account.fullName}</span>
                      <span className="account-info">Birth Date: {account.birthDate}</span>
                      <span className="account-info">Registered: {account.registrationDate}</span>
                    </div>
                    <div className="selection-indicator"></div>
                  </div>
                ))}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowVerificationModal(false)}>Cancel</button>
                <button type="button" className="submit-button" onClick={handleVerification}>Continue</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content password-modal">
            <div className="modal-header">
              <h2>Password Verification</h2>
              <button className="close-button" onClick={() => setShowPasswordModal(false)}>&times;</button>
            </div>
            
            <div className="verification-content">
              <div className="selected-account-summary">
                <h3>Account Details</h3>
                <div className="account-details-summary">
                  <div className="account-detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedAccount?.fullName}</span>
                  </div>
                  <div className="account-detail-item">
                    <span className="detail-label">Birth Date:</span>
                    <span className="detail-value">{selectedAccount?.birthDate}</span>
                  </div>
                  <div className="account-detail-item">
                    <span className="detail-label">Registration Date:</span>
                    <span className="detail-value">{selectedAccount?.registrationDate}</span>
                  </div>
                </div>
              </div>
              
              <p className="verification-instruction">Please enter your password to verify your identity:</p>
              
              <div className="form-group">
                <input
                  type="password"
                  value={verificationPassword}
                  onChange={(e) => setVerificationPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="password-verification-input"
                />
                {passwordError && <span className="error password-error">{passwordError}</span>}
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => {
                  setShowPasswordModal(false);
                  // Go back to account selection if there were multiple accounts
                  if (userAccounts.filter(account => 
                    account.fullName.toLowerCase() === fullname.toLowerCase()
                  ).length > 1) {
                    setShowVerificationModal(true);
                  }
                }}>Back</button>
                <button 
                  type="button" 
                  className="submit-button" 
                  onClick={handlePasswordVerification}
                  disabled={!verificationPassword}
                >
                  {
                    passwordLoading ? 
                    (
                      <Spinner animation="border" variant="light" />
                    )
                    :
                    (
                      <span>Verify & Login</span>
                    )
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;