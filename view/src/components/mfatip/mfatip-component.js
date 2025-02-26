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
import Footer from '../landingpage/footer/footer-component.js';

export default function MonthlyFinanceAllocationToIndividualPeople(props) {
 return(
    <Col id="mfatip">

      <Col id='mfatip-landingpageview'>
        <NavBar viewport={props.viewport}/>
        <Header />
        <HopeHeader />
        <RapportAdvertisement />
        <MFATIPConfiguration />
        <Footer />
      </Col>

      <SetUpMFATIPACCOUNT user={props.user}
                          usercb={props.usercb}/>

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
        <h4 className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">Building Your Path to Personal Success</h4>
        <br/>
        <h1 className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">(M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople: MFATIP</h1>
        <br/>
        <br/>
        <p className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">Accelerate your personal growth by receiving monthly financial allocations through your MFATIP profile. Our team will be present to support your success. We pride ourselves on providing excellent service to individuals, ensuring a positive experience for everyone.</p>
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
                <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer">
                  <p className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer-dataheaderindication">0 WEBSITE PAGE VISITS</p>
                </Col>
                <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer">
                  <p className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer-dataheaderindication">0 ACTIVE MFATIP ACCOUNT PROFILE HOLDERS</p>
                </Col>
              </Col>
            </Col>
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer">
              <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer">
                <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer">
                  <p className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer-dataheaderindication">0 PUBLIC ACTIVE CITIZEN'S</p>
                </Col>
                <Col className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer">
                  <p className="mfatipheaderrowcontariner-dataheaderindicationcontainer-rowcontainer-datacontainer-datarowcontainer-datacolcontainer-positioningcontainer-datacontainer-dataheaderindication">0 PRIVATE ACTIVE CITIZEN'S</p>
                </Col>
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
        <h4 className="hopeheader-hopeheader-headerindicationscontainer-headerindication">About HOPE</h4>
        <br/>
        <h2 className="hopeheader-hopeheader-headerindicationscontainer-headerindication">LEADING ALL HOPES INTO PRECISION</h2>
        <br/>
        <p className="hopeheader-hopeheader-headerindicationscontainer-headerindication">OMSIAP believes that the foundation we established was sufficient to unite everyone for constitutional change. Join our growing community that tracks market prices, shares data-driven insights about current trends, provides updates on our industrial economy and latest designs, and offers financial allocations based on OMSIAP's profits.</p>
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
        <h3 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">OMSIAP Benefits Package</h3>
        <br />
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Receive Monthly Financial Support</p>
        <ul className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">
          <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Up to ₱8,000 Philippine Pesos</li>
          <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> No registration fees</li>
          <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Lifetime account access</li>
          <p> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Account Features</p>
          <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Secure permanent storage in OMSIAP database</li>
          <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Free access to personal development tools:</li>
          <ul>
            <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Portfolio builder</li>
            <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Resume creator</li>
            <li>  <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Task management system</li>
          </ul>
          <li> <img src="../images/mfatip/check.jpg"
                 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-checkdisplayimage"/> Complimentary OMSIAP Map access</li>
        </ul>
     </Col>
     <Col xs={12}
          md={12}
          lg={12}
          className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer">
        <h4 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Contact OMSIAP</h4>
        <br/>
        <h1 className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Have Questions Get In Touch</h1>
        <br/>
        <p className="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-headerindication">Our team is available at,</p>
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
       <button id="mfatipconfiguration-configurationmodalrowcontainer-colcontainer-setupmymfatipaccountbutton"
               onClick={()=> {
                const _setupmfatipaccountmodal = document.querySelector("#setupmfatipaccount");
                _setupmfatipaccountmodal.style.display = "block";
               }}>SET UP MY (M)onthly (F)inance (A)llocation (T)o (I)ndividual (P)eople ACCOUNT</button>
     </Col>
   </Row>
  </Col>
 )
}

function SetUpMFATIPACCOUNT(props) {
 return (
   <Col id="setupmfatipaccount">
     <Row id="setupmfatipaccount-navigationcontainer">
       <Col xs={3}
            md={3}
            lg={3}
            className="setupmfatipaccount-navigationcontainer-navigationheaderindicationcontainer">
          <p className="setupmfatipaccount-navigationcontainer-navigationheaderindicationcontainer-headerindication"
             onClick={()=> {
              const _setupmfatipaccountmodal = document.querySelector("#setupmfatipaccount");
              _setupmfatipaccountmodal.style.display = "none";
             }}>Back /</p>
       </Col>
     </Row>
     <Col id="setupmfatipaccount-headerindicationscontainer">
      <p className="">Registering an MFATIP or (M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople Requirements</p>
          <br/>
          <p className="setupmfatipaccount-headerindicationscontainer-headerindication">By registreting to have  a MFATIP (M)ontlhy (Financial) (A)llocation (T)o (I)ndividual (P)eople profile with OMSIAP, OMSIAP will give financial allocation to your MFATIP profile or account each month that you can also withdraw monthly the reason why you must follow the strict procudere's written below.</p>
          <br />
          <ul className="setupmfatipaccount-headerindicationscontainer-headerindication">
            <li>Make sure to write consistent personal details to avoid dual accounts</li>
            <br />
            <p>HAVING DUAL ACCOUNTS WILL RESULT INTO</p>
            <ul>
              <li>Forfeiting of your other MFATIP (M)onthly) (F)ianancial (A)llocation (T)o (I)ndividual (P)eople account profile of a same name that was validated by the OMSIAP system and it's personel's that is not a different person and it is you creating another MFATIP account profile to recieve more financial allocation each month.</li>
               <li>Risking to lose your first registered MFATIP account profile</li>
            </ul>
            <br />
            <li>Make sure to have the same Gcash account name and number with your MFATIP account profile registered</li>
            <br/>
            <p>WHY DO I NEED TO REGISTER MY MFATIP ACCOUNT PROFILE WITH A SAME GCASH ACCOUNT NAME AND NUMBER?</p>
            <ul>
              <li>Because when sending your financial allocation each month, Gcash was mainly used send the credits that before, it was validated strictly what if the MFATIP account profile was not the same with your Gcash accounts. This system is very simple yet it is very powerful to determine user falsifications and scams</li>
            </ul>
             <p>Why do I need to avoid registering my MFATIP account profile that was not the same with my Gcash account name and number?</p>
             <ul>
              <li>Because when widthdrawing your financial allocations each month also specially depositing amounts here at OMSIAP, the screenshots of the transactions made in Gcash was mainly asked to be send it to OMSIAP before recieving and sending credits. For further validation for example if it is the not the same person or not, compared to your MFATIP accounts and Gcash account name and number, the credits will be send instead to the first who transacted the widthdrawal or depositing an amount here at OMSIAP with legal proofs.</li>
            </ul>
            <br/>
            <li>Make sure to have a clearer capture on your photo's uploading your documents</li>
            <br />
            <p>WHY DO I HAVE TO HAVE A CLEARER CAPTURE UPLOADING MY DOCUMENTS</p>
            <ul>
              <li>All documents that are sent to OMSIAP will be printed and complied to your documents saved and stored with the OMSIAP database and offfice's ( storage's of personal details documents )</li>
            </ul>
          </ul>
     </Col>
      <Row id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer">
        <Col xs={12}
            md={12}
            lg={12}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer">
          <h1 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer-headerindication">PERSONAL DETAILS</h1>
        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameheaderindication">First name</p>
          <input id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameinputfield" 
                 type="text"
                 onChange={(evt)=> {

                  props.user.personaldetails.name.firstname = evt.target.value;

               }}/>
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnamereminder">Make sure to write your first name the same in your first name in your Gcash account</p>
        </Col>  
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameheaderindication">Middle name</p>
          <input id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameinputfield" 
                 type="text"
                 onChange={(evt)=> {

                  props.user.personaldetails.name.middlename = evt.target.value;

               }}/>
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnamereminder">Make sure to write your middle name the same in your middle name in your Gcash account</p>
        </Col>  <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameheaderindication">Last name</p>
          <input id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameinputfield" 
                 onChange={(evt)=> {

                  props.user.personaldetails.name.lastname = evt.target.value;

                }}/>
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnamereminder">Make sure to write your last name the same in your last name in your Gcash account</p>
        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer-phonenumberheaderindication">Phone number</p>
          <input id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer-phonenumberinputfield" 
                 type="number"
                 onChange={(evt)=> {

                  props.user.personaldetails.contactdetails.phonenumber = evt.target.value;

               }}/>
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer-phonenumberreminder">Make sure to write your phone number the same in your Gcash account number</p>
        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer-dobheaderindication">Date Of Birth ( DOB )</p>
          <input id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer-dobinputfield" 
                 type="date"
                 onChange={(evt)=> {
                  props.user.personaldetails.dob = evt.target.value;
                 }}/>
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer-dobreminder">Make sure to write your full name the same in your Gcash account</p>
        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusheaderindication">Civil status</p>
          <label for="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusselect" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusselectlabel">Choose a civil status:</label>
          <select id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusselect"
                   onChange={(evt)=> {
                    props.user.personaldetails.civilstatus = evt.target.value;
                   }}>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="In a civil partnership">In a civil partnership</option>
            <option value="Former civil partner in a civil partnership that has ended">Former civil partner in a civil partnership that has ended</option>
        </select>
        </Col>
        <Col xs={12}
            md={12}
            lg={12}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer">
          <h1 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer-headerindication">NEEDED DOCUMENTS</h1>
        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofbirthcertificateinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificateheaderindication">FRONT PHOTO OF BIRTH CERTIFICATE</p>
          <img src="../images/landingpage/citizenshipregistration/blackquestionmark.png"
                  id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofbirthcertificateinputfieldcolcontainer-blackquestionmarkimage"/>
              <br/>
          <input type="file" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel" 
                 className="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificateinputfield" 
                 onChange={(evt)=> {

                    const _frontphotoofbirthcertificateimage = document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofbirthcertificateinputfieldcolcontainer-blackquestionmarkimage");
                    const _frontphotoofbirthcertificatefile =  document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel");

                    _frontphotoofbirthcertificateimage.src = URL.createObjectURL(_frontphotoofbirthcertificatefile.files[0]);

                 }}/>
          
          <label for="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel">
            Choose file
          </label>

        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofbirthcertificateinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificateheaderindication">BACK PHOTO OF BIRTH CERTIFICATE</p>
        
          <img src="../images/landingpage/citizenshipregistration/blackquestionmark.png"
                  id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofbirthcertificateinputfieldcolcontainer-blackquestionmarkimage"/>
              <br/>
          <input type="file" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel" 
                 className="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificateinputfield" 
                 onChange={(evt)=> {

                  const _backphotoofbirthcertificateimage = document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofbirthcertificateinputfieldcolcontainer-blackquestionmarkimage");
                  const _backphotoofbirthcertificatefile =  document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel");

                  _backphotoofbirthcertificateimage.src = URL.createObjectURL(_backphotoofbirthcertificatefile.files[0]);

               }}/>
          
          <label for="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel">
          Choose file
          </label>

        </Col>

        <Col xs={12}
            md={12}
            lg={12}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer">
          <h1 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer-headerindication"></h1>
        </Col>

        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofvalidgovernmentidinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidheaderindication">FRONT PHOTO OF BIRTH CERTIFICATE</p>
          <img src="../images/landingpage/citizenshipregistration/blackquestionmark.png"
                  id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofvalidgovernmentidinputfieldcolcontainer-blackquestionmarkimage"/>
              <br/>
          <input type="file" 
                  id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel"
                  className="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidinputfield" 
                  onChange={(evt)=> {

                    const _frontphotoofbirthcertificateimage = document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofvalidgovernmentidinputfieldcolcontainer-blackquestionmarkimage");
                    const _frontphotoofbirthcertificatefile =  document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel");

                    _frontphotoofbirthcertificateimage.src = URL.createObjectURL(_frontphotoofbirthcertificatefile.files[0]);

                 }}/>
          
          <label for="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel">
          Choose file
          </label>

        </Col>
        <Col xs={12}
            md={3}
            lg={3}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofvalidgovernmentidinputfieldcolcontainer">
          <p id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidheaderindication">BACK PHOTO OF THE SAME VALID GOVERMENT ID</p>
          <img src="../images/landingpage/citizenshipregistration/blackquestionmark.png"
                  id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofvalidgovernmentidinputfieldcolcontainer-blackquestionmarkimage"/>
              <br/>
          <input type="file" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidlabel" 
                 className="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidinputfield" 
                 onChange={(evt)=> {

                  const _backphotoofbirthcertificateimage = document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofvalidgovernmentidinputfieldcolcontainer-blackquestionmarkimage");
                  const _backphotoofbirthcertificatefile =  document.querySelector("#setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidlabel");

                  _backphotoofbirthcertificateimage.src = URL.createObjectURL(_backphotoofbirthcertificatefile.files[0]);

               }}/>
          
          <label for="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidlabel" 
                 id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidlabel">
          Choose file
          </label>

        </Col>
        <Col xs={12}
            md={12}
            lg={12}
            id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-submitbuttoncontainer">
          <button id="setupmfatipaccount-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-submitbuttoncontainer-submitbutton">SUBMIT</button>
        </Col>
    </Row>
   </Col>
 )
}