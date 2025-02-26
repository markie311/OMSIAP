import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col,
         Accordion } from 'react-bootstrap';

import '../../../styles/landingpage/meetourprofessional/meetourprofessional.scss';

export default function MeetOurProfessional() {
 return( 
  <Col id="meetourprofessional">
    <Col id="meetourprofessional-headerindicationscontainer">
      <h3 className="meetourprofessional-headerindicationscontainer-headerindication">OMSIAP Team</h3>
      <h1 className="meetourprofessional-headerindicationscontainer-headerindication">Meet OMSIAP'S Professional's</h1>
    </Col>
    <Col id="meetourprofessional-theprofessionalscontainer">
      <Row id="meetourprofessional-theprofessionalscontainer-rowcontainer">
         <Col xs={6}
              md={3}
              lg={3}
              className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer">
            <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer">
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer">
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-backgroundimagecontainer">
                </Col>
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer">
                  <img src="../images/landingpage/meetourprofessionals/tuxedo.jpg"
                       className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer-photo"/>
                </Col>
              </Col>
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer">
                <div className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer">
                  <h4 className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Mark Anthony Beloy</h4>
                  <p className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Owner</p>
                </div>
              </Col>
            </Col>
         </Col>
         <Col xs={6}
              md={3}
              lg={3}
              className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer">
            <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer">
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer">
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-backgroundimagecontainer">
                </Col>
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer">
                  <img src="../images/landingpage/meetourprofessionals/tuxedo.jpg"
                       className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer-photo"/>
                </Col>
              </Col>
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer">
                <div className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer">
                  <h4 className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Mark Anthony Beloy</h4>
                  <p className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Owner</p>
                </div>
              </Col>
            </Col>
         </Col>
         <Col xs={6}
              md={3}
              lg={3}
              className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer">
            <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer">
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer">
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-backgroundimagecontainer">
                </Col>
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer">
                  <img src="../images/landingpage/meetourprofessionals/tuxedo.jpg"
                       className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer-photo"/>
                </Col>
              </Col>
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer">
                <div className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer">
                  <h4 className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Mark Anthony Beloy</h4>
                  <p className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Owner</p>
                </div>
              </Col>
            </Col>
         </Col>
         <Col xs={6}
              md={3}
              lg={3}
              className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer">
            <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer">
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer">
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-backgroundimagecontainer">
                </Col>
                <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer">
                  <img src="../images/landingpage/meetourprofessionals/tuxedo.jpg"
                       className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-photocontainer-photocontainer-photo"/>
                </Col>
              </Col>
              <Col className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer">
                <div className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer">
                  <h4 className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Mark Anthony Beloy</h4>
                  <p className="meetourprofessional-theprofessionalscontainer-rowcontainer-meetourprofessionalcolcontainer-positioningcontainer-detailscontainer-detailslayoutcontainer-headerindication">Owner</p>
                </div>
              </Col>
            </Col>
         </Col>
      </Row>
    </Col>
  </Col>
 )
}