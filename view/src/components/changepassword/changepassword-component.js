import React, { useState } from 'react';

import axiosCreatedInstance from '../lib/axiosutil.js';

export default function ChangePassword() {

  const [bren, setBren] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [registrantData, setRegistrantData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFindRegistrant = async (e) => { 

  e.preventDefault();
  setError('');
  setSuccessMessage('');
  
  if (!bren.trim()) {
    setError('Please enter your BREN or Birth Certificate Reference Number');
    return;
  }

  setLoading(true);

  try {
    // Make API call to find registrant by BREN
    const response = await axiosCreatedInstance.get(`/people/registrants/find/${bren}`);
    
    if (response.data && response.data.success) {
      setRegistrantData(response.data.data);
      setShowModal(true);
      setSuccessMessage('Registrant found successfully!');
    } else {
      setError(response.data.message || 'Registrant not found. Please check your BREN and try again.');
    }
  } catch (err) {
    console.error('Error finding registrant:', err);
    
    if (err.response) {
      // Server responded with error status
      setError(err.response.data.message || 'Unable to find registrant. Please verify your BREN and try again.');
    } else if (err.request) {
      // Request made but no response received
      setError('No response from server. Please check your connection and try again.');
    } else {
      // Error in request setup
      setError('An error occurred. Please try again.');
    }
  } finally {
    setLoading(false);
  }
  };

  
const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  setPasswordError('');
  setSuccessMessage('');

  if (!newPassword || !confirmPassword) {
    setPasswordError('Please fill in both password fields');
    return;
  }

  if (newPassword.length < 8) {
    setPasswordError('Password must be at least 8 characters long');
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError('Passwords do not match');
    return;
  }

  setUpdatingPassword(true);

  try {
    const response = await axiosCreatedInstance.put('/people/registrants/update-password', {
      bren: bren,
      newPassword: newPassword
    });
    
    if (response.data && response.data.success) {
      setSuccessMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        handleCloseModal();
        setBren('');
        setSuccessMessage('');
      }, 2000);
    } else {
      setPasswordError(response.data.message || 'Failed to update password. Please try again.');
    }
  } catch (err) {
    console.error('Error updating password:', err);
    
    if (err.response) {
      setPasswordError(err.response.data.message || 'An error occurred while updating password. Please try again.');
    } else if (err.request) {
      setPasswordError('No response from server. Please check your connection and try again.');
    } else {
      setPasswordError('An error occurred while updating password. Please try again.');
    }
  } finally {
    setUpdatingPassword(false);
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
    setRegistrantData(null);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div style={styles.changepassword}>
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <div style={{
            ...styles.formCard,
            ...(inputFocused ? styles.formCardFocused : {})
          }}>
            <div style={styles.iconWrapper}>
              <svg style={styles.lockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
              </svg>
            </div>
            
            <h1 style={styles.title}>Change Password</h1>
            <p style={styles.subtitle}>Enter your BREN or Birth Certificate Reference Number</p>

            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.alertIcon}>⚠️</span>
                <span>{error}</span>
                <button 
                  onClick={() => setError('')} 
                  style={styles.closeBtn}
                  aria-label="Close"
                >×</button>
              </div>
            )}

            {successMessage && (
              <div style={styles.successAlert}>
                <span style={styles.alertIcon}>✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            <div style={styles.searchForm} onSubmit={handleFindRegistrant}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Enter BREN"
                  value={bren}
                  onChange={(e) => setBren(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  style={{
                    ...styles.brenInput,
                    ...(inputFocused ? styles.brenInputFocused : {})
                  }}
                  disabled={loading}
                />
                <div style={{
                  ...styles.inputUnderline,
                  ...(inputFocused ? styles.inputUnderlineFocused : {})
                }}></div>
              </div>

              <button 
                onClick={handleFindRegistrant}
                style={{
                  ...styles.submitBtn,
                  ...(loading ? styles.submitBtnDisabled : {})
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Find Account</span>
                    <svg style={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div style={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Update Password</h2>
              <button onClick={handleCloseModal} style={styles.modalCloseBtn}>×</button>
            </div>
            
            <div style={styles.modalBody}>
              {registrantData && (
                <>
                  <div style={styles.infoCard}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Full Name:</span>
                      <span style={styles.infoValue}>{registrantData.fullName}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Phone Number:</span>
                      <span style={styles.infoValue}>{registrantData.phoneNumber}</span>
                    </div>
                  </div>

                  {passwordError && (
                    <div style={styles.modalError}>
                      <span style={styles.alertIcon}>⚠️</span>
                      {passwordError}
                    </div>
                  )}

                  <div style={styles.passwordForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>New Password</label>
                      <div style={styles.passwordInputWrapper}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={updatingPassword}
                          style={styles.passwordInput}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={styles.eyeBtn}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      <small style={styles.formText}>Password must be at least 8 characters long</small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Confirm New Password</label>
                      <div style={styles.passwordInputWrapper}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={updatingPassword}
                          style={styles.passwordInput}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeBtn}
                        >
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <div style={styles.modalActions}>
                      <button 
                        onClick={handleCloseModal}
                        disabled={updatingPassword}
                        style={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handlePasswordUpdate}
                        disabled={updatingPassword}
                        style={{
                          ...styles.updateBtn,
                          ...(updatingPassword ? styles.updateBtnDisabled : {})
                        }}
                      >
                        {updatingPassword ? (
                          <>
                            <span style={styles.spinner}></span>
                            <span>Updating...</span>
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  changepassword: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    animation: 'fadeInUp 0.8s ease-out',
  },
  formCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    minWidth: '450px',
    maxWidth: '500px',
    transition: 'all 0.3s ease',
  },
  formCardFocused: {
    transform: 'translateY(-8px)',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.4)',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s ease-in-out infinite',
  },
  lockIcon: {
    width: '40px',
    height: '40px',
    color: 'white',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '32px',
  },
  errorAlert: {
    backgroundColor: '#fee',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    animation: 'slideIn 0.3s ease-out',
    position: 'relative',
  },
  successAlert: {
    backgroundColor: '#e6fffa',
    color: '#2c7a7b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    animation: 'slideIn 0.3s ease-out',
  },
  alertIcon: {
    fontSize: '18px',
  },
  closeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    position: 'relative',
  },
  brenInput: {
    width: '100%',
    padding: '16px 0',
    fontSize: '16px',
    border: 'none',
    borderBottom: '2px solid #e2e8f0',
    background: 'transparent',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    color: '#2d3748',
  },
  brenInputFocused: {
    borderBottomColor: '#667eea',
  },
  inputUnderline: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '2px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
  },
  inputUnderlineFocused: {
    width: '100%',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  arrowIcon: {
    width: '20px',
    height: '20px',
    transition: 'transform 0.3s ease',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    animation: 'float 10s infinite ease-in-out',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'scaleIn 0.3s ease-out',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0,
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#718096',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  modalBody: {
    padding: '24px',
  },
  infoCard: {
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
  },
  infoValue: {
    color: '#2d3748',
    fontSize: '14px',
    fontWeight: '500',
  },
  modalError: {
    backgroundColor: '#fee',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  passwordForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  passwordInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 40px 12px 12px',
    fontSize: '14px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
  },
  formText: {
    fontSize: '12px',
    color: '#718096',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  cancelBtn: {
    padding: '12px 24px',
    border: '2px solid #e2e8f0',
    background: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#4a5568',
    transition: 'all 0.2s ease',
  },
  updateBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  updateBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
};

// Add keyframe animations via style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(50px);
      opacity: 0;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(styleSheet);