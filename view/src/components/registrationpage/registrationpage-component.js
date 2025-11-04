import React, { useState } from 'react';

import { Spinner } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import generateInt32StringsDataType from '../lib/generateInt32StringDataType.js';
import { timestamp } from "../lib/timestamps.js"

import '../../styles/registrationpage/registrationpage.scss';

import axiosCreatedInstance from '../lib/axiosutil.js';

const LoginAndRegistrationPage = (props) => {

  const navigate = useNavigate();

  const [signinbuttonloadingindication, signinbuttonloadingindicationcb] = useState(false);
  const [registerbuttonloadingindication, registerbuttonloadingindicationcb] = useState(false); 
  const [refresh, setRefresh] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
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
    birthCertificatePhoto: null,
    bRenNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  const [errors, setErrors] = useState({});

  const handleSignIn = async (e) => {
    
    e.preventDefault();
    
    // Reset previous errors
    setError(null);
    
    // Start loading indication
    signinbuttonloadingindicationcb(true);
    
    // Input validation
    if (!firstName || !lastName || !password) {
      setError('Please fill in all required fields');
      signinbuttonloadingindicationcb(false);
      return;
    }
    
    try {
      // Make API call
      const response = await axiosCreatedInstance.post("/people/login", {
        $firstname: firstName,
        $middlename: middleName, // Send empty string if no middle name
        $lastname: lastName,
        $password: password
      });
      
      // Handle response
      const _responsemessage = response.data.message;
      const _registrant = response.data.registrant;
      
      switch(_responsemessage) {
        case "No user found with the provided name details":
          setError('No account found with those name details');
          break;
          
        case "Login successful":
          // Store the MongoDB ObjectId in a cookie for 1 year
          const oneYearFromNow = 365 * 24 * 60 * 60;
          document.cookie = `id=${_registrant.objectId}; path=/; max-age=${oneYearFromNow}; SameSite=Strict; Secure`;
          
          // Optional: Display success message
          document.querySelectorAll(".loginpage-responsemessagecontainer")[0].style.display = "block";
          break;
          
        case "Incorrect password":
          setError('Incorrect password');
          break;
          
        case "Database connection error. Please try again later.":
          setError('Internet connection problem. Please check your connection and try again.');
          break;
          
        default:
          setError('An unexpected error occurred');
      }
    } catch (error) {
      // Handle network errors or server connection issues
      console.error('Login error:', error);
      
      if (!navigator.onLine) {
        setError('You appear to be offline. Please check your internet connection.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error processing your login. Please try again.');
      }
    } finally {
      // Always stop loading indication
      signinbuttonloadingindicationcb(false);
    }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          birthCertificatePhoto: 'Please upload a valid image file'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          birthCertificatePhoto: 'Image size must be less than 5MB'
        });
        return;
      }
      
      setFormData({
        ...formData,
        birthCertificatePhoto: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors({
        ...errors,
        birthCertificatePhoto: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.birthCertificatePhoto) {
      newErrors.birthCertificatePhoto = 'Birth certificate photo is required';
    }
    
    if (!formData.bRenNumber) {
      newErrors.bRenNumber = 'Birth Reference Number (bRen) is required';
    } else if (formData.bRenNumber.length < 10) {
      newErrors.bRenNumber = 'Birth Reference Number must be at least 10 characters';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number (10-11 digits)';
    }

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

const handleRegistration = async (e) => {
  
  e.preventDefault();
  registerbuttonloadingindicationcb(true);
  
  const validationErrors = validateForm();
   
  if (Object.keys(validationErrors).length === 0) {
    try {
      const _registeringdate = timestamp.getFormattedDate();
      
      // 🔍 DEBUG: Log what we're sending
      console.log("=== REGISTRATION DEBUG INFO ===");
      console.log("Image file:", formData.birthCertificatePhoto);
      console.log("Image file name:", formData.birthCertificatePhoto?.name);
      console.log("Image file size:", formData.birthCertificatePhoto?.size, "bytes");
      console.log("Image file type:", formData.birthCertificatePhoto?.type);
      console.log("bRen number:", formData.bRenNumber);
      console.log("Phone number:", formData.phoneNumber);

      // ✅ Create FormData object for multipart/form-data upload
      const formDataToSend = new FormData();
      
      // Add the birth certificate image file
      formDataToSend.append('birthcertificate_front', formData.birthCertificatePhoto);
      
      // Add the registrant data as JSON string
      const registrantData = {
        id: `1000-0000-A-1`, // This will be replaced on the server
        registrationstatusesandlogs: {
          type: "Monthly Financial Allocation To Individual People ( MFATIP )",
          indication: "unverified",
          deviceloginstatus: "logged out",
          registrationlog: []
        },
        name: {
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        contact: {
          phonenumber: formData.phoneNumber,
          telephonenumber: "",
          emailaddress: formData.email || "",
          address: {
            street: "",
            baranggay: "",
            trademark: "",
            city: "",
            province: "",
            country: ""
          }
        },
        personaldata: {
          age: "",
          sex: "",
          bloodtype: "",
          height: "",
          weight: "",
          deviceprofilepicture: "",
          dob: "",
          citizenship: "",
          civil_status: "",
          birthcertificate: {
            frontphoto: {
              name: formData.birthCertificatePhoto.name,
              description: "Front photo of birth certificate",
              uploaddate: _registeringdate
            },
            backphoto: {
              name: "",
              description: "",
              image: "",
              uploaddate: ""
            },
            birthcertificatereferencenumber: formData.bRenNumber
          },
          government_issued_identification: {
            frontphoto: {
              name: "",
              description: "",
              image: "",
              uploaddate: ""
            },
            backphoto: {
              name: "",
              description: "",
              image: "",
              uploaddate: ""
            }
          }
        },
        passwords: {
          account: {
            password: formData.confirmPassword
          }
        },
        credits: {
          omsiapawas: {
            id: `${generateInt32StringsDataType(16)}-A-1`,
            amount: 0,
            transactions: {
              currencyexchange: [],
              widthdrawals: [],
              omsiapawastransfer: []
            }
          }
        },
        transactions: {
          merchandise: []
        }
      };
      
      // Add registrant data as a JSON field
      formDataToSend.append('registrantData', JSON.stringify(registrantData));
      
      // 🔍 DEBUG: Log FormData contents
      console.log("FormData entries:");
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}:`, pair[1].name, pair[1].size, 'bytes');
        } else {
          console.log(`  ${pair[0]}:`, pair[1].substring(0, 100) + '...');
        }
      }

      // Make the request with FormData (axios will automatically set Content-Type to multipart/form-data)
      const response = await axiosCreatedInstance.post("/people/registration", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const _responsemessage = response.data.message;
      
      // 🔍 DEBUG: Log server response
      console.log("Server response:", _responsemessage);
      console.log("=== END DEBUG INFO ===");
      
      // Always show the results section first
      document.querySelector('#registration-results').style.display = "block";
      
      switch(_responsemessage) {
        case "Registrant registered":
          registrationresponsemessagetextcolorindicationcb("green");
          registrationresponsemessagecb({
            status: "Successfully REGISTERED",
            indication: "Your account has been created successfully with your birth certificate and bRen number",
            bulletpoint1: "Your birth certificate photo has been securely uploaded",
            bulletpoint2: "Your Birth Reference Number (bRen) has been recorded",
            advice: "You can log in to your account using firstname, middlename and lastname in your birthcertificate information accordingly after recieving a text message on the phone number you provided."
          });
          break;
          
        case "Duplicate bRen number":
          registrationresponsemessagetextcolorindicationcb("red");
          registrationresponsemessagecb({
            status: "Birth Certificate Already Registered",
            indication: "This Birth Reference Number (bRen) is already registered in our system",
            bulletpoint1: "Each Birth Reference Number can only be used once for registration",
            bulletpoint2: "This prevents duplicate accounts and ensures program integrity",
            advice: "Please verify your bRen number is correct, or contact support if you believe this is an error"
          });
          break;
          
        case "OMSIAP_USER_LIMIT_REACHED":
          registrationresponsemessagetextcolorindicationcb("blue");
          registrationresponsemessagecb({
            status: "OMSIAP First 1000 Users Milestone Reached",
            indication: "Congratulations! You're among the first to witness this momentous occasion.",
            bulletpoint1: "OMSIAP has successfully reached its initial user capacity of 1000 registrants",
            bulletpoint2: "Accommodation and verification process will be initiated soon",
            advice: "Stay tuned! We'll be expanding our user base and processing registrations in phases. Your interest is valuable to us."
          });
          break;
          
        default:
          registrationresponsemessagetextcolorindicationcb("orange");
          registrationresponsemessagecb({
            status: "Unexpected Response",
            indication: `Server returned: ${_responsemessage}`,
            bulletpoint1: "An unexpected response was received from the server",
            bulletpoint2: "Please try again or contact support if the issue persists",
            advice: "Take a screenshot of this message and contact technical support"
          });
          break;
      }

      registerbuttonloadingindicationcb(false);

    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Always show the results section for errors too
      document.querySelector("#registration-results").style.display = "block";
      
      let errorMessage = "Connection to server failed";
      let errorDetails = {
        status: "Registration Failed",
        indication: "Unable to connect to the registration server",
        bulletpoint1: "Check your internet connection",
        bulletpoint2: "Verify server status",
        advice: "If the problem persists, please contact support"
      };
      
      // Handle specific error responses
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        if (errorMessage.includes("Duplicate bRen number")) {
          errorDetails = {
            status: "Birth Certificate Already Registered",
            indication: "This Birth Reference Number (bRen) is already registered in our system",
            bulletpoint1: "Each Birth Reference Number can only be used once for registration",
            bulletpoint2: "This prevents duplicate accounts and ensures program integrity",
            advice: "Please verify your bRen number is correct, or contact support if you believe this is an error"
          };
        } else if (errorMessage.includes("OMSIAP_USER_LIMIT_REACHED")) {
          errorDetails = {
            status: "OMSIAP First 1000 Users Milestone Reached",
            indication: "Congratulations! You're among the first to witness this momentous occasion.",
            bulletpoint1: "OMSIAP has successfully reached its initial user capacity of 1000 registrants",
            bulletpoint2: "Accommodation and verification process will be initiated soon",
            advice: "Stay tuned! We'll be expanding our user base and processing registrations in phases. Your interest is valuable to us."
          };
          registrationresponsemessagetextcolorindicationcb("blue");
        } else {
          errorDetails.indication = errorMessage;
        }
      }
      
      if (!errorMessage.includes("OMSIAP_USER_LIMIT_REACHED")) {
        registrationresponsemessagetextcolorindicationcb("red");
      }
      
      registrationresponsemessagecb(errorDetails);
      registerbuttonloadingindicationcb(false);
    }
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
    <div className="loginandregister-auth-container"
         style={{display: props.authcontainer}}>

      <div className="loginandregister-auth-card">

        <div className="loginandregister-auth-header">
          <h1>Welcome</h1>
          <p>Sign in to access your account</p>
        </div>

        {error && <div className="loginandregister-error-message">{error}</div>}

        <form onSubmit={handleSignIn} className="loginandregister-auth-form">
          <div className="loginandregister-form-row">
            <div className="loginandregister-form-group">
              <label>First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="loginandregister-form-group">
              <label>Middle Name</label>
              <input
                type="text"
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Enter your middle name"
              />
            </div>
          </div>

          <div className="loginandregister-form-group">
            <label>Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="loginandregister-form-group">
            <label>Password</label>
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
              <p className="loginpage-responsemessagecontainer-responsemessageheaderindication">Click to go to home to go to home landing page</p>
              <a href={"/"}>Go to home</a>
          </div>

          <div className="loginandregister-forgot-password">
            <a href="#reset">Forgot Password?</a>
          </div>
          
          {
             signinbuttonloadingindication ?  
             (
              <Spinner animation="border" variant="info" />
             )
             :
             (
              <button type="submit" className="loginandregister-auth-button">
                <span>Sign In</span>
              </button>
             )
          }
        
        </form>

        <div className="loginandregister-auth-footer">
          <p>Don't have an account? <button onClick={() => setShowModal(true)} className="loginandregister-text-button">Sign Up</button></p>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (

        <div className="loginandregister-modal-overlay">
          <div className="loginandregister-modal-content">
            <div className="loginandregister-modal-header">
              <h2>Create Your Account</h2>
              <button className="loginandregister-close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleRegistration} className="loginandregister-registration-form">
              
              {/* Birth Certificate Photo Upload */}
              <div className="loginandregister-form-group">
                <label>Birth Certificate Front Photo*</label>
                <div className="loginandregister-field-reminder">
                  <small>📋 We need your birth certificate photo to verify your identity, OMSIAP personel will be creating your firstname, middlename and lastname login credential based on the birthcerficate you submitted. OMSIAP ensure's only legitimate registrants receive monthly financial allocations through the MFATIP program.</small>
                </div>
                <input
                  type="file"
                  id="birthCertificatePhoto"
                  name="birthCertificatePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="loginandregister-file-input"
                />
                {formData.birthCertificatePhoto && imagePreview && (
                  <div className="loginandregister-file-preview">
                    <div className="loginandregister-file-info">
                      <span>✓ {formData.birthCertificatePhoto.name}</span>
                      <button 
                        type="button" 
                        className="loginandregister-view-button"
                        onClick={() => setShowImageModal(true)}
                      >
                        View Full Size
                      </button>
                    </div>
                    <div className="loginandregister-image-thumbnail">
                      <img 
                        src={imagePreview} 
                        alt="Birth Certificate Thumbnail" 
                        className="loginandregister-thumbnail-image"
                        onClick={() => setShowImageModal(true)}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          marginTop: '10px'
                        }}
                      />
                    </div>
                  </div>
                )}
                {errors.birthCertificatePhoto && <span className="loginandregister-error">{errors.birthCertificatePhoto}</span>}
              </div>

              {/* Birth Reference Number (bRen) */}
              <div className="loginandregister-form-group">
                <label>Birth Reference Number (bRen)*</label>
                <div className="loginandregister-field-reminder">
                  <small>🔢 The bRen number is a unique identifier on your birth certificate that helps us prevent duplicate registrations and ensures program integrity. It is found at the top center area of you Philippine birthcertificate.</small>
                </div>
                <input
                  type="text"
                  id="bRenNumber"
                  name="bRenNumber"
                  value={formData.bRenNumber}
                  onChange={handleChange}
                  placeholder="Enter your Birth Reference Number"
                />
                {errors.bRenNumber && <span className="loginandregister-error">{errors.bRenNumber}</span>}
              </div>

              {/* Phone Number */}
              <div className="loginandregister-form-group">
                <label>Phone Number*</label>
                <div className="loginandregister-field-reminder">
                  <small>📞 Your phone number will be used for account verification, security notifications, and important updates about your MFATIP benefits. Make sure the one phone number you will provide that is the phone number you used as your Gcash account to recieve Monthly Financial Allocations and other transactions.</small>
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <span className="loginandregister-error">{errors.phoneNumber}</span>}
              </div>
              
              {/* Password Fields */}
              <div className="loginandregister-form-row">
                <div className="loginandregister-form-group">
                  <label>Password*</label>
                  <div className="loginandregister-field-reminder">
                    <small>🔒 Create a strong password (minimum 8 characters) to secure your account and protect your personal information and financial allocations.</small>
                  </div>
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                  />
                  {errors.password && <span className="loginandregister-error">{errors.password}</span>}
                </div>
                
                <div className="loginandregister-form-group">
                  <label>Confirm Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <span className="loginandregister-error">{errors.confirmPassword}</span>}
                </div>
              </div>
              
              <div className="loginandregister-document-notice">
                <h3>Important Information</h3>
                <p>By registering with your birth certificate and bRen number, you are:</p>
                <ul>
                  <li>Verifying your identity with official government documents</li>
                  <li>Helping us prevent duplicate accounts and program abuse</li>
                  <li>Ensuring secure access to your Monthly Financial Allocation To Individual People Program (MFATIP)</li>
                  <li>Providing the necessary credentials for receiving benefits</li>
                </ul>
                <p><strong>Privacy Notice:</strong> Your documents are encrypted and stored securely. We use this information solely for identity verification and program administration.</p>
              </div>

              <div className="loginandregister-document-notice" id="registration-results">
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
              
              <div className="loginandregister-form-actions">
                <button type="button" className="loginandregister-cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                {
                   registerbuttonloadingindication ? 
                   (
                    <Spinner animation="border" variant="primary" />
                   )
                   :
                   (
                    <button type="submit" className="loginandregister-auth-button">  
                        <span>Register</span>
                    </button>
                   )
                }
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && imagePreview && (
        <div className="loginandregister-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="loginandregister-image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="loginandregister-modal-header">
              <h3>Birth Certificate Preview</h3>
              <button 
                className="loginandregister-close-button" 
                onClick={() => setShowImageModal(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#333',
                  zIndex: 1000
                }}
              >
                &times;
              </button>
            </div>
            <div className="loginandregister-image-container">
              <img 
                src={imagePreview} 
                alt="Birth Certificate Preview" 
                className="loginandregister-preview-image"
                style={{
                  maxWidth: '90%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  border: '2px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div className="loginandregister-modal-footer">
              <button 
                className="loginandregister-cancel-button" 
                onClick={() => setShowImageModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};

export default LoginAndRegistrationPage;