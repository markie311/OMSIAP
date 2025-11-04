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
import OmsiapMarket from './components/omsiapmarket/omsiapmarket/omsiapmarket-component.js';
import WorldWideOmsiapMarketInsights from './components/omsiapmarket/worldwideomsiapmarketinsights/worldwideomsiapmarketinsights-component.js'
import ShopperDetails from './components/omsiapmarket/shopperdetails/shopperdetails-component.js'
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

import ContactUs from './components/landingpage/footer/contactus-component.js'
import HowItWorks from './components/landingpage/footer/howitworks-component.js'
import PrivacyAndPolicy from './components/landingpage/footer/privacyandpolicy-component.js'
import TermsAndService from './components/landingpage/footer/termsandservice-component.js'

import PaymentSuccess from './components/paymongo/paymentsuccess-component.js'
import PaymentCancel from './components/paymongo/paymentcancel-component.js'

import axiosCreatedInstance from './components/lib/axiosutil.js';

// Import Loading Context
import { LoadingProvider, useLoading } from './components/loadingcontext/loadingcontext.js'
import LoadingIndicator from './components/loadingindicator/loadingindicator-component.js'
import { propTypes } from 'react-bootstrap/esm/Image.js';
import { m } from 'framer-motion';


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

   const dummyProduct = [
  {
    authentications: {
      producttype: "Electronics",
      id: "PROD-001"
    },
    details: {
      productname: "Ultra HD Smart TV",
      category: "Home Entertainment",
      description: "A 65-inch 4K Ultra HD Smart TV with HDR10 support.",
      features: [
        { data: "4K UHD Resolution" },
        { data: "HDR10+ Support" },
        { data: "Built-in Netflix and YouTube" }
      ],
      webaddress: "https://example.com/uhdtv",
      weightingrams: 15000,
      warranty: "2 years",
      for: {
        age: "All",
        part: "Living Room",
        gender: "Unisex",
        reminder: "Handle with care"
      },
      price: {
        amount: 55000,
        capital: 40000,
        shipping: 1000,
        transactiongiveaway: 500,
        profit: 13500
      },
      specifications: []
    },
    images: [
      { url: "https://via.placeholder.com/400x250.png?text=Smart+TV+Front" },
      { url: "https://via.placeholder.com/400x250.png?text=Smart+TV+Side" }
    ],
    videos: [
      { url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" }
    ],
    customerfeedback: {
      rating: 4.7,
      reviews: 249
    },
    system: {
      stocks: 30,
      purchases: {
        total: [
          {
            identification: {
              name: { firstname: "Mark", middlename: "Anthony", lastname: "Beloy" }
            },
            location: {
              street: "123 Main St",
              city: "Manila",
              province: "Metro Manila",
              country: "Philippines"
            },
            date: {
              month: "October",
              year: "2025",
              date: "22",
              day: "Wednesday",
              time: "10:00 AM"
            },
            ordersummary: {
              merchandisetotal: 55000,
              shippingtotal: 1000,
              processingfee: 50,
              totalcapital: 40000,
              totaltransactiongiveaway: 500,
              totalprofit: 13500,
              totalitems: 1,
              totalweightgrams: 15000,
              totalweightkilos: 15
            },
            shippinginfo: {
              city: "Manila",
              province: "Metro Manila",
              country: "Philippines"
            }
          }
        ],
        pending: [],
        accepted: [],
        rejected: []
      }
    }
  }
   ];

  // Products state
  const [alloftheproducts, alloftheproductscb] = useState(dummyProduct)
  
  // Transactions state
  const [transactions, setTransactions] = useState([])

  /// cart 
  const [cart, cartcb] = useState([]); 


  const [articles, articlescb] = useState([

  ])


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
      // Start with all resources loading
      updateLoadingState('global', true);
      updateLoadingState('user', true);
      updateLoadingState('products', true);
      updateLoadingState('contents', true);
      updateLoadingState('transactions', true);

      // Step 1 - Simulate user data
      await loadUserData();
      await new Promise(r => setTimeout(r, 1000));
      updateLoadingState('user', false);

      // Step 2 - Products
      await loadProductData();
      await new Promise(r => setTimeout(r, 1000));
      updateLoadingState('products', false);

      // Step 3 - Contents
      await loadContentsData();
      await new Promise(r => setTimeout(r, 1000));
      updateLoadingState('contents', false);

      // Step 4 - Transactions
      await loadTransactionData();
      await new Promise(r => setTimeout(r, 1000));
      updateLoadingState('transactions', false);

      // Mark everything done
      updateLoadingState('global', false);

      // Hide loading indicator after a slight delay
      setTimeout(() => {
        loadingindicatormodalcb('none');
      }, 1000);

    } catch (error) {
      console.error("Failed to initialize app:", error);
      updateLoadingState('global', false);
      loadingindicatormodalcb('none');
    }
    }
    
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

  // Later, when backend responds, replace with live data
  const loadProductData = async () => {
    try {
      const response = await axiosCreatedInstance.get("/products/getallproducts");
      if (response.data?.products?.length > 0) {
        alloftheproductscb(response.data.products);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Load contents data
  const loadContentsData = async () => {

    try {

      updateLoadingState('contents', true);

      // Fetch contents from the API
      const response = await axiosCreatedInstance.get("/content/getallcontents");
      
      if (response.data && response.data.data) {
        // Use the contents from the API response
        articlescb(response.data.data)
      } else {
        // Set default contents if none returned
        articlescb([
       
        ]);
      }
      
      updateLoadingState('contents', false);

    } catch (error) {
      console.error("Error loading content data:", error);
      updateLoadingState('contents', false);
      
      // Set default contents on error
      articlescb([
      
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

                                  articles={articles}

                                  />}>
      </Route>
      <Route path='/honestiesonconstitutionalpromisesevaluation'
            element={<HOPE viewport={viewport}
                           user={user}
                           usercb={usercb}
                           alloftheproducts={alloftheproducts}
                           citizenshipregistrationtype={citizenshipregistrationtype}
                           citizenshipregistrationtypecb={citizenshipregistrationtypecb}/>}>
      </Route>
      <Route path='/omsiapmarket'
             element={<OmsiapMarket/>}/>
      <Route path='/ecommercemarket'
            element={<Market viewport={viewport}
            
                             alloftheproducts={alloftheproducts}
                             alloftheproductscb={alloftheproductscb}
                            
                             cart={cart}
                             cartcb={cartcb}
                            
                             updatecomponent={updatecomponent}/>}>
      </Route>
      <Route
             path="/worldwideomsiapmarketinsights"
             element={<WorldWideOmsiapMarketInsights alloftheproducts={alloftheproducts} />}
      />
      <Route path='/shopperdetails'
             element={<ShopperDetails user={user}/>}>

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
            element={<ReadMoreAboutArticles viewport={viewport}
                                            user={user}
                                            articles={articles}
                                            articlescb={articlescb}/>}>
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

      <Route path='/contactus'
             element={<ContactUs />}>

      </Route>

       <Route path='/howitworks'
             element={<HowItWorks />}>

      </Route>

       <Route path='/privacyandpolicy'
             element={<PrivacyAndPolicy />}>

       </Route>

        <Route path='/termsandservice'
               element={<TermsAndService />}>

        </Route>

        <Route path='/paymentsuccess'
               element={<PaymentSuccess />}>

        </Route>

         <Route path='/paymentcancel'
               element={<PaymentCancel />}>

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
