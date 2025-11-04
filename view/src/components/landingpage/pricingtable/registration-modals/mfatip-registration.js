"use client"

import { useState } from "react"
import { Form, Button } from "react-bootstrap"

const MFATIPRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    agreeToTerms: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("MFATIP Registration submitted:", formData)

    // Show success message or redirect
    alert("Thank you for registering for MFATIP citizenship!")
    onClose()
  }

  return (
    <div className="registration-modal mfatip-modal">
      <h2 className="modal-title">MFATIP Registration</h2>
      <p className="modal-subtitle">Free Lifetime Membership</p>

      <div className="modal-description">
        <p>
          Join OMSIAP's MFATIP program and receive monthly financial allocations for life. No fees, no recurring
          payments.
        </p>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="form-group">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Address</Form.Label>
          <Form.Control as="textarea" name="address" value={formData.address} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="form-group checkbox">
          <Form.Check
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
            label="I agree to the terms and conditions of OMSIAP MFATIP program"
          />
        </Form.Group>

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="submit-btn" disabled={!formData.agreeToTerms}>
            Register for MFATIP
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default MFATIPRegistration

