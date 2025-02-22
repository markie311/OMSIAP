import React, {
useState,
useEffect
} from 'react';

import { Row,
Col,
Accordion } from 'react-bootstrap';

import '../../../styles/landingpage/pricingtable/pricingtable.scss';


export default function PricingTable(props) {
 return (
  <Row id="pricingtable">
    <Col xs={12}
         md={6}
         lg={6}
         id="pricingtable-headerindicationscontainer">
      <Col id="pricingtable-headerindicationscontainer-headerindicationscontainer">
        <h3 className="pricingtable-headerindicationscontainer-headerindicationscontainer-headerindication">Pricing table</h3>
        <h1 className="pricingtable-headerindicationscontainer-headerindicationscontainer-headerindication">Something to ask about OMSIAP CITIZENSHIP</h1>
      </Col>
      <Col id="pricingtable-headerindicationscontainer-accordionscontainer">
        <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
            <Accordion.Header><p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">What is OMSIAP CITIZENSHIP?</p></Accordion.Header>
            <Accordion.Body>

              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
               OMSIAP Citizenship Categories, OMSIAP offers three distinct citizenship categories, each with unique benefits and requirements:
              </p>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                1. MFATIP (Monthly Financial Allocation To Individual People)
              </p>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
               MFATIP citizenship is designed to support personal growth through monthly financial allocations. Key features:
              </p>
              <ul>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                 One-time lifetime registration with no recurring fees
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Monthly funds distributed from OMSIAP's revenue based on set percentages
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                No registration or monthly payments required
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Free monthly financial allocation program
                </li>
              </ul>

              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
               2. Public Citizenship
              </p>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
               This category operates on a monthly membership basis:
              </p>
              <ul>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                 Monthly membership fee: 150 pesos
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                 Treated as a tax contribution to OMSIAP
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Members receive guaranteed monthly funds calculated from OMSIAP's revenue
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Benefits distributed through public sharing system
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Membership duration: 1 month, renewable
                </li>
              </ul>

              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">Private Citizenship</p>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">Similar to public citizenship but with enhanced benefits:</p>
              <ul>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                 Quarterly membership fee: 300 pesos (valid for 3 months)
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Treated as a tax contribution to OMSIAP
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Higher monthly financial allocations compared to public citizenship
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Funds distributed exclusively among private OMSIAP citizens
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Benefits shared through private distribution channels
                </li>

              </ul>
            
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
            <Accordion.Header><p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication"></p>Do I need to pay to be an OMSIAP citizen?</Accordion.Header>
            <Accordion.Body>
               <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">Payments are only required when acquiring public or private citizenship. However, on OMSIAP, you automatically become a citizen through the Monthly Financial Allocation to Individual People (MFATIP) program, which provides monthly financial distributions. To participate, you must first complete a one-time, free registration that remains valid for life.</p>
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
            <Accordion.Header><p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">What is OMSIAP's operational area and scope of activities?</p></Accordion.Header>
            <Accordion.Body>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">It depends on the activity. There are certain activities that can only be done through OMSIAP offices located in designated areas. However, contacting OMSIAP is possible globally since we use email technology. OMSIAP also offers services that can operate globally, such as marketing, infrastructure projects, and web development.</p>
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
            <Accordion.Header><p>Payment Methods, Membership or Citizenship Terms for OMSIAP</p></Accordion.Header>
            <Accordion.Body>
               <p>Payment Options:</p>
               <p>1. Online Payments</p>
               <ul>
                <li>Integrated digital payment platforms (e.g. Gcash, OMSIAPS payment system using OMSIAPS own currency)</li>
               </ul>
               <p>2. Physical Payments</p>
               <ul>
                <li>In-person transactions at OMSIAP offices</li>
               </ul>
               <p>Membership Categories and Duration:</p>
               <p>1. Private Citizenship</p>
               <ul>
                <li>Integrated digital payment platforms (e.g. Gcash, OMSIAPS payment system using OMSIAPS own currency)</li>
               </ul>
               <p>2. Public Citizenship</p>
               <ul>
                <li>Tax/membership period: 1-month term</li>
                <li>Includes lifetime enrollment in MFATIP (Monthly Financial Allocation To Individual People)</li>
                <li>Beneficiaries receive monthly financial allocations</li>
               </ul>
               <p>Transaction Processing:</p>
               <ul>
                <li>Automated processing through AI systems</li>
                <li>Manual processing available at OMSIAP offices</li>
                <li>MFATIP disbursements are managed automatically for enrolled members</li>
               </ul>
               <p>Note: The Monthly Financial Allocation To Individual People (MFATIP) program provides continuous financial benefits to qualifying public citizenship holders for their lifetime."</p>
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
            <Accordion.Header><p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">What are currencies used?</p></Accordion.Header>
            <Accordion.Body>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">Accepted Curriencies in OMSIAP</p>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">1. OMSIAPAWASTO (Of Macky'S Ink And Paper And Wood And Stone Currency)</p>
              <ul>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                 This is OMSIAP's native currency
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                 Functions as the organization's official internal currency
                </li>
              </ul>
              <p>2. Philippine Peso (PHP)</p>
              <ul>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                  Widely used for transactions
                </li>
                <li className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">
                Can be converted from OMSIAPAWASTO
                </li>
              </ul>
              <p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">All transactions made using OMSIAPAWASTO are automatically processed through payment platforms that utilize digital payment integration, such as GCash. This ensures secure and convenient transactions for users.</p>
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
            <Accordion.Header><p className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">Securement</p></Accordion.Header>
            <Accordion.Body>
                <p  className="pricingtable-headerindicationscontainer-accordionscontainer-headerindication">Join OMSIAP's creative community as a citizen and unlock your potential for personal growth! Whether you choose to use OMSIAPAWASTO through OMSIAP's integrated payment system or Philippine Peso via GCash, becoming a citizen connects you with fellow members and gives you access to our unique platform. Our secure payment options make the process seamless, so you can focus on what matters most - developing yourself and being part of our growing community."</p>
            </Accordion.Body>
        </Accordion.Item>
        </Accordion>
      </Col>
    </Col>
    <Col xs={12}
         md={6}
         lg={6}
         id="pricingtable-pricingtablecontainer">

     <Row className="pricingtable-pricingtablecontainer-rowcontainer">
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-checkboxcontainer">
          <p className="pricingtable-pricingtablecontainer-rowcontainer-checkboxcontainer-checkboxheaderindication"
             onClick={()=> {
               props.citizenshipregistrationtypecb((citizenshipregistrationtype)=> citizenshipregistrationtype = "MFATIP");
               const _citizenshipregistration = document.querySelector("#citizenshipregistration");
               _citizenshipregistration.style.display = "block";
             }}>&#10004;</p>
        </Col>
        <Col xs={6}
             md={6}
             lg={6}
             className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer">
            <p className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">(M)ontly (F)inancial (A)llocation (T)o (I)ndividual (P)eople or MFATIP</p>
            <h3 className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Free / Life time registration</h3>
            <p className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Start your journey to financial growth with OMSIAP. Register for free today and receive monthly financial allocations with your lifetime membership.</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-pricingcontainer">
           <p className="pricingtable-pricingtablecontainer-rowcontainer-pricingcontainer-headerindication">&#8369; 0.00</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-bestvaluecontainer">
          <p className="pricingtable-pricingtablecontainer-rowcontainer-bestvaluecontainer-bestvalueindication">Best Value</p>
        </Col>
     </Row>

     <Row className="pricingtable-pricingtablecontainer-rowcontainer">
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-checkboxcontainer">
          <p className="pricingtable-pricingtablecontainer-rowcontainer-checkboxcontainer-checkboxheaderindication"
             onClick={()=> {
              props.citizenshipregistrationtypecb((citizenshipregistrationtype)=> citizenshipregistrationtype = "Public citizenship");
              const _citizenshipregistration = document.querySelector("#citizenshipregistration");
              _citizenshipregistration.style.display = "block"
            }}>&#10004;</p>
        </Col>
        <Col xs={6}
             md={6}
             lg={6}
             className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer">
            <p className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Public citizenship</p>
            <h3 className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Monthly expiration</h3>
            <p className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Maximize your financial growth potential with OMSIAP. Receive higher percentage-based monthly allocations!</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-pricingcontainer">
           <p className="pricingtable-pricingtablecontainer-rowcontainer-pricingcontainer-headerindication">&#8369; 150.00</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-bestvaluecontainer">
          <p className="pricingtable-pricingtablecontainer-rowcontainer-bestvaluecontainer-bestvalueindication">Best Value</p>
        </Col>
     </Row>

     <Row className="pricingtable-pricingtablecontainer-rowcontainer">
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-checkboxcontainer">
          <p className="pricingtable-pricingtablecontainer-rowcontainer-checkboxcontainer-checkboxheaderindication"
             onClick={()=> {
              props.citizenshipregistrationtypecb((citizenshipregistrationtype)=> citizenshipregistrationtype = "Private citizenship");
              const _citizenshipregistration = document.querySelector("#citizenshipregistration");
              _citizenshipregistration.style.display = "block"
             }}>&#10004;</p>
        </Col>
        <Col xs={6}
             md={6}
             lg={6}
             className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer">
            <p className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Private citizenship</p>
            <h3 className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Every three months expiration</h3>
            <p className="pricingtable-pricingtablecontainer-rowcontainer-headerindicationscontainer-headerindication">Maximize your financial growth potential with OMSIAP. Receive higher percentage-based monthly allocations!</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-pricingcontainer">
           <p className="pricingtable-pricingtablecontainer-rowcontainer-pricingcontainer-headerindication">&#8369; 300.00</p>
        </Col>
        <Col xs={2}
             md={2}
             lg={2}
             className="pricingtable-pricingtablecontainer-rowcontainer-bestvaluecontainer">
          <p className="pricingtable-pricingtablecontainer-rowcontainer-bestvaluecontainer-bestvalueindication">Best Value</p>
        </Col>
     </Row>

    </Col>
  </Row>
 )
}