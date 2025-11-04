import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import '../../styles/awards/awards.scss';

export default function Awards() {
 return (
   <Col id="awards">
     <Col id="awards-closebuttonheaderindication">
       <p id="awards-closebuttonheaderindication-closebuttonheaderindication"
          onClick={()=> {
             const _awardscontainer = document.querySelector("#awards");
             _awardscontainer.style.display = "none";
          }}>x</p>
     </Col>
     <Row id="awards-awardsrowcontainer">
        <h1 id="awards-awardsrowcontainer-awardsheaderindication">EMPTY</h1>
     </Row>
   </Col>
 )
}