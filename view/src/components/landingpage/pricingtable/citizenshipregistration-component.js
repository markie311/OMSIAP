import React, { useState } from 'react';


import '../../../styles/landingpage/pricingtable/citizenshipregistration.scss';


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    civilStatus: '',
    birthCertFront: null,
    birthCertBack: null
  });

  const [previews, setPreviews] = useState({
    birthCertFront: null,
    birthCertBack: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      // Update form data with the file
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Create and set preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviews({
        ...previews,
        [name]: previewUrl
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    // For demonstration - show submitted data
    alert('Registration submitted! Check console for details.');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Registration Form</h2>
          <p>Please fill in your details to register</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name <span className="required">*</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="Enter middle name"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName">Last Name <span className="required">*</span></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth <span className="required">*</span></label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="civilStatus">Civil Status <span className="required">*</span></label>
              <select
                id="civilStatus"
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Birth Certificate</h3>
            <p className="form-hint">Upload clear images of your birth certificate (front and back)</p>
            
            <div className="form-row document-upload">
              <div className="form-group upload-group">
                <label htmlFor="birthCertFront">
                  Front Side <span className="required">*</span>
                </label>
                <div className="file-upload-container">
                  <div 
                    className={`preview-container ${previews.birthCertFront ? 'has-preview' : ''}`}
                    style={{
                      backgroundImage: previews.birthCertFront ? `url(${previews.birthCertFront})` : 'none'
                    }}
                  >
                    {!previews.birthCertFront && (
                      <div className="upload-placeholder">
                        <i className="upload-icon">📄</i>
                        <span>Click to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="birthCertFront"
                    name="birthCertFront"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group upload-group">
                <label htmlFor="birthCertBack">
                  Back Side <span className="required">*</span>
                </label>
                <div className="file-upload-container">
                  <div 
                    className={`preview-container ${previews.birthCertBack ? 'has-preview' : ''}`}
                    style={{
                      backgroundImage: previews.birthCertBack ? `url(${previews.birthCertBack})` : 'none'
                    }}
                  >
                    {!previews.birthCertBack && (
                      <div className="upload-placeholder">
                        <i className="upload-icon">📄</i>
                        <span>Click to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="birthCertBack"
                    name="birthCertBack"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="reset" className="btn-secondary">Clear</button>
            <button type="submit" className="btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;