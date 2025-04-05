import '../../../styles/navbar/largerviewportsnavbar/largerviewportsnavbar.scss';

import React, { useState } from 'react';
import { Dropdown, Navbar, Nav, Container } from 'react-bootstrap';
import { List, X } from 'lucide-react';

const ResponsiveNavbar = (props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleNavbar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="navbar-wrapper">
      <Navbar expand="lg" variant="dark" expanded={expanded} className="custom-navbar">
        <Container fluid>
          {/* Logo and Brand Section */}
          <div className="navbar-brand-section">
            <div className="logo-container">
              <img 
                src='../images/navbar/navbar/goldenshield.jpg'
                alt="OMSIAP Logo" 
                className="navbar-logo"
              />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">OMSIAP</h1>
              <p className="brand-subtitle">Of Macky'S Ink And Paper</p>
              <div className="special-indicator">Premium Business Services</div>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <Navbar.Toggle 
            aria-controls="responsive-navbar-nav" 
            onClick={toggleNavbar}
            className="custom-toggler"
          >
            {expanded ? <X size={24} /> : <List size={24} />}
          </Navbar.Toggle>

          {/* Navigation Items */}
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto navigation-items">

            <div className="nav-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-mfatip" className="custom-dropdown-toggle">
                    HOME
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item href="/">HOME PAGE 1</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="nav-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-mfatip" className="custom-dropdown-toggle">
                    MONTHLY FINANCIAL ALLOCATION TO INDIVIDUAL PEOPLE
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item href="/monthlyfinanceallocationtoindividualpeople">WHAT IS MFATIP</Dropdown.Item>
                    <Dropdown.Item href="/useraccount">MY MFATIP PROFILE ACCOUNT</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="nav-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-market" className="custom-dropdown-toggle">
                    MARKET
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item href="market">Market</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="nav-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-hope" className="custom-dropdown-toggle">
                    HOPE
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item href="/honestiesonconstitutionalpromisesevaluation">(H)onesties (O)n Constitutional (P)romises (E)valuation</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="nav-dropdown">
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="dark" 
                    id="dropdown-account" 
                    className={`custom-dropdown-toggle ${props.user && props.user.registrationstatusesandlogs.deviceloginstatus === "logged in" ? "logged-in" : "logged-out"}`}
                  >
                    {props.user && props.user.loginstatus === "logged in" 
                      ? "LOG OUT" 
                      : "LOG IN / REGISTER"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-dropdown-menu">
                    {props.user && props.user.registrationstatusesandlogs.deviceloginstatus === "logged in" 
                      ? <Dropdown.Item href="/mfatip/loginregister">LOG OUT MFATIP PROFILE ACCOUNT</Dropdown.Item>
                      : <Dropdown.Item href="/mfatip/loginregister">MFATIP LOGIN / MFATIP REGISTER PAGE</Dropdown.Item>}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default ResponsiveNavbar;
