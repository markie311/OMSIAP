"use client"


import "../../../styles/landingpage/awardsandachievements/readmoreaboutawardsandachievements.scss"

import { useState, useEffect } from "react"
import { Row, Col, Modal } from "react-bootstrap"

export default function CompanyAwards() {
  const [showModal, setShowModal] = useState(false)
  const [selectedAward, setSelectedAward] = useState(null)
  const [animatedItems, setAnimatedItems] = useState([])

  // Animation on scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const awards = document.querySelectorAll(".award-card")
      awards.forEach((award) => {
        const rect = award.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight - 100

        if (isVisible) {
          const id = award.getAttribute("data-id")
          if (!animatedItems.includes(id)) {
            setAnimatedItems((prev) => [...prev, id])
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger once on mount to check for initially visible items
    setTimeout(handleScroll, 100)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [animatedItems])

  // Sample awards data - replace with your actual awards
  const awards = [
    {
      id: 1,
      medalType: "gold", // gold, silver, bronze, platinum
      title: "Business Excellence Award 2024",
      organization: "International Business Association",
      year: "2024",
      description: "Recognized for outstanding business performance and innovation.",
      fullDescription:
        "The Business Excellence Award recognizes companies that have demonstrated exceptional performance, innovation, and strategic leadership in their industry. Our company was selected from over 500 nominees worldwide for our groundbreaking approach to sustainable business practices and customer-centric solutions.",
      achievements: [
        "Increased market share by 35% in competitive markets",
        "Implemented innovative sustainability practices",
        "Achieved 98% customer satisfaction rating",
      ],
    },
    {
      id: 2,
      medalType: "platinum",
      title: "Innovation of the Year",
      organization: "Tech Innovators Summit",
      year: "2023",
      description: "Awarded for our revolutionary product development.",
      fullDescription:
        "The Innovation of the Year award celebrates breakthrough technologies and solutions that have the potential to transform industries. Our proprietary technology platform was recognized for its unique approach to solving complex industry challenges while significantly reducing operational costs for our clients.",
      achievements: [
        "Patented technology with 15 approved patents",
        "Reduced client operational costs by average of 42%",
        "Pioneered new industry standard adopted by leading competitors",
      ],
    },
    {
      id: 3,
      medalType: "silver",
      title: "Sustainability Leadership Award",
      organization: "Global Sustainability Council",
      year: "2023",
      description: "Honored for commitment to environmental sustainability.",
      fullDescription:
        "The Sustainability Leadership Award recognizes organizations that have made exceptional contributions to environmental sustainability. Our company was selected for our comprehensive approach to reducing carbon footprint, implementing circular economy principles, and promoting sustainable practices throughout our supply chain.",
      achievements: [
        "Reduced carbon emissions by 65% over 3 years",
        "Implemented zero-waste manufacturing processes",
        "Developed industry-leading sustainability reporting framework",
      ],
    },
    {
      id: 4,
      medalType: "gold",
      title: "Best Employer of the Year",
      organization: "HR Excellence Institute",
      year: "2022",
      description: "Recognized for outstanding workplace culture and employee satisfaction.",
      fullDescription:
        "The Best Employer of the Year award celebrates organizations that have created exceptional workplace environments that foster employee growth, well-being, and satisfaction. Our company was recognized for our innovative approach to work-life balance, professional development programs, and inclusive culture.",
      achievements: [
        "Employee retention rate of 94%",
        "Implemented comprehensive professional development program",
        "Created industry-leading parental leave and flexible work policies",
      ],
    },
    {
      id: 5,
      medalType: "bronze",
      title: "Customer Service Excellence",
      organization: "Customer Experience Awards",
      year: "2022",
      description: "Awarded for exceptional customer service and support.",
      fullDescription:
        "The Customer Service Excellence award recognizes organizations that have demonstrated an unwavering commitment to providing outstanding customer experiences. Our company was selected for our innovative approach to customer support, personalized service delivery, and consistent excellence in resolving customer issues.",
      achievements: [
        "Average customer satisfaction score of 4.9/5",
        "Reduced response time by 78% through AI implementation",
        "Developed proprietary customer success methodology",
      ],
    },
    {
      id: 6,
      medalType: "platinum",
      title: "Global Impact Award",
      organization: "International Development Forum",
      year: "2021",
      description: "Recognized for positive social impact across global communities.",
      fullDescription:
        "The Global Impact Award honors organizations that have made significant contributions to addressing global challenges and improving communities worldwide. Our company was recognized for our initiatives in education, healthcare, and economic development in underserved regions.",
      achievements: [
        "Provided educational resources to over 100,000 students",
        "Implemented healthcare technology in 50+ rural communities",
        "Created economic opportunities for 10,000+ individuals",
      ],
    },
  ]

  const openAwardModal = (award) => {
    setSelectedAward(award)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  // Medal icon component based on medal type
  const MedalIcon = ({ type }) => {
    switch (type) {
      case "gold":
        return (
          <div className="medal-icon gold-medal">
            <div className="medal-ribbon"></div>
            <div className="medal-circle">
              <span className="medal-star">★</span>
            </div>
          </div>
        )
      case "silver":
        return (
          <div className="medal-icon silver-medal">
            <div className="medal-ribbon"></div>
            <div className="medal-circle">
              <span className="medal-star">★</span>
            </div>
          </div>
        )
      case "bronze":
        return (
          <div className="medal-icon bronze-medal">
            <div className="medal-ribbon"></div>
            <div className="medal-circle">
              <span className="medal-star">★</span>
            </div>
          </div>
        )
      case "platinum":
        return (
          <div className="medal-icon platinum-medal">
            <div className="medal-ribbon"></div>
            <div className="medal-circle">
              <span className="medal-star">★</span>
            </div>
          </div>
        )
      default:
        return (
          <div className="medal-icon gold-medal">
            <div className="medal-ribbon"></div>
            <div className="medal-circle">
              <span className="medal-star">★</span>
            </div>
          </div>
        )
    }
  }

  return (
    <section className="readmoreaboutawards-section">
      <div className="awards-header">
        <h3 className="awards-subtitle animate-fade-in">Recognition & Excellence</h3>
        <h1 className="awards-title animate-slide-up">Our Awards & Achievements</h1>
        <p className="awards-description animate-fade-in">
          Celebrating our commitment to excellence, innovation, and leadership in the industry.
        </p>
      </div>

      <div className="awards-container">
        <Row className="awards-row">
          {awards.map((award) => (
            <Col xs={12} md={6} lg={4} key={award.id} className="award-col">
              <div
                className={`award-card ${animatedItems.includes(award.id.toString()) ? "animate-card" : ""}`}
                data-id={award.id}
                onClick={() => openAwardModal(award)}
              >
                <div className="award-icon-container">
                  <MedalIcon type={award.medalType} />
                </div>
                <div className="award-details">
                  <h3 className="award-title">{award.title}</h3>
                  <div className="award-meta">
                    <span className="award-organization">{award.organization}</span>
                    <span className="award-year">{award.year}</span>
                  </div>
                  <p className="award-description">{award.description}</p>
                  <div className="award-view-more">
                    <span>View Details</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Award Modal */}
      <Modal show={showModal} onHide={closeModal} centered dialogClassName="award-modal" className="modal-animation">
        {selectedAward && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedAward.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-award-header">
                <div className="modal-award-icon">
                  <MedalIcon type={selectedAward.medalType} />
                </div>
                <div className="modal-award-meta">
                  <div className="modal-award-organization">{selectedAward.organization}</div>
                  <div className="modal-award-year">{selectedAward.year}</div>
                </div>
              </div>

              <div className="modal-award-content">
                <h4 className="animate-slide-in">About this Award</h4>
                <p className="animate-fade-in-delay">{selectedAward.fullDescription}</p>

                <h4 className="animate-slide-in">Key Achievements</h4>
                <ul className="modal-award-achievements">
                  {selectedAward.achievements.map((achievement, index) => (
                    <li
                      key={index}
                      className="animate-slide-in-delay"
                      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    >
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="modal-close-btn pulse-animation" onClick={closeModal}>
                Close
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  )
}

