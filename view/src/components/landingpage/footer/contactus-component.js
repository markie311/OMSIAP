import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Container, Modal, Button } from 'react-bootstrap';
import Map from '../map/map-component.js';
import axiosCreatedInstance from '../../lib/axiosutil.js';
import '../../../styles/landingpage/footer/contactus.scss';

export default function ContactUs() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    type: '', // 'success', 'error', 'warning'
    title: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Client-side validation
      if (!formData.name.trim() || !formData.email.trim() || 
          !formData.subject.trim() || !formData.message.trim()) {
        setModalContent({
          type: 'warning',
          title: 'Incomplete Form',
          message: 'Please fill out all fields before submitting.'
        });
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setModalContent({
          type: 'warning',
          title: 'Invalid Email',
          message: 'Please enter a valid email address.'
        });
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // Message length validation
      if (formData.message.length < 10) {
        setModalContent({
          type: 'warning',
          title: 'Message Too Short',
          message: 'Your message must be at least 10 characters long.'
        });
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      // Send request to backend
      const response = await axiosCreatedInstance.post('/omsiap/contactus', formData);

      if (response.data.success) {
        setModalContent({
          type: 'success',
          title: 'Message Sent Successfully!',
          message: response.data.message || 'Thank you for contacting us! We will get back to you soon.'
        });
        setShowModal(true);
        
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }

    } catch (error) {
      console.error('Contact form submission error:', error);

      let errorMessage = 'Something went wrong. Please try again later.';
      let errorTitle = 'Error';

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.message || errorMessage;
        
        if (error.response.status === 400) {
          errorTitle = 'Validation Error';
        } else if (error.response.status === 500) {
          errorTitle = 'Server Error';
        } else if (error.response.status === 503) {
          errorTitle = 'Service Unavailable';
        }
      } else if (error.request) {
        // Request made but no response
        errorTitle = 'Connection Error';
        errorMessage = 'Unable to reach the server. Please check your internet connection and try again.';
      }

      setModalContent({
        type: 'error',
        title: errorTitle,
        message: errorMessage
      });
      setShowModal(true);

    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'hello@omsiap.com',
      link: 'mailto:hello@omsiap.com'
    },
    {
      icon: '📱',
      title: 'Phone',
      content: '+63 XXX XXX XXXX',
      link: 'tel:+63XXXXXXXXX'
    },
    {
      icon: '📍',
      title: 'Location',
      content: 'Las Piñas, Metro Manila, PH',
      link: '#map-section'
    },
    {
      icon: '⏰',
      title: 'Business Hours',
      content: 'Mon-Sat: 9AM - 6PM',
      link: null
    }
  ];

  const socialMedia = [
    { name: 'Facebook', icon: '📘', link: '#', color: '#1877f2' },
    { name: 'Instagram', icon: '📷', link: '#', color: '#e4405f' },
    { name: 'Twitter', icon: '🐦', link: '#', color: '#1da1f2' },
    { name: 'LinkedIn', icon: '💼', link: '#', color: '#0077b5' }
  ];

  // Get modal icon based on type
  const getModalIcon = () => {
    switch (modalContent.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Container fluid id="contactus" className={isVisible ? 'visible' : ''}>
      <div id="contactus-backbuttoncontainer">
        <button 
          id="contactus-backbuttoncontainer-backbutton"
          onClick={() => navigate('/')}
        >
          &larr;
        </button>
      </div>

      <Row className="contactus-header">
        <Col xs={12} className="text-center">
          <div className="header-content">
            <span className="subtitle-tag">Get in Touch</span>
            <h1 className="main-title">
              Contact <span className="highlight">OMSIAP</span>
            </h1>
            <p className="description">
              Of Macky's Ink And Paper - Your trusted partner for premium stationery and e-commerce solutions
            </p>
          </div>
        </Col>
      </Row>

      <Row className="contactus-content">
        {/* Contact Information Cards */}
        <Col lg={4} md={12} className="info-section">
          <div className="info-cards">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="info-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {info.link ? (
                  <a href={info.link} className="info-link">
                    <span className="info-icon">{info.icon}</span>
                    <div className="info-text">
                      <h4>{info.title}</h4>
                      <p>{info.content}</p>
                    </div>
                  </a>
                ) : (
                  <div className="info-link">
                    <span className="info-icon">{info.icon}</span>
                    <div className="info-text">
                      <h4>{info.title}</h4>
                      <p>{info.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="social-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className={`social-link ${hoveredSocial === index ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    '--social-color': social.color,
                    animationDelay: `${0.4 + index * 0.1}s`
                  }}
                  aria-label={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </Col>

        {/* Contact Form */}
        <Col lg={8} md={12} className="form-section">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder=" "
                      disabled={isSubmitting}
                    />
                    <label className="form-label">Your Name</label>
                    <div className="form-border"></div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder=" "
                      disabled={isSubmitting}
                    />
                    <label className="form-label">Email Address</label>
                    <div className="form-border"></div>
                  </div>
                </Col>
              </Row>
              
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <label className="form-label">Subject</label>
                <div className="form-border"></div>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="form-input form-textarea"
                  rows="5"
                  placeholder=" "
                  disabled={isSubmitting}
                ></textarea>
                <label className="form-label">Your Message</label>
                <div className="form-border"></div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                <span className="btn-text">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </span>
                <span className="btn-icon">
                  {isSubmitting ? '⏳' : '✉️'}
                </span>
              </button>
            </form>
          </div>
        </Col>
      </Row>

      {/* Map Section */}
      <Row className="map-section" id="map-section">
        <Col xs={12}>
          <div className="map-container">
            <div className="map-header">
              <h2>Visit Our Location</h2>
              <p>Find us on the map</p>
            </div>
            <div className="map-wrapper">
              <Map />
            </div>
          </div>
        </Col>
      </Row>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Response Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        centered
        className={`contactus-modal modal-${modalContent.type}`}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="modal-icon">{getModalIcon()}</span>
            {modalContent.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalContent.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant={modalContent.type === 'success' ? 'success' : 'primary'}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}