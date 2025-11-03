import '../../styles/infrastructuresportfolio/infrastructuresportfolio.scss';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Info, 
  Users, 
  Target, 
  Award, 
  Image as ImageIcon,
  Filter,
  X,
  ArrowLeft,
  ArrowRight,
  FileText
} from 'lucide-react';

const infrastructureProjects = [
  {
    id: '001',
    name: 'Urban Green Bridge',
    category: 'OMSIAP',
    dateStarted: '2022-03-15',
    totalPrice: 5200000,
    purpose: 'Sustainable Urban Connectivity',
    accomplishmentDate: '2024-06-30',
    participants: [
      'Emily Rodriguez', 
      'Michael Chang', 
      'Sarah Thompson'
    ],
    businessParticipants: [
      'GreenTech Solutions',
      'Urban Innovations Inc.',
      'Sustainable Futures LLC'
    ],
    donationsReceived: 750000,
    currentBudget: 4450000,
    additionalInfo: {
      lengthInMeters: 280,
      sustainabilityRating: 'Platinum',
      carbonOffsetPotential: '1200 tons/year'
    },
    projectImages: [
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
    ],
    comments: []
  },
  {
    id: '002',
    name: 'Solar Power Grid Expansion',
    category: 'Regular',
    dateStarted: '2023-01-10',
    totalPrice: 8500000,
    purpose: 'Renewable Energy Infrastructure',
    accomplishmentDate: '2025-12-31',
    participants: [
      'David Kim', 
      'Aisha Patel', 
      'Luis Hernandez'
    ],
    businessParticipants: [
      'SolarTech Innovations',
      'Green Energy Consortium',
      'National Power Solutions'
    ],
    donationsReceived: 1200000,
    currentBudget: 7300000,
    additionalInfo: {
      capacityMW: 150,
      housesServed: 45000,
      carbonReductionPercentage: 35
    },
    projectImages: [
     '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
      '../images/market/products/lighter.jpg',
    ],
    comments: []
  }
];

const InfrastructurePortfolio = () => {
  const [projects, setProjects] = useState(infrastructureProjects);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeFullImage();
        closeDetailsModal();
      }
    };

    if (selectedImage !== null || isDetailsModalOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedImage, isDetailsModalOpen]);

  const openFullImage = (project, imageIndex) => {
    setSelectedProject(project);
    setSelectedImage(imageIndex);
  };

  const closeFullImage = () => {
    setSelectedProject(null);
    setSelectedImage(null);
  };

  const openDetailsModal = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedProject(null);
    setIsDetailsModalOpen(false);
  };

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeFullImage();
      closeDetailsModal();
    }
  };

  const navigateImage = (direction) => {
    if (!selectedProject) return;

    const images = selectedProject.projectImages;
    const currentIndex = selectedImage;
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    setSelectedImage(newIndex);
  };

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="infrastructure-portfolio">
      <header className="portfolio-header">
        <h1>Infrastructure Project Portfolio</h1>
        <div className="category-filter">
          <Filter size={16} />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Projects</option>
            <option value="OMSIAP">OMSIAP Projects</option>
            <option value="Regular">Regular Projects</option>
          </select>
        </div>
      </header>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image-gallery">
              <div className="image-grid">
                {project.projectImages.slice(0, 4).map((image, index) => (
                  <div 
                    key={index} 
                    className="gallery-thumbnail"
                    onClick={() => openFullImage(project, index)}
                  >
                    <img 
                      src={image} 
                      alt={`${project.name} - Image ${index + 1}`} 
                    />
                  </div>
                ))}
                {project.projectImages.length > 4 && (
                  <div 
                    className="gallery-more"
                    onClick={() => openFullImage(project, 0)}
                  >
                    <ImageIcon size={32} />
                    <span>+{project.projectImages.length - 4} More</span>
                  </div>
                )}
              </div>
            </div>

            <div className="project-details">
              <h2>{project.name}</h2>
              <div className="project-info">
                <p><Target size={16} /> Purpose: {project.purpose}</p>
                <p><Calendar size={16} /> Started: {project.dateStarted}</p>
                <p><DollarSign size={16} /> Total Budget: {formatCurrency(project.totalPrice)}</p>
                <p><Award size={16} /> Category: {project.category}</p>
              </div>
              <button 
                className="view-details-btn"
                onClick={() => openDetailsModal(project)}
              >
                <FileText size={16} /> View Project Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Image Modal */}
      {selectedImage !== null && selectedProject && (
        <div 
          className="full-image-modal" 
          onClick={handleModalOverlayClick}
        >
          <button className="close-modal" onClick={closeFullImage}>
            <X size={24} />
          </button>
          
          <button 
            className="nav-button prev-button" 
            onClick={() => navigateImage('prev')}
          >
            <ArrowLeft size={24} />
          </button>
          
          <button 
            className="nav-button next-button" 
            onClick={() => navigateImage('next')}
          >
            <ArrowRight size={24} />
          </button>

          <div className="full-image-container">
            <img 
              src={selectedProject.projectImages[selectedImage]} 
              alt={`${selectedProject.name} - Full Image`} 
            />
            <div className="image-info">
              <h2>{selectedProject.name}</h2>
              <p>Image {selectedImage + 1} of {selectedProject.projectImages.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {isDetailsModalOpen && selectedProject && (
        <div 
          className="details-modal" 
          onClick={handleModalOverlayClick}
        >
          <div className="details-modal-content">
            <button className="close-modal" onClick={closeDetailsModal}>
              <X size={24} />
            </button>
            <h2>{selectedProject.name}</h2>
            
            <div className="details-section">
              <h3>Project Overview</h3>
              <div className="detail-item">
                <Target size={16} />
                <span>Purpose: {selectedProject.purpose}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Start Date: {selectedProject.dateStarted}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Expected Completion: {selectedProject.accomplishmentDate}</span>
              </div>
            </div>

            <div className="details-section">
              <h3>Financial Information</h3>
              <div className="detail-item">
                <DollarSign size={16} />
                <span>Total Budget: {formatCurrency(selectedProject.totalPrice)}</span>
              </div>
              <div className="detail-item">
                <DollarSign size={16} />
                <span>Donations Received: {formatCurrency(selectedProject.donationsReceived)}</span>
              </div>
              <div className="detail-item">
                <DollarSign size={16} />
                <span>Current Budget: {formatCurrency(selectedProject.currentBudget)}</span>
              </div>
            </div>

            <div className="details-section">
              <h3>Participants</h3>
              <div className="detail-item">
                <Users size={16} />
                <span>Individual Participants: {selectedProject.participants.join(', ')}</span>
              </div>
              <div className="detail-item">
                <Users size={16} />
                <span>Business Participants: {selectedProject.businessParticipants.join(', ')}</span>
              </div>
            </div>

            {selectedProject.additionalInfo && (
              <div className="details-section">
                <h3>Additional Information</h3>
                {Object.entries(selectedProject.additionalInfo).map(([key, value]) => (
                  <div key={key} className="detail-item">
                    <Info size={16} />
                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructurePortfolio;