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
           md={5}
           lg={5}
           id="mfatipheaderrowcontariner-headerindicationscontainer">
        <h4 className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">Building Your Path to Personal Success</h4>
        <br/>
        <h1 className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">(M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople: MFATIP</h1>
        <br/>
        <br/>
        <p className="mfatipheaderrowcontariner-headerindicationscontainer-headerindication">Accelerate your personal growth by receiving monthly financial allocations through your MFATIP profile. Our team will be present to support your success. We pride ourselves on providing excellent service to individuals, ensuring a positive experience for everyone.</p>
      </Col>
      <Col xs={12}
           md={7}
           lg={7}
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
     <MFATIPRegistrationForm />
     
   </Col>
 )
}


function MFATIPRegistrationForm() { 
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    civilStatus: '',
    birthCertificateFront: null,
    birthCertificateBack: null,
    governmentIdFront: null,
    governmentIdBack: null
  });

  // State for image previews
  const [previews, setPreviews] = useState({
    birthCertificateFront: null,
    birthCertificateBack: null,
    governmentIdFront: null,
    governmentIdBack: null
  });

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      // Update form data with file
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews({
          ...previews,
          [name]: event.target.result
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="registration-container">
      <h2>Registration Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="civilStatus">Civil Status</label>
              <select
                id="civilStatus"
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Document Uploads</h3>
          
          <div className="document-row">
            <div className="document-group">
              <h4>Birth Certificate</h4>
              
              <div className="document-uploads">
                <div className="upload-item">
                  <label htmlFor="birthCertificateFront">
                    <div className="upload-label">Front Side</div>
                    <div className={`upload-preview ${previews.birthCertificateFront ? 'has-image' : ''}`}>
                      {previews.birthCertificateFront ? (
                        <img src={previews.birthCertificateFront} alt="Birth Certificate Front" />
                      ) : (
                        <div className="upload-placeholder">Click to upload</div>
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    id="birthCertificateFront"
                    name="birthCertificateFront"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    hidden
                  />
                </div>
                
                <div className="upload-item">
                  <label htmlFor="birthCertificateBack">
                    <div className="upload-label">Back Side</div>
                    <div className={`upload-preview ${previews.birthCertificateBack ? 'has-image' : ''}`}>
                      {previews.birthCertificateBack ? (
                        <img src={previews.birthCertificateBack} alt="Birth Certificate Back" />
                      ) : (
                        <div className="upload-placeholder">Click to upload</div>
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    id="birthCertificateBack"
                    name="birthCertificateBack"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="document-row">
            <div className="document-group">
              <h4>Government ID</h4>
              
              <div className="document-uploads">
                <div className="upload-item">
                  <label htmlFor="governmentIdFront">
                    <div className="upload-label">Front Side</div>
                    <div className={`upload-preview ${previews.governmentIdFront ? 'has-image' : ''}`}>
                      {previews.governmentIdFront ? (
                        <img src={previews.governmentIdFront} alt="Government ID Front" />
                      ) : (
                        <div className="upload-placeholder">Click to upload</div>
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    id="governmentIdFront"
                    name="governmentIdFront"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    hidden
                  />
                </div>
                
                <div className="upload-item">
                  <label htmlFor="governmentIdBack">
                    <div className="upload-label">Back Side</div>
                    <div className={`upload-preview ${previews.governmentIdBack ? 'has-image' : ''}`}>
                      {previews.governmentIdBack ? (
                        <img src={previews.governmentIdBack} alt="Government ID Back" />
                      ) : (
                        <div className="upload-placeholder">Click to upload</div>
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    id="governmentIdBack"
                    name="governmentIdBack"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="reset" className="btn-secondary">Reset</button>
          <button type="submit" className="btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};
