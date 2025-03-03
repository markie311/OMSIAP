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
import Footer from '../landingpage/footer/footer-component.js';

export default function HOPE(props) {

  const location = useLocation();
  const navigate = useNavigate();

 return(
  <Col id="hope">
    <NavBar viewport={props.viewport}/>
    <Header />
    <AboutHOPE />
    <Footer />
  </Col>
 )
}

function Header() {

 return (
    <Col id="hope-header">
      <Col id="hopeheader-displayimagecontainer">
        <img src="../images/hope/happycrowd.jpg"
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
      <br/>
      <h1 className="abouthope-headerindicationscontainer-headerindication">Honesties On Constitutional Promises Evaluation (H) (O) (P) (E)</h1>
      <br/>
      <p className="abouthope-headerindicationscontainer-headerindication">It all began with one man's dedication and hard work. His efforts evolved into meaningful experiences that he shared freely with others, transcending fatigue, struggles, and financial constraints to create purposeful opportunities. This motivation grew through experiences in various industries, from Business Process Outsourcing (BPO) to remote work opportunities with different companies. These combined experiences led to a single solution: That is to evaluating government systems and establishing an alternative framework that ensures precision in industrial projects, market operations, to success, pension management system and this is, this is, HOPE.</p>
      <br/>
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

