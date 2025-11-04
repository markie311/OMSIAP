import React, { useState } from 'react';

import '../../styles/privacypolicy/privacypolicy.scss';

export default function PrivacyPolicy() {
  
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [agreeToPolicy, setAgreeToPolicy] = useState(false);
    const [passwordError, setPasswordError] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      
      if (nickname.trim() !== '' && password.trim() !== '' && agreeToPolicy) {
        // Save nickname and encrypted password in cookies for 1 year (365 days)
        const oneYearFromNow = 365 * 24 * 60 * 60;
        document.cookie = `nickname=${nickname}; path=/; max-age=${oneYearFromNow}`;
        
        // In a real application, you would never store passwords in cookies
        // This is just for demonstration purposes
        // Normally you would handle authentication via a secure backend
       // document.cookie = `auth=true; path=/; max-age=${oneYearFromNow}`;
        
        setIsLoggedIn(true);
      }
    };
  
    const handleNicknameChange = (e) => {
      setNickname(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      setPasswordError('');
    };
  
    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
      setPasswordError('');
    };
  
    const togglePrivacyPolicy = () => {
      setShowPrivacyPolicy(!showPrivacyPolicy);
    };
  
    const handlePolicyAgreement = () => {
      setAgreeToPolicy(!agreeToPolicy);
    };
  
    return (
      <div className="app-container">
        {!isLoggedIn ? (
          <div className="welcome-container">
            <div className="welcome-card">
              <h1>Welcome to Our Transaction Portal</h1>
              <p>Please create an account to continue accessing your primary transaction dashboard.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="nickname">Nickname:</label>
                  <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={handleNicknameChange}
                    placeholder="Enter your nickname"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm your password"
                    required
                  />
                  {passwordError && <p className="error-message">{passwordError}</p>}
                </div>
                
                <div className="password-reminder">
                  <p><strong>Important:</strong> Please remember your password carefully. This account will be used for primary transactions, and your session will be active for one year on this device.</p>
                </div>
                
                <div className="privacy-section">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="privacy-agree"
                      checked={agreeToPolicy}
                      onChange={handlePolicyAgreement}
                      required
                    />
                    <label htmlFor="privacy-agree">
                      I agree to the <button 
                        type="button" 
                        className="policy-btn"
                        onClick={togglePrivacyPolicy}
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                  
                  {showPrivacyPolicy && (
                    <div className="privacy-policy">
                      <h2>Privacy Policy</h2>
                      <p>Last updated: February 26, 2025</p>
                      
                      <h3>Cookie Usage</h3>
                      <p>This website uses cookies to enhance your browsing experience and enable transaction functionality. By using our website, you agree to our use of cookies in accordance with this Privacy Policy.</p>
                      
                      <h3>What information do we collect?</h3>
                      <p>We collect the nickname you provide and authentication information through cookies. These cookies are used to:</p>
                      <ul>
                        <li>Authenticate your identity for transaction purposes</li>
                        <li>Track your movements and interactions with our transaction platform</li>
                        <li>Analyze usage patterns to improve our services and security</li>
                        <li>Provide personalized content based on your transaction history</li>
                        <li>Maintain your session for convenience across visits</li>
                      </ul>
                      
                      <h3>How long do we store your information?</h3>
                      <p>The cookies containing your account information will remain active for one year on your device. This extended duration is implemented to facilitate seamless access to your primary transaction account. Your data is stored securely and is not shared with unauthorized third parties.</p>
                      
                      <h3>Your rights</h3>
                      <p>You can delete cookies at any time through your browser settings. You can also choose to disable cookies, although this will prevent you from accessing your transaction account. For security purposes, we recommend using this service only on personal, secure devices.</p>
                      
                      <button 
                        type="button" 
                        className="close-btn"
                        onClick={togglePrivacyPolicy}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={!nickname.trim() || !password.trim() || !confirmPassword.trim() || !agreeToPolicy}>
                  Create Account
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="content-container">
            <div className="header">
              <h1>Welcome to Your Transaction Dashboard, {nickname}!</h1>
              <button 
                className="logout-btn"
                onClick={() => {
                  const _privacypolicy = document.querySelectorAll('.app-container');
                  const _dashboardcontainer = document.querySelectorAll('.dashboard-container');
                  _privacypolicy[0].style.display = "none";
                  _dashboardcontainer[0].style.display = "block";
                  // Delete all cookies
                //  document.cookie = "nickname=; path=/; max-age=0";
                //  document.cookie = "auth=; path=/; max-age=0";
                //  setIsLoggedIn(false);
                //  setNickname('');
                //  setPassword('');
                //  setConfirmPassword('');
                //  setAgreeToPolicy(false);

                }}
              >
                Continue to user dashboard
              </button>
            </div>
            
            <div className="main-content">
              <h2>Before proceeding to your user dashboard</h2>
              <p>Welcome to your secure transaction portal. You are now logged in with a session that will remain active for one year.</p>
              <p>From here, you can manage all your primary transactions safely.</p>
              <p>Feel free to enjoy.</p>
              <div className="transaction-info">
                <h3>Session Information</h3>
                <p>Your session will remain active on this device for one year.</p>
                <p>For security purposes, please do not use this service on public or shared computers.</p>
              </div>
              
              {/* Transaction content would go here */}
            </div>
          </div>
        )}
      </div>
    );
  };