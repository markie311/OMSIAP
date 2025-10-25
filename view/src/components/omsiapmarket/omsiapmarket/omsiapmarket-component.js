"use client"

import React from "react"

import { useNavigate } from 'react-router-dom'

import { Col, Row } from "react-bootstrap"

import { motion } from "framer-motion"

import "../../../styles/omsiapmarket/omsiapmarket/omsiapmarket.scss"

export default function OmsiapMarket() {

  const navigate = useNavigate()

  const navigationItems = [
    "Shop Products",
    "Worldwide OMSIAP market insights",
    "Shopper Details"
  ]

  return (
    <Col id="omsiapmarket">

      <div id="omsiapmarket-backbuttoncontainer">
          <button id="omsiapmarket-backbuttoncontainer-backbutton"
                  onClick={()=> {
                    navigate("/")
                  }}>&larr;</button>
      </div>

      {/* Header Section */}
      <motion.div
        id="omsiapmarket-mainheaderscontainer"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >

        <h1 className="omsiapmarket-title">
          Welcome to <span className="highlight">OMSIAP Market</span>
        </h1>
        <motion.p
          className="omsiapmarket-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Every <span className="highlight">purchase</span> made here online is powered
          a blockchain technology that automatically shares transaction give aways to
          everyone after the order was confirmed recieved
        </motion.p>

        <motion.p
          className="omsiapmarket-subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Navigate through our futuristic platform and experience transparency
        </motion.p>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        id="omsiapmarket-navigationcontainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <Row className="omsiapmarket-navigationrow">
          {navigationItems.map((item, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={2}
              className="omsiapmarket-navigationcontainer-colcontainer"
              onClick={()=> {
                if ( item === "Shop Products" ) {
                  navigate('/ecommercemarket')
                }

                if ( item === "Worldwide OMSIAP market insights" ) {
                  navigate('/worldwideomsiapmarketinsights')
                }

                if ( item === "Shopper Details" ) {
                  navigate('/shopperdetails')
                }
              }}
            >
              <motion.button
                className="omsiapmarket-navigationcontainer-headerindication"
                whileHover={{
                  scale: 1.1,
                  rotate: 1,
                  boxShadow: "0px 0px 25px rgba(0, 153, 255, 0.9)",
                }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                {item}
              </motion.button>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="omsiapmarket-footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <p className="footer-text">
          © {new Date().getFullYear()} OMSIAP Market — Powered by Blockchain Commerce
        </p>
      </motion.div>
    </Col>
  )
}
