import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'

import { Col, Row, Container } from 'react-bootstrap';
import '../../../styles/landingpage/footer/privacyandpolicy.scss';

export default function PrivacyAndPolicy() {

  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      icon: '📋',
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, including name, email address, phone number, shipping address, and payment information. We also automatically collect certain information about your device and how you interact with our platform.',
      highlights: ['Personal Details', 'Order Information', 'Device Data', 'Usage Analytics']
    },
    {
      icon: '🔒',
      title: 'How We Use Your Information',
      content: 'Your information is used to process orders, improve our services, communicate with you about your purchases, and provide personalized recommendations. We never sell your personal information to third parties.',
      highlights: ['Order Processing', 'Service Improvement', 'Customer Support', 'Marketing Communications']
    },
    {
      icon: '🛡️',
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. We regularly update our security protocols to ensure your data remains safe.',
      highlights: ['SSL Encryption', 'Secure Servers', 'Regular Audits', 'Access Controls']
    },
    {
      icon: '🍪',
      title: 'Cookies & Tracking',
      content: 'We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser preferences.',
      highlights: ['Essential Cookies', 'Analytics', 'Preferences', 'Marketing']
    },
    {
      icon: '👤',
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can opt-out of marketing communications at any time. Contact us to exercise your data protection rights.',
      highlights: ['Access Data', 'Update Info', 'Delete Account', 'Opt-Out Anytime']
    },
    {
      icon: '🤝',
      title: 'Third-Party Services',
      content: 'We work with trusted third-party service providers for payment processing, shipping, and analytics. These partners are required to maintain the confidentiality of your information.',
      highlights: ['Payment Processors', 'Shipping Partners', 'Analytics Tools', 'Email Services']
    }
  ];

  const policies = [
    {
      icon: '📅',
      label: 'Last Updated',
      value: 'October 25, 2025'
    },
    {
      icon: '⏰',
      label: 'Effective From',
      value: 'January 1, 2025'
    },
    {
      icon: '🌐',
      label: 'Jurisdiction',
      value: 'Philippines'
    },
    {
      icon: '📧',
      label: 'Contact',
      value: 'privacy@omsiap.com'
    }
  ];

  return (
    <Container fluid id="privacyandpolicy" className={isVisible ? 'visible' : ''}>

      <div id="privacyandpolicy-backbuttoncontainer">
        <button id="privacyandpolicy-backbuttoncontainer-backbutton"
                onClick={()=> {
                  navigate('/')
                }}>&larr;</button>
      </div> 

      {/* Header Section */}
      <Row className="privacy-header">
        <Col xs={12} className="text-center">
          <div className="header-content">
            <span className="subtitle-tag">Your Privacy Matters</span>
            <h1 className="main-title">
              Privacy & <span className="highlight">Policy</span>
            </h1>
            <p className="description">
              At OMSIAP, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </div>
        </Col>
      </Row>

      {/* Policy Info Cards */}
      <Row className="policy-info-section">
        {policies.map((policy, index) => (
          <Col key={index} lg={3} md={6} xs={12} className="policy-info-col">
            <div 
              className="policy-info-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="policy-icon">{policy.icon}</span>
              <div className="policy-text">
                <span className="policy-label">{policy.label}</span>
                <span className="policy-value">{policy.value}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Main Content Sections */}
      <Row className="content-section">
        <Col lg={4} md={12} className="sidebar-section">
          <div className="sidebar-container">
            <h3 className="sidebar-title">Quick Navigation</h3>
            <ul className="sidebar-menu">
              {sections.map((section, index) => (
                <li 
                  key={index}
                  className={`sidebar-item ${activeSection === index ? 'active' : ''}`}
                  onClick={() => setActiveSection(index)}
                >
                  <span className="sidebar-icon">{section.icon}</span>
                  <span className="sidebar-text">{section.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </Col>

        <Col lg={8} md={12} className="main-content-section">
          <div className="content-container">
            {sections.map((section, index) => (
              <div 
                key={index}
                className={`content-card ${activeSection === index ? 'active' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="content-header">
                  <span className="content-icon">{section.icon}</span>
                  <h2 className="content-title">{section.title}</h2>
                </div>
                <p className="content-description">{section.content}</p>
                <div className="content-highlights">
                  {section.highlights.map((highlight, idx) => (
                    <div key={idx} className="highlight-item">
                      <span className="highlight-bullet">✓</span>
                      <span className="highlight-text">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Contact Section */}
      <Row className="contact-section">
        <Col xs={12}>
          <div className="contact-container">
            <div className="contact-content">
              <h2 className="contact-title">Questions About Privacy?</h2>
              <p className="contact-description">
                If you have any questions or concerns about our privacy policy, please don't hesitate to reach out to our team.
              </p>
              <div className="contact-buttons">
                <button className="contact-btn primary">
                  <span className="btn-text">Contact Us</span>
                  <span className="btn-icon">📧</span>
                </button>
                <button className="contact-btn secondary">
                  <span className="btn-text">Download PDF</span>
                  <span className="btn-icon">📄</span>
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Important Notice */}
      <Row className="notice-section">
        <Col xs={12}>
          <div className="notice-container">
            <div className="notice-icon">⚠️</div>
            <div className="notice-content">
              <h4 className="notice-title">Important Notice</h4>
              <p className="notice-text">
                By using OMSIAP's services, you agree to our privacy policy. We may update this policy periodically, and we will notify you of any significant changes via email or through our platform.
              </p>
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
    </Container>
  );
}