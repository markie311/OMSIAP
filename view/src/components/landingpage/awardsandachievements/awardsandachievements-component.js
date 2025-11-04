import '../../../styles/landingpage/awardsandachievements/awardsandachievements.scss';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function AwardsAndAchievements() {
  const [activeAward, setActiveAward] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  // Detect when component is in viewport for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("awardsandachievements");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Award categories data
  const awardCategories = [
    { id: 1, title: "Our Prestigious Awards" },
    { id: 2, title: "Milestone Moments" },
    { id: 3, title: "Industry Recognitions" },
    { id: 4, title: "Accolades & Distinctions" },
    { id: 5, title: "Top Achievements" },
    { id: 6, title: "Celebrating Success" },
    { id: 7, title: "Awards & Honors" },
    { id: 8, title: "Award Winning Excellence" }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const headerVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const handleShowAwards = () => {
    const awardsContainer = document.querySelector("#awards");
    awardsContainer.style.display = "block";
  };

  const handleCloseAwards = () => {
    const awardsContainer = document.querySelector("#awards");
    awardsContainer.style.display = "none";
  };

  return (
    <motion.div
      id="awardsandachievements"
      className="awards-section"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background elements */}
      <div className="bg-glow" />

      {/* Header section */}
      <Row className="mb-5 position-relative" style={{ zIndex: 1 }}>
        <Col xs={12} md={8} lg={8}>
          <motion.div variants={headerVariants}>
            <h3 className="subtitle">Self-Growth and Corporate Service</h3>
            <h2 className="title">Company awards and achievements</h2>
          </motion.div>
        </Col>
        <Col xs={12} md={4} lg={4} className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0">
          <motion.button
            className="view-all-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=> {
              navigate('/companyawardsandachievements')
            }}
          >
            View All Achievements
          </motion.button>
        </Col>
      </Row>

      {/* Awards grid */}
      <Row className="gx-4 gy-4">
        {awardCategories.map((award) => (
          <Col xs={12} md={6} lg={6} key={award.id}>
            <motion.div
              className="award-card"
              variants={itemVariants}
              onMouseEnter={() => setActiveAward(award.id)}
              onMouseLeave={() => setActiveAward(null)}
              onClick={handleShowAwards}
            >
              <Row className="align-items-center">
                <Col xs={1} md={1} lg={1}>
                  <div className="award-number">
                    {String(award.id).padStart(2, '0')}
                  </div>
                </Col>
                <Col xs={8} md={9} lg={9}>
                  <h3 className="award-title">{award.title}</h3>
                </Col>
                <Col xs={3} md={2} lg={2} className="d-flex justify-content-end">
                  <div className="award-arrow">→</div>
                </Col>
              </Row>

              {/* Decorative element */}
              <div className="award-decoration" />
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Awards modal (hidden by default) */}
      <div id="awards" className="awards-modal"
          style={{border: "none"}}>
        <div className="awards-modal-content">
          <button 
            className="awards-modal-close"
            onClick={handleCloseAwards}
          >
            ×
          </button>
          <h2 className="awards-modal-title">Award Details</h2>
          <div style={{ color: "#fff" }}>
            <p>Award details will appear here. This content can be dynamically loaded based on which award category is selected.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
