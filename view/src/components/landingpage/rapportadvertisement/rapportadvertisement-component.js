import '../../../styles/landingpage/rapportadvertisement/rapportadvertisement.scss';
import React, {
  useState,
  useEffect
} from 'react';

import { Row,
       Col } from 'react-bootstrap';

import '../../../styles/landingpage/rapportadvertisement/rapportadvertisement.scss';

export default function RapportAdvertisement() {
return (
  <Row id="rapportadvertisement">
    <Row id="rapportadvertisement-animationcontainer">
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Individual people</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
       <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Pension's</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Philanthropist</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Environmentalist</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Marketing</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Tsunami proof house's</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Earthquake proof house's</h1>
    </Col>
    <Col xs={6}
         md={6}
         lg={4}
         className="rapportadvertisement-colcontainer">
      <h1 className="rapportadvertisement-colcontainer-rapportindication"><span className="rapportadvertisement-colcontainer-rapporthighlightindication">*</span>Infastracture</h1>
    </Col>
    </Row>
  </Row>
)
}