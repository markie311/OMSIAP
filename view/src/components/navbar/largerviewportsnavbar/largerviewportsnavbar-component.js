import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown
       } from 'react-bootstrap';

import '../../../styles/navbar/largerviewportsnavbar/largerviewportsnavbar.scss';
import { propTypes } from 'react-bootstrap/esm/Image';

export default function LargerViewportsNavbar(props) {
 return(
   <Row id="largerviewportsnavbar">
     <Col xs={12}
          md={12}
          lg={5}
          id="largerviewportsnavbar-headerindicationscontainer">
        <Row  id="largerviewportsnavbar-headerindicationscontainer-rowcontainer">
          <Col xs={12}
               md={12}
               lg={5}
               id="largerviewportsnavbar-headerindicationscontainer-rowcontainer-omsiaplogocolcontainer">
          <img src='../images/navbar/navbar/goldenshield.jpg'
               id='largerviewportsnavbar-headerindicationscontainer-rowcontainer-omsiaplogo'/>
          </Col>
          <Col xs={12}
               md={12}
               lg={7}
               id="largerviewportsnavbar-headerindicationscontainer-rowcontainer-headerindicationscontainer">
             <h1 className='largerviewportsnavbar-headerindicationscontainer-rowcontainer-headerindication'>OMSIAP</h1>
             <p className="largerviewportsnavbar-headerindicationscontainer-rowcontainer-headerindication">Of Macky'S Ink And Paper</p>
          </Col>
        </Row>
     </Col>
     <Col xs={12}
          md={12}
          lg={7}
          id="largerviewportsnavbar-dropdownscontainer">
      <Row id="largerviewportsnavbar-dropdownscontainer-rowcontainer"> 

       <Col xs={12}
            md={12}
            lg={10}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
               MONTHLY FINANCIAL ALLOCATION TO INDIVIDUAL PEOPLE
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/monthlyfinanceallocationtoindividualpeople">WHAT IS MFATIP</Dropdown.Item>
                <Dropdown.Item href="/useraccount">MY MFATIP PROFILE ACCOUNT </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        
        <Col xs={12}
             md={12}
             lg={2}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>

            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                MARKET
            </Dropdown.Toggle>

            <Dropdown.Menu>
              
            <Dropdown.Item href="market">Market</Dropdown.Item>
         
            </Dropdown.Menu>
          </Dropdown>

        </Col>
        
        <Col xs={12}
             md={12}
             lg={2}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                HOPE
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/test">(H)onesties (O)n Constitutional (P)romises (E)valuation (H) (O) (P) (E)</Dropdown.Item>
               
            </Dropdown.Menu>
          </Dropdown>
        </Col>
   
        {
          props.user.loginstatus === "logged in"
          ? 
          (
            <Col xs={12}
                 md={12}
                 lg={4}
                 className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
             <Dropdown>
               <Dropdown.Toggle variant="dark" id="dropdown-basic">
                 Log out
               </Dropdown.Toggle>

               <Dropdown.Menu>
                  <Dropdown.Item href="/mfatip/loginregister">LOG OUT MFATIP PROFILE ACCOUNT</Dropdown.Item>
                
               </Dropdown.Menu>
             </Dropdown>
           </Col>
          )
          :
          (
            <Col xs={12}
                 md={12}
                 lg={4}
                 className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
             <Dropdown>
               <Dropdown.Toggle variant="dark" id="dropdown-basic">
                 Lon in / Register
               </Dropdown.Toggle>

               <Dropdown.Menu>
                   <Dropdown.Item href="/mfatip/loginregister">MFATIP LOGIN / MFATIP REGISTER PAGE</Dropdown.Item>
                  
               </Dropdown.Menu>
             </Dropdown>
           </Col>
          )
        }
        
       
      </Row>
     </Col>
   </Row>
 )
}