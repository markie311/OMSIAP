"use client";

import React, { useState } from "react";
import { Row, Col, Accordion, Button } from "react-bootstrap";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosCreatedInstance from "../../lib/axiosutil.js";

import "../../../styles/landingpage/pricingtable/pricingtable.scss";

export default function PricingTable({ user }) {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [responseModal, setResponseModal] = useState({
    show: false,
    message: "",
    success: false
  });

  const openModal = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedType(null);
    setShowModal(false);
  };

  const showResponseModal = (message, success) => {
    setResponseModal({
      show: true,
      message,
      success
    });
  };

  const closeResponseModal = () => {
    setResponseModal({
      show: false,
      message: "",
      success: false
    });
    if (responseModal.success) {
      closeModal();
    }
  };

  const isVerified = (type) =>
    user?.registrationstatusesandlogs?.type === type &&
    user?.registrationstatusesandlogs?.indication === "Verified";

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <CitizenshipConfirmationModal
        onClose={closeModal}
        user={user}
        type={selectedType}
        showResponseModal={showResponseModal}
      />
    );
  };

  return (
    <div className="pricing-container">
      <Row className="pricing-table">
        {/* LEFT: Accordion Info */}
        <Col xs={12} md={6} lg={6} className="pricing-info">
          <div className="pricing-header">
            <h3 className="subtitle">Pricing Table</h3>
            <h1 className="title">OMSIAP Citizenship</h1>
          </div>

          <Accordion defaultActiveKey="0" className="pricing-accordion">
            {/* All six questions retained */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>What is OMSIAP Citizenship?</Accordion.Header>
              <Accordion.Body>
                OMSIAP Citizenship represents membership in a progressive
                socio-economic initiative designed to empower individuals,
                enhance financial stability, and promote inclusive community
                growth.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>What are the requirements?</Accordion.Header>
              <Accordion.Body>
                To register, individuals must provide basic identification
                credentials and must be of legal age.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>What is Public Citizenship?</Accordion.Header>
              <Accordion.Body>
                Public citizens have lifetime access to OMSIAP's public
                programs, community events, and educational resources.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>What is Private Citizenship?</Accordion.Header>
              <Accordion.Body>
                Private citizens receive all public benefits plus internal
                project access, financial aid programs, and premium privileges.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>What is MFATIP?</Accordion.Header>
              <Accordion.Body>
                MFATIP stands for Monthly Financial Allocation To Individual
                People — a free lifetime initiative ensuring financial support
                for registered members.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>How do I verify my status?</Accordion.Header>
              <Accordion.Body>
                Verification is processed by OMSIAP administrators once
                registration details are confirmed and approved.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        {/* RIGHT: Pricing Cards */}
        <Col xs={12} md={6} lg={6} className="pricing-plans">
          {/* MFATIP */}
          <div className="plan-card best-value">
            <div className="plan-badge">Best Value</div>
            <h3 className="plan-title">
              (M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople
            </h3>
            <h2 className="plan-price">Free / Lifetime</h2>
            <p className="plan-desc">
              Free lifetime registration under the OMSIAP MFATIP initiative.
            </p>

            {isVerified("Month Financial Allocation To Individual People") ? (
              <div className="verified-notice">
                ✅ You are already a verified MFATIP registrant.
              </div>
            ) : (
              <Button
                className="proceed-btn"
                onClick={() => navigate("/mfatip/loginregister")}
              >
                Proceed to MFATIP Registration
              </Button>
            )}
          </div>

          {/* PUBLIC CITIZENSHIP */}
          <div className="plan-card popular">
            <div className="plan-badge">Popular</div>
            <h3 className="plan-title">Public Citizenship</h3>
            <h2 className="plan-price">₱200 / 3 months expiration </h2>
            <p className="plan-desc">
              Lifetime access to OMSIAP public programs, events, and resources.
            </p>

            <Button
              className="proceed-btn"
              onClick={() => openModal("Public Citizenship")}
            >
              Proceed to Purchase Citizenship
            </Button>
          </div>

          {/* PRIVATE CITIZENSHIP */}
          <div className="plan-card premium">
            <div className="plan-badge">Premium</div>
            <h3 className="plan-title">Private Citizenship</h3>
            <h2 className="plan-price">₱300 / 3 months expiration </h2>
            <p className="plan-desc">
              Premium access with additional OMSIAP private opportunities and
              internal development programs.
            </p>

            <Button
              className="proceed-btn"
              onClick={() => openModal("Private Citizenship")}
            >
              Proceed to Purchase Citizenship
            </Button>
          </div>
        </Col>
      </Row>

      {/* Citizenship Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="modal-close" onClick={closeModal}>
              <X size={22} />
            </button>
            {renderModal()}
          </div>
        </div>
      )}

      {/* Response Message Modal */}
      {responseModal.show && (
        <div className="modal-overlay">
          <div className="response-modal-container">
            <button className="modal-close" onClick={closeResponseModal}>
              <X size={22} />
            </button>
            <div className="response-modal-content">
              <div className={`response-icon ${responseModal.success ? 'success' : 'error'}`}>
                {responseModal.success ? (
                  <CheckCircle size={48} />
                ) : (
                  <AlertCircle size={48} />
                )}
              </div>
              <h3 className="response-title">
                {responseModal.success ? 'Success!' : 'Error'}
              </h3>
              <p className="response-message">{responseModal.message}</p>
              <Button
                className="response-btn"
                onClick={closeResponseModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   Citizenship Confirmation Modal (Public / Private)
====================================================== */

const CitizenshipConfirmationModal = ({ onClose, user, type, showResponseModal }) => {

  const handleConfirm = async () => {
    try {
      const res = await axiosCreatedInstance.post("/people/purchasecitizenship", {
        type,
        name: `${user?.name?.firstname} ${user?.name?.middlename} ${user?.name?.lastname}`,
        birthcertificatenumber:
          user?.personaldata?.birthcertificate?.birthcertificatereferencenumber,
      });

      showResponseModal(res.data.message, res.data.success);
    } catch (err) {
      console.error("Purchase citizenship error:", err);
      const msg = err.response?.data?.message || "Error confirming citizenship.";
      showResponseModal(msg, false);
    }
  };

  return (
    <div className="registration-modal">
      <h2>{type} Purchase Confirmation</h2>
      <div className="confirmation-details">
        <p>
          <strong>First Name:</strong> {user?.name?.firstname || "N/A"}
        </p>
        <p>
          <strong>Middle Name:</strong> {user?.name?.middlename || "N/A"}
        </p>
        <p>
          <strong>Last Name:</strong> {user?.name?.lastname || "N/A"}
        </p>
        <p>
          <strong>Birth Certificate No.: </strong>{" "}
          {user?.personaldata?.birthcertificate?.birthcertificatereferencenumber || "N/A"}
        </p>
      </div>

      <Button
        className="confirm-btn"
        variant="primary"
        onClick={handleConfirm}
      >
        Confirm information to proceed to purchasing citizenship
      </Button>
    </div>
  );
};
