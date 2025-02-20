import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import '../../../styles/landingpage/pricingtable/citizenshipregistration.scss';

export default function CitizenshipRegistration() {
 return (
    <Col id="citizenshipregistration">
      <Row id="citizenshipregistration-navigationcontainer">
        <Col xs={3}
             md={2}
             lg={2}
             className="citizenshipregistration-navigationcontainer-navigationcontainer">
          <p className="citizenshipregistration-navigationcontainer-navigationcontainer-navigationheaderindication"
             onClick={()=> {
              const _citizenshipregistration = document.querySelector("#citizenshipregistration");
              _citizenshipregistration.style.display = "none"
            }}>Back /</p>
        </Col>
      </Row>
      <Col id="citizenshipregistration-viewcontainer">
        <Row id="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer">
          <Col xs={4}
               md={4}
               lg={4}         
               className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer">
            <p className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-colcontainer-navigationheaderindication">OMSIAPAWASTO Currency</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}         
               className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer">
            <p className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-colcontainer-navigationheaderindication">Gcash</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}         
               className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer">
            <p className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-colcontainer-navigationheaderindication">Borrow</p>
          </Col>
        </Row>
        
        <PaymentTypesView />

      </Col>
    </Col>
 )
}

function PaymentTypesView() {
 return (
  <Col id="paymenttpyesview"> 
    <OMSIAPAWASTOCITIZENSHIPPAYMENT />
  </Col>
 )
}

function OMSIAPAWASTOCITIZENSHIPPAYMENT() {
  return (
   <Row id="omsiapawastocitizenshippayment">
     <h1>OMSIAPAWASTO citizenship payment</h1>
   </Row>
  )
}