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
               element={<LandingPage viewport={viewport}/>}>
        </Route>
        <Route path='/test'
               element={<HOPE viewport={viewport}/>}>
        </Route>
        <Route path='/market'
               element={<Market viewport={viewport}/>}>
        </Route>
        <Route path='/monthlyfinanceallocationtoindividualpeople'
               element={<MonthlyFinanceAllocationToIndividualPeople viewport={viewport}/>}>
        </Route>
        <Route path='/cart'
               element={<Cart />}>
        </Route>
        <Route path='/servicedetails'
               element={<ServiceDetails />}>
        </Route>
     </Routes>
    </Container>
  );
}

export default OMSIAPCore;
