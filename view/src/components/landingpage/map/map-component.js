import React, {
    useState,
    useEffect
  } from 'react';

import { Row,
         Col,
         Accordion } from 'react-bootstrap';

import '../../../styles/landingpage/map/map.scss';

import L from 'leaflet';

import { MapContainer, 
         TileLayer,
         useMap,
         useMapEvents,
         Marker,
         Popup } from 'react-leaflet';

 import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';





export default function Map() {

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow  
  });

   L.Marker.prototype.options.icon = DefaultIcon;
   const position = [51.505, -0.09]

 return (
  <Col id="map">
     <MapContainer id="mapcontainer" center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        </MapContainer>
  </Col>
 )
}