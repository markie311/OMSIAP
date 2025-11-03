import '../../../styles/landingpage/omsiapsvideo/omsiapsvideo.scss';

import VideoPlayer from '../../videoplayer/videoplayer-component.js';
import React, { useState } from 'react';
import { Col, Modal } from 'react-bootstrap';

export default function OMSIAPSVideo() {
  const [showModal, setShowModal] = useState(false);
  
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  return (
    <Col id="omsiapsvideo" className="video-section">
      <div className="video-background-container">
        <img
          src="../images/landingpage/omsiapsvideo/laptopandcoffee.jpg"
          alt="Laptop with coffee"
          className="background-image"
        />
        <div className="overlay"></div>
      </div>
      
      <div className="play-button-container">
        <button
          className="play-button"
          onClick={handleOpenModal}
          aria-label="Play video"
        >
          <div className="play-icon"
               onClick={()=> {
                document.querySelectorAll(".fullscreen-video-modal")[0].style.display = "block";
            }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
            </svg>
          </div>
          <span className="play-text"
                onClick={()=> {
                  document.querySelectorAll(".fullscreen-video-modal")[0].style.display = "block";
              }}>WATCH VIDEO</span>
        </button>
      </div>
      
      {/* Video Modal */}
      <div className="fullscreen-video-modal">
        <div className="containerullscreen-video-modal-headerindication">
           <h1>Product Overview</h1>
           <p className="fullscreen-video-modal-headerindicationcontainer-closebuttonheaderindication"
              onClick={()=> {
                  document.querySelectorAll(".fullscreen-video-modal")[0].style.display = "none";
              }}>close</p>
        </div>
        <div className="fullscreen-video-modal-videoplayercontainer">
         <VideoPlayer url="https://www.youtube.com/watch?v=emPqaeJsRBk"/>
        </div>
      </div>
    </Col>
  );
}
