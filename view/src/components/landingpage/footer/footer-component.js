import '../../../styles/landingpage/footer/footer.scss';

import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom'

import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaAngleRight,
  FaClock
} from 'react-icons/fa';

export default function Footer() {

  const navigate = useNavigate()

  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-wrapper">
      <div className="footer-top">
        <Container>
          <Row className="footer-row">
            {/* Company Info Column */}
            <Col xs={12} md={6} lg={4} className="footer-col company-info">
              <div className="footer-brand">
                <div className="logo-container">
                  <img 
                    src="../images/landingpage/footer/goldenshield.jpg" 
                    alt="OMSIAP Logo" 
                    className="footer-logo"
                  />
                </div>
                <div className="brand-name">
                  <h3>Of Macky's Ink And Paper</h3>
                </div>
              </div>
              <p className="company-description">
                OMSIAP is your trusted business agent, providing expert solutions 
                tailored to your needs. We help businesses thrive in today's competitive landscape.
              </p>
              
              <div className="social-icons">
                <a href="#" className="social-icon facebook">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-icon twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon linkedin">
                  <FaLinkedinIn />
                </a>
              </div>
              
            </Col>

            {/* Useful Links Column */}
            <Col xs={12} md={6} lg={4} className="footer-col useful-links">
              <h4 className="footer-title">Useful Links</h4>
              <ul className="footer-links">
                <li className="footer-link-item">
                  <FaAngleRight className="link-icon" />
                  <a href="contactus">Contact us</a>
                </li>
                <li className="footer-link-item">
                  <FaAngleRight className="link-icon" />
                  <a href="howitworks">How it works</a>
                </li>
                {/*
                <li className="footer-link-item">
                  <FaAngleRight className="link-icon" />
                  <a href="#">Office Create</a>
                </li>
                <li className="footer-link-item">
                  <FaAngleRight className="link-icon" />
                  <a href="#">Residential Explore</a>
                </li>
                */}
                <li className="footer-link-item">
                  <FaAngleRight className="link-icon" />
                  <a href="termsandservice">Terms & Service</a>
                </li>
                <li className="footer-link-item">
                  <FaAngleRight className="link-icon" />
                  <a href="privacyandpolicy">Privacy Policy</a>
                </li>
              </ul>
            </Col>

            {/* Contact Info Column */}
            <Col xs={12} md={6} lg={4} className="footer-col contact-info">
              <h4 className="footer-title">Get In Touch</h4>
              <ul className="contact-details">
                <li className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <p>Greenhills subdivision, Trinidad Street, Davao City, Philippines</p>
                </li>
                <li className="contact-item">
                  <FaPhone className="contact-icon" />
                  <p>+09956777674</p>
                </li>
                <li className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <p>markiebeloy@gmail.com</p>
                </li>
                <li className="contact-item">
                  <FaClock className="contact-icon" />
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                </li>
              </ul>
            </Col>

            {/* Newsletter Column 
            <Col xs={12} md={6} lg={3} className="footer-col newsletter">
              <h4 className="footer-title">Newsletter</h4>
              <p className="newsletter-text">
                Subscribe to our newsletter to receive updates on our latest services and offers.
              </p>
              <form className="newsletter-form">
                <div className="form-group">
                  <input 
                    type="email" 
                    className="newsletter-input" 
                    placeholder="Your Email Address" 
                    required
                  />
                  <button type="submit" className="newsletter-button">
                    Subscribe
                  </button>
                </div>
              </form>
              <div className="executive-image">
                <img 
                  src="../images/landingpage/footer/tuxedo.jpg" 
                  alt="Executive" 
                  className="executive-photo"
                />
              </div>
            </Col>
            */}
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <Row>
            <Col xs={12} className="copyright-col">
              <p className="copyright-text">
                © {currentYear} <span className="highlight">Of Macky's Ink And Paper</span>. All Rights Reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}