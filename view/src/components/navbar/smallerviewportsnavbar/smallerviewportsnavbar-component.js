import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown
       } from 'react-bootstrap';

import '../../../styles/navbar/smallerviewportsnavbar/smallerviewportsnavbar.scss';

export default function SmallerViewportsNavbar() {
 return (
    <Row id="smallerviewportsnavbar">
     <Col xs={8}
          md={12}
          lg={12}
          id="smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer">
       <Row id="smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer-rowcontainer">
         <Col xs={5}
              md={12}
              lg={12}
              id="smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer-rowcontainer-omsiaplogocontainer">
            <img src='../images/navbar/navbar/goldenshield.jpg'
               id='smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer-rowcontainer-omsiaplogo'/>
         </Col>
         <Col xs={7}
              md={12}
              lg={12}
              id="smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer-rowcontainer-headerindicationscontainer">
          <h1 className="smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer-rowcontainer-headerindication">OMSIAP</h1>
          <p className="smallerviewportsnavbar-headerindicationsandbackgroundimagecontainer-rowcontainer-headerindication">Of Macky'S Ink And Paper</p>
         </Col>
       </Row>
     </Col>
     <Col xs={4}
          md={12}
          lg={!2}
          id="smallerviewportsnavbar-hamburgercontainer">
      <div id="smallerviewportsnavbar-hamburger"
           onClick={()=> {
            alert('Synced')
           }}>
        <div className="smallerviewportsnavbar-hamburger-line"></div>
        <div className="smallerviewportsnavbar-hamburger-line"></div>
        <div className="smallerviewportsnavbar-hamburger-line"></div>
      </div>
     </Col>
    </Row>
 )
}