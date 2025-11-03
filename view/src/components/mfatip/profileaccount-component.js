import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown
       } from 'react-bootstrap';

import { useLocation,
useNavigate
} from 'react-router-dom';

import '../../styles/mfatip/profileaccount.scss';



export default function MFATIPProfileAccount() {

   const location = useLocation();
   const navigate = useNavigate();

 return (
   <Col id="mfatipprofileaccount">
     <Col id="mfatipprofileaccount-mainviewcontainer">

       <Row id="mfatipprofileaccount-navigationcontainer">
        <Col xs={2}
             md={3}
             lg={3}
             className="mfatipprofileaccount-navigationcontainer-navigationcolcontainer">
         <p className="mfatipprofileaccount-navigationcontainer-navigationcolcontainer-navigationheaderindication"
            onClick={()=> {
              navigate("/")
            }}>Home /</p>
        </Col>
       </Row>

       <Row id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer">
         <Col xs={3}
              md={3}
              lg={3}
              id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-profilepicturecontainer">
          <Col id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-profilepicturecontainer-profilepicturecontainer">
            <img src="../images/mfatip/tuxedo.jpg"
                 id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-profilepicturecontainer-profilepicturecontainer-profilepicture"/>
          </Col>
          <Col id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-profilepicturecontainer-editprofilepicturecontainer">
             <button id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-profilepicturecontainer-editprofilepicturecontainer-editprofilepicturebutton">Edit profile picture</button>
          </Col>
         </Col>
         <Col xs={9}
              md={9}
              lg={9}
              id="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-fullnameheaderindicationcontainer">
           <h1 className="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-fullnameheaderindicationcontainer-headerindication">Firstname, Middle name, Last name</h1>
           <p className="mfatipprofileaccount-profilepictureandfullnameheaderindicationcontainer-fullnameheaderindicationcontainer-headerindication">MFATIP PROFILE ACCOUNT</p>
         </Col>
       </Row>


       <Row id="mfatipprofileaccount-profileaccountdetailscontainer">
         <Col xs={12}
              md={4}
              lg={4}
              id="mfatipprofileaccount-profileaccountdetailscontainer-statusescontainer">
           <Col id="mfatipprofileaccount-profileaccountdetailscontainer-statusescontainer-primarystatuscontainer">
            <h5 id="mfatipprofileaccount-profileaccountdetailscontainer-statusescontainer-primarystatuscontainer-headerindication">Primary status: <span id="mfatipprofileaccount-profileaccountdetailscontainer-statusescontainer-primarystatuscontainer-statusheaderindication">Unregistered</span></h5>
           </Col>
           <p className="mfatipprofileaccount-profileaccountdetailscontainer-headerindication">Name</p>
            <ul className="mfatipprofileaccount-profileaccountdetailscontainer-headerindication">
                <li>First name: First name </li>
                <li>Middle name: Middle name</li>
                <li>Last name: Last name</li>
            </ul>
            <p className="mfatipprofileaccount-profileaccountdetailscontainer-headerindication">Contact details</p>
            <ul className="mfatipprofileaccount-profileaccountdetailscontainer-headerindication">
                <li>Phone number: 000-000-000-00-0 </li>
                <li>Telephone number: 000-000-000-00-0</li>
                <li>Emaill address: emailadress@gmail.com</li>
            </ul>
            <p className="mfatipprofileaccount-profileaccountdetailscontainer-headerindication">(D)ate (o)f (Birth): ??-??-????</p>
            <p className="mfatipprofileaccount-profileaccountdetailscontainer-headerindication">Civil status: Single</p>
         </Col>
         <Col xs={12}
              md={8}
              lg={8}
              id="mfatipprofileaccount-profileaccountdetailscontainer-personaldetailscontainer">
            <Col className="mfatipprofileaccount-profileaccountdetailscontainer-personaldetailscontainer-detailscontainer">
              <h1 className="mfatipprofileaccount-profileaccountdetailscontainer-personaldetailscontainer-detailscontainer-headerindication">Currency</h1>
            </Col>
         </Col>
       </Row>

     </Col>
   </Col>
 )
}