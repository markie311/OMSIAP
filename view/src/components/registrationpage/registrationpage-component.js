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

const handleRegistration = async (e) => {

    e.preventDefault();
    registerbuttonloadingindicationcb(true);
  
    const validationErrors = validateForm();
   
    if (Object.keys(validationErrors).length === 0) {
      try {
        
        const _registeringdate = timestamp.getFormattedDate();
  
        const _registrant = { 
          id: `1000-0000-A-1`, // This will be replaced on the server
          registrationstatusesandlogs: {
            type: "Month Financial Allocation To Individual People ( MFATIP )",
            indication: "Trying to register",
            deviceloginstatus: "logged out",
            registrationlog: []
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
              country: ""
            }
          },
          personaldata: {
            age: 0,
            sex: "",
            bloodtype: "",
            height: "",
            weight: "",
            deviceprofilepicture: "",
            dob: "",
            citizenship: "",
            civil_status: "",
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
            },
            birthcertificate: {
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
  
        const response = await axiosCreatedInstance.post("/people/registration", {
          $registrant: _registrant
        });
  
        const _responsemessage = response.data.message;
        
        switch(_responsemessage) {
          case "Registrant registered":
            document.querySelector('#registration-results').style.display = "block";
            registrationresponsemessagetextcolorindicationcb("green");
            registrationresponsemessagecb({
              status: "Successfully REGISTERED",
              indication: "You may now continue logging in your account and do not forget to submit these documents later",
              bulletpoint1: "Front and back photo of your birth certificate",
              bulletpoint2: "Front and back photo of your one valid government ID",
              advice: "These documents really ensure that there will be no lazy duplicate accounts on OMSIAP abusing the MFATIP program. Your documents will be used as credentials."
            });
            break;
          case "Same passwords":
            registrationresponsemessagetextcolorindicationcb("red");
            registrationresponsemessagecb({
              status: "Same password",
              indication: "Registration failed. The registration will only succeed if you change your password. This process is making sure that there will be no duplicate accounts abusing the MFATIP program",
              bulletpoint1: "Change your password within the registration form. Make sure your password is unique and secure with a minimun of 8 characters. This process is making sure that there will be no duplicate accounts abusing the MFATIP program.",
              bulletpoint2: "Minimum of 8 characters",
              advice: "Try changing your password first before clicking register button again"
            });
            break;
          case "OMSIAP_USER_LIMIT_REACHED":
            registrationresponsemessagetextcolorindicationcb("blue");
            registrationresponsemessagecb({
              status: "OMSIAP First 1000 Users Milestone Reached",
              indication: "Congratulations! You're among the first to witness this momentous occasion.",
              bulletpoint1: "OMSIAP has successfully reached its initial user capacity of 1000 registrants",
              bulletpoint2: "Accommodation and verification process will be initiated soon",
              advice: "Stay tuned! We'll be expanding our user base and processing registrations in phases. Your interest is valuable to us.",
              additionalNote: "You'll be notified about next steps via the contact information provided."
            });
            break;
        }
  
        document.querySelector("#registration-results").style.display = "block";
        registerbuttonloadingindicationcb(false);
  
      } catch (error) {
        console.error("Registration error:", error);
        
        const errorMessage = error.response?.data?.message || "Connection to server failed";
        
        registrationresponsemessagetextcolorindicationcb("red");
        registrationresponsemessagecb({
          status: "Registration Failed",
          indication: errorMessage,
          bulletpoint1: "Check your internet connection",
          bulletpoint2: "Verify server status",
          advice: "If the problem persists, please contact support"
        });
  
        document.querySelector("#registration-results").style.display = "block";
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
              <label htmlFor="firstName">First Name</label>
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
              <label htmlFor="middleName">Middle Name</label>
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
            <label htmlFor="lastName">Last Name</label>
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
              <div className="loginandregister-form-row">
                <div className="loginandregister-form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <span className="loginandregister-error">{errors.firstName}</span>}
                </div>
                
                <div className="loginandregister-form-group">
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
              
              <div className="loginandregister-form-row">
                <div className="loginandregister-form-group">
                  <label htmlFor="lastName">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <span className="loginandregister-error">{errors.lastName}</span>}
                </div>
                
                <div className="loginandregister-form-group">
                  <label htmlFor="phoneNumber">Phone Number*</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && <span className="loginandregister-error">{errors.phoneNumber}</span>}
                </div>
              </div>
              
              <div className="loginandregister-form-group">
                <label htmlFor="birthDate">Birth Date*</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && <span className="loginandregister-error">{errors.birthDate}</span>}
              </div>

              <div className="loginandregister-form-row">
                <div className="loginandregister-form-group">
                  <label htmlFor="regPassword">Password*</label>
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
                  <label htmlFor="confirmPassword">Confirm Password*</label>
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
                <h3>Important Notice</h3>
                <p>To complete your registration process, please have the following documents ready for submission:</p>
                <ul>
                  <li>Front and back photos of your birth certificate</li>
                  <li>Front and back photos of one valid government ID</li>
                </ul>
                <p>You may proceed with registration now and submit these documents at your convenience.</p>
                <p>
                  These documents help us verify your identity and prevent duplicate accounts from misusing the MFATIP program. Your submitted documentation will also serve as the credential for receiving your monthly financial allocations.
                </p>
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

    </div>
  );

};

export default LoginAndRegistrationPage;