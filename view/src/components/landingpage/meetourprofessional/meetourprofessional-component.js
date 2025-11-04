import '../../../styles/landingpage/meetourprofessional/meetourprofessional.scss';
import React, { useState, useEffect } from 'react';

// Sample professional data
const professionals = [
  {
    id: 1,
    name: "Mark Anthony Beloy",
    position: "HEAD SOFTWARE ENGINEER / Owner",
    image: "../images/landingpage/meetourprofessionals/tuxedo.jpg",
    bio: "Mark is the head software engineer of OMSIAP with over 5 years of industry experience. He specializes in strategic planning and business development.",
    education: "Mapua Malayan Colleges Mindanao",
    contact: "markiebeloy@gmail.com"
  },
    {
    id: 2,
    name: "Sarah Johnson",
    position: "Senior Consultant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Sarah has been with OMSIAP for 8 years and leads our client consultation team. She has helped over 200 clients achieve their business goals.",
    education: "MS in Business Analytics, Stanford University",
    contact: "sarah@omsiap.com"
  },
  {
    id: 3,
    name: "David Chen",
    position: "Technical Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "David oversees all technical implementations at OMSIAP. He has a background in software engineering and project management.",
    education: "BS in Computer Science, MIT",
    contact: "david@omsiap.com"
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    position: "Client Relations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Maria ensures our clients receive exceptional service throughout their journey with OMSIAP. She specializes in relationship management.",
    education: "BA in Communications, NYU",
    contact: "maria@omsiap.com"
  }
];

export default function MeetOurProfessionals() {
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleProfileClick = (professional) => {
    setSelectedProfessional(professional);
    setShowModal(true);
    setIsAnimating(true);
    document.body.style.overflow = 'hidden';
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowModal(false);
      setSelectedProfessional(null);
      document.body.style.overflow = 'auto';
    }, 300);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (showImageModal) {
          handleCloseImageModal();
        } else if (showModal) {
          handleCloseModal();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showModal, showImageModal]);

  return (
    <>
      <style jsx>{`
        /* Scoped styles to avoid conflicts */
        .omsiap-professionals-section {
          padding: 60px 20px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          min-height: 100vh;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .omsiap-professionals-header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out;
        }

        .omsiap-team-label {
          color: #3498db;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          display: inline-block;
        }

        .omsiap-team-label::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, #3498db, #2980b9);
          border-radius: 1px;
        }

        .omsiap-professionals-title {
          color: #ffffff;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .omsiap-professionals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .omsiap-professional-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          height: 100%;
          position: relative;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInCard 0.6s ease-out forwards;
        }

        .omsiap-professional-card:nth-child(1) { animation-delay: 0.1s; }
        .omsiap-professional-card:nth-child(2) { animation-delay: 0.2s; }
        .omsiap-professional-card:nth-child(3) { animation-delay: 0.3s; }
        .omsiap-professional-card:nth-child(4) { animation-delay: 0.4s; }

        .omsiap-professional-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(41, 128, 185, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .omsiap-professional-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 25px 50px rgba(52, 152, 219, 0.3);
          border-color: rgba(52, 152, 219, 0.5);
        }

        .omsiap-professional-card:hover::before {
          opacity: 1;
        }

        .omsiap-photo-container {
          position: relative;
          padding-top: 100%;
          overflow: hidden;
          background: linear-gradient(135deg, #2c3e50, #34495e);
        }

        .omsiap-photo-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .omsiap-professional-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: grayscale(20%) brightness(1.1);
        }

        .omsiap-professional-card:hover .omsiap-professional-photo {
          transform: scale(1.15);
          filter: grayscale(0%) brightness(1.2);
        }

        .omsiap-professional-details {
          padding: 25px;
          text-align: center;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
        }

        .omsiap-professional-name {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .omsiap-professional-card:hover .omsiap-professional-name {
          color: #3498db;
        }

        .omsiap-professional-position {
          font-size: 14px;
          color: #bdc3c7;
          margin-bottom: 0;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* Modal Styles */
        .omsiap-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
          padding: 20px;
        }

        .omsiap-modal-overlay.show {
          opacity: 1;
        }

        .omsiap-modal-content {
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          transform: scale(0.7) translateY(50px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .omsiap-modal-overlay.show .omsiap-modal-content {
          transform: scale(1) translateY(0);
        }

        .omsiap-modal-header {
          padding: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(41, 128, 185, 0.1) 100%);
        }

        .omsiap-modal-title {
          color: #ffffff;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #3498db, #2980b9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .omsiap-close-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;
        }

        .omsiap-close-button:hover {
          background: rgba(231, 76, 60, 0.2);
          border-color: rgba(231, 76, 60, 0.5);
          transform: rotate(90deg);
        }

        .omsiap-modal-body {
          padding: 40px;
        }

        .omsiap-modal-content-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .omsiap-modal-photo-container {
          flex: 0 0 auto;
          max-width: 300px;
          margin: 0 auto;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .omsiap-modal-photo-container:hover {
          transform: scale(1.05);
        }

        .omsiap-modal-professional-photo {
          width: 100%;
          height: auto;
          display: block;
          transition: filter 0.3s ease;
        }

        .omsiap-modal-professional-photo:hover {
          filter: brightness(1.1);
        }

        .omsiap-modal-details {
          flex: 1;
        }

        .omsiap-modal-position {
          color: #3498db;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }

        .omsiap-modal-section {
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .omsiap-modal-section h4 {
          font-size: 18px;
          font-weight: 700;
          color: #3498db;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .omsiap-modal-section p {
          font-size: 15px;
          color: #bdc3c7;
          line-height: 1.7;
          margin: 0;
        }

        .omsiap-modal-footer {
          padding: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          background: rgba(0, 0, 0, 0.2);
        }

        .omsiap-button {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .omsiap-button-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .omsiap-button-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .omsiap-button-primary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: #ffffff;
          border: 1px solid #3498db;
        }

        .omsiap-button-primary:hover {
          background: linear-gradient(135deg, #2980b9, #1f6391);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
        }

        /* Image Modal */
        .omsiap-image-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          padding: 20px;
          cursor: pointer;
        }

        .omsiap-image-modal-content {
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
          cursor: default;
          animation: zoomIn 0.4s ease-out;
        }

        .omsiap-image-modal-content img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Responsive Design */
        @media (min-width: 768px) {
          .omsiap-modal-content-wrapper {
            flex-direction: row;
            align-items: flex-start;
          }

          .omsiap-modal-photo-container {
            flex: 0 0 300px;
            margin: 0;
          }

          .omsiap-modal-position {
            text-align: left;
          }
        }

        @media (max-width: 767px) {
          .omsiap-professionals-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 0 10px;
          }

          .omsiap-modal-body {
            padding: 20px;
          }

          .omsiap-modal-header {
            padding: 20px;
          }

          .omsiap-modal-footer {
            padding: 20px;
            flex-direction: column;
          }

          .omsiap-button {
            width: 100%;
          }
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInCard {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Scrollbar styling for modal */
        .omsiap-modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .omsiap-modal-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .omsiap-modal-content::-webkit-scrollbar-thumb {
          background: rgba(52, 152, 219, 0.6);
          border-radius: 3px;
        }

        .omsiap-modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(52, 152, 219, 0.8);
        }
      `}</style>

      <section className="omsiap-professionals-section">
        <div className="omsiap-professionals-header">
          <h3 className="omsiap-team-label">OMSIAP Team</h3>
          <h1 className="omsiap-professionals-title">Meet OMSIAP's Professionals</h1>
        </div>

        <div className="omsiap-professionals-grid">
          {professionals.map((professional) => (
            <div 
              key={professional.id}
              className="omsiap-professional-card"
              onClick={() => handleProfileClick(professional)}
            >
              <div className="omsiap-photo-container">
                <div className="omsiap-photo-wrapper">
                  <img 
                    src={professional.image} 
                    alt={professional.name} 
                    className="omsiap-professional-photo"
                  />
                </div>
              </div>
              <div className="omsiap-professional-details">
                <h4 className="omsiap-professional-name">{professional.name}</h4>
                <p className="omsiap-professional-position">{professional.position}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Details Modal */}
        {showModal && selectedProfessional && (
          <div 
            className={`omsiap-modal-overlay ${isAnimating ? 'show' : ''}`}
            onClick={handleCloseModal}
          >
            <div 
              className="omsiap-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="omsiap-modal-header">
                <h2 className="omsiap-modal-title">{selectedProfessional.name}</h2>
                <button 
                  className="omsiap-close-button"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="omsiap-modal-body">
                <div className="omsiap-modal-content-wrapper">
                  <div 
                    className="omsiap-modal-photo-container"
                    onClick={handleImageClick}
                  >
                    <img 
                      src={selectedProfessional.image} 
                      alt={selectedProfessional.name} 
                      className="omsiap-modal-professional-photo"
                    />
                  </div>
                  <div className="omsiap-modal-details">
                    <h3 className="omsiap-modal-position">{selectedProfessional.position}</h3>
                    
                    <div className="omsiap-modal-section">
                      <h4>📋 About</h4>
                      <p>{selectedProfessional.bio}</p>
                    </div>
                    
                    <div className="omsiap-modal-section">
                      <h4>🎓 Education</h4>
                      <p>{selectedProfessional.education}</p>
                    </div>
                    
                    <div className="omsiap-modal-section">
                      <h4>📧 Contact</h4>
                      <p>{selectedProfessional.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="omsiap-modal-footer">
                <button 
                  className="omsiap-button omsiap-button-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button 
                  className="omsiap-button omsiap-button-primary"
                  onClick={handleCloseModal}
                >
                  Contact {selectedProfessional.name.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Full View Modal */}
        {showImageModal && selectedProfessional && (
          <div 
            className="omsiap-image-modal-overlay"
            onClick={handleCloseImageModal}
          >
            <div className="omsiap-image-modal-content">
              <img 
                src={selectedProfessional.image} 
                alt={selectedProfessional.name}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}