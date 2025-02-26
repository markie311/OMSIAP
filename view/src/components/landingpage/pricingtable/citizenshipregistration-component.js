
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

    <CitizenshipRegistrationType user={props.user}
                                 usercb={props.usercb}  
                                  
                                  
                                  
                                 citizenshipregistrationtype={props.citizenshipregistrationtype}
                                 citizenshipregistrationtypecb={props.citizenshipregistrationtypecb}/>

   
  </Col>
)
}

function CitizenshipRegistrationType(props) {

if ( props.citizenshipregistrationtype === "MFATIP") {
  return (
    <Col id="citizenshipregistration-citizenshipregistrationtypeviewcontainer">
       <MFATIPRegistrationForm />
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
          <button id="citizenshipregistration-citizenshipregistrationtypeviewcontainer-privatecitizenshippaymentbuttoncontainer-publiccitizenshippaymentbutton">Pay &#8369; 300.00</button>
        </Col>
      </Col>
    )
 }

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
