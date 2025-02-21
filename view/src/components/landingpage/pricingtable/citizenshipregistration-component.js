import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col,
         Spinner } from 'react-bootstrap';

import '../../../styles/landingpage/pricingtable/citizenshipregistration.scss';

export default function CitizenshipRegistration() {

 const [typesofpaymentview, typesofpaymentviewcb] = useState("OMSIAPAWASTO");
 const [payingomsiapawastocreditsloadingindication, payingomsiapawastocreditsloadingindicationcb] = useState(false);


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

      <Row id="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer">
          <Col xs={4}
               md={4}
               lg={4}         
               className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-omsiapawastonavigationcontainer">
            <p className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-colcontainer-navigationheaderindication"
               onClick={(evt)=> {

                const _paymenttypecontainer = evt.target.parentElement;
                const _allpaymenttypecontainer = document.querySelectorAll(".citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer");
                
                for ( let i = 0; i < _allpaymenttypecontainer.length; i++ ) {
                  _allpaymenttypecontainer[i].style.backgroundColor = "black";
                  _allpaymenttypecontainer[i].style.color = "white";
                }

                _paymenttypecontainer.style.backgroundColor = "white";
                _paymenttypecontainer.style.color = "black";

                typesofpaymentviewcb((paymenttype)=> paymenttype = "OMSIAPAWASTO");

               }}>OMSIAPAWASTO Currency</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}         
               className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer">
            <p className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-colcontainer-navigationheaderindication"
               onClick={(evt)=> {

                  const _paymenttypecontainer = evt.target.parentElement;
                  const _allpaymenttypecontainer = document.querySelectorAll(".citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer");
                  
                  for ( let i = 0; i < _allpaymenttypecontainer.length; i++ ) {
                    _allpaymenttypecontainer[i].style.backgroundColor = "black";
                    _allpaymenttypecontainer[i].style.color = "white";
                  }

                  _paymenttypecontainer.style.backgroundColor = "white";
                  _paymenttypecontainer.style.color = "black";

                  typesofpaymentviewcb((paymenttype)=> paymenttype = "Gcash");

              }}>Gcash</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}         
               className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer">
            <p className="citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-colcontainer-navigationheaderindication"
                onClick={(evt)=> {

                  const _paymenttypecontainer = evt.target.parentElement;
                  const _allpaymenttypecontainer = document.querySelectorAll(".citizenshipregistration-viewcontainer-typesofpaymentnavigationcontainer-navigationcontainer");
                  
                  for ( let i = 0; i < _allpaymenttypecontainer.length; i++ ) {
                    _allpaymenttypecontainer[i].style.backgroundColor = "black";
                    _allpaymenttypecontainer[i].style.color = "white";
                  }
  
                  _paymenttypecontainer.style.backgroundColor = "white";
                  _paymenttypecontainer.style.color = "black";

                  typesofpaymentviewcb((paymenttype)=> paymenttype = "Borrow");
  
                 }}>Borrow</p>
          </Col>
      </Row>

      <Col id="citizenshipregistration-viewcontainer">
        <PaymentTypesView typesofpaymentview={typesofpaymentview}
                          typesofpaymentviewcb={typesofpaymentviewcb}/>
      </Col>

      

    </Col>
 )
}
///  <PaymentTypesView payingomsiapawastocreditsloadingindication={payingomsiapawastocreditsloadingindication}/>
function PaymentTypesView(props) {

  if ( props.typesofpaymentview === "OMSIAPAWASTO" ) {
   return (
      <Col id="paymenttpyesview"> 
        <OMSIAPAWASTOCITIZENSHIPPAYMENT payingomsiapawastocreditsloadingindication={props.payingomsiapawastocreditsloadingindication}
                                        typesofpaymentview={props.typesofpaymentview}
                                        typesofpaymentviewcb={props.typesofpaymentviewcb}/>
      </Col>
   )
  }

  if ( props.typesofpaymentview === "Gcash" ) {
   return (
    <h1>Gcash</h1>
   )
  }

}

function OMSIAPAWASTOCITIZENSHIPPAYMENT(props) {
  return (
   <Row id="omsiapawastocitizenshippayment">
     
     <Col xs={12}
          md={3}
          lg={3}
          id="omsiapawastocitizenshippayment-requirementscontainer">
        <p className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Requirements for Public Citizenship and about OMSIAPWASTO Currency</p>
        <h3 className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Overview</h3>
        <p className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">This document outlines the requirements for obtaining public citizenship through the OMSIAPWASTO monetary system.</p>
        <h3  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Currency Definition</h3>
        <p  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">OMSIAPWASTO (Of Macky's Ink And Paper And Wood And Stone) is the official currency used in this system. This currency encompasses physical materials including:</p>
         <ul  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">
           <li>Ink</li>
           <li>Paper</li>
           <li>Wood</li>
           <li>Stone</li>
         </ul>
         <h3  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Financial Account Requirements</h3>
         <p  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">To obtain public citizenship, individuals must establish and maintain a Monthly Financial Allocation To Individual People (MFATIP) profile. This profile serves as the primary financial account for:</p>
         <ul  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">
           <li>Receiving monthly allocations</li>
           <li>Managing citizenship-related transactionsManaging</li>
           <li>Tracking currency holdings and transfers</li>
         </ul>
         <h3  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Account Management</h3>
         <p  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">MFATIP profiles must be:</p>
         <ul  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">
            <p>1. Registered under the individual's legal name</p>
            <p>2. Updated with current contact information</p>
            <p>3. Maintained in good standing with regular activity</p>
            <p>4. Compliant with all system regulations</p>
         </ul>
         <h2  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Additional Considerations</h2>
         <p  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Citizens must demonstrate:</p>
         <ul  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">
          <li>Understanding of the OMSIAPWASTO currency system</li>
          <li>Ability to manage their MFATIP profile responsibly</li>
          <li>Commitment to participating in the financial community</li>
         </ul>
         <h2 className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">Contact Information</h2>
         <p  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">For questions regarding citizenship requirements or MFATIP profiles, please contact the relevant administrative office or email us.</p>

        <ul  className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">
          <li className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">MFATIP or Monthly Financial Allocation To Individual People PROFILE or account</li>
          <li className="omsiapawastocitizenshippayment-requirementscontainer-headerindication">OMSIAPAWASTO or Of Macky'S Ink And Paper And Wood And Stone money or currency</li>
        </ul>
     </Col>
     <Col xs={9}
          md={9}
          lg={9}
          id="omsiapawastocitizenshippayment-paymentcontainer">
        <Row id="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer">
          <Col xs={4}
               md={4}
               lg={4}
               className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-colcontainer">
            <p className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-dataheaderindication">Name: Mark Anthony Apura Beloy</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}
               className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-colcontainer">
            <p className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-dataheaderindication">Your OMSIAPAWASTO as of now: 0.00</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}
               className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-colcontainer">
            <p className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-dataheaderindication">Date now:</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}
               className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-colcontainer">
            <p className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-dataheaderindication">Acquiring citizenship validity: Until when purchased</p>
          </Col>
          <Col xs={4}
               md={4}
               lg={4}
               className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-colcontainer">
            <p className="omsiapawastocitizenshippayment-paymentcontainer-userdetailscontainer-dataheaderindication">Citizenship status: ???????</p>
          </Col>
          
        </Row>
        <Col id="omsiapawastocitizenshippayment-paymentcontainer-buttonsandloadingindicatorcontainer">
          {
            props.payingomsiapawastocreditsloadingindication ? 
            (
              <Spinner animation="grow" variant="info" />
            )
            :
            (
              <button id="omsiapawastocitizenshippayment-paymentcontainer-buttonsandloadingindicatorcontainer-acquirecitizenshippayingomsiapawastocreditsbutton">ACQUIRE CITIZENSHIP PAYING OMSIAPASTO CREDITS</button>
            )
          }
        </Col>
     </Col>
     
   </Row>
  )
}
