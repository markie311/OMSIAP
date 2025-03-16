"use client"

import '../../styles/hope/hope.scss';
import { useState } from "react"
import { Row, Col } from "react-bootstrap"
import {
  Phone,
  Mail,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Leaf,
  Building,
  ShoppingCart,
  Construction,
} from "lucide-react"

import NavBar from "../navbar/navbar/navbar-component.js"
import Footer from "../landingpage/footer/footer-component.js"

export default function HOPE({ viewport, user, usercb }) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState("")
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    icon: null,
  })

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc)
    setShowImageModal(true)
  }

  const openInfoModal = (type) => {
    let content = {}

    switch (type) {
      case "MARKET":
        content = {
          title: "Market Analysis & Opportunities",
          icon: <ShoppingCart size={32} className="modal-header-icon" />,
          content: (
            <>
              <div className="modal-section">
                <h3>Market Overview</h3>
                <p>
                  Our comprehensive market analysis evaluates economic indicators, consumer trends, and competitive
                  landscapes to provide actionable insights for strategic decision-making.
                </p>
              </div>

              <div className="modal-section">
                <h3>Key Market Indicators</h3>
                <div className="graph-container">
                  <div className="graph-header">
                    <BarChart3 className="graph-icon" />
                    <h4>Market Growth by Sector (2023)</h4>
                  </div>
                  <div className="bar-graph">
                    <div className="bar-container">
                      <div className="bar" style={{ height: "65%" }}></div>
                      <span>Tech</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "45%" }}></div>
                      <span>Retail</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "80%" }}></div>
                      <span>Healthcare</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "30%" }}></div>
                      <span>Finance</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "55%" }}></div>
                      <span>Energy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Market Opportunities</h3>
                <ul className="feature-list">
                  <li>
                    <strong>Emerging Markets:</strong> Identification of untapped market segments with high growth
                    potential
                  </li>
                  <li>
                    <strong>Consumer Behavior Analysis:</strong> Deep insights into changing consumer preferences and
                    purchasing patterns
                  </li>
                  <li>
                    <strong>Competitive Positioning:</strong> Strategic recommendations for market differentiation and
                    competitive advantage
                  </li>
                  <li>
                    <strong>Sustainable Market Practices:</strong> Implementation of eco-friendly market strategies that
                    align with consumer values
                  </li>
                </ul>
              </div>

              <div className="eco-friendly-section">
                <Leaf className="eco-icon" />
                <div>
                  <h3>Eco-Friendly Market Initiatives</h3>
                  <p>
                    Our market analysis includes sustainability metrics that help businesses reduce environmental impact
                    while improving market performance. We identify green market opportunities and sustainable consumer
                    segments.
                  </p>
                </div>
              </div>
            </>
          ),
        }
        break

      case "BUSINESS":
        content = {
          title: "Business Portfolio Management",
          icon: <Building size={32} className="modal-header-icon" />,
          content: (
            <>
              <div className="modal-section">
                <h3>Business Portfolio Overview</h3>
                <p>
                  Our business portfolio management system provides comprehensive tools for optimizing business
                  operations, maximizing profitability, and ensuring sustainable growth across diverse industries.
                </p>
              </div>

              <div className="modal-section">
                <h3>Portfolio Performance</h3>
                <div className="graph-container">
                  <div className="graph-header">
                    <PieChart className="graph-icon" />
                    <h4>Business Portfolio Distribution</h4>
                  </div>
                  <div className="pie-chart">
                    <div className="pie-segment segment1" title="Technology: 35%"></div>
                    <div className="pie-segment segment2" title="Manufacturing: 25%"></div>
                    <div className="pie-segment segment3" title="Services: 20%"></div>
                    <div className="pie-segment segment4" title="Retail: 15%"></div>
                    <div className="pie-segment segment5" title="Other: 5%"></div>
                  </div>
                  <div className="pie-legend">
                    <div className="legend-item">
                      <span className="legend-color color1"></span>Technology (35%)
                    </div>
                    <div className="legend-item">
                      <span className="legend-color color2"></span>Manufacturing (25%)
                    </div>
                    <div className="legend-item">
                      <span className="legend-color color3"></span>Services (20%)
                    </div>
                    <div className="legend-item">
                      <span className="legend-color color4"></span>Retail (15%)
                    </div>
                    <div className="legend-item">
                      <span className="legend-color color5"></span>Other (5%)
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Business Solutions</h3>
                <ul className="feature-list">
                  <li>
                    <strong>Strategic Planning:</strong> Comprehensive business strategy development aligned with market
                    opportunities
                  </li>
                  <li>
                    <strong>Operational Efficiency:</strong> Process optimization and cost reduction strategies
                  </li>
                  <li>
                    <strong>Risk Management:</strong> Identification and mitigation of business risks
                  </li>
                  <li>
                    <strong>Growth Acceleration:</strong> Scalable business models and expansion strategies
                  </li>
                  <li>
                    <strong>Digital Transformation:</strong> Technology integration for business process enhancement
                  </li>
                </ul>
              </div>

              <div className="eco-friendly-section">
                <Leaf className="eco-icon" />
                <div>
                  <h3>Sustainable Business Practices</h3>
                  <p>
                    Our business portfolio management incorporates sustainability metrics to help businesses reduce
                    their environmental footprint while improving operational efficiency. We provide guidance on
                    implementing eco-friendly business practices that contribute to both profitability and environmental
                    stewardship.
                  </p>
                </div>
              </div>
            </>
          ),
        }
        break

      case "INFRASTRUCTURES":
        content = {
          title: "Infrastructure Development & Management",
          icon: <Construction size={32} className="modal-header-icon" />,
          content: (
            <>
              <div className="modal-section">
                <h3>Infrastructure Solutions</h3>
                <p>
                  Our infrastructure portfolio provides comprehensive solutions for developing, managing, and optimizing
                  critical infrastructure projects that support economic growth and community development.
                </p>
              </div>

              <div className="modal-section">
                <h3>Infrastructure Performance Metrics</h3>
                <div className="graph-container">
                  <div className="graph-header">
                    <LineChart className="graph-icon" />
                    <h4>Infrastructure Investment Returns (5-Year Trend)</h4>
                  </div>
                  <div className="line-graph">
                    <svg viewBox="0 0 300 150" className="line-chart-svg">
                      <polyline
                        fill="none"
                        stroke="#0074d9"
                        strokeWidth="3"
                        points="
                          0,120
                          60,100
                          120,110
                          180,80
                          240,60
                          300,40
                        "
                      />
                      <g className="axis-labels x-axis">
                        <text x="0" y="140">
                          2019
                        </text>
                        <text x="60" y="140">
                          2020
                        </text>
                        <text x="120" y="140">
                          2021
                        </text>
                        <text x="180" y="140">
                          2022
                        </text>
                        <text x="240" y="140">
                          2023
                        </text>
                        <text x="300" y="140">
                          2024
                        </text>
                      </g>
                      <g className="axis-labels y-axis">
                        <text x="10" y="120">
                          5%
                        </text>
                        <text x="10" y="90">
                          10%
                        </text>
                        <text x="10" y="60">
                          15%
                        </text>
                        <text x="10" y="30">
                          20%
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Infrastructure Capabilities</h3>
                <ul className="feature-list">
                  <li>
                    <strong>Project Planning & Design:</strong> Comprehensive infrastructure planning with sustainable
                    design principles
                  </li>
                  <li>
                    <strong>Construction Management:</strong> Efficient project execution with quality control and
                    timeline management
                  </li>
                  <li>
                    <strong>Asset Management:</strong> Long-term infrastructure maintenance and optimization strategies
                  </li>
                  <li>
                    <strong>Smart Infrastructure:</strong> Integration of technology for enhanced infrastructure
                    performance
                  </li>
                  <li>
                    <strong>Public-Private Partnerships:</strong> Innovative funding and collaboration models for
                    infrastructure development
                  </li>
                </ul>
              </div>

              <div className="eco-friendly-section">
                <Leaf className="eco-icon" />
                <div>
                  <h3>Eco-Friendly Infrastructure</h3>
                  <p>
                    Our infrastructure solutions prioritize environmental sustainability through green building
                    practices, renewable energy integration, and resource-efficient designs. We help develop
                    infrastructure that minimizes environmental impact while maximizing community benefits and economic
                    returns.
                  </p>
                  <ul className="eco-list">
                    <li>Reduced carbon footprint through energy-efficient designs</li>
                    <li>Water conservation and management systems</li>
                    <li>Sustainable materials and construction methods</li>
                    <li>Renewable energy integration in infrastructure projects</li>
                  </ul>
                </div>
              </div>
            </>
          ),
        }
        break

      case "ECO_FRIENDLY":
        content = {
          title: "Eco-Friendly Initiatives",
          icon: <Leaf size={32} className="modal-header-icon" />,
          content: (
            <>
              <div className="modal-section">
                <h3>Our Green Commitment</h3>
                <p>
                  At HOPE, we believe that environmental responsibility is crucial for sustainable development. Our eco-friendly 
                  initiatives integrate environmental consciousness across all aspects of our operations and services.
                </p>
              </div>

              <div className="modal-section">
                <h3>Key Environmental Metrics</h3>
                <div className="graph-container">
                  <div className="graph-header">
                    <BarChart3 className="graph-icon" />
                    <h4>Environmental Impact Reduction (Annual)</h4>
                  </div>
                  <div className="bar-graph">
                    <div className="bar-container">
                      <div className="bar" style={{ height: "75%" }}></div>
                      <span>Carbon</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "60%" }}></div>
                      <span>Water</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "85%" }}></div>
                      <span>Waste</span>
                    </div>
                    <div className="bar-container">
                      <div className="bar" style={{ height: "65%" }}></div>
                      <span>Energy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Sustainability Initiatives</h3>
                <ul className="feature-list">
                  <li>
                    <strong>Renewable Energy Integration:</strong> Implementation of solar, wind, and other renewable energy sources
                  </li>
                  <li>
                    <strong>Waste Reduction Programs:</strong> Comprehensive recycling and waste management systems
                  </li>
                  <li>
                    <strong>Sustainable Supply Chain:</strong> Partnering with eco-conscious suppliers and vendors
                  </li>
                  <li>
                    <strong>Carbon Neutrality:</strong> Ongoing efforts to reduce and offset carbon emissions
                  </li>
                  <li>
                    <strong>Green Building Practices:</strong> Implementation of sustainable construction and operation methods
                  </li>
                </ul>
              </div>

              <div className="eco-friendly-section highlight">
                <Leaf className="eco-icon" />
                <div>
                  <h3>Environmental Impact Assessment</h3>
                  <p>
                    Our environmental assessment program helps organizations measure, monitor, and minimize their ecological footprint. 
                    Through detailed analysis and actionable recommendations, we enable sustainable operations that benefit both the 
                    environment and business performance.
                  </p>
                  <ul className="eco-list">
                    <li>Comprehensive environmental audits</li>
                    <li>Sustainable business practice implementation</li>
                    <li>Green certification guidance</li>
                    <li>Environmental compliance management</li>
                  </ul>
                </div>
              </div>
            </>
          ),
        }
        break

      default:
        content = {
          title: "Information",
          content: <p>Content not available.</p>,
        }
    }

    setModalContent(content)
    setShowInfoModal(true)
  }

  // Placeholder images - replace with your actual image paths
  const headerImage = "../images/hope/happycrowd.jpg"
  const laptopImage = "../images/hope/happycrowd.jpg"
  const smallImage1 = "../images/hope/happycrowd.jpg"
  const smallImage2 = "../images/hope/happycrowd.jpg"

  // Navigation function (simulated)
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`)
    // In a real app, you would use your router's navigation
    // window.location.href = path;
  }

  return (
    <div className="hope-container dark-theme">
      {/* NavBar */}
      <NavBar viewport={viewport} user={user} usercb={usercb} />

      {/* Header Section */}
      <div className="hope-header">
        <div className="header-image-container">
          <img
            src={headerImage || "/placeholder.svg?height=500&width=1200"}
            alt="HOPE Header"
            className="header-image"
            onClick={() => openImageModal(headerImage)}
          />
          <div className="image-overlay dark-overlay"></div>
        </div>
        <div className="header-content">
          <h1 className="header-title">Honesties On Constitutional Promises Evaluation</h1>
          <h5 className="header-subtitle">(H)(O)(P)(E)</h5>
        </div>
      </div>

      {/* About HOPE Section */}
      <Row className="about-hope-section">
        <Col xs={12} md={6} className="about-content-col">
          <div className="main-image-container">
            <img
              src={laptopImage || "/placeholder.svg?height=400&width=600"}
              alt="About HOPE"
              className="main-image"
              onClick={() => openImageModal(laptopImage)}
            />
          </div>

          <h1 className="about-title">Honesties On Constitutional Promises Evaluation (H) (O) (P) (E)</h1>

          <p className="about-description">
            It all began with one man's dedication and hard work. His efforts evolved into meaningful experiences that
            he shared freely with others, transcending fatigue, struggles, and financial constraints to create
            purposeful opportunities. This motivation grew through experiences in various industries, from Business
            Process Outsourcing (BPO) to remote work opportunities with different companies. These combined experiences
            led to a single solution: That is to evaluating government systems and establishing an alternative framework
            that ensures precision in industrial projects, market operations, to success, pension management system and
            this is, this is, HOPE.
          </p>

          <div className="eco-friendly-banner">
            <Leaf className="eco-banner-icon" />
            <div className="eco-banner-content">
              <h3>ECO FRIENDLY INITIATIVES</h3>
              <p>
                Our commitment to sustainability drives every aspect of our operations. We implement eco-friendly
                practices across all our projects, reducing environmental impact while maximizing efficiency and
                performance.
              </p>
            </div>
          </div>

          <Row className="small-images-row">
            <Col xs={6} className="small-image-col">
              <div className="small-image-container">
                <img
                  src={smallImage1 || "/placeholder.svg?height=200&width=300"}
                  alt="HOPE Image 1"
                  className="small-image"
                  onClick={() => openImageModal(smallImage1)}
                />
              </div>
            </Col>
            <Col xs={6} className="small-image-col">
              <div className="small-image-container">
                <img
                  src={smallImage2 || "/placeholder.svg?height=200&width=300"}
                  alt="HOPE Image 2"
                  className="small-image"
                  onClick={() => openImageModal(smallImage2)}
                />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={6} className="subjects-col">
          <div className="subjects-container">
            <div className="subject-item" onClick={() => openInfoModal("MARKET")}>
              <div className="subject-content">
                <ShoppingCart className="subject-icon" />
                <p className="subject-title">MARKET</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>

            <div className="subject-item" onClick={() => openInfoModal("BUSINESS")}>
              <div className="subject-content">
                <Building className="subject-icon" />
                <p className="subject-title">BUSINESS</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>

            <div className="subject-item" onClick={() => openInfoModal("INFRASTRUCTURES")}>
              <div className="subject-content">
                <Construction className="subject-icon" />
                <p className="subject-title">INFRASTRUCTURES</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>

            <div className="subject-item eco-item" onClick={() => openInfoModal("ECO_FRIENDLY")}>
              <div className="subject-content">
                <Leaf className="subject-icon" />
                <p className="subject-title">ECO FRIENDLY</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>
          </div>

          <div className="help-container">
            <h3 className="help-title">Need any help?</h3>
            <p className="help-description">
              At Tector, we are dedicated to providing innovative and reliable technology solutions tailored to meet the
              unique needs of your business
            </p>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <h4 className="contact-text">(555) 123-4567</h4>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <h4 className="contact-text">support@tector.com</h4>
            </div>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <Footer />

      {/* Image Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-container dark-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowImageModal(false)}>
              ×
            </button>
            <div className="modal-content">
              <img src={modalImage || "/placeholder.svg?height=600&width=800"} alt="HOPE" className="modal-image" />
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="info-modal-container dark-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowInfoModal(false)}>
              ×
            </button>
            <div className="info-modal-header">
              {modalContent.icon}
              <h2 className="info-modal-title">{modalContent.title}</h2>
            </div>
            <div className="info-modal-content">{modalContent.content}</div>
          </div>
        </div>
      )}

      {/* CSS for dark theme */}
      <style jsx global>{`
        .dark-theme {
          background-color: #000;
          color: #fff;
        }

        .dark-theme .hope-header,
        .dark-theme .about-hope-section,
        .dark-theme .subjects-container,
        .dark-theme .help-container {
          background-color: #000;
          color: #fff;
        }

        .dark-theme .header-title,
        .dark-theme .header-subtitle,
        .dark-theme .about-title,
        .dark-theme .about-description,
        .dark-theme .help-title,
        .dark-theme .help-description,
        .dark-theme .contact-text,
        .dark-theme .subject-title {
          color: #fff;
        }

        .dark-theme .subject-item {
          background-color: #111;
          border: 1px solid #333;
        }

        .dark-theme .subject-item:hover {
          background-color: #222;
        }

        .dark-theme .eco-friendly-banner {
          background-color: #0a2e0a;
          border: 1px solid #1e4e1e;
        }

        .dark-theme .subject-icon,
        .dark-theme .arrow-icon,
        .dark-theme .contact-icon,
        .dark-theme .eco-banner-icon {
          color: #4caf50;
        }

        .dark-theme .help-container {
          background-color: #111;
          border: 1px solid #333;
        }

        .dark-overlay {
          background-color: rgba(0, 0, 0, 0.7);
        }

        .dark-modal {
          background-color: #111;
          color: #fff;
          border: 1px solid #333;
        }

        .dark-modal .modal-section h3,
        .dark-modal .info-modal-title,
        .dark-modal .modal-header-icon {
          color: #fff;
        }

        .dark-modal .feature-list li,
        .dark-modal .eco-list li {
          color: #ddd;
        }

        .dark-modal .bar {
          background-color: #4caf50;
        }

        .dark-modal .eco-friendly-section {
          background-color: #0a2e0a;
          border: 1px solid #1e4e1e;
          padding: 15px;
          border-radius: 5px;
        }

        .dark-modal .eco-friendly-section.highlight {
          background-color: #0f3f0f;
          border: 1px solid #2e6e2e;
        }

        .dark-modal .eco-icon {
          color: #4caf50;
        }

        .dark-modal .graph-icon {
          color: #4caf50;
        }

        .dark-modal .axis-labels text {
          fill: #fff;
        }

        .dark-modal .legend-item {
          color: #ddd;
        }

        .dark-modal .modal-close-btn {
          color: #fff;
          background-color: #333;
        }

        .dark-modal .modal-close-btn:hover {
          background-color: #444;
        }

        /* Special text indications */
        .dark-theme .special-text {
          color: #4caf50;
          font-weight: bold;
        }

        .dark-theme strong {
          color: #4caf50;
          font-weight: bold;
        }

        .dark-theme h1, .dark-theme h2, .dark-theme h3, .dark-theme h4, .dark-theme h5 {
          color: #4caf50;
        }
      `}</style>
    </div>
  )
}