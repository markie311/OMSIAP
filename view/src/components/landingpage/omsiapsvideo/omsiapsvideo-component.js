import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col } from 'react-bootstrap';

import '../../../styles/landingpage/omsiapsvideo/omsiapsvideo.scss';

export default function OMSIAPSVideo() {
 return (
  <Col id="omsiapsvideo">
    <Col id="omsiapsvideo-backgroundimagecontainer">
     <img src="../images/landingpage/omsiapsvideo/laptopandcoffee.jpg"
          id="omsiapsvideo-backgroundimagecontainer-backgroundimage"/>
    </Col>
    <Col id="omsiapsvideo-playbuttoncontainer">
     <button id="omsiapsvideo-playbuttoncontainer-playbutton"
             onClick={()=> {
              const _videoplayer = document.querySelector("#videoplayer");
                   _videoplayer.style.display = "block";
             }}>PLAY</button>
    </Col>
  </Col>
 )
}