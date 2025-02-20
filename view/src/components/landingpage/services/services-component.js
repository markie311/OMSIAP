import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import { useLocation,
useNavigate
} from 'react-router-dom';

import '../../../styles/landingpage/services/services.scss';

export default function Services() {

  const location = useLocation();
  const navigate = useNavigate();

 return (
    <Row id="services">
      <Col xs={12}
           md={12}
           lg={12}
           id="services-headerindicationscontainer">
       <Row id="services-headerindicationscontainer-rowcontainer">
         <Col xs={12}
              md={10}
              lg={10}
              id="services-headerindicationscontainer-rowcontainer-headerindicationscontainer">
            <h3 className="services-headerindicationscontainer-rowcontainer-headerindicationscontainer-headerindication">For Self-growth and Corporate Services</h3>
            <h1 className="services-headerindicationscontainer-rowcontainer-headerindicationscontainer-headerindication">Of Macky'S Ink And Paper Core Service's</h1>
         </Col>
         <Col xs={12}
              md={2}
              lg={2}
              id="services-headerindicationscontainer-rowcontainer-viewallservicesbuttoncontainer">
            <button id="services-headerindicationscontainer-rowcontainer-viewallservicesbuttoncontainer-viewallservicesbutton"
                    onClick={()=> {
                      navigate('/servicedetails')
                    }}>View all service's</button>
         </Col>
       </Row>
      </Col>
      <Col xs={12}
           md={12}
           lg={12}
           id="services-servicescontainer">
        <Row id="services-servicescontainer-rowcontainer">
        <Col xs={12}
                md={4}
                lg={4}
                className="services-servicescontainer-rowcontainer-servicecolcontainer">
            <Col className="services-layoutcontainer-servicecontainer">
              <Col className="services-layoutcontainer-servicecontainer-countcontainer">
               <p className="services-layoutcontainer-servicecontainer-countcontainer-countindication">01</p>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-logocontainer">
                <img src="../images/landingpage/services/goldenshield.jpg"
                     className="services-layoutcontainer-servicecontainer-logocontainer-logo services-layoutcontainer-servicecontainer-logocontainer-logo1"/>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-headerindicationscontainer">
               <h2 className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">OMSIAP'S Market</h2>
               <p className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication"> Complete data analysis based on the five W's (What, Who, When, Where, and Why), providing data-driven market share insights mapped for public access.</p>
              </Col>
            </Col>
           </Col>
           <Col xs={12}
                md={4}
                lg={4}
                className="services-servicescontainer-rowcontainer-servicecolcontainer">
            <Col className="services-layoutcontainer-servicecontainer">
              <Col className="services-layoutcontainer-servicecontainer-countcontainer">
               <p className="services-layoutcontainer-servicecontainer-countcontainer-countindication">02</p>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-logocontainer">
                <img src="../images/landingpage/services/analysisandreport.png"
                     className="services-layoutcontainer-servicecontainer-logocontainer-logo services-layoutcontainer-servicecontainer-logocontainer-logo2"/>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-headerindicationscontainer">
               <h2 className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Analysis & Report</h2>
               <p className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Effective data analysis drives informed decisions, enhances operational efficiency, and uncovers growth opportunities.</p>
              </Col>
            </Col>
           </Col>
           <Col xs={12}
                md={4}
                lg={4}
                className="services-servicescontainer-rowcontainer-servicecolcontainer">
            <Col className="services-layoutcontainer-servicecontainer">
              <Col className="services-layoutcontainer-servicecontainer-countcontainer">
               <p className="services-layoutcontainer-servicecontainer-countcontainer-countindication">03</p>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-logocontainer">
                <img src="../images/landingpage/services/marketingstrategy.png"
                     className="services-layoutcontainer-servicecontainer-logocontainer-logo services-layoutcontainer-servicecontainer-logocontainer-logo3"/>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-headerindicationscontainer">
               <h2 className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Marketing Strategy</h2>
               <p className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Engaging with innovative and data-driven marketing strategies.</p>
              </Col>
            </Col>
           </Col>
           <Col xs={12}
                md={4}
                lg={4}
                className="services-servicescontainer-rowcontainer-servicecolcontainer">
            <Col className="services-layoutcontainer-servicecontainer">
              <Col className="services-layoutcontainer-servicecontainer-countcontainer">
               <p className="services-layoutcontainer-servicecontainer-countcontainer-countindication">04</p>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-logocontainer">
                <img src="../images/landingpage/services/openhands.png"
                     className="services-layoutcontainer-servicecontainer-logocontainer-logo services-layoutcontainer-servicecontainer-logocontainer-logo4"/>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-headerindicationscontainer">
               <h2 className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Monthly Finance Allocation To Individual People (MFATIP)</h2>
               <p className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Boost your self-growth recieving funds every month coming from OMSIAP'S market profit, it's marketing fee's to businesse's that was considered taxation power by OMSIAP, infrastructure projects commision's, web developement commision's and community project's profit's.</p>
              </Col>
            </Col>
           </Col>
         
           <Col xs={12}
                md={4}
                lg={4}
                className="services-servicescontainer-rowcontainer-servicecolcontainer">
            <Col className="services-layoutcontainer-servicecontainer">
              <Col className="services-layoutcontainer-servicecontainer-countcontainer">
               <p className="services-layoutcontainer-servicecontainer-countcontainer-countindication">05</p>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-logocontainer">
                <img src="../images/landingpage/services/webdevelopment.png"
                     className="services-layoutcontainer-servicecontainer-logocontainer-logo services-layoutcontainer-servicecontainer-logocontainer-logo5"/>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-headerindicationscontainer">
               <h2 className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Web Development</h2>
               <p className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Modern web development combines responsive design, and user-friendly interfaces to create dynamic web applications.</p>
              </Col>
            </Col>
           </Col>
          
           <Col xs={12}
                md={4}
                lg={4}
                className="services-servicescontainer-rowcontainer-servicecolcontainer">
            <Col className="services-layoutcontainer-servicecontainer">
              <Col className="services-layoutcontainer-servicecontainer-countcontainer">
               <p className="services-layoutcontainer-servicecontainer-countcontainer-countindication">06</p>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-logocontainer">
                <img src="../images/landingpage/services/infrastructure.png"
                     className="services-layoutcontainer-servicecontainer-logocontainer-logo services-layoutcontainer-servicecontainer-logocontainer-logo6"/>
              </Col>
              <Col className="services-layoutcontainer-servicecontainer-headerindicationscontainer">
               <h2 className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Infastracture</h2>
               <p className="services-layoutcontainer-servicecontainer-headerindicationscontainer-headerindication">Building and Housing for project's for the whole Family including pets, tsunami's and earthquake's proof.</p>
              </Col>
            </Col>
           </Col>
        </Row>
      </Col>
    </Row>
 )
}