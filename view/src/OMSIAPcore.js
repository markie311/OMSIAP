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
import BusinessPortfolio from './components/businessportfolio/businessportfolio-component.js';
import InfrasturesPortfolio from './components/infrastructuresportfolio/infrastructureportfolio-component.js';
import CompanyAwards from './components/landingpage/awardsandachievements/readmoreaboutawardsandachievements-component.js';
import DatabaseComponent from './components/database/database-component.js';

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
      type: "MFATIP",
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
          successful_deposits: [],
          successful_withdrawals: [],
          failed_deposits: [],
          failed_withdrawals: []
        }
      }
    },
    transactions: []
    }
  );

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-001',
      date: '2025-02-25',
      type: 'Purchase',
      amount: -1200.50,
      status: 'Completed',
      products: [
        { id: 'PRD-001', name: 'Premium T-Shirt', price: 299.99, quantity: 1, color: 'Black', size: 'L' },
        { id: 'PRD-002', name: 'Designer Jeans', price: 450.50, quantity: 1, color: 'Blue', size: 'M' },
        { id: 'PRD-003', name: 'Sports Socks', price: 75.00, quantity: 3, color: 'White', size: 'One Size' }
      ],
      orderdetails: {
        orderedby: {
          id: "",
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        name: {
          id: "",
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        shipping: {
          totalweight: 0,
          fee: 0
        },
        amounts: {
         totaprice: 0,
         totalcapital: 0,
         totaltransactiongiveaway: 0,
         totalomsiapprofit: 0,
         totalweightinGrams: 0,
         totalweightinkilos: 0
        }
      }
    },
    {
      id: 'TXN-002',
      date: '2025-02-20',
      type: 'Deposit',
      amount: 3000.00,
      status: 'Completed',
      products: [],
      orderdetails: {
        orderedby: {
          id: "",
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        name: {
          id: "",
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        shipping: {
          totalweight: 0,
          fee: 0
        },
        amounts: {
         totaprice: 0,
         totalcapital: 0,
         totaltransactiongiveaway: 0,
         totalomsiapprofit: 0,
         totalweightinGrams: 0,
         totalweightinkilos: 0
        }
      }
    },
    {
      id: 'TXN-003',
      date: '2025-02-15',
      type: 'Purchase',
      amount: -750.25,
      status: 'Completed',
      products: [
        { id: 'PRD-004', name: 'Running Shoes', price: 599.99, quantity: 1, color: 'Red/Black', size: '42' },
        { id: 'PRD-005', name: 'Water Bottle', price: 45.25, quantity: 1, color: 'Blue', size: '750ml' },
        { id: 'PRD-006', name: 'Fitness Band', price: 105.01, quantity: 1, color: 'Black', size: 'Regular' }
      ],
      orderdetails: {
        orderedby: {
          id: "",
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        name: {
          id: "",
          firstname: "",
          middlename: "",
          lastname: "",
          nickname: ""
        },
        shipping: {
          totalweight: 0,
          fee: 0
        },
        amounts: {
         totaprice: 0,
         totalcapital: 0,
         totaltransactiongiveaway: 0,
         totalomsiapprofit: 0,
         totalweightinGrams: 0,
         totalweightinkilos: 0
        }
      }
    }
  ]);

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
        <Route path='/honestiesonconstitutionalpromisesevaluation'
               element={<HOPE viewport={viewport}
                              user={user}
                              usercb={usercb}
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
                                      cartcb={cartcb}
                                      
                                      updatecomponent={updatecomponent}/>}>
        </Route>
        <Route path='/placeorder'
               element={<PlaceOrder viewport={viewport}

                                    user={user}
                                    usercb={usercb}
                                    
                                    cart={cart}
                                    cartcb={cartcb}/>}>
        </Route>

        <Route path='/mfatip/loginregister'
               element={<RegistrationPage viewport={viewport}
                                          handleLoadingIndicatorModal={handleLoadingIndicatorModal}
                                          user={user}
                                          usercb={usercb}/>}>
        </Route>

        <Route path='/businessesportfolios'
               element={<BusinessPortfolio/>}>
        </Route>

        <Route path='/infractructuresportfolio'
               element={<InfrasturesPortfolio/>}>
        </Route>

        <Route path='/companyawardsandachievements'
               element={<CompanyAwards />}>
        </Route>
 
        <Route path='/database'
               element={<DatabaseComponent />}>

        </Route>
        

     </Routes>
    </Container>
  );
}

export default OMSIAPCore;
