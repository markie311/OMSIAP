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

export default function LandingPage(props) {

 const url = "https://www.youtube.com/watch?v=LXb3EKWsInQ";

 return(
    <Col id="landingpage">
      <Col id="landingpage-view">
        <NavBar viewport={props.viewport}/>
        <WelcomeIntroduction />
        <RapportAdvertisement />
        <Services />
        <OMSIAPSVideo />
        <AwardsAndAchievements />
        <AmazingWork  />
        <PricingTable />
        <MeetOurProfessional />
        <Articles />
        <Map />
        <Footer />
      </Col>

      <VideoPlayer url={url}/>

      <Awards />

      <CitizenshipRegistration />
      
    </Col>
 )
}