import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import '../../../styles/landingpage/amazingwork/amazingwork.scss';

export default function AmazingWork() {
 return (
  <Col id="amazingwork">
    <Row id="amazingwork-headerindicationscontainer">
       <h2 className="amazingwork-headerindicationscontainer-headerindication">OMSIAP Project</h2>
       <h1 className="amazingwork-headerindicationscontainer-headerindication">Check OMSIAP'S Amazing Work</h1>
    </Row>
    <Col id="amazingwork-contentcontainer">
      <h1 id="amazingwork-contentcontainer-soonheaderindication">SOON</h1>
    </Col>
  </Col>
 )
}