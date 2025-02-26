import React, {
  useState,
  useEffect
} from 'react';

import { Routes, 
         Route
       } from 'react-router-dom';

import { Container } from 'react-bootstrap';

import './styles/omsiapcore/omsiapcore.scss';

import LandingPage from './components/landingpage/landingpage/landingpage-component.js';
import HOPE from './components/hope/hope-component.js';
import Market from './components/market/market-component.js';
import MonthlyFinanceAllocationToIndividualPeople from './components/mfatip/mfatip-component.js';
import Cart from './components/cart/cart-component.js';
import ServiceDetails from './components/landingpage/services/servicedetails-component.js';
import ReadMoreAboutArticles from './components/landingpage/articles/readmoreaboutarticles-component.js'
import MFATIPProfileAccount from './components/mfatip/profileaccount-component.js'

function OMSIAPCore() {

  const [viewport, viewportcb] = useState('xs');

  const $xsviewport= window.matchMedia('(max-width: 600px)');
  const $mdviewport = window.matchMedia('(min-width: 992px)'); 
  const $lgviewport = window.matchMedia('(min-width: 1200px)');

  const $viewportscreenbreakpoints = {
    xsviewportscreenbreakpoint: async () => {
      $xsviewport.addListener($viewportscreenbreakpoints.xsviewportscreenbreakpoint);
      if ($xsviewport.matches) {
        viewportcb((viewport)=> viewport = 'xs')
      }
    },
    mdviewportscreenbreakpoint: async () => {
      $mdviewport.addListener($viewportscreenbreakpoints.mdviewportscreenbreakpoint);
      if ($mdviewport.mathces) {
        viewportcb((viewport)=> viewport = 'md')
      }
    },
    lgviewportscreenbreakpoint: async () => {
      $lgviewport.addListener($viewportscreenbreakpoints.lgviewportscreenbreakpoint);
      if ($lgviewport.matches) {
        viewportcb((viewport)=> viewport = 'lg')
      }
    }
  } 

  const [citizenshipregistrationtype, citizenshipregistrationtypecb] = useState("MFATIP");

  //// user data 
  const [user, usercb] = useState({ 
    id: "",
    name: {
      firstname: "",
      middlename: "",
      lastname: "",
      nickname: ""
    },
    contact: {
      phonenumber: "",
      telephonenumber: "",
      emailaddress: "",
      address: {
        street: "",
        baranggay: "",
        trademark: "",
        city: "",
        province: "",
        country: ''
      }
    },
    personalinformation: {
      age: 0,
      sex: "",
      bloodtype: "",
      dob: "",
      citizenship: "",
      civil_status: "",
      government_issued_identification: "" 
    },
    credits: {
      omsiapawasto: {
        id: "",
        amount: 0,
        transactions: {
          deposit: [],
          widthdrawal: [],
          successful_deposits: [],
          successful_widthdrawals: []
        }
      }
    },
    order: {
      name: {
        firstname: "",
        middlename: "",
        lastname: ""
      },
      shippingdetails: {
        street: "",
        baranggay: "",
        city: "",
        province: "",
        country: "",
        postal_zipcode: ""
      },
      paymentdetails: {
        merchandise_total: 0,
        merchandise_total_weight: 0,
        merchandise_count: 0,
        total_payment: 0,
        totalshipment: 0,
      }
    }
  });
  /// user data

  useEffect(()=> {

    $viewportscreenbreakpoints.xsviewportscreenbreakpoint();
    $viewportscreenbreakpoints.mdviewportscreenbreakpoint();
    $viewportscreenbreakpoints.lgviewportscreenbreakpoint();

 }, []);

  return (
    <Container fluid  
               id="omsiapcore">
     <Routes>
        <Route path='/'
               element={<LandingPage viewport={viewport}
               
                                     user={user}
                                     usercb={usercb}

                                     citizenshipregistrationtype={citizenshipregistrationtype}
                                     citizenshipregistrationtypecb={citizenshipregistrationtypecb}

                                     />}>
        </Route>
        <Route path='/test'
               element={<HOPE viewport={viewport}
                              citizenshipregistrationtype={citizenshipregistrationtype}
                              citizenshipregistrationtypecb={citizenshipregistrationtypecb}/>}>
        </Route>
        <Route path='/market'
               element={<Market viewport={viewport}/>}>
        </Route>
        <Route path='/monthlyfinanceallocationtoindividualpeople'
               element={<MonthlyFinanceAllocationToIndividualPeople viewport={viewport}
                                                                    user={user}
                                                                    usercb={usercb}/>}>
        </Route>
        <Route path='/cart'
               element={<Cart />}>
        </Route>
        <Route path='/servicedetails'
               element={<ServiceDetails />}>
        </Route>
        <Route path='/readmoreaboutarticles'
               element={<ReadMoreAboutArticles viewport={viewport}/>}>
        </Route>

        <Route path='/mfatipprofileaccount'
               element={<MFATIPProfileAccount viewport={viewport}/>}>
        </Route>

     </Routes>
    </Container>
  );
}

export default OMSIAPCore;
