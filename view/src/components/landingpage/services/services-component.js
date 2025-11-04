import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add framer-motion for animations
import '../../../styles/landingpage/services/services.scss';

export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Services data for better maintenance and scalability
  const services = [
    {
      id: '01',
      title: "OMSIAP'S Market",
      description: "Complete data analysis based on the five W's (What, Who, When, Where, and Why), providing data-driven market share insights mapped for public access.",
      image: "../images/landingpage/services/goldenshield.jpg"
    },
    {
      id: '02',
      title: "Analysis & Report",
      description: "Effective data analysis drives informed decisions, enhances operational efficiency, and uncovers growth opportunities.",
      image: "../images/landingpage/services/analysisandreport.png"
    },
    {
      id: '03',
      title: "Marketing Strategy",
      description: "Engaging with innovative and data-driven marketing strategies.",
      image: "../images/landingpage/services/marketingstrategy.png"
    },
    {
      id: '04',
      title: "Monthly Finance Allocation To Individual People (MFATIP)",
      description: "Boost your self-growth while receiving monthly funds generated from OMSIAP’s diverse profit streams — including market profits, marketing fees from businesses recognized under OMSIAP’s taxation power, infrastructure project commissions, web development services, and community project profits and revenue.",
      image: "../images/landingpage/services/openhands.png"
    },
    {
      id: '05',
      title: "Web Development",
      description: "Modern web development combines responsive design, and user-friendly interfaces to create dynamic web applications.",
      image: "../images/landingpage/services/webdevelopment.png"
    },
    {
      id: '06',
      title: "Infrastructure",
      description: "Building and Housing projects for the whole Family including pets, tsunami and earthquake proof.",
      image: "../images/landingpage/services/infrastructure.png"
    }
  ];

  // Animation variants for staggered effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const logoVariants = {
    initial: { 
      rotate: 0,
      scale: 1
    },
    animate: {
      rotate: [0, 5, 0, -5, 0],
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Row id="services" className="services-section dark-theme">
      <Col xs={12} md={12} lg={12} className="services-header">
        <Row className="header-row">
          <Col xs={12} md={8} lg={9} className="header-text">
            <h3 className="subheading">For Self-growth and Corporate Services</h3>
            <h1 className="main-heading">Of Macky's Ink And Paper Core Services</h1>
          </Col>
          <Col xs={12} md={4} lg={3} className="header-button">
            <button 
              className="view-all-btn"
              onClick={() => navigate('/servicedetails')}
            >
              View all services
            </button>
          </Col>
        </Row>
      </Col>
      
      <Col xs={12} md={12} lg={12} className="services-grid">
        <motion.div 
          className="services-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row>
            {services.map((service, index) => (
              <Col xs={12} md={6} lg={4} key={index} className="service-col">
                <motion.div 
                  className="service-card"
                  variants={itemVariants}
                >
                  <div className="service-glow"></div>
                  <div className="count-container">
                    <p className="count-number">{service.id}</p>
                  </div>
                  <div className="logo-container">
                    <motion.img 
                      src={service.image}
                      alt={service.title}
                      className={`service-logo logo-${index + 1}`}
                      variants={logoVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    />
                  </div>
                  <div className="service-content">
                    <h2 className="service-title"><span className="highlight">*</span>{service.title}</h2>
                    <p className="service-description">{service.description}</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Col>
    </Row>
  );
}