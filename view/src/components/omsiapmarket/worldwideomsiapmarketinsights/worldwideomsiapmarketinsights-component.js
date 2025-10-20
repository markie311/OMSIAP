import { useState } from "react";
import { useNavigate } from "react-router-dom"

import { ChevronLeft, X } from "lucide-react";

import "../../../styles/omsiapmarket/worldwideomsiapmarketinsights/worldwideomsiapmarketinsights.scss"


export default function WorldWideOmsiapMarketInsights() {

  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  const handleNavigateBack = () => {
    navigate('/omsiapmarket')
  };

  return (
    <div className="wwomi-root">
      {/* Back Button */}
      <button 
        className="wwomi-back-button"
        onClick={handleNavigateBack}
        aria-label="Go back"
      >
       &#x25c0;
      </button>

      {/* Header Section */}
      <header className="wwomi-header">
        <h1 className="wwomi-main-title">
          Welcome to <span className="wwomi-title-highlight">OMSIAP Market</span> Worldwide Insights
        </h1>
        <p className="wwomi-subtitle">
          Experience full market <span className="wwomi-accent">transparency</span> — explore the insights everyone deserves to see.
        </p>
      </header>

      {/* Content Grid */}
      <div className="wwomi-grid">
        {/* Sales Card */}
        <div className="wwomi-card">
          <div className="wwomi-card-glow"></div>
          <h2 className="wwomi-card-title">Sales</h2>
          <p className="wwomi-card-description">
            Discover which <span className="wwomi-accent">products</span> perform best each month and track category trends.
          </p>
          <p className="wwomi-card-cta">
            Click below to open the <span className="wwomi-accent-highlight">Sales Insights</span> panel.
          </p>
          <button 
            className="wwomi-button"
            onClick={() => setActiveModal("sales")}
          >
            SALES INSIGHTS
          </button>
        </div>

        {/* Locations Card */}
        <div className="wwomi-card">
          <div className="wwomi-card-glow"></div>
          <h2 className="wwomi-card-title">Locations</h2>
          <p className="wwomi-card-description">
            Track the <span className="wwomi-accent">heartbeat</span> of each market in real-time.
          </p>
          <p className="wwomi-card-cta">
            Click below to view <span className="wwomi-accent-highlight">Location Insights</span> and monitor regions.
          </p>
          <button 
            className="wwomi-button"
            onClick={() => setActiveModal("locations")}
          >
            LOCATION INSIGHTS
          </button>
        </div>

        {/* People Card */}
        <div className="wwomi-card">
          <div className="wwomi-card-glow"></div>
          <h2 className="wwomi-card-title">People</h2>
          <p className="wwomi-card-description">
            Gain insight into <span className="wwomi-accent">consumer behavior</span> and evolving market trends.
          </p>
          <p className="wwomi-card-cta">
            Click below to open the <span className="wwomi-accent-highlight">People Insights</span> panel.
          </p>
          <button 
            className="wwomi-button"
            onClick={() => setActiveModal("people")}
          >
            PEOPLE INSIGHTS
          </button>
        </div>
      </div>

      {/* SALES MODAL */}
      {activeModal === "sales" && (
        <Modal title="Sales Insights" onClose={closeModal}>
          <div className="wwomi-modal-placeholder">
            <p>Display your sales insight charts or data here.</p>
          </div>
        </Modal>
      )}

      {/* LOCATIONS MODAL */}
      {activeModal === "locations" && (
        <Modal title="Location Insights" onClose={closeModal}>
          <div className="wwomi-modal-placeholder">
            <p>Display your location insight data here.</p>
          </div>
        </Modal>
      )}

      {/* PEOPLE MODAL */}
      {activeModal === "people" && (
        <Modal title="People Insights" onClose={closeModal}>
          <div className="wwomi-modal-placeholder">
            <p>Display your people insight analytics here.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="wwomi-modal-overlay" onClick={onClose}>
      <div className="wwomi-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="wwomi-modal-header">
          <h2 className="wwomi-modal-title">{title}</h2>
          <button className="wwomi-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="wwomi-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}