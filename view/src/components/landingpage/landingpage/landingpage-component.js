import React, {
    useState,
    useEffect
  } from 'react';

import { Col } from 'react-bootstrap';

import '../../../styles/landingpage/landingpage.scss';

import NavBar from '../../navbar/navbar/navbar-component.js';
import WelcomeIntroduction from '../welcomeintroduction/welcomeintroduction-component.js';
import RapportAdvertisement from '../rapportadvertisement/rapportadvertisement-component.js';
import Services from '../services/services-component.js';
import OMSIAPSVideo from '../omsiapsvideo/omsiapsvideo-component.js';
import AwardsAndAchievements from '../awardsandachievements/awardsandachievements-component.js';
import AmazingWork from '../amazingwork/amazingwork-component.js';
import PricingTable from '../pricingtable/pricingtable-component.js';
import MeetOurProfessional from '../meetourprofessional/meetourprofessional-component.js';
import Articles from '../articles/articles-component.js';
import Map from '../map/map-component.js';
import Footer from '../footer/footer-component.js';
import VideoPlayer from '../../videoplayer/videoplayer-component.js'
import Awards from '../../awards/awards-component.js'
import CitizenshipRegistration from '../../landingpage/pricingtable/citizenshipregistration-component.js'
import PrivacyPolicy from '../../privacypolicy/privacypolicy-component.js'
import UserAccount from '../../useraccount/useraccount-component.js'
import LoadingIndicator from '../../loadingindicator/loadingindicator-component.js'
import RegistrationPage from '../../registrationpage/registrationpage-component.js'


export default function LandingPage(props) {

 const url = "https://www.youtube.com/watch?v=LXb3EKWsInQ";

 const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(true);

 const handleLogout = () => {
  // Add your logout logic here
  console.log('User logged out');
  setIsLogoutModalOpen(false);
  // Redirect to login page or perform other logout actions
};

 return(
    <Col id="landingpage">
      
      <Col id="landingpage-view">
        <NavBar viewport={props.viewport}
                user={props.user}
                usercb={props.usercb}/>
        <WelcomeIntroduction />
        <RapportAdvertisement />
        <Services />
        <OMSIAPSVideo />
        <AwardsAndAchievements />
        <AmazingWork  />
        <PricingTable  user={props.user}
                       citizenshipregistrationtype={props.citizenshipregistrationtype}
                       citizenshipregistrationtypecb={props.citizenshipregistrationtypecb}/>
        <MeetOurProfessional />
        <Articles articles={props.articles}/>
        <Map />
        <Footer />
      </Col>

      <Awards />

      <CitizenshipRegistration  user={props.user}
                                usercb={props.usercb} 
                                
                                
                                citizenshipregistrationtype={props.citizenshipregistrationtype}
                                citizenshipregistrationtypecb={props.citizenshipregistrationtypecb}/>

      <LoadingIndicator loadingindicatormodal={props.loadingindicatormodal}
                        loadingindicatormodalcb={props.loadingindicatormodalcb}
                        
                        userdashboardmodal={props.userdashboardmodal}
                        userdashboardmodalcb={props.userdashboardmodalcb}/>
      
    </Col>
 )
}