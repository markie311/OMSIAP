import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col,
         Accordion } from 'react-bootstrap';

import '../../../styles/landingpage/footer/footer.scss';

export default function Footer() {
 return (
  <Row id="footer">
    <Col xs={12}
         md={3}
         lg={3}
         className='footer-colcontainer'>
      <Row id="footer-colcontainer-logocontainer">
         <Col xs={4}
              md={4}
              lg={4}
              id="footer-colcontainer-logocontainer-logocontainer">
           <img src='../images/landingpage/footer/goldenshield.jpg'
                id="footer-colcontainer-logocontainer-logocontainer-logo"/>
         </Col>
         <Col xs={8}
              md={8}
              lg={8}
              id="footer-colcontainer-logocontainer-headerindicationscontainer">
           <p className="footer-colcontainer-logocontainer-headerindicationscontainer-headerindication">Of Macky'S Ink And Paper</p>
         </Col>
         <Col xs={12}
              md={12}
              lg={12}
              id="footer-colcontainer-logocontainer-headerindicationscontainer">
           <p className="footer-colcontainer-logocontainer-headerindicationscontainer-headerindication">Tector is your trusted business agent, providing expert solutions tailored to your needs.</p>
         </Col>
      </Row>
    </Col>
    <Col xs={12}
         md={3}
         lg={3}
         className='footer-colcontainer'>
      <h4 className='footer-colcontainer-headerindication'>Useful Links</h4>
      <p className="footer-colcontainer-headerindication">Contact us</p>
      <p className="footer-colcontainer-headerindication">How it works</p>
      <p className="footer-colcontainer-headerindication">Office Create</p>
      <p className="footer-colcontainer-headerindication">Residential Explore</p>
      <p className="footer-colcontainer-headerindication">Terms $ Service</p>
    </Col>
    <Col xs={12}
         md={3}
         lg={3}
         className='footer-colcontainer'>
      <h4 className='footer-colcontainer-headerindication'>Get In Touch</h4>
      <p className="footer-colcontainer-headerindication">Valentin, Street Road 24, New York, USA - 67452</p>
      <p className="footer-colcontainer-headerindication"> +199(980) 6915</p>
      <p className="footer-colcontainer-headerindication">markiebeloy@gmail.com</p>
    </Col>
    <Col xs={12}
         md={3}
         lg={3}
         className='footer-colcontainer'>
      <img src="../images/landingpage/footer/tuxedo.jpg"
           id="footer-colcontainer-tuxedoimage"/>
    </Col>
  </Row>
 )
}