import '../../../styles/landingpage/meetourprofessional/meetourprofessional.scss';
import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';

// Sample professional data - in a real app, this would come from props or an API
const professionals = [
  {
    id: 1,
    name: "Mark Anthony Beloy",
    position: "Owner",
    image: "../images/landingpage/meetourprofessionals/tuxedo.jpg",
    bio: "Mark is the founder of OMSIAP with over 15 years of industry experience. He specializes in strategic planning and business development.",
    education: "MBA, Harvard Business School",
    contact: "mark@omsiap.com"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Senior Consultant",
    image: "../images/landingpage/meetourprofessionals/tuxedo.jpg",
    bio: "Sarah has been with OMSIAP for 8 years and leads our client consultation team. She has helped over 200 clients achieve their business goals.",
    education: "MS in Business Analytics, Stanford University",
    contact: "sarah@omsiap.com"
  },
  {
    id: 3,
    name: "David Chen",
    position: "Technical Director",
    image: "../images/landingpage/meetourprofessionals/tuxedo.jpg",
    bio: "David oversees all technical implementations at OMSIAP. He has a background in software engineering and project management.",
    education: "BS in Computer Science, MIT",
    contact: "david@omsiap.com"
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    position: "Client Relations",
    image: "../images/landingpage/meetourprofessionals/tuxedo.jpg",
    bio: "Maria ensures our clients receive exceptional service throughout their journey with OMSIAP. She specializes in relationship management.",
    education: "BA in Communications, NYU",
    contact: "maria@omsiap.com"
  }
];

export default function MeetOurProfessionals() {
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleProfileClick = (professional) => {
    setSelectedProfessional(professional);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <section className="meet-professionals-section">
      <div className="meet-professionals-header">
        <h3 className="team-label">OMSIAP Team</h3>
        <h1 className="professionals-title">Meet OMSIAP's Professionals</h1>
      </div>

      <Row className="professionals-grid">
        {professionals.map((professional) => (
          <Col key={professional.id} xs={6} md={3} lg={3} className="professional-card-col">
            <div 
              className="professional-card"
              onClick={() => handleProfileClick(professional)}
            >
              <div className="photo-container">
                <div className="photo-background"></div>
                <div className="photo-wrapper">
                  <img 
                    src={professional.image} 
                    alt={professional.name} 
                    className="professional-photo"
                  />
                </div>
              </div>
              <div className="professional-details">
                <h4 className="professional-name">{professional.name}</h4>
                <p className="professional-position">{professional.position}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal for Professional Details */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        centered
        className="professional-modal"
      >
        {selectedProfessional && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProfessional.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-content-wrapper">
                <div className="modal-photo-container">
                  <img 
                    src={selectedProfessional.image} 
                    alt={selectedProfessional.name} 
                    className="modal-professional-photo"
                  />
                </div>
                <div className="modal-details">
                  <h3 className="modal-position">{selectedProfessional.position}</h3>
                  <div className="modal-bio">
                    <h4>About</h4>
                    <p>{selectedProfessional.bio}</p>
                  </div>
                  <div className="modal-education">
                    <h4>Education</h4>
                    <p>{selectedProfessional.education}</p>
                  </div>
                  <div className="modal-contact">
                    <h4>Contact</h4>
                    <p>{selectedProfessional.contact}</p>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCloseModal}>
                Contact {selectedProfessional.name.split(' ')[0]}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  );
}