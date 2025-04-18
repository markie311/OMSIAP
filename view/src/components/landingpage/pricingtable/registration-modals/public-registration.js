"use client"

import { useState } from "react"
import { Form, Button } from "react-bootstrap"

const PublicRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "gcash",
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
    console.log("Public Citizenship Registration submitted:", formData)

    // Show success message or redirect
    alert("Thank you for registering for Public citizenship! You will be redirected to complete your payment.")
    onClose()
  }

  return (
    <div className="registration-modal public-modal">
      <h2 className="modal-title">Public Citizenship Registration</h2>
      <p className="modal-subtitle">Monthly Membership - ₱150.00</p>

      <div className="modal-description">
        <p>
          Join OMSIAP's Public Citizenship program and receive enhanced monthly financial allocations. Your membership
          renews monthly.
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

        <Form.Group className="form-group">
          <Form.Label>Payment Method</Form.Label>
          <Form.Select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="gcash">GCash</option>
            <option value="omsiapawasto">OMSIAPAWASTO</option>
            <option value="office">Pay at OMSIAP Office</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="form-group checkbox">
          <Form.Check
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
            label="I agree to the terms and conditions of OMSIAP Public Citizenship program"
          />
        </Form.Group>

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="submit-btn" disabled={!formData.agreeToTerms}>
            Register & Pay ₱150.00
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PublicRegistration

