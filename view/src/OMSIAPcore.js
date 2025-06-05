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
import PlaceOrderPage from './components/placeorder/placeorder-component.js'
import CheckoutPage from './components/checkout/checkout-component.js'
import LoginAndRegistrationPage from './components/registrationpage/registrationpage-component.js';
import BusinessPortfolio from './components/businessportfolio/businessportfolio-component.js';
import InfrasturesPortfolio from './components/infrastructuresportfolio/infrastructureportfolio-component.js';
import CompanyAwards from './components/landingpage/awardsandachievements/readmoreaboutawardsandachievements-component.js';
import DatabaseComponent from './components/database/database-component.js';
import ImageUpload from './components/imageupload/imageupload-component.js';

import axiosCreatedInstance from './components/lib/axiosutil.js';

// Import Loading Context
import { LoadingProvider, useLoading } from './components/loadingcontext/loadingcontext.js'
import LoadingIndicator from './components/loadingindicator/loadingindicator-component.js'


function OMSIAPCoreContent() {

  const navigate = useNavigate()
  const { loadingState, updateLoadingState, setAllLoaded } = useLoading()

  const [viewport, viewportcb] = useState('xs')
  const [, states] = useState()
  const updatecomponent = useCallback(() => states({}), [])
  const [userIdCookie, setUserIdCookie] = useState("")
  const [authcontainer, authcontainercb] = useState('flex')
  const [loadingindicatormodal, loadingindicatormodalcb] = useState('flex');
  const [userdashboardmodal, userdashboardmodalcb] = useState('none');
  const [areyousureyouwanttologoutmodal, areyousureyouwanttologoutmodalcb] = useState('none');
  const [citizenshipregistrationtype, citizenshipregistrationtypecb] = useState("MFATIP");

   // User data state
   const [user, usercb] = useState({
    id: "",
    _id: "",
    registrationstatusesandlogs: {
      type: "",
      indication: "",
      deviceloginstatus: "logged out",
      registrationlog: [
        {
          date: "Loading",
          type: "Loading",
          indication: "Loading",
          messages: []
        }
      ]
    },
    // ... rest of user state
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
       country: ""
      }
    },
    personaldata: {
      age: "",
      sex: "",
      bloodtype: "",
      height: "",
      weight: "",
      deviceprofilepicture: "",
      dob: "",
      citizenship: "",
      civil_status: "",
      government_issued_identification: {
      frontphoto: {
       name: "",
       description: "",
       image: "",
       uploaddate: "",
      },
      backphoto: {
       name: "",
       description: "",
       image: "",
       uploaddate: "",
      }
     },
     birthcertificate: {
      frontphoto: {
       name: "",
       description: "",
       image: "",
       uploaddate: "",
      },
      backphoto: {
       name: "",
       description: "",
       image: "",
       uploaddate: ""
      }
     }
    },
    credits: {
      omsiapawas: {
       id: "",
       amount: 0,
       transactions: {
        currencyexchange: [],
        widthdrawals: [],
        omsiapawastransfer: []
      }
     }
    },
    transactions: {
      merchandise: []
    }
   });

  // Products state
  const [alloftheproducts, alloftheproductscb] = useState([
  
  ])
  
  // Transactions state
  const [transactions, setTransactions] = useState([])

  /// cart 
  const [cart, cartcb] = useState([]); 

  // Setup viewport detection
  useEffect(() => {

    const $xsviewport = window.matchMedia('(max-width: 600px)');
    const $mdviewport = window.matchMedia('(min-width: 992px)');
    const $lgviewport = window.matchMedia('(min-width: 1200px)');

    const handleXsViewport = () => {
      if ($xsviewport.matches) {
        viewportcb('xs');
      }
    };

    const handleMdViewport = () => {
      if ($mdviewport.matches) {
        viewportcb('md');
      }
    };

    const handleLgViewport = () => {
      if ($lgviewport.matches) {
        viewportcb('lg');
      }
    };

    $xsviewport.addListener(handleXsViewport);
    $mdviewport.addListener(handleMdViewport);
    $lgviewport.addListener(handleLgViewport);

    // Initialize viewport
    handleXsViewport();
    handleMdViewport();
    handleLgViewport();

    // Clean up listeners
    return () => {
      $xsviewport.removeListener(handleXsViewport);
      $mdviewport.removeListener(handleMdViewport);
      $lgviewport.removeListener(handleLgViewport);
    };

  }, []);

  // Initialize app data
  useEffect(() => {

    const initializeApp = async () => {
      try {
        // Update loading state to show we're starting
        updateLoadingState('global', true);
        
        // Start all data loading in parallel
        await Promise.all([
          loadUserData(),
          loadProductData(),
          loadTransactionData()
        ]);
        
        // All critical data is loaded, update global state
        updateLoadingState('global', false);
        
        // Hide loading indicator after a short delay
        setTimeout(() => {
          loadingindicatormodalcb('none');
        }, 500);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Handle initialization failure
        updateLoadingState('global', false);
        loadingindicatormodalcb('none');
        // Show error message or handle gracefully
      }
    };
    
    initializeApp();

  }, []);


  // Load user data
  const loadUserData = async () => {
    
    try {

      updateLoadingState('user', true);
      
      const _documentcookie = document.cookie;
      
      if ( _documentcookie !== "" ) {

        const _parsedusercookie = _documentcookie.substr(3, 24);
        
        const response = await axiosCreatedInstance.post("/people/getregistrant", {
          $userid: _parsedusercookie
        });
        
        const _responsemessage = response.data.message;

        if (_responsemessage === "REGISTRANT_FOUND") {

          const registrant = response.data.registrant
          usercb(registrant)

        } else if (_responsemessage === "NO_REGISTRANT_FOUND") {

          handleUserLoginStatusLoggedOut();

        } else {

          // Handle other responses
          console.warn("Unexpected response for user data:", _responsemessage);
          handleUserLoginStatusLoggedOut();

        }
      } else {
        handleUserLoginStatusLoggedOut();
      }
      
      updateLoadingState('user', false);
    } catch (error) {
      console.error("Error loading user data:", error);
      handleUserLoginStatusLoggedOut();
      updateLoadingState('user', false);
    }
  };

  // Load product data
  const loadProductData = async () => {

    try {

      updateLoadingState('products', true);

      // Replace with your actual product loading logic
      const response = await axiosCreatedInstance.get("/products/getallproducts");
      
      if (response.data && response.data.products) {

        alloftheproductscb(response.data.products);

      } else {
        // Default products if none returned
        alloftheproductscb([
         
        ]);

      }
      
      updateLoadingState('products', false);

    } catch (error) {

      console.error("Error loading product data:", error);
      updateLoadingState('products', false);
      // Set default products on error
      alloftheproductscb([
      
      ]);

    }

  };

  // Load transaction data
  const loadTransactionData = async () => {

    try {

      updateLoadingState('transactions', true);
      
      if (user && user.id) {
        // Only load transactions if user is logged in
        const response = await axiosCreatedInstance.post("/transactions/getUserTransactions", {
          userId: user.id
        });
        
        if (response.data && response.data.transactions) {
          setTransactions(response.data.transactions);
        }

      } else {

        // Set default transactions for demo purposes
        setTransactions([
          {
            id: "",
            intent: "",
            statusesandlogs: {
            status: "",
            indication: "",
            logs: []
            },
            details: {
            merchandise: {
            thistransactionismadeby: {
            id: "",
            name: {
            firstname: "",
            middlename: "",
            lastname: ""
            },
            address: {
            street: "",
            trademark: "",
            baranggay: "",
            city: "",
            province: "",
            postal_zip_code: "",
            country: ""
            }
            },
            thistransactionismainlyintendedto: {
            id: "",
            name: {
            firstname: "",
            middlename: "",
            lastname: ""
            },
            address: {
              street: "",
              trademark: "",
              baranggay: "",
              city: "",
              province: "",
              postal_zip_code: "",
              country: ""
            }
            },
            list: [],
            ordersummary: {
            merchandisetotal: 0,
            shippingtotal:0,
            totalcapital: 0,
            totaltransactiongiveaway: 0,
            totalprofit: 0,
            totalitems: 0,
            totalweightgrams: 0,
            totalweightkilos: 0
            },
            shippinginfo: {
            street: "",
            trademark: "",
            baranggay: "",
            city: "",
            province: "",
            zipcode: "",
            country: ""
            }
            },
            paymentmethod: ""
            }
            }
        ]);

      }
      
      updateLoadingState('transactions', false);

    } catch (error) {

      console.error("Error loading transaction data:", error);
      updateLoadingState('transactions', false);
      // Set default transactions on error

    }

  };

  function handleUserLoginStatusLoggedOut() {
    usercb({
      id: "Not logged in",
      _id: "Not logged in",
      registrationstatusesandlogs: {
        type: "Not logged in",
        indication: "Not logged in",
        deviceloginstatus: "logged out",
        registrationlog: [
          {
            date: "Loading",
            type: "Loading",
            indication: "Loading",
            messages: []
          }
        ]
      },
      name: {
        firstname: "Not logged in",
        middlename: "Not logged in",
        lastname: "Not logged in",
        nickname: "Not logged in"
      },
      contact: {
        phonenumber: "Not logged in",
        telephonenumber: "Not logged in",
        emailaddress: "Not logged in",
        address: {
         street: "Not logged in",
         baranggay: "Not logged in",
         trademark: "Not logged in",
         city: "Not logged in",
         province: "Not logged in",
         country: "Not logged in"
        }
      },
      personaldata: {
        age: "Not logged in",
        sex: "Not logged in",
        bloodtype: "Not logged in",
        height: "Not logged in",
        weight: "Not logged in",
        deviceprofilepicture: "Not logged in",
        dob: "Not logged in",
        citizenship: "Not logged in",
        civil_status: "Not logged in",
        government_issued_identification: {
        frontphoto: {
         name: "Not logged in",
         description: "Not logged in",
         image: "Not logged in",
         uploaddate: "Not logged in",
        },
        backphoto: {
         name: "Not logged in",
         description: "Not logged in",
         image: "Not logged in",
         uploaddate: "Not logged in",
        }
       },
       birthcertificate: {
        frontphoto: {
         name: "Not logged in",
         description: "Not logged in",
         image: "Not logged in",
         uploaddate: "Not logged in",
        },
        backphoto: {
         name: "Not logged in",
         description: "Not logged in",
         image: "Not logged in",
         uploaddate: "Not logged in"
        }
       }
      },
      credits: {
        omsiapawas: {
         id: "Not logged in",
         amount: 0,
         transactions: {
          currencyexchange: [],
          widthdrawals: [],
          omsiapawastransfer: []
        }
       }
      },
      transactions: {
        merchandise: []
      }
    });
  }

  // Routes configuration
  return (
    <Container fluid id="omsiapcore">

      {/* Show loading indicator when global state is loading */}
      <LoadingIndicator 
        isVisible={loadingState.global} 
        loadingindicatormodal={loadingState.global ? 'flex' : 'none'}
        loadingindicatormodalcb={loadingindicatormodalcb}
      />

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

                                  user={user}
                                  usercb={usercb}

                                  areyousureyouwanttologoutmodal={areyousureyouwanttologoutmodal}
                                  areyousureyouwanttologoutmodalcb={areyousureyouwanttologoutmodalcb}
                                  
                                  />}>
      </Route>

      <Route path='/checkout'
            element={<CheckoutPage viewport={viewport}

                                   user={user}
                                   usercb={usercb}
            
                                   cart={cart}
                                   cartcb={cartcb}
                                  
                                   updatecomponent={updatecomponent}/>}>
      </Route>
      <Route path='/placeorder'
            element={<PlaceOrderPage viewport={viewport}

                                     user={user}
                                     usercb={usercb}
                                
                                     cart={cart}
                                     cartcb={cartcb}/>}>
      </Route>

      <Route path='/mfatip/loginregister'
            element={<LoginAndRegistrationPage viewport={viewport}
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

      <Route path='/imageupload'
            element={<ImageUpload />}>

      </Route>


      </Routes>

    </Container>
    )

}

// Wrap the main component with the LoadingProvider
function OMSIAPCore() {
  return (
    <LoadingProvider>
      <OMSIAPCoreContent />
    </LoadingProvider>
  );
}

export default OMSIAPCore;
