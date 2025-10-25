import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'

import { Col, Row, Container } from 'react-bootstrap';
import '../../../styles/landingpage/footer/howitworks.scss';

export default function HowItWorks() {

  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Browse Products',
      description: 'Explore our wide range of premium stationery, ink, and paper products. Use our smart filters to find exactly what you need.',
      features: ['Advanced Search', 'Product Categories', 'Price Filters']
    },
    {
      number: '02',
      icon: '🛒',
      title: 'Add to Cart',
      description: 'Select your favorite items and add them to your cart. Review quantities and specifications before proceeding.',
      features: ['Quick Add', 'Save for Later', 'Bulk Orders']
    },
    {
      number: '03',
      icon: '💳',
      title: 'Secure Checkout',
      description: 'Complete your purchase with our secure payment gateway. Multiple payment options available for your convenience.',
      features: ['Multiple Payments', 'Secure Gateway', 'Order Tracking']
    },
    {
      number: '04',
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Sit back and relax while we prepare and deliver your order straight to your doorstep with real-time tracking.',
      features: ['Express Shipping', 'Track Order', 'Safe Packaging']
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Quick loading times and seamless browsing experience'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with top-tier security'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your orders and view detailed market analytics'
    },
    {
      icon: '🎁',
      title: 'Exclusive Deals',
      description: 'Access special promotions and transaction giveaways'
    }
  ];

  return (
    <Container fluid id="howitworks" className={isVisible ? 'visible' : ''}>

      <div id="howitworks-backbuttoncontainer">
        <button id="howitworks-backbuttoncontainer-backbutton"
                onClick={()=> {
                   navigate('/')
                }}>&larr;</button>
      </div>

      {/* Header Section */}
      <Row className="howitworks-header">
        <Col xs={12} className="text-center">
          <div className="header-content">
            <span className="subtitle-tag">Simple & Easy</span>
            <h1 className="main-title">
              How <span className="highlight">OMSIAP</span> Works
            </h1>
            <p className="description">
              Experience seamless e-commerce shopping with our intuitive platform. From browsing to delivery, we've made it simple.
            </p>
          </div>
        </Col>
      </Row>

      {/* Steps Section */}
      <Row className="steps-section">
        <Col xs={12}>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`step-card ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  <ul className="step-features">
                    {step.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-bullet">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Timeline Visualization */}
      <Row className="timeline-section">
        <Col xs={12}>
          <div className="timeline-wrapper">
            <div className="timeline-line"></div>
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`timeline-dot ${activeStep === index ? 'active' : ''}`}
                style={{ left: `${(index / (steps.length - 1)) * 100}%` }}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="dot-inner">{step.icon}</div>
                <span className="dot-label">{step.title}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Benefits Section */}
      <Row className="benefits-section">
        <Col xs={12} className="text-center mb-4">
          <h2 className="benefits-title">Why Choose OMSIAP?</h2>
          <p className="benefits-subtitle">Discover the advantages of shopping with us</p>
        </Col>
        {benefits.map((benefit, index) => (
          <Col key={index} lg={3} md={6} xs={12} className="benefit-col">
            <div 
              className="benefit-card"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="benefit-icon">{benefit.icon}</div>
              <h4 className="benefit-title">{benefit.title}</h4>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          </Col>
        ))}
      </Row>

      {/* CTA Section */}
      <Row className="cta-section">
        <Col xs={12} className="text-center">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers who trust OMSIAP for their stationery needs
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary">
                <span className="btn-text">Shop Now</span>
                <span className="btn-icon">🛍️</span>
              </button>
              <button className="cta-btn secondary">
                <span className="btn-text">Learn More</span>
                <span className="btn-icon">📖</span>
              </button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>
    </Container>
  );
}