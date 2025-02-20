import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown
       } from 'react-bootstrap';

import { useLocation,
         useNavigate
        } from 'react-router-dom';

import '../../styles/hope/hope.scss';

import NavBar from '../navbar/navbar/navbar-component.js';
import PricingTable from '../landingpage/pricingtable/pricingtable-component.js';

export default function HOPE(props) {

  const location = useLocation();
  const navigate = useNavigate();

 return(
  <Col id="hope">
    <NavBar viewport={props.viewport}/>
    <Header />
    <AboutHOPE />
    <PricingTable />
  </Col>
 )
}

function Header() {

 return (
    <Col id="hope-header">
      <Col id="hopeheader-displayimagecontainer">
        <img src="../images/hope/people.jpg"
             id="hopeheader-displayimagecontainer-displayimage"/>
      </Col>
      <Col id="hopeheader-headerindicationscontainer">
        <h1 className="hopeheader-headerindicationscontainer-headerindication">Honesties On Constitutional Promises Evaluation</h1>
        <h5 className="hopeheader-headerindicationscontainer-headerindication">(H)(O)(P)(E)</h5>
      </Col>
    </Col>
 ) 
}


function AboutHOPE() {

  const location = useLocation();
  const navigate = useNavigate();

 return (
  <Row id="abouthope">
    <Col xs={12}
         md={6}
         lg={6}
         id="abouthope-headerindicationscontainer">
      <img src="../images/hope/laptopandcoffee.jpg"
           id="abouthope-headerindicationscontainer-displayimage"/>
      <h1 className="abouthope-headerindicationscontainer-headerindication">Solutions for a Modern Business Landscape</h1>
      <p className="abouthope-headerindicationscontainer-headerindication">In today's fast-paced and ever-evolving market, businesses require innovative solutions to stay ahead of the curve. At Tector, we specialize in providing cutting-edge services tailored to the unique needs of modern enterprises. Our comprehensive suite of offerings includes advanced technological integrations, strategic business consulting, and customized support services designed to optimize operations and drive growth. We understand the challenges that contemporary businesses face, and we are committed to delivering solutions that not only meet but exceed expectations. Partner with Tector and experience the transformation of your business landscape through our expertise and dedication to excellence.</p>
     <Row id="abouthope-displayimagescontainer">
       <Col xs={6}
            md={6}
            lg={6}
            className="abouthope-displayimagescontainer-displayimagescontainer">
          <img src="../images/hope/laptopandcoffee.jpg"
           className="abouthope-displayimagescontainer-displayimagescontainer-displayimage"/>    
       </Col>
       <Col xs={6}
            md={6}
            lg={6}
            className="abouthope-displayimagescontainer-displayimagescontainer">
          <img src="../images/hope/laptopandcoffee.jpg"
           className="abouthope-displayimagescontainer-displayimagescontainer-displayimage"/>
       </Col>
     </Row>
    </Col>
    <Col xs={12}
         md={6}
         lg={6}
         id="abouthope-subjectscontainer">
      <Row id="abouthope-subjectscontainer-subjectscontainer"
           onClick={()=> {
              navigate('/market')
           }}>
        <Col xs={10}
             md={10}
             lg={10}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">MARKET</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">>></p>
        </Col>
      </Row>
      <Row id="abouthope-subjectscontainer-subjectscontainer">
        <Col xs={10}
             md={10}
             lg={10}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">Sample text</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">>></p>
        </Col>
      </Row>
      <Row id="abouthope-subjectscontainer-subjectscontainer">
        <Col xs={10}
             md={10}
             lg={10}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">Sample text</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">>></p>
        </Col>
      </Row>
      <Row id="abouthope-subjectscontainer-subjectscontainer">
        <Col xs={10}
             md={10}
             lg={10}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">Sample text</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="abouthope-subjectscontainer-subjectscontainer-colcontainer">
          <p className="abouthope-subjectscontainer-subjectscontainer-colcontainer-headerindication">>></p>
        </Col>
      </Row>
      <Col id="abouthope-subjectscontainer-needanyhelpcontainer">
       <p className="abouthope-subjectscontainer-needanyhelpcontainer-headerindication">Need any help?</p>
       <p className="abouthope-subjectscontainer-needanyhelpcontainer-headerindication">At Tector, we are dedicated to providing innovative and realible  techonology solutions tailored to meet the unique needs of your business</p>
       <h4 className="abouthope-subjectscontainer-needanyhelpcontainer-headerindication">(555) 123=4567</h4>
       <h4 className="abouthope-subjectscontainer-needanyhelpcontainer-headerindication">support@tector.com</h4>
      </Col>
    </Col>
  </Row>
 )
}

