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
    {
      authentications: {
        producttype: "",
        id: ""
      },
      details: {
       productname: "111",
       category: "",
       description: "",
       features: [],
       weightingrams: 0,
       warranty: "",
       price: {
         amount: 0,
         capital: 0,
         transactiongiveaway: 0,
         profit: 0
       },
       specifications: []
      },
      images: [],
      videos: [],
      customerfeedback: {
       rating: 0,
       reviews: 0
      },
      system: {
       purchases: {
         total: [],
         pending: [],
         accepted: [],
         rejected: []
       }
      }
    }
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
      const response = await axiosCreatedInstance.get("/products/getAllProducts");
      
      if (response.data && response.data.products) {

        alloftheproductscb(response.data.products);

      } else {
        // Default products if none returned
        alloftheproductscb([
          {
          authentications: {
            producttype: "",
            id: ""
          },
          details: {
           productname: "",
           category: "",
           description: "",
           features: [],
           weightingrams: 0,
           warranty: "",
           price: {
             amount: 0,
             capital: 0,
             transactiongiveaway: 0,
             profit: 0
           },
           specifications: []
          },
          images: [],
          videos: [],
          customerfeedback: {
           rating: 0,
           reviews: 0
          },
          system: {
           purchases: {
             total: [],
             pending: [],
             accepted: [],
             rejected: []
           }
          }
          }
        ]);

      }
      
      updateLoadingState('products', false);

    } catch (error) {

      console.error("Error loading product data:", error);
      updateLoadingState('products', false);
      // Set default products on error
      alloftheproductscb([
        {
          authentications: {
            producttype: "Apparel",
            id: ""
          },
          details: {
           productname: "Lighter",
           category: "Apparel",
           description: "A nice red lighter",
           features: [{data: "3 millimeters in size"},{data: "strong and durable"},{data: "stock and loaded"}],
           weightingrams: 0,
           warranty: "1 year warranty",
           price: {
             amount: 60,
             capital: 57,
             transactiongiveaway: 2,
             profit: 1
           },
           specifications: [
            {
              authentications: {
                producttype: "",
                id: "",
              },
              details: {
               productname: "Product specification name 1",
               category: "Product category specification 1",
               description: "A product specification and it's description",
               features: [{data: "3 millimeters in size"},{data: "strong and durable"},{data: "stock and loaded"}],
               weightingrams: 100,
               warranty: 0,
               for: {
                age: "10 below",
                part: "Wrist",
                gender: "Male",
                reminder: "Water repellant"
               },
               price: {
                 amount: 60,
                 capital: 57,
                 transactiongiveaway: 2,
                 profit: 1
               },
               specifications: []
              },
              images: [{url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}],
              videos: [],
              customerfeedback: {
               rating: 0,
               reviews: 0
              },
              system: {
               stocks: 100
              }
            },
            {
              authentications: {
                producttype: "",
                id: "",
              },
              details: {
               productname: "",
               category: "",
               description: "A product specification and it's description",
               features: [],
               weightingrams: 300,
               warranty: 0,
               for: {
                age: 0,
                part: "",
                gender: "",
                reminder: ""
               },
               price: {
                 amount: 60,
                 capital: 57,
                 transactiongiveaway: 2,
                 profit: 1
               },
               specifications: []
              },
              images: [{url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}],
              videos: [],
              customerfeedback: {
               rating: 0,
               reviews: 0
              },
              system: {
               stocks: 100
              }
            },
            {
              authentications: {
                producttype: "",
                id: "",
              },
              details: {
               productname: "",
               category: "",
               description: "A product specification and it's description",
               features: [],
               weightingrams: 100,
               warranty: 0,
               for: {
                age: 0,
                part: "",
                gender: "",
                reminder: ""
               },
               price: {
                 amount: 60,
                 capital: 57,
                 transactiongiveaway: 2,
                 profit: 1
               },
               specifications: []
              },
              images: [{url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}],
              videos: [],
              customerfeedback: {
               rating: 0,
               reviews: 0
              },
              system: {
               stocks: 100
              }
            }
           ]
          },
          images: [{url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}],
          videos: [],
          customerfeedback: {
           rating: 0,
           reviews: 0
          },
          system: {
           purchases: {
             total: [],
             pending: [],
             accepted: [],
             rejected: []
           }
          }
        },
        {
          authentications: {
            producttype: "Electronics",
            id: ""
          },
          details: {
           productname: "333",
           category: "Electronics",
           description: "",
           features: [],
           weightingrams: 0,
           warranty: "",
           price: {
             amount: 0,
             capital: 0,
             transactiongiveaway: 0,
             profit: 0
           },
           specifications: []
          },
          images: [{url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}, {url:'../images/market/products/lighter.jpg'}],
          videos: [],
          customerfeedback: {
           rating: 0,
           reviews: 0
          },
          system: {
           purchases: {
             total: [],
             pending: [],
             accepted: [],
             rejected: []
           }
          }
        },
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


{/*
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
const [user, usercb] = useState({
 id: "",
 registrationstatusesandlogs: {
  type: "",
  indication: "",
  deviceloginstatus: "logged out",
  registrationlog: []
 },
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
  omsiapawasto: {
   id: "",
   amount: "",
   transactions: {
    currencyexchange: {
     total: [],
     pending: [],
     successful: [],
     rejected: []
    },
   widthdrawals: {
    total: [],
    pending: [],
    successful: [],
    rejected: []
   },
   omsiapawastransfer: []
  }
 }
 },
 transactions: {
  merchandise: {
   total: [],
   pending: [],
   accepted: [],
   rejected: []
  },
 }
});

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
alert("There is user")
handleLoadingIndicatorModal()
handleUserLoginStatusLoggedIn();
return
}

alert("This is no user");
handleUserLoginStatusLoggedOut();

}

function handleLoadingIndicatorModal() {
loadingindicatormodalcb("flex");
}

function handleAuthContainer() {
authcontainercb("flex");
}

async function handleUserLoginStatusLoggedIn() {

try {
const _usercookie = document.cookie;
const _parsedusercookie = _usercookie.substr(3, 24);

const response = await axiosCreatedInstance.post("/people/getregistrant", {
$userid: _parsedusercookie
});

const _responsemessage = response.data.message;

switch(_responsemessage) {
case "REGISTRANT_FOUND":
const registrant = response.data.registrant;
registrant.loginstatus = "logged in";
usercb(registrant);
break;

case "NO_REGISTRANT_FOUND":
navigate('/mfatip/loginregister');
break;

case "USER_INACTIVE":
// Handle inactive user scenario
alert("Your account is currently inactive. Please contact support.");
navigate('/mfatip/support');
break;

case "USER_ID_REQUIRED":
console.error("User ID is missing from the request");
navigate('/mfatip/loginregister');
break;

default:
// Handle unexpected responses
console.error("Unexpected response:", _responsemessage);
alert("Something went wrong. Please try again later.");
break;
}
} catch (error) {
// Handle network or server errors
console.error("Login status check failed:", error);

if (!navigator.onLine) {
alert("No internet connection. Please check your network and try again.");
} else if (error.response) {
// The request was made and the server responded with a status code
// that falls out of the range of 2xx
switch(error.response.data.message) {
case "NO_REGISTRANT_FOUND":
navigate('/mfatip/loginregister');
break;
case "USER_INACTIVE":
alert("Your account is currently inactive. Please contact support.");
navigate('/mfatip/support');
break;
default:
alert("Server error: " + (error.response.data.description || "Unknown error"));
}
} else if (error.request) {
// The request was made but no response was received
alert("Server is not responding. Please try again later.");
} else {
// Something happened in setting up the request
alert("An error occurred. Please try again.");
}
}

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

                            user={user}
                            usercb={usercb}

                            areyousureyouwanttologoutmodal={areyousureyouwanttologoutmodal}
                            areyousureyouwanttologoutmodalcb={areyousureyouwanttologoutmodalcb}
                            
                            />}>
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
      element={<LoginAndRegistrationPage viewport={viewport}
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

<Route path='/imageupload'
      element={<ImageUpload />}>

</Route>


</Routes>
</Container>
);
}

export default OMSIAPCore;
*/}