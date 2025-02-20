import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import { useLocation,
         useNavigate
} from 'react-router-dom';

import NavBar from '../../navbar/navbar/navbar-component.js';

import '../../../styles/landingpage/services/servicedetails.scss';

export default function ServiceDetails(props) {
 return(
  <Col id="servicedetails">
    <NavBar viewport={props.viewport}/>
    <Header />
    <OMSIAPMarketServiceDetails />
    <AnalysisReportServiceDetails />
  </Col>
 )
}

function Header() {
 return (
    <Col id="servicedetails-headercontainer">
     <Col id="servicedetails-headercontainer-backgroundimagecontainer">
       <img src="../images/landingpage/services/servicedetails.jpg"
            id="servicedetails-headercontainer-backgroundimagecontainer-servicedetailsbackgroundimage"/>
     </Col>
     <Col id="servicedetails-headercontainer-headerindicationscontainer">
       
       <h1 className="servicedetails-headercontainer-headerindicationscontainer-headerindication">Service Details</h1>
       <p className="servicedetails-headercontainer-headerindicationscontainer-headerindication"><span>Home/Service Details</span></p>
     </Col>
    </Col>
 )
}

function OMSIAPMarketServiceDetails() {
 return (
    <Row className="servicedetails-leftbackgroundimageservicedetailsrowcontainer">
      <Col xs={6}
           md={6}
           lg={6}
           className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-displayimagecontainer">
         <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-displayimagecontainer-displayimagecontainer">
           <img src="../images/landingpage/services/holdingphone.jpg"
                className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-displayimagecontainer-displayimagecontainer-displayimage"/>
         </Col>
         <Row className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer">
            <Col xs={12}
                 md={12}
                 lg={12}
                 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-requestaqouteforworkheaderindicationcontainer">
              <h1 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-requestaqouteforworkheaderindicationcontainer-requestaqouteforworkheaderindication">Request A Qoute For Work</h1>
            </Col>
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
              <input type="text" placeholder="Your name" className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-nameinputfield"/>
            </Col>
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
               <input type="text" placeholder="Email address" className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-emailaddressinputfield"/>
            </Col>
            <Col xs={12}
                 md={12}
                 lg={12}
                 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
              <input type="number" placeholder="Philippine phone number" className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-phonenumberinputfield"/>
            </Col>
            <Col xs={12}
                 md={12}
                 lg={12}
                 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
             <textarea className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-messageinputfield" placeholder="Message"></textarea>
            </Col>
            <Col xs={12}
                 md={12}
                 lg={12}
                 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
              <button className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-sendmessagebutton">Send message</button>
            </Col>
         </Row>
      </Col>
      <Col xs={6}
           md={6}
           lg={6}
           className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer">
        <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-headerindicationscontainer">
          <h1 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-headerindicationscontainer-headaerindication">OMSIAP'S Market</h1>
          <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-headerindicationscontainer-headaerindication">Complete data analysis starting from the five W's. What, Whom, When, Where and Why data driven and mapped market shared to the public.</p>
        </Col>
        <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer">
          <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-contactdetailsheaderindication"><img src="../images/landingpage/services/phonenumberlogo.png"
              className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-cotactlogo"/>Phone number: 000-0000-000-0000</p>
          <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-contactdetailsheaderindication"><img src="../images/landingpage/services/emaillogo.png"
              className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-cotactlogo"/>Email address: sample@gmail.com</p>
          <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-contactdetailsheaderindication"><img src="../images/landingpage/services/mapmarker.png"
              className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-cotactlogo"/>Office location: Maa, Trinidad street, Greenhills subdivion, Davao City</p>
        </Col>
        <Col id="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer">
           <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
             <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
             <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
              <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

              </div>
             </div>
           </Col>
           <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
             <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
             <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
              <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

              </div>
             </div>
           </Col>
           <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
             <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
             <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
              <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

              </div>
             </div>
           </Col>
           <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
             <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
             <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
              <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

              </div>
             </div>
           </Col>
        </Col>
      </Col>
    </Row>
 )
}

function AnalysisReportServiceDetails() {
 return (
  <Row className="servicedetails-leftbackgroundimageservicedetailsrowcontainer">
  <Col xs={6}
       md={6}
       lg={6}
       className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-displayimagecontainer">
     <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-displayimagecontainer-displayimagecontainer">
       <img src="../images/landingpage/services/holdingphone.jpg"
            className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-displayimagecontainer-displayimagecontainer-displayimage"/>
     </Col>
     <Row className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer">
        <Col xs={12}
             md={12}
             lg={12}
             className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-requestaqouteforworkheaderindicationcontainer">
          <h1 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-requestaqouteforworkheaderindicationcontainer-requestaqouteforworkheaderindication">Request A Qoute For Work</h1>
        </Col>
        <Col xs={6}
             md={6}
             lg={6}
             className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
          <input type="text" placeholder="Your name" className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-nameinputfield"/>
        </Col>
        <Col xs={6}
             md={6}
             lg={6}
             className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
           <input type="text" placeholder="Email address" className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-emailaddressinputfield"/>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
          <input type="number" placeholder="Philippine phone number" className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-phonenumberinputfield"/>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
         <textarea className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer-messageinputfield" placeholder="Message"></textarea>
        </Col>
        <Col xs={12}
             md={12}
             lg={12}
             className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-inputfieldcontainer">
          <button className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-requestaqouteforworkcontainer-sendmessagebutton">Send message</button>
        </Col>
     </Row>
  </Col>
  <Col xs={6}
       md={6}
       lg={6}
       className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer">
    <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-headerindicationscontainer">
      <h1 className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-headerindicationscontainer-headaerindication">OMSIAP'S Market</h1>
      <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-headerindicationscontainer-headaerindication">Complete data analysis starting from the five W's. What, Whom, When, Where and Why data driven and mapped market shared to the public.</p>
    </Col>
    <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer">
      <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-contactdetailsheaderindication"><img src="../images/landingpage/services/phonenumberlogo.png"
          className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-cotactlogo"/>Phone number: 000-0000-000-0000</p>
      <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-contactdetailsheaderindication"><img src="../images/landingpage/services/emaillogo.png"
          className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-cotactlogo"/>Email address: sample@gmail.com</p>
      <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-contactdetailsheaderindication"><img src="../images/landingpage/services/mapmarker.png"
          className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-contactdetailscontainer-cotactlogo"/>Office location: Maa, Trinidad street, Greenhills subdivion, Davao City</p>
    </Col>
    <Col id="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer">
       <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
         <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
         <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
          <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

          </div>
         </div>
       </Col>
       <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
         <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
         <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
          <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

          </div>
         </div>
       </Col>
       <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
         <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
         <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
          <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

          </div>
         </div>
       </Col>
       <Col className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer">
         <p className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetcontainer-skillssetheaderindication">Skills set</p>
         <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbar">
          <div className="servicedetails-leftbackgroundimageservicedetailsrowcontainer-servicedetailscontainer-skillssetcontainer-skillssetbarindication">

          </div>
         </div>
       </Col>
    </Col>
  </Col>
</Row>
 )
}