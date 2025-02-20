import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col } from 'react-bootstrap';

import '../../../styles/landingpage/welcomeintroduction/welcomeintroduction.scss';

export default function WelcomeIntroduction() {
 return(
    <Row id="welcomeintroduction">
     <Col xs={12}
          md={6}
          lg={6}
          id="welcomeintroduction-headerindicationscontainer">
        <Col id="welcomeintroduction-headerindicationscontainer-headerindicationscontainer">
          <h3 className="welcomeintroduction-headerindicationscontainer-headerindicationscontainer-headerindication">BUILDING YOUR PATH TO SUCCESS.</h3>
          <br/>
          <h1 className="welcomeintroduction-headerindicationscontainer-headerindicationscontainer-headerindication">Expert Services for Personal Growth and Business Development</h1>
          <br/>
          <p className="welcomeintroduction-headerindicationscontainer-headerindicationscontainer-headerindication">One unified approach: We listen to your needs for shelter, education, and advancement.</p>
          <p className="welcomeintroduction-headerindicationscontainer-headerindicationscontainer-headerindication">At OMSIAP, we evaluate individual potential and help chart the course to success.</p>
          <p className="welcomeintroduction-headerindicationscontainer-headerindicationscontainer-headerindication">Unlock your potential with OMSIAP's expert services, tailored to enhance your visibility and experience. We specialize in: strategic marketing and pension planning, data-driven analytics and precision metrics, innovative design and content creation and infrastructure development.</p>
         
        </Col>
        <Col id="welcomeintroduction-headerindicationscontainer-displayimagescontainer">
         <img src="../images/landingpage/welcomeintroduction/goldenshield.jpg"
            id="welcomeintroduction-headerindicationscontainer-displayimagescontainer-backgroundimage"/>
        </Col>
     </Col>
     <Col xs={12}
          md={6}
          lg={6}
          id="welcomeintroduction-displayimagescontainer">
       <Row id="welcomeintroduction-displayimagescontainer-rowcontainer">
         <Col xs={6}
              md={6}
              lg={6}
              className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer"
              id="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer1">
            <img src="../images/landingpage/welcomeintroduction/construction.jpg"
                 className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer-backgroundimage"/>
         </Col>
         <Col xs={6}
              md={6}
              lg={6}
              className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer"
              id="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer2">
            <img src="../images/landingpage/welcomeintroduction/boss.jpg"
                 className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer-backgroundimage"/>
         </Col>
         <Col xs={6}
              md={6}
              lg={6}
              className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer"
              id="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer3">
            <img src="../images/landingpage/welcomeintroduction/worker.jpg"
                 className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer-backgroundimage"/>
         </Col>
         <Col xs={6}
              md={6}
              lg={6}
              className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer"
              id="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer4">
            <img src="../images/landingpage/welcomeintroduction/graph.jpg"
                 className="welcomeintroduction-displayimagescontainer-rowcontainer-colcontainer-backgroundimage"/>
         </Col>
       </Row>
     </Col>
    </Row>
 )
}