import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import { Routes, 
         Route,
         useNavigate
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
import UserAccount from './components/useraccount/useraccount-component.js'
import CheckoutPage from './components/checkout/checkout-component.js'
import PlaceOrder from './components/placeorder/placeorder-component.js'
import RegistrationPage from './components/registrationpage/registrationpage-component.js';

import axiosCreatedInstance from './components/lib/axiosutil.js';

function OMSIAPCore() {

  const navigate = useNavigate();

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

  const [, states] = useState();
  const updatecomponent = useCallback(() => states({}), []);
 
  const [userIdCookie, setUserIdCookie] = useState("");
  
  const [authcontainer, authcontainercb] = useState('flex');
  const [loadingindicatormodal, loadingindicatormodalcb] = useState('none');
  const [userdashboardmodal, userdashboardmodalcb] = useState('none');

  const [areyousureyouwanttologoutmodal, areyousureyouwanttologoutmodalcb] = useState('none');

  const [citizenshipregistrationtype, citizenshipregistrationtypecb] = useState("MFATIP");

  //// start user data 
  const [user, usercb] = useState(
    { 
    id: "qwerty1234qwefdln-A-1",
    loginstatus: "logged in",
    status: {
      indication: "Registered",
      requests: [
       { 
         purpose: "Registration",
         message: "You registered for the MFATIP PROGRAM",
         status: "FIRST REGISTRATION. STATUS REGISTERED",
         date: '07-12-2022'
       }
     ]
    },
    name: {
      firstname: "Mark Anthony",
      middlename: "Apura",
      lastname: "Beloy",
      nickname: "Macky"
    },
    contact: {
      phonenumber: "123456-6789-0",
      telephonenumber: "",
      emailaddress: "emailaddress@gmail.com",
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
    passwords: {
      account: {
        password: ""
      }
    },
    credits: {
      omsiapawasto: {
        id: "",
        amount: 10,
        transactions: {
          deposits: [],
          widthdrawals: [],
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
      },
      products: []
    }
    }
  );

  /// end of user data

  /// start of product data 

  /// all of the products
  const [alloftheproducts, alloftheproductscb] = useState([
    {
      id: 1,
      name: 'Premium Headphones',
      price: 299.99,
      category: 'electronics',
      description: 'High-quality noise-cancelling headphones with premium sound.',
      images: ['../images/market/products/lighter.jpg', '../images/market/products/lighter.jpg', '../images/market/products/lighter.jpg'],
      stock: 15,
      rating: 4.8,
      reviews: 127,
      specifications: [
        { name: 'Battery Life', value: '30 hours' },
        { name: 'Noise Cancellation', value: 'Active' },
        { name: 'Connectivity', value: 'Bluetooth 5.0' },
        { name: 'Weight', value: '250g' }
      ],
      videoUrl: '/api/placeholder/640/360', // Placeholder for video URL
      features: [
        'Active noise cancellation',
        'Transparency mode',
        'Spatial audio',
        'Voice assistant compatibility'
      ],
      warranty: '2 years manufacturer warranty'
    }
  ])

  /// cart 
  const [cart, cartcb] = useState([]); 

  /// end of product data 

  useEffect( ()=> {

    $viewportscreenbreakpoints.xsviewportscreenbreakpoint();
    $viewportscreenbreakpoints.mdviewportscreenbreakpoint();
    $viewportscreenbreakpoints.lgviewportscreenbreakpoint();

    handleUserCookie();

 }, []);

 function handleUserCookie() {

  const _authcontainer = document.querySelectorAll('.auth-container');

   let _documentcookie = document.cookie;
   if (_documentcookie !== "") {
    handleLoadingIndicatorModal();
    handleUserLoginStatusLoggedIn();
    return
   }
  
   alert("This is no user");
   handleLoadingIndicatorModal();
   handleUserLoginStatusLoggedOut();

 }

 function handleLoadingIndicatorModal() {
    loadingindicatormodalcb("flex");
 }

 function handleAuthContainer() {
  authcontainercb("flex");
 }

 async function handleUserLoginStatusLoggedIn() {
 
  const _usercookie = document.cookie;
  const _parsedusercookie = _usercookie.substr(3, 20);

  await axiosCreatedInstance.post("/people/getregistrant", {
    $userid: _parsedusercookie
  }).then((response)=> {
    console.log(response.data)
    const _responsemessage = response.data.message; 
    const _registrant = response.data.registrant;

    switch(_responsemessage) {
       case "No registrant found with the given user ID":
        navigate('/mfatip/loginregister')
       break;
       case "Registrant found":
        _registrant.loginstatus = "logged in"
        usercb(_registrant);
       break;
    }
   
  })

 
 }

 function handleUserLoginStatusLoggedOut() {
  usercb({ 
      id: "qwerty1234qwefdln-A-1",
      loginstatus: "logged out",
      status: {
        indication: "Registered",
        requests: [
         { 
           purpose: "Registration",
           message: "You registered for the MFATIP PROGRAM",
           status: "REGISTERED",
           date: '07-12-2022'
         }
       ]
      },
      name: {
        firstname: "Mark Anthony",
        middlename: "Apura",
        lastname: "Beloy",
        nickname: "Macky"
      },
      contact: {
        phonenumber: "123456-6789-0",
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
      passwords: {
        account: {
          password: ""
        }
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
        },
        merchandises: []
      }
  })
 }

  return (
    <Container fluid  
               id="omsiapcore">
     <Routes>
        <Route path='/'
               element={<LandingPage viewport={viewport}

                                     updatecomponent={updatecomponent}
               
                                     user={user}
                                     usercb={usercb}

                                     loadingindicatormodal={loadingindicatormodal}
                                     loadingindicatormodalcb={loadingindicatormodalcb}

                                     userdashboardmodal={userdashboardmodal}
                                     userdashboardmodalcb={userdashboardmodalcb}

                                     authcontainer={authcontainer}
                                     authcontainercb={authcontainercb}

                                     handleLoadingIndicatorModal={handleLoadingIndicatorModal}

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
               element={<Market viewport={viewport}
               
                                alloftheproducts={alloftheproducts}
                                alloftheproductscb={alloftheproductscb}
                                
                                cart={cart}
                                cartcb={cartcb}
                                
                                updatecomponent={updatecomponent}/>}>
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

        <Route path='/useraccount'
               element={<UserAccount viewport={viewport}

                                     updatecomponent={updatecomponent}

                                     areyousureyouwanttologoutmodal={areyousureyouwanttologoutmodal}
                                     areyousureyouwanttologoutmodalcb={areyousureyouwanttologoutmodalcb}
                                     
                                     user={user}
                                     usercb={usercb}/>}>
        </Route>

        <Route path='/checkout'
               element={<CheckoutPage viewport={viewport}
               
                                      cart={cart}
                                      cartcb={cartcb}/>}>
        </Route>
        <Route path='/placeorder'
               element={<PlaceOrder viewport={viewport}
                
                                    cart={cart}
                                    cartcb={cartcb}/>}>
        </Route>

        <Route path='/mfatip/loginregister'
               element={<RegistrationPage viewport={viewport}
                                          handleLoadingIndicatorModal={handleLoadingIndicatorModal}
                                          user={user}
                                          usercb={usercb}/>}>
        </Route>

     </Routes>
    </Container>
  );
}

export default OMSIAPCore;
