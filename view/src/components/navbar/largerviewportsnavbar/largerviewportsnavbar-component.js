import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col,
         Dropdown
       } from 'react-bootstrap';

import '../../../styles/navbar/largerviewportsnavbar/largerviewportsnavbar.scss';

export default function LargerViewportsNavbar() {
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
             lg={2}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>

            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                OMSIAP
            </Dropdown.Toggle>

            <Dropdown.Menu>
              
            <Dropdown.Item href="useraccount">MY ACCOUNT</Dropdown.Item>
         
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
        <Col xs={12}
             md={12}
             lg={3}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                FOR YOUR PERSONAL-GROWTH
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/monthlyfinanceallocationtoindividualpeople">ABOUT: ( M )onthly ( F )inance ( A )llocation ( T )o  ( I )ndividual ( P )eople</Dropdown.Item>
                <Dropdown.Item href="/useraccount">PROFILE ACCOUNT: ( M )onthly ( F )inance ( A )llocation ( T )o  ( I )ndividual ( P )eople </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12}
             md={12}
             lg={3}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                FOR YOUR BUSINESS
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/test">(H)onesties (O)n Constitutional (P)romises (E)valuation (H) (O) (P) (E)</Dropdown.Item>
               
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12}
             md={12}
             lg={2}
             className="largerviewportsnavbar-dropdownscontainer-rowcontainer-colcontainer">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                SERVICES
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/test">(H)onesties (O)n Constitutional (P)romises (E)valuation (H) (O) (P) (E)</Dropdown.Item>
               
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
     </Col>
   </Row>
 )
}