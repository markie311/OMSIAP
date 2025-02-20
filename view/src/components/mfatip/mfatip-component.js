import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown
       } from 'react-bootstrap';

import '../../styles/mfatip/mfatip.scss';

import NavBar from '../navbar/navbar/navbar-component.js';
import RapportAdvertisement from '../landingpage/rapportadvertisement/rapportadvertisement-component.js';
import PricingTable from '../landingpage/pricingtable/pricingtable-component.js';


export default function MonthlyFinanceAllocationToIndividualPeople(props) {
 return(
    <Col id="mfatip">

      <Col id='mfatip-landingpageview'>
        <NavBar viewport={props.viewport}/>
        <Header />
        <HopeHeader />
        <RapportAdvertisement />
        <MFATIPConfiguration />
      </Col>

      <SetUpMFATIPACCOUNT />

    </Col>
 )
}

function Header() {
 return ( 
    <Row id="mfatipheaderrowcontariner">
      <Col xs={12}
           md={4}
           lg={4}
           id="mfatipheaderrowcontariner-headerindicationscontainer">
        <h4 className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">We Are Responsive To Build Success</h4>
        <h1 className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">Innovative Creative Solutions For Your Business</h1>
        <p className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">Innovative Creative Solutions for Your Business" encapsulates the essence of transforming conventional business approaches into extraordinary opportunities for growth and success.</p>
      </Col>
      <Col xs={12}
           md={8}
           lg={8}
           id="mfatipheaderrowcontariner-dataheaderindicationcontainer">
        <Row id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer">
         <Col xs={12}
              md={6}
              lg={6}
              id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer">
          <Row id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer">
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer">
              <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer">
              </Col>
            </Col>
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer">
              <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer">
              </Col>
            </Col>
          </Row>
          <Col id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datadisplayimagecontainer">
           <img src="../images/mfatip/people.jpg"
                id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datadisplayimagecontainer-datadisplayimage"/>
          </Col>
         </Col>
         <Col xs={12}
              md={6}
              lg={6}
              id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-ownerbackgroundimagecontainer">
            <img src="../images/mfatip/tuxedo.jpg"
                 id="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-ownerbackgroundimagecontainer-ownerbackgrounimage"/>
         </Col>
        </Row>
      </Col>
    </Row>
 )
}

function HopeHeader() {
 return(
    <Row id="hopeheader">
        
      <Col xs={6}
           md={6}
           lg={6}
           id="hopeheader-displayimagescontainer">
        <Row id="hopeheader-displayimagescontainer-rowcontainer">
          <Col xs={6}
               md={6}
               lg={6}
               className="hopeheader-displayimagescontainer-rowcontainer-colcontainer">
            <img src="../images/mfatip/tuxedo.jpg"
                 id="hopeheader-displayimagescontainer-rowcontainer-colcontainer-displayimage1"/>
             <img src="../images/mfatip/tuxedo.jpg"
                 id="hopeheader-displayimagescontainer-rowcontainer-colcontainer-displayimage2"/>
          </Col>
          <Col xs={6}
               md={6}
               lg={6}
               className="hopeheader-displayimagescontainer-rowcontainer-colcontainer">
              <img src="../images/mfatip/tuxedo.jpg"
                 id="hopeheader-displayimagescontainer-rowcontainer-colcontainer-displayimage3"/>
          </Col>
        </Row>
      </Col>
      <Col xs={6}
           md={6}
           lg={6}
           id="hopeheader-hopeheader-headerindicationscontainer">
        <h4 className="hopeheader-hopeheader-headerindicationscontainer-headerindication">About us</h4>
        <h2 className="hopeheader-hopeheader-headerindicationscontainer-headerindication">EmpoweringYourBusinessforSuccess</h2>
        <p className="hopeheader-hopeheader-headerindicationscontainer-headerindication">At Refreshingly Unique, we believe in giving your business the competitive edge it deserves. Our innovative solutions and personalized approach ensure your company stands out in the market.</p>
      </Col>

    </Row>
 )
}

function MFATIPConfiguration() {
 return (
  <Col id="mfatipconfiguration">
   <Col id="mfatipconfiguration-headerindicationcontainer">
     <h4 className="mfatipconfiguration-headerindicationcontainer-headerindication">BUILD YOUR Self-Growth Success with OMSIAP</h4>
     <h1 className="mfatipconfiguration-headerindicationcontainer-headerindication">REGISTER NOW</h1>
   </Col>
   <Row id="mfatipconfiguration-configurationmodalrowcontainer">
     <Col xs={12}
          md={12}
          lg={12}
          className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer">
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>RECIEVE FINANCE ALLOCATION MONTHLY UP TO &#8369; 8,000 PESO'S</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>FREE REGISTRATION</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>FREE AND A LIFE-TIME ACCOUNT</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>LIFE-TIME CONSISTENT ACCOUNT SAVED ON OMSIAP'S DATABASE</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>FREE DATABASE THAT CAN BE USE FOR YOUR SELF-GROWTH</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>FREE USAGE OF PACKAGES ON OMSIAP FOR YOUR SELF-GROWTH E.G PORTFOLIO, RESUME, TO DO LIST</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication"> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/>FREE USAGE OF OMSIAP MAP</p>
     </Col>
     <Col xs={12}
          md={12}
          lg={12}
          className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer">
        <h4 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Contact OMSIAP</h4>
        <h1 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Have Questions Get In Touch</h1>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.</p>
        <br />
        <br />
        <br />
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Address: Street, Baranggay, City, Province, Country</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Email address: Street, Baranggay, City, Province, Country</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Phone number: 000-000-0000-000</p>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Telephone number: 000-000-0000-000</p>
     </Col>
     <Col xs={12}
          md={12}
          lg={12}
          className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer">
       <button id="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-setupmymfatipaccountbutton">SET UP MY (M)onthly (F)inance (A)llocation (T)o (I)ndividual (P)eople ACCOUNT</button>
     </Col>
   </Row>
  </Col>
 )
}

function SetUpMFATIPACCOUNT() {
 return (
   <Row id="setupmfatipaccount">
      <Row id="setupmfatipaccount-viewcontainer">
        <Col xs={12}
              md={12}
              lg={12}
              id="setupmfatipaccount-profilepictureandnamecontainer">
          <Row id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer">
            <Col xs={4}
                  md={3}
                  lg={3}
                  id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-profilepicturecontainer">
                <div id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-profilepicturecontainer-layoutcontainer">
                </div>
            </Col>
            <Col xs={8}
                  md={9}
                  lg={9}
                  id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-detailscontainer">
                <Col id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-detailscontainer-namecontainer">
                  <h1 className="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-detailscontainer-namecontainer-headerindication">BELOY, MARK ANTHONY</h1>
                  <h4 className="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-detailscontainer-namecontainer-headerindication">MONTHLY FINANCE ALLOCATION TO INDIVIDUAL PEOPLE PROFILE</h4>
                </Col>
                <Col id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-detailscontainer-editnamebuttoncontainer">
                  <button id="setupmfatipaccount-profilepictureandnamecontainer-rowcontainer-detailscontainer-editnamebuttoncontainer-editnameandprofilepicturebutton">Edit name and profile picture</button>
                </Col>
            </Col>
          </Row>
        </Col>
        <Row id="setupmfatipaccount-viewcontainer-gridcontainer">
          <Col xs={12}
               md={4}
               lg={4}
               id="setupmfatipaccount-viewcontainer-gridcontainer-statuscontainer">
            <p>(1) Birth certificate: <span>You did not submit a copy of your birth certificate yet to a nearest OMSIAP office</span></p>
            <p>You must comply and submit a photo of your birth certificate in order to the compliance of MFATIP</p>

            <Col id="setupmfatipaccount-viewcontainer-gridcontainer-statuscontainer-edityourbirthcerfiticatebuttoncontainer">
              <button>Comply a copy of your birth certificate photo online</button>
            </Col>
            <br />

            <p>(2) One Valid Government ID: <span>You did not submit one copy of your valid government ID yet to a nearest OMSIAP office</span></p>
            <p>You must comply and submit a photo of your birth certificate in order to the compliance of MFATIP</p>

            <Col id="setupmfatipaccount-viewcontainer-gridcontainer-statuscontainer-edityourvalidgovernmentidbuttoncontainer">
              <button>Comply a copy of your one valid Government ID photo online</button>
            </Col>
            <br />

            <p>(3) Lock your account: <span>You did not purchase from OMSIAP'S Market</span></p>
            <p>You must comply and submit a photo of your birth certificate in order to the compliance of MFATIP</p>

          </Col>
          <Col xs={12}
               md={8}
               lg={8}
               id="setupmfatipaccount-viewcontainer-gridcontainer-detailscontainer">
            <Col id="setupmfatipaccount-viewcontainer-gridcontainer-detailscontainer-dobstatuseducationdetailscontainer">
              <Row id="setupmfatipaccount-viewcontainer-gridcontainer-detailscontainer-dobstatuseducationdetailscontainer-detailsrowcontainer">
                <Col xs={6}
                     md={3}
                     lg={3} 
                     className="setupmfatipaccount-viewcontainer-gridcontainer-detailscontainer-dobstatuseducationdetailscontainer-detailsrowcontainer-colcontainer">
                  <p><button className="setupmfatipaccount-viewcontainer-gridcontainer-detailscontainer-dobstatuseducationdetailscontainer-detailsrowcontainer-colcontainer-checkandwrongxbutton"></button> DOB: ?????</p>
                </Col>
              </Row>
              <Col id="setupmfatipaccount-viewcontainer-gridcontainer-detailscontainer-dobstatuseducationdetailscontainer-editdobstatuseducationdetailscontainer">
              </Col>
            </Col>
          </Col>
        </Row>
      
      </Row>
   </Row>
 )
}