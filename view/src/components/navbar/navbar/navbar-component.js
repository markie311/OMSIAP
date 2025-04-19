import React, {
    useState,
    useEffect
  } from 'react';

import { Row, 
         Col } from 'react-bootstrap';
         
import '../../../styles/navbar/navbar/navbar.scss';

import SmallerViewportsNavbar from '../smallerviewportsnavbar/smallerviewportsnavbar-component.js';
import LargerViewportsNavbar from '../largerviewportsnavbar/largerviewportsnavbar-component.js';

export default function NavBar(props) {
 return (
    <LargerViewportsNavbar user={props.user}
                           usercb={props.usercb}/>
   
 )
}