import '../../../styles/landingpage/pricingtable/pricingtable.scss';

import React, { useState } from 'react';
import { Row, Col, Accordion } from 'react-bootstrap';
import { X } from 'lucide-react';

// Registration Modal Components
import MFATIPRegistration from './registration-modals/mfatip-registration';
import PublicRegistration from './registration-modals/public-registration';
import PrivateRegistration from './registration-modals/private-registration';

export default function PricingTable() {
  const [showModal, setShowModal] = useState(false);
  const [registrationType, setRegistrationType] = useState('');

  const openRegistrationModal = (type) => {
    setRegistrationType(type);
    setShowModal(true);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  // Render the appropriate registration modal based on type
  const renderRegistrationModal = () => {
    if (!showModal) return null;

    switch (registrationType) {
      case 'MFATIP':
        return <MFATIPRegistration onClose={closeModal} />;
      case 'Public citizenship':
        return <PublicRegistration onClose={closeModal} />;
      case 'Private citizenship':
        return <PrivateRegistration onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="pricing-container">
      <Row className="pricing-table">
        <Col xs={12} md={6} lg={6} className="pricing-info">
          <div className="pricing-header">
            <h3 className="subtitle">Pricing table</h3>
            <h1 className="title">OMSIAP CITIZENSHIP</h1>
          </div>
          
          <div className="pricing-accordion">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <p className="accordion-title">What is OMSIAP CITIZENSHIP?</p>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="accordion-text">
                    OMSIAP Citizenship Categories, OMSIAP offers three distinct citizenship categories, each with unique benefits and requirements:
                  </p>
                  <p className="accordion-text highlight">
                    1. MFATIP (Monthly Financial Allocation To Individual People)
                  </p>
                  <p className="accordion-text">
                    MFATIP citizenship is designed to support personal growth through monthly financial allocations. Key features:
                  </p>
                  <ul className="feature-list">
                    <li>One-time lifetime registration with no recurring fees</li>
                    <li>Monthly funds distributed from OMSIAP's revenue based on set percentages</li>
                    <li>No registration or monthly payments required</li>
                    <li>Free monthly financial allocation program</li>
                  </ul>

                  <p className="accordion-text highlight">
                    2. Public Citizenship
                  </p>
                  <p className="accordion-text">
                    This category operates on a monthly membership basis:
                  </p>
                  <ul className="feature-list">
                    <li>Monthly membership fee: 150 pesos</li>
                    <li>Treated as a tax contribution to OMSIAP</li>
                    <li>Members receive guaranteed monthly funds calculated from OMSIAP's revenue</li>
                    <li>Benefits distributed through public sharing system</li>
                    <li>Membership duration: 1 month, renewable</li>
                  </ul>

                  <p className="accordion-text highlight">
                    3. Private Citizenship
                  </p>
                  <p className="accordion-text">
                    Similar to public citizenship but with enhanced benefits:
                  </p>
                  <ul className="feature-list">
                    <li>Quarterly membership fee: 300 pesos (valid for 3 months)</li>
                    <li>Treated as a tax contribution to OMSIAP</li>
                    <li>Higher monthly financial allocations compared to public citizenship</li>
                    <li>Funds distributed exclusively among private OMSIAP citizens</li>
                    <li>Benefits shared through private distribution channels</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <p className="accordion-title">Do I need to pay to be an OMSIAP citizen?</p>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="accordion-text">
                    Payments are only required when acquiring public or private citizenship. However, on OMSIAP, you automatically become a citizen through the Monthly Financial Allocation to Individual People (MFATIP) program, which provides monthly financial distributions. To participate, you must first complete a one-time, free registration that remains valid for life.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <p className="accordion-title">What is OMSIAP's operational area and scope of activities?</p>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="accordion-text">
                    It depends on the activity. There are certain activities that can only be done through OMSIAP offices located in designated areas. However, contacting OMSIAP is possible globally since we use email technology. OMSIAP also offers services that can operate globally, such as marketing, infrastructure projects, and web development.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  <p className="accordion-title">Payment Methods, Membership or Citizenship Terms for OMSIAP</p>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="accordion-text highlight">Payment Options:</p>
                  <p className="accordion-text">1. Online Payments</p>
                  <ul className="feature-list">
                    <li>Integrated digital payment platforms (e.g. Gcash, OMSIAPS payment system using OMSIAPS own currency)</li>
                  </ul>
                  <p className="accordion-text">2. Physical Payments</p>
                  <ul className="feature-list">
                    <li>In-person transactions at OMSIAP offices</li>
                  </ul>
                  
                  <p className="accordion-text highlight">Membership Categories and Duration:</p>
                  <p className="accordion-text">1. Private Citizenship</p>
                  <ul className="feature-list">
                    <li>Integrated digital payment platforms (e.g. Gcash, OMSIAPS payment system using OMSIAPS own currency)</li>
                  </ul>
                  <p className="accordion-text">2. Public Citizenship</p>
                  <ul className="feature-list">
                    <li>Tax/membership period: 1-month term</li>
                    <li>Includes lifetime enrollment in MFATIP (Monthly Financial Allocation To Individual People)</li>
                    <li>Beneficiaries receive monthly financial allocations</li>
                  </ul>
                  
                  <p className="accordion-text highlight">Transaction Processing:</p>
                  <ul className="feature-list">
                    <li>Automated processing through AI systems</li>
                    <li>Manual processing available at OMSIAP offices</li>
                    <li>MFATIP disbursements are managed automatically for enrolled members</li>
                  </ul>
                  
                  <p className="accordion-text note">
                    Note: The Monthly Financial Allocation To Individual People (MFATIP) program provides continuous financial benefits to qualifying public citizenship holders for their lifetime.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  <p className="accordion-title">What are currencies used?</p>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="accordion-text highlight">Accepted Currencies in OMSIAP</p>
                  <p className="accordion-text">1. OMSIAPAWASTO (Of Macky'S Ink And Paper And Wood And Stone Currency)</p>
                  <ul className="feature-list">
                    <li>This is OMSIAP's native currency</li>
                    <li>Functions as the organization's official internal currency</li>
                  </ul>
                  <p className="accordion-text">2. Philippine Peso (PHP)</p>
                  <ul className="feature-list">
                    <li>Widely used for transactions</li>
                    <li>Can be converted from OMSIAPAWASTO</li>
                  </ul>
                  <p className="accordion-text">
                    All transactions made using OMSIAPAWASTO are automatically processed through payment platforms that utilize digital payment integration, such as GCash. This ensures secure and convenient transactions for users.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="5">
                <Accordion.Header>
                  <p className="accordion-title">Securement</p>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="accordion-text">
                    Join OMSIAP's creative community as a citizen and unlock your potential for personal growth! Whether you choose to use OMSIAPAWASTO through OMSIAP's integrated payment system or Philippine Peso via GCash, becoming a citizen connects you with fellow members and gives you access to our unique platform. Our secure payment options make the process seamless, so you can focus on what matters most - developing yourself and being part of our growing community.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Col>
        
        <Col xs={12} md={6} lg={6} className="pricing-plans">
          <div className="plan-card" onClick={() => openRegistrationModal('MFATIP')}>
            <div className="plan-checkbox">
              <span className="checkmark">✓</span>
            </div>
            <div className="plan-details">
              <p className="plan-type">(M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople or MFATIP</p>
              <h3 className="plan-duration">Free / Lifetime registration</h3>
              <p className="plan-description">Start your journey to financial growth with OMSIAP. Register for free today and receive monthly financial allocations with your lifetime membership.</p>
            </div>
            <div className="plan-price">
              <p className="price">₱ 0.00</p>
            </div>
            <div className="plan-badge">
              <p className="badge-text">Best Value</p>
            </div>
          </div>

          <div className="plan-card" onClick={() => openRegistrationModal('Public citizenship')}>
            <div className="plan-checkbox">
              <span className="checkmark">✓</span>
            </div>
            <div className="plan-details">
              <p className="plan-type">Public citizenship</p>
              <h3 className="plan-duration">Monthly expiration</h3>
              <p className="plan-description">Maximize your financial growth potential with OMSIAP. Receive higher percentage-based monthly allocations!</p>
            </div>
            <div className="plan-price">
              <p className="price">₱ 150.00</p>
            </div>
            <div className="plan-badge">
              <p className="badge-text">Popular</p>
            </div>
          </div>

          <div className="plan-card" onClick={() => openRegistrationModal('Private citizenship')}>
            <div className="plan-checkbox">
              <span className="checkmark">✓</span>
            </div>
            <div className="plan-details">
              <p className="plan-type">Private citizenship</p>
              <h3 className="plan-duration">Every three months expiration</h3>
              <p className="plan-description">Maximize your financial growth potential with OMSIAP. Receive higher percentage-based monthly allocations!</p>
            </div>
            <div className="plan-price">
              <p className="price">₱ 300.00</p>
            </div>
            <div className="plan-badge">
              <p className="badge-text">Premium</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            {renderRegistrationModal()}
          </div>
        </div>
      )}
    </div>
  );
}



