import React, { useState } from 'react';

import '../../styles/privacypolicy/privacypolicy.scss';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: February 25, 2025</p>
      </div>

      <div className="privacy-policy-intro">
        <p>
          Thank you for choosing our services. We are committed to protecting your privacy and providing 
          you with a secure experience. This Privacy Policy explains how we collect, use, and safeguard your 
          information when you visit our website or use our application.
        </p>
      </div>

      <div className="privacy-policy-table-of-contents">
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#information-collection" onClick={(e) => { e.preventDefault(); toggleSection('information-collection'); }}>Information We Collect</a></li>
          <li><a href="#information-use" onClick={(e) => { e.preventDefault(); toggleSection('information-use'); }}>How We Use Your Information</a></li>
          <li><a href="#information-sharing" onClick={(e) => { e.preventDefault(); toggleSection('information-sharing'); }}>Information Sharing</a></li>
          <li><a href="#cookies" onClick={(e) => { e.preventDefault(); toggleSection('cookies'); }}>Cookies and Tracking</a></li>
          <li><a href="#data-security" onClick={(e) => { e.preventDefault(); toggleSection('data-security'); }}>Data Security</a></li>
          <li><a href="#user-rights" onClick={(e) => { e.preventDefault(); toggleSection('user-rights'); }}>Your Rights</a></li>
          <li><a href="#children" onClick={(e) => { e.preventDefault(); toggleSection('children'); }}>Children's Privacy</a></li>
          <li><a href="#changes" onClick={(e) => { e.preventDefault(); toggleSection('changes'); }}>Changes to This Policy</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); toggleSection('contact'); }}>Contact Us</a></li>
        </ul>
      </div>

      <div className="privacy-policy-sections">
        <section id="information-collection" className={`policy-section ${activeSection === 'information-collection' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('information-collection')}>
            Information We Collect
            <span className="toggle-icon">{activeSection === 'information-collection' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide when using our service, including:</p>
            <ul>
              <li>Contact information (name, email address, phone number)</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Profile information</li>
            </ul>

            <h3>Usage Information</h3>
            <p>We automatically collect certain information about your interaction with our services, including:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage patterns and preferences</li>
              <li>Access times and referring URLs</li>
            </ul>
          </div>
        </section>

        <section id="information-use" className={`policy-section ${activeSection === 'information-use' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('information-use')}>
            How We Use Your Information
            <span className="toggle-icon">{activeSection === 'information-use' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and fulfilling orders</li>
              <li>Improving and personalizing user experience</li>
              <li>Communicating with you about updates, promotions, or support</li>
              <li>Analyzing usage patterns to enhance our service</li>
              <li>Detecting and preventing fraud or security breaches</li>
            </ul>
          </div>
        </section>

        <section id="information-sharing" className={`policy-section ${activeSection === 'information-sharing' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('information-sharing')}>
            Information Sharing
            <span className="toggle-icon">{activeSection === 'information-sharing' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who assist in operating our business</li>
              <li>Partners with whom we offer co-branded services or promotions</li>
              <li>Legal authorities when required by law or to protect our rights</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </div>
        </section>

        <section id="cookies" className={`policy-section ${activeSection === 'cookies' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('cookies')}>
            Cookies and Tracking
            <span className="toggle-icon">{activeSection === 'cookies' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>We use cookies and similar tracking technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Understand how you interact with our services</li>
              <li>Analyze and improve our offerings</li>
              <li>Deliver relevant advertisements</li>
            </ul>
            <p>You can manage your cookie preferences through your browser settings.</p>
          </div>
        </section>

        <section id="data-security" className={`policy-section ${activeSection === 'data-security' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('data-security')}>
            Data Security
            <span className="toggle-icon">{activeSection === 'data-security' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>We implement appropriate security measures to protect your personal information, including:</p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Secure data storage practices</li>
            </ul>
            <p>While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.</p>
          </div>
        </section>

        <section id="user-rights" className={`policy-section ${activeSection === 'user-rights' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('user-rights')}>
            Your Rights
            <span className="toggle-icon">{activeSection === 'user-rights' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li>Access to your personal data</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your data (subject to certain conditions)</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p>To exercise these rights, please contact us using the information provided in the Contact Us section.</p>
          </div>
        </section>

        <section id="children" className={`policy-section ${activeSection === 'children' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('children')}>
            Children's Privacy
            <span className="toggle-icon">{activeSection === 'children' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
          </div>
        </section>

        <section id="changes" className={`policy-section ${activeSection === 'changes' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('changes')}>
            Changes to This Policy
            <span className="toggle-icon">{activeSection === 'changes' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We recommend reviewing this Privacy Policy periodically for any changes.</p>
          </div>
        </section>

        <section id="contact" className={`policy-section ${activeSection === 'contact' ? 'active' : ''}`}>
          <h2 onClick={() => toggleSection('contact')}>
            Contact Us
            <span className="toggle-icon">{activeSection === 'contact' ? '−' : '+'}</span>
          </h2>
          <div className="section-content">
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <div className="contact-info">
              <p>Email: privacy@example.com</p>
              <p>Address: 123 Privacy Street, Securityville, SC 12345</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </section>
      </div>

      <div className="privacy-policy-footer">
        <button className="accept-button">Accept All</button>
        <button className="customize-button">Customize Settings</button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;