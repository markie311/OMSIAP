"use client"

import { useState } from "react"
import { Row, Col, Modal, Form, Button } from "react-bootstrap"
import { Phone, Mail, MapPin, X, Send, Image } from "lucide-react"

import NavBar from '../../navbar/navbar/navbar-component.js';
import Footer from '../footer/footer-component.js';

import '../../../styles/landingpage/services/servicedetails.scss';

export default function ServiceDetails({ viewport }) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState("")
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [serviceType, setServiceType] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData, "Service Type:", serviceType)

    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
    setShowQuoteModal(false)

    // Show success message
    alert("Your quote request has been submitted. We will contact you shortly.")
  }

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc)
    setShowImageModal(true)
  }

  const openQuoteModal = (type) => {
    setServiceType(type)
    setShowQuoteModal(true)
  }

  // Placeholder images - replace with your actual image paths
  const headerImage = "../images/landingpage/services/holdingphone.jpg"
  const marketImage = "../images/landingpage/services/holdingphone.jpg"
  const analysisImage = "../images/landingpage/services/holdingphone.jpg"

  // Skill sets for each service
  const marketSkills = [
    { name: "Market Research", percentage: 90 },
    { name: "Data Analysis", percentage: 85 },
    { name: "Consumer Insights", percentage: 80 },
    { name: "Strategic Planning", percentage: 95 },
  ]

  const analysisSkills = [
    { name: "Statistical Analysis", percentage: 95 },
    { name: "Data Visualization", percentage: 90 },
    { name: "Predictive Modeling", percentage: 85 },
    { name: "Report Generation", percentage: 88 },
  ]

  return (
    <div className="service-details">

      <NavBar />

      {/* Header Section */}
      <div className="header-section">
        <div className="header-image-container">
          <img
            src={headerImage || "/placeholder.svg"}
            alt="Service Details Header"
            className="header-image"
            onClick={() => openImageModal(headerImage)}
          />
          <div className="image-overlay"></div>
        </div>
        <div className="header-content">
          <h1 className="header-title">Service Details</h1>
          <p className="header-breadcrumb">Home / Service Details</p>
        </div>
      </div>

      {/* OMSIAP Market Service Details */}
      <Row className="service-row">
        <Col xs={12} md={6} className="service-image-col">
          <div className="service-image-container">
            <img
              src={marketImage || "/placeholder.svg"}
              alt="OMSIAP Market Service"
              className="service-image"
              onClick={() => openImageModal(marketImage)}
            />
            <button className="image-view-btn" onClick={() => openImageModal(marketImage)}>
              <Image size={20} />
              <span>View Image</span>
            </button>
          </div>
          <div className="quote-cta">
            <h2 className="quote-title">Request A Quote For Work</h2>
            <Button className="quote-btn" onClick={() => openQuoteModal("OMSIAP Market")}>
              Get a Quote
            </Button>
          </div>
        </Col>
        <Col xs={12} md={6} className="service-details-col">
          <div className="service-header">
            <h2 className="service-title">OMSIAP'S Market</h2>
            <p className="service-description">
              Complete data analysis starting from the five W's. What, Whom, When, Where and Why data driven and mapped
              market shared to the public.
            </p>
          </div>
          <div className="contact-details">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <p className="contact-text">Phone number: 000-0000-000-0000</p>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <p className="contact-text">Email address: sample@gmail.com</p>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <p className="contact-text">Office location: Maa, Trinidad street, Greenhills subdivision, Davao City</p>
            </div>
          </div>
          <div className="skills-container">
            <h3 className="skills-title">Skills & Expertise</h3>
            {marketSkills.map((skill, index) => (
              <div className="skill-item" key={index}>
                <div className="skill-header">
                  <p className="skill-name">{skill.name}</p>
                  <p className="skill-percentage">{skill.percentage}%</p>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Analysis Report Service Details */}
      <Row className="service-row">
        <Col xs={12} md={6} className="service-image-col">
          <div className="service-image-container">
            <img
              src={analysisImage || "/placeholder.svg"}
              alt="Analysis Report Service"
              className="service-image"
              onClick={() => openImageModal(analysisImage)}
            />
            <button className="image-view-btn" onClick={() => openImageModal(analysisImage)}>
              <Image size={20} />
              <span>View Image</span>
            </button>
          </div>
          <div className="quote-cta">
            <h2 className="quote-title">Request A Quote For Work</h2>
            <Button className="quote-btn" onClick={() => openQuoteModal("Analysis Report")}>
              Get a Quote
            </Button>
          </div>
        </Col>
        <Col xs={12} md={6} className="service-details-col">
          <div className="service-header">
            <h2 className="service-title">Analysis Report</h2>
            <p className="service-description">
              Comprehensive analysis reports that transform complex data into actionable insights. Our reports provide
              clear, data-driven recommendations for your business.
            </p>
          </div>
          <div className="contact-details">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <p className="contact-text">Phone number: 000-0000-000-0000</p>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <p className="contact-text">Email address: sample@gmail.com</p>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <p className="contact-text">Office location: Maa, Trinidad street, Greenhills subdivision, Davao City</p>
            </div>
          </div>
          <div className="skills-container">
            <h3 className="skills-title">Skills & Expertise</h3>
            {analysisSkills.map((skill, index) => (
              <div className="skill-item" key={index}>
                <div className="skill-header">
                  <p className="skill-name">{skill.name}</p>
                  <p className="skill-percentage">{skill.percentage}%</p>
                </div>
                <div className="skill-bar">
                  <div className="skill-progress" style={{ width: `${skill.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered dialogClassName="image-modal">
        <Modal.Header>
          <button className="modal-close-btn" onClick={() => setShowImageModal(false)}>
            <X size={24} />
          </button>
        </Modal.Header>
        <Modal.Body>
          <img src={modalImage || "/placeholder.svg"} alt="Service" className="modal-image" />
        </Modal.Body>
      </Modal>

      {/* Quote Request Modal */}
      <Modal show={showQuoteModal} onHide={() => setShowQuoteModal(false)} centered dialogClassName="quote-modal">
        <Modal.Header>
          <Modal.Title className="quote-modal-title">Request A Quote - {serviceType}</Modal.Title>
          <button className="modal-close-btn" onClick={() => setShowQuoteModal(false)}>
            <X size={24} />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Describe your project requirements"
              />
            </Form.Group>
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setShowQuoteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="submit-btn">
                <Send size={16} className="me-2" />
                Send Message
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  )
}



