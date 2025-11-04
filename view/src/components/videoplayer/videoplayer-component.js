import React, {
    useState,
    useEffect
  } from 'react';

import { Col } from 'react-bootstrap';

import ReactPlayer from 'react-player/youtube';

import '../../styles/videoplayer/videoplayer.scss';

export default function VideoPlayer(props) {
    if ( props.url === '') {
        return (
          <Col  id='videoplayer'>
            <h5 id='videoplayer-novideoheaderindication'>No video</h5>
          </Col>
        )
    } 
     else {
        return (
          <Col id='videoplayer'>
            {/*
            <Col id="videoplayer-closebuttoncontainer">
              <p id="videoplayer-closebuttoncontainer-closebuttonheaderindication"
                 onClick={()=> {
                   const _videoplayer = document.querySelector("#videoplayer");
                   alert("Synced")
                   _videoplayer.style.display = "none";
                 }}>x</p>
            </Col>
             */}
            <Col id="videoplayer-videocontainer">
              <ReactPlayer url={props.url}
                           height='90%'
                           width='90%'/>
            </Col>
           </Col>
        )
   
    }
      

}