import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col,
         Spinner } from 'react-bootstrap';

import '../../../styles/landingpage/pricingtable/citizenshipregistration.scss';

export default function CitizenshipRegistration(props) {

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

      <CitizenshipRegistrationType citizenshipregistrationtype={props.citizenshipregistrationtype}
                                   citizenshipregistrationtypecb={props.citizenshipregistrationtypecb}/>

     
    </Col>
 )
}

function CitizenshipRegistrationType(props) {

  if ( props.citizenshipregistrationtype === "MFATIP") {
    return (
      <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer">
        <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipheaderindicationscontainer">
          <p className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipheaderindicationscontainer-headerindication">Registering an MFATIP or (M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople Requirements</p>
          <br/>
          <p className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipheaderindicationscontainer-headerindication">By registreting to have  a MFATIP (M)ontlhy (Financial) (A)llocation (T)o (I)ndividual (P)eople profile with OMSIAP, OMSIAP will give financial allocation to your MFATIP profile or account each month that you can also withdraw monthly the reason why you must follow the strict procudere's written below.</p>
          <br />
          <ul className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipheaderindicationscontainer-headerindication">
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
        <Row id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer">
          <Col xs={12}
               md={12}
               lg={12}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer">
            <h1 id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer-headerindication">PERSONAL DETAILS</h1>
          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameheaderindication">Full name</p>
            <input id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnameinputfield" type="text"/>
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-fullnameinputfieldcolcontainer-fullnamereminder">Make sure to write your full name the same in your Gcash account</p>
          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer-phonenumberheaderindication">Phone number</p>
            <input id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer-phonenumberinputfield" type="number"/>
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-phonenumberinputfieldcolcontainer-phonenumberreminder">Make sure to write your phone number the same in your Gcash account number</p>
          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer-dobheaderindication">Date Of Birth ( DOB )</p>
            <input id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer-dobinputfield" type="date"/>
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-dobinputfieldcolcontainer-dobreminder">Make sure to write your full name the same in your Gcash account</p>
          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusheaderindication">Civil status</p>
            <label for="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusselect" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusselectlabel">Choose a civil status:</label>
             <select id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-civilstatusinputfieldcolcontainer-civilstatusselect">
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
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer">
            <h1 id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer-headerindication">NEEDED DOCUMENTS</h1>
          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofbirthcertificateinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificateheaderindication">FRONT PHOTO OF BIRTH CERTIFICATE</p>
           
            <input type="file" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel" className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificateinputfield" aria-label="File browser example"/>
            
            <label for="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofbirthcertificateinputfieldcolcontainer-frontphotoofbirthcertificatelabel">
             Choose file
            </label>

          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofbirthcertificateinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificateheaderindication">BACK PHOTO OF BIRTH CERTIFICATE</p>
           
            <input type="file" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel" className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificateinputfield" aria-label="File browser example"/>
            
            <label for="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel">
             Choose file
            </label>

          </Col>

          <Col xs={12}
               md={12}
               lg={12}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer">
            <h1 id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-headerindicationscontainer-headerindication"></h1>
          </Col>

          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotoofvalidgovernmentidinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidheaderindication">FRONT PHOTO OF BIRTH CERTIFICATE</p>
           
            <input type="file" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel" className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidinputfield" aria-label="File browser example"/>
            
            <label for="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-frontphotofvalidgovernmentidinputfieldcolcontainer-frontphotoofvalidgovernmentidlabel">
             Choose file
            </label>

          </Col>
          <Col xs={12}
               md={3}
               lg={3}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotoofvalidgovernmentidinputfieldcolcontainer">
            <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidheaderindication">BACK PHOTO OF THE SAME VALID GOVERMENT ID</p>
           
            <input type="file" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidlabel" className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidinputfield" aria-label="File browser example"/>
            
            <label for="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofbirthcertificateinputfieldcolcontainer-backphotoofbirthcertificatelabel" id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-backphotofvalidgovernmentidinputfieldcolcontainer-backphotoofvalidgovernmentidlabel">
             Choose file
            </label>

          </Col>
          <Col xs={12}
               md={12}
               lg={12}
               id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-submitbuttoncontainer">
            <button id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-mfatipcitizenshipregistrationpersonaldetailscontainer-submitbuttoncontainer-submitbutton">SUBMIT</button>
          </Col>
        </Row>
       </Col>
     )
  }

  if ( props.citizenshipregistrationtype === "Public citizenship" ) {
    return (
      <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer">
         <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-publiccitizenshipregistrationheaderindicationscontainer">
           <p className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-publiccitizenshipregistrationheaderindicationscontainer">Paying for a public citizenship requirements</p>
           <ul className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-publiccitizenshipregistrationheaderindicationscontainer">
            <li>All payments must be made in the official OMSIAPAWASTO currency</li>
            <li>Citizens must maintain an active MFATIP account profile (M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople profile for processing payments because payment verification is tracked through individual MFATIP profiles</li>
           </ul>
         </Col>
         <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-publiccitizenshippaymentbuttoncontainer">
           <button id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-publiccitizenshippaymentbuttoncontainer-publiccitizenshippaymentbutton">Pay &#8369; 150.00</button>
         </Col>
       </Col>
     )
  }

  if ( props.citizenshipregistrationtype === "Private citizenship" ) {
    return (
      <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer">
         <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-privatecitizebshipregistrationheaderindicationscontainer">
           <p id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-privatecitizebshipregistrationheaderindicationscontainer-headerindication">Paying for a private citizenship requirements</p>
           <ul className="citizenshipregistration-citizenshipregistrationtypeviewcontainer-privatecitizebshipregistrationheaderindicationscontainer-headerindication">
            <li>All payments must be made in the official OMSIAPAWASTO currency</li>
            <li>Citizens must maintain an active MFATIP account profile (M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople profile for processing payments because payment verification is tracked through individual MFATIP profiles</li>
           </ul>
         </Col>
         <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-privatecitizenshippaymentbuttoncontainer">
           <button id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-privatecitizenshippaymentbuttoncontainer-publiccitizenshippaymentbutton">Pay &#8369; 150.00</button>
         </Col>
       </Col>
     )
  }

}