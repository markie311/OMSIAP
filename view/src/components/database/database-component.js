"use client"

import "../../styles/database/database.scss"

import { useState, useEffect, useRef } from "react"

import { Row, Col } from "react-bootstrap"

import { FaEye, FaEdit, FaTimes, FaSearch, FaExclamationTriangle, FaCalendarAlt, FaUserClock, FaIdCard, FaCheck, FaEnvelope, FaTimesCircle, FaExclamationCircle, FaMoneyBillWave, FaClock, FaFileAlt, FaUserCircle, FaPhone, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { X, Star, Package, ShoppingCart, Tag, Info, FileText, Video, Award, Truck, AlertCircle, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


// Example data for pending registrations
const sampleRegistrants = [
  {
    id: "qwerty1234qwefdln-A-1",
    fullName: "Mark Anthony Apura Beloy",
    status: "REGISTERED",
    email: "emailaddress@gmail.com",
    registrationType: "MFATIP",
    registrationDate: '07-12-2022'
  },
  {
    id: "abcdef5678ghijkl-B-2",
    fullName: "John Robert Smith",
    status: "PENDING APPROVAL",
    email: "johnsmith@gmail.com",
    registrationType: "MFATIP",
    registrationDate: '08-15-2022'
  },
  {
    id: "mnopqr9101stuvwx-C-3",
    fullName: "Maria Elena Santos",
    status: "REGISTERED",
    email: "mariasantos@gmail.com",
    registrationType: "MFATIP",
    registrationDate: '09-23-2022'
  },
  {
    id: "yzabcd1112efghij-D-4",
    fullName: "James Andrew Wilson",
    status: "PENDING DOCUMENTS",
    email: "jameswilson@gmail.com",
    registrationType: "MFATIP",
    registrationDate: '10-05-2022'
  }
];

function DatabaseComponent() {

    // Example data with date fields
    const [data, setData] = useState([
      { id: 1, date: '2023-01-05', value: 120 },
      { id: 2, date: '2023-01-12', value: 145 },
      { id: 3, date: '2023-02-03', value: 210 },
      { id: 4, date: '2023-02-17', value: 185 },
      { id: 5, date: '2023-03-08', value: 230 },
      { id: 6, date: '2023-03-22', value: 195 },
      { id: 7, date: '2024-01-10', value: 250 },
      { id: 8, date: '2024-01-25', value: 275 },
      { id: 9, date: '2024-02-05', value: 220 },
      { id: 10, date: '2024-02-20', value: 305 },
    ]);
    
    const [filteredData, setFilteredData] = useState(data);
    
    // Handle filter changes from the FilterDataByDate component
    const handleFilterChange = (filtered) => {
      setFilteredData(filtered);
    };

     // Example custom stats data
  const customStats = {
    pendingOrders: { count: 42, change: '+8%' },
    pendingDeposits: { count: 27, change: '+15%' },
    pendingWithdrawals: { count: 13, change: '-7%' },
    pendingRegistrations: { count: 56, change: '+32%' }
  };

  const [showDatabaseConfiguration, setShowDatabaseConfiguration] = useState(false);
  const [showPendingPublicRegistrationModal, setShowPendingPublicRegistrationModal] = useState(false);
  const [showPendingPrivateRegistrationModal, setShowPendingPrivateRegistrationModal] = useState(false);
  const [showTotalOrders, setShowTotalOrders] = useState(false);
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [showAcceptedOrders, setShowAcceptedOrders] = useState(false);
  const [showPendingDeposits, setShowPendingDeposits] = useState(false);
  const [showPendingWithdrawals, setShowPendingWithdrawals] = useState(false);
  const [showRegisteredRegistrantWithPendingDocuments, setShowRegisteredRegistrantsWithPendingDocuments] = useState(false);

  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const [showPendingOrderDetails, setShowPendingOrderDetails] = useState(false);

  const [showProductReader, setShowProductReader] = useState(false);
  const [showDeleteProductReader, setShowDeleteProductReader] = useState(false);

  const [showGcashPaymentLink, setShowGcashPaymentLink] = useState(false);

  const [showModal, setShowModal] = useState(true);

const transactions = [
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
{
id: "!23asdasd1231232",
date: "!23asdasd1231232",
type: "!23asdasd1231232",
amount: 0,
status: "pending",
paymentmethod: "!23asdasd1231232",
details: {
products: [],
shippingInfo: {
address: "!23asdasd1231232",
city: "!23asdasd1231232",
state: "!23asdasd1231232",
zipCode: "!23asdasd1231232",
country: "!23asdasd1231232"
},
orderSummary: {
merchandiseTotal: 0,
shippingTotal: 0,
totalTransactionGiveaway: 0,
totalOmsiaProfit: 0,
totalCapital: 0,
totalItems: 0,
totalProducts: 0,
totalWeightGrams: 0,
totalWeightKilos: 0,
total: 0
}
}
},
];

const creditstransactions = [
  {
    id: "TRX12345678",
    date: "2025-03-10T15:30:00",
    type: "deposit",
    amount: 1250.00,
    status: "pending",
    paymentmethod: "Bank Transfer",
    details: {
      shippingInfo: {
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA"
      },
      orderSummary: {
        total: 1250.00,
        merchandiseTotal: 1200.00,
        shippingTotal: 50.00
      }
    }
  },
  {
    id: "TRX87654321",
    date: "2025-03-11T10:15:00",
    type: "deposit",
    amount: 875.50,
    status: "pending",
    paymentmethod: "Credit Card",
    details: {
      shippingInfo: {
        address: "456 Oak Ave",
        city: "Chicago",
        state: "IL",
        zipCode: "60606",
        country: "USA"
      },
      orderSummary: {
        total: 875.50,
        merchandiseTotal: 825.50,
        shippingTotal: 50.00
      }
    }
  },
  {
    id: "TRX99887766",
    date: "2025-03-12T09:45:00",
    type: "deposit",
    amount: 3500.00,
    status: "pending",
    paymentmethod: "Wire Transfer",
    details: {
      shippingInfo: {
        address: "789 Pine Blvd",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderSummary: {
        total: 3500.00,
        merchandiseTotal: 3400.00,
        shippingTotal: 100.00
      }
    }
  }
];

// Example registrants data
const registrants = [
  {
    id: "MFATIP-2025-0001",
    loginstatus: "active",
    status: {
      type: "incomplete",
      indication: "pending documents",
      requests: [
        {
          purpose: "Initial registration",
          message: "Submitted application",
          status: "approved",
          date: "2025-02-15T09:30:00"
        },
        {
          purpose: "Document submission",
          message: "Government ID pending",
          status: "pending",
          date: "2025-02-15T14:45:00"
        }
      ]
    },
    name: {
      firstname: "Juan",
      middlename: "Dela",
      lastname: "Cruz",
      nickname: "JDC"
    },
    contact: {
      phonenumber: "+63 912 345 6789",
      telephonenumber: "02-8123-4567",
      emailaddress: "juan.delacruz@email.com",
      address: {
        street: "123 Rizal Street",
        baranggay: "San Antonio",
        trademark: "Near City Hall",
        city: "Makati",
        province: "Metro Manila",
        country: "Philippines"
      }
    },
    personaldata: {
      age: 35,
      sex: "Male",
      bloodtype: "O+",
      dob: "1990-05-15",
      citizenship: "Filipino",
      civil_status: "Married",
      government_issued_identification: "Driver's License"
    },
    transactions: [
      {
        id: "TRX-2025-0001",
        date: "2025-02-15T09:30:00",
        type: "registration",
        amount: 500,
        status: "completed",
        paymentmethod: "GCash"
      }
    ]
  },
  {
    id: "MFATIP-2025-0002",
    loginstatus: "active",
    status: {
      type: "incomplete",
      indication: "pending documents",
      requests: [
        {
          purpose: "Initial registration",
          message: "Submitted application",
          status: "approved",
          date: "2025-02-20T10:15:00"
        }
      ]
    },
    name: {
      firstname: "Maria",
      middlename: "Santos",
      lastname: "Reyes",
      nickname: "May"
    },
    contact: {
      phonenumber: "+63 923 456 7890",
      telephonenumber: "",
      emailaddress: "maria.reyes@email.com",
      address: {
        street: "456 Bonifacio Avenue",
        baranggay: "Poblacion",
        trademark: "Beside Central Park",
        city: "Quezon City",
        province: "Metro Manila",
        country: "Philippines"
      }
    },
    personaldata: {
      age: 28,
      sex: "Female",
      bloodtype: "A+",
      dob: "1997-08-23",
      citizenship: "Filipino",
      civil_status: "Single",
      government_issued_identification: "National ID"
    },
    transactions: [
      {
        id: "TRX-2025-0002",
        date: "2025-02-20T10:15:00",
        type: "registration",
        amount: 500,
        status: "completed",
        paymentmethod: "Credit Card"
      }
    ]
  }
 ]

 // Sample user data
 const [user] = useState({
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
 });


 const product = {
  id: "12312312",
  name: "12312312",
  price: 0,
  category: "12312312",
  description: "12312312",
  weightingrams: 1000,
  images: [],
  stock: 0,
  rating: 0,
  reviews: 0,
  specifications: [],
  videoUrl: "12312312", 
  features: [],
  warranty: "12312312",
  quantity: 0,
  focuseddata: {
     price: {
         price: 0,
         capital: 0,
         transactiongiveaway: 0,
         omsiapprofit: 0
     }
  },
  orderdetails: { 
     quantity: 0,
     product: {
       price: 0,
       capital: 0,
       transactiongiveaway: 0,
       omsiapprofit: 0,
     },
     shipment: {
       totalkilos: 0,
       totalshipmentfee: 0
     }
  }
 };


 return (
   <div id="database-container">
     <div id="database-container-viewcontainer">

       <DatabaseHeader />

       <FilterDataByDate data={data}/>

       <StatisticsCardOperationBasis stats={customStats}
                       setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                       setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal}
                       setShowPendingPrivateRegistrationModal={setShowPendingPrivateRegistrationModal}
                       setShowTotalOrders={setShowTotalOrders}
                       setShowPendingOrders={setShowPendingOrders}
                       setShowAcceptedOrders={setShowAcceptedOrders}
                       setShowPendingDeposits={setShowPendingDeposits}
                       setShowPendingWithdrawals={setShowPendingWithdrawals}
                       setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                       />

       <StatisticsCardOperationScope stats={customStats}
                       setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                       setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal}
                       setShowPendingPrivateRegistrationModal={setShowPendingPrivateRegistrationModal}
                       setShowPendingOrders={setShowPendingOrders}
                       setShowPendingDeposits={setShowPendingDeposits}
                       setShowPendingWithdrawals={setShowPendingWithdrawals}
                       setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                       />

        <StatisticsCardDailyTasks stats={customStats}
                       setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                       setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal}
                       setShowPendingPrivateRegistrationModal={setShowPendingPrivateRegistrationModal}
                       setShowPendingOrders={setShowPendingOrders}
                       setShowPendingDeposits={setShowPendingDeposits}
                       setShowPendingWithdrawals={setShowPendingWithdrawals}
                       setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                       />

         <StatisticsCardProductCRUD stats={customStats}
                                    setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                    setShowCreateProduct={setShowCreateProduct}
                                    setShowProductReader={setShowProductReader}
                       />

         <StatisticsCardRegistrantCRUD stats={customStats}
                                    setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                    setShowCreateProduct={setShowCreateProduct}
                                    setShowProductReader={setShowProductReader}
                       />
     </div>

     {
      showDatabaseConfiguration && (
        <div id="database-configurationcontainer">
           
           {
            showPendingPublicRegistrationModal && (
              <PendingPublicRegistrationsModal setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                               setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal} />
            )
           }

           {
            showPendingPrivateRegistrationModal && (
              <PendingPrivateRegistrationsModal setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                                setShowPendingPrivateRegistrationModal={setShowPendingPublicRegistrationModal} />
            )
            }

            {
            showTotalOrders && (
              <TotalOrders transactions={transactions}
                           setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                           setShowTotalOrders={setShowTotalOrders}
                           setShowPendingOrders={setShowPendingOrders}
                           setShowPendingOrderDetails={setShowPendingOrderDetails}
                             />
            )
            }

            {
            showPendingOrders && (
              <PendingOrders transactions={transactions}
                             setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                             setShowPendingOrders={setShowPendingOrders}
                             setShowPendingOrderDetails={setShowPendingOrderDetails}
                             />
            )
            }

            {
            showAcceptedOrders && (
              <AcceptedOrders transactions={transactions}
                              setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                              setShowPendingOrders={setShowPendingOrders}
                              setShowAcceptedOrders={setShowAcceptedOrders}
                              setShowPendingOrderDetails={setShowPendingOrderDetails}
                             />
            )
            }

            {
            showPendingDeposits && (
              <PendingDeposits transactions={creditstransactions}
                             setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                             setShowPendingDeposits={setShowPendingDeposits}

                             />
            )
            }
 
            {
            showPendingWithdrawals && (
              <PendingWithdrawals transactions={creditstransactions}
                                   setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                   setShowPendingWithdrawals={setShowPendingWithdrawals}
                             />
            )
            }

            {
            showRegisteredRegistrantWithPendingDocuments && (
              <MfatipPendingRegistrants registrants={registrants}
                                        setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                        setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                             />
            )
            }

            {
              showPendingOrderDetails && (
                <OrderDetailsModal transaction={transactions[0]} 
                                   onClose={() => setShowModal(false)} 
                                   setShowPendingOrders={setShowPendingOrders}
                                   setShowPendingOrderDetails={setShowPendingOrderDetails}/>
              )
            }

            
            {
              showProductReader && (
                <ProductReader product={product} 
                               onClose={() => setShowModal(false)} 
                               setShowPendingOrders={setShowPendingOrders}
                               setShowProductReader={setShowProductReader}/>
              )
            }

            {
             showDeleteProductReader && (
              <DeleteProductReader product={product}
                                   isOpen={true} />
             )
            }

            {
              showCreateProduct && (
                <CreateProduct  setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                setShowCreateProduct={setShowCreateProduct}/>
              )
            }

            {
              showGcashPaymentLink && (
                <GCashPaymentLink />
              )
            }

        </div>
      )
     }

   </div>
 )
}

function DatabaseHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format time as HH:MM:SS AM/PM
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Format complete date as: Mon, August 25, 2015
  const options = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const formattedDate = currentTime.toLocaleDateString('en-US', options);
  
  // Complete datetime: Mon, August 25, 2015, 07:02:30pm
  const completeDateTime = `${formattedDate}, ${formattedTime}`;

  return (
    <header className="db-header">
      <div className="header-container">
        <div className="logo-section">
          <h1>DATABASE MANAGEMENT SYSTEM</h1>
          <span className="subtitle">Admin Portal</span>
        </div>
        <div className="time-section">
          <div className="datetime-display">
            <div className="time-label">Current Date & Time:</div>
            <div id="complete-datetime" className="datetime-value">{completeDateTime}</div>
          </div>
        </div>
      </div>
      <div className="status-bar">
        <span className="status-indicator">Status: <span className="status-value">Connected</span></span>
        <span className="server-indicator">Server: <span className="special-text">DBMS_MAIN_01</span></span>
        <span className="user-indicator">User: <span className="special-text">admin@system</span></span>
      </div>
    </header>
  );
}

function FilterDataByDate({ data, onFilterChange }) {
  // State for selected filters
  const [filters, setFilters] = useState({
    year: '',
    month: '',
    day: ''
  });
  
  // State for available options (extracted from data)
  const [options, setOptions] = useState({
    years: [],
    months: [],
    days: []
  });
  
  // State for filtered data
  const [filteredData, setFilteredData] = useState(data);

  // Extract unique years, months, and days from data on component mount
  useEffect(() => {
    if (data && data.length > 0) {
      const years = [...new Set(data.map(item => {
        const date = new Date(item.date);
        return date.getFullYear();
      }))].sort((a, b) => b - a); // Sort descending (newest first)
      
      setOptions(prev => ({
        ...prev,
        years
      }));
    }
  }, [data]);

  // Update available months when year changes
  useEffect(() => {
    if (data && data.length > 0 && filters.year) {
      const months = [...new Set(data
        .filter(item => {
          const date = new Date(item.date);
          return date.getFullYear() === parseInt(filters.year);
        })
        .map(item => {
          const date = new Date(item.date);
          return date.getMonth() + 1; // JavaScript months are 0-indexed
        })
      )].sort((a, b) => a - b);
      
      setOptions(prev => ({
        ...prev,
        months
      }));
      
      // Reset month and day selection when year changes
      setFilters(prev => ({
        ...prev,
        month: '',
        day: ''
      }));
    }
  }, [data, filters.year]);

  // Update available days when month changes
  useEffect(() => {
    if (data && data.length > 0 && filters.year && filters.month) {
      const days = [...new Set(data
        .filter(item => {
          const date = new Date(item.date);
          return date.getFullYear() === parseInt(filters.year) &&
                 date.getMonth() + 1 === parseInt(filters.month);
        })
        .map(item => {
          const date = new Date(item.date);
          return date.getDate();
        })
      )].sort((a, b) => a - b);
      
      setOptions(prev => ({
        ...prev,
        days
      }));
      
      // Reset day selection when month changes
      setFilters(prev => ({
        ...prev,
        day: ''
      }));
    }
  }, [data, filters.year, filters.month]);

  // Filter data when filters change
  useEffect(() => {
    if (!data) return;
    
    let results = [...data];
    
    if (filters.year) {
      results = results.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === parseInt(filters.year);
      });
    }
    
    if (filters.month) {
      results = results.filter(item => {
        const date = new Date(item.date);
        return date.getMonth() + 1 === parseInt(filters.month);
      });
    }
    
    if (filters.day) {
      results = results.filter(item => {
        const date = new Date(item.date);
        return date.getDate() === parseInt(filters.day);
      });
    }
    
    setFilteredData(results);
    
    // Send filtered data to parent component
    if (onFilterChange) {
      onFilterChange(results);
    }
  }, [data, filters, onFilterChange]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      year: '',
      month: '',
      day: ''
    });
  };

  // Format month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  return (
    <div className="filter-data-container">
      <div className="filter-header">
        <h2>FILTER DATA BY DATE</h2>
        <button className="reset-button" onClick={handleReset}>RESET</button>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="year" className="filter-label">YEAR</label>
          <select 
            id="year" 
            name="year" 
            value={filters.year} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">ALL YEARS</option>
            {options.years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="month" className="filter-label">MONTH</label>
          <select 
            id="month" 
            name="month" 
            value={filters.month} 
            onChange={handleFilterChange}
            className="filter-select"
            disabled={!filters.year}
          >
            <option value="">ALL MONTHS</option>
            {options.months.map(month => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="day" className="filter-label">DAY</label>
          <select 
            id="day" 
            name="day" 
            value={filters.day} 
            onChange={handleFilterChange}
            className="filter-select"
            disabled={!filters.month}
          >
            <option value="">ALL DAYS</option>
            {options.days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-summary">
        <span className="result-count">{filteredData.length}</span>
        <span className="result-text"> {filteredData.length === 1 ? 'RESULT' : 'RESULTS'} FOUND</span>
        {filters.year && <span className="filter-detail"> FOR <span className="highlight-text">{filters.year}</span></span>}
        {filters.month && <span className="filter-detail"> <span className="highlight-text">{getMonthName(parseInt(filters.month))}</span></span>}
        {filters.day && <span className="filter-detail"> <span className="highlight-text">{filters.day}</span></span>}
      </div>
    </div>
  );
}

const StatisticsCardOperationBasis = ({ stats, setShowDatabaseConfiguration, setShowPendingPublicRegistrationModal, setShowPendingPrivateRegistrationModal,  setShowTotalOrders, setShowPendingOrders, setShowAcceptedOrders, setShowPendingDeposits, setShowPendingWithdrawals, setShowRegisteredRegistrantsWithPendingDocuments }) => {
  // Sample stats data if not provided
  const defaultStats = {
    pendingOrders: { count: 24, change: 1200 },
    pendingDeposits: { count: 18, change: 3500 },
    pendingWithdrawals: { count: 9, change: -850 },
    pendingRegistrations: { count: 32, change: 6400 }
  };

  // Use provided stats or default
  const statsData = stats || defaultStats;

  // Format the change value as a peso currency
  const formatPeso = (amount) => {
    // Make sure amount is a number
    const numAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return '₱0';
    }
    
    const sign = numAmount > 0 ? '+' : '';
    return `${sign}₱${Math.abs(numAmount).toLocaleString()}`;
  };

  return (
    <div className="statistics-container">
      <h1>Operation Basis</h1>
      <div className="statistics-grid">

        {/* TOTAL ORDERS */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">TOTAL ORDERS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count} total orders</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <br/>
            <p>42 total orders orders <button className="pendingorders-viewbutton"
                                              onClick={()=> {
                                                setShowDatabaseConfiguration(true);
                                                setShowPendingOrders(false);
                                                setShowTotalOrders(true);
                                              }}>
                                                view
                                      </button>
            </p>
            <p>20 of it was pending orders <button className="pendingorders-viewbutton"                          
                                         onClick={()=> {
                                           setShowDatabaseConfiguration(true);
                                           setShowTotalOrders(false);
                                           setShowPendingOrders(true);
                                         }}>
                                          view
                                </button>
            </p>
            <p>22 of it was already accepted <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                            setShowAcceptedOrders(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>Processing transaction id: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">Search order by transaction ID</button>
            <br/>
            <p>PROCESSING TRANSACTION ID TNX-123asd-123aqwe</p>
          </div>
        </div>

        {/* TOTAL DEPOSITS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
              setShowPendingDeposits(true);
             }}>
          <div className="card-inner">
            <div className="card-header">TOTAL DEPOSITS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingDeposits.count} total deposits</div>
              <div className={`stat-change ${Number(statsData.pendingDeposits.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingDeposits.change)}
              </div>
            </div>
            <div className="card-icon deposits-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <br/>
            <p>27 total deposits <button className="pendingorders-viewbutton"
                                              onClick={()=> {
                                                setShowDatabaseConfiguration(true);
                                                setShowPendingOrders(false);
                                                setShowTotalOrders(true);
                                              }}>
                                                view
                                      </button>
            </p>
            <p>20 of it was pending deposits <button className="pendingorders-viewbutton"                          
                                         onClick={()=> {
                                           setShowDatabaseConfiguration(true);
                                           setShowTotalOrders(false);
                                           setShowPendingOrders(true);
                                         }}>
                                          view
                                </button>
            </p>
            <p>22 of it was a successful deposit <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                            setShowAcceptedOrders(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>While 22 deposits are rejected <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                            setShowAcceptedOrders(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>Processing transaction id: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">Search deposit by transaction ID</button>
            <br/>
            <p>PROCESSING TRANSACTION ID TNX-123asd-123aqwe</p>
          </div>
        </div>

        {/* TOTAL WITHDRAWALS */}
        <div className="statistics-card"
              onClick={()=> {
                setShowDatabaseConfiguration(true);
                setShowPendingWithdrawals(true);
               }}>
          <div className="card-inner">
            <div className="card-header">TOTAL WITHDRAWALS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingWithdrawals.count} total withdrawals</div>
              <div className={`stat-change ${Number(statsData.pendingWithdrawals.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingWithdrawals.change)}
              </div>
            </div>
            <div className="card-icon withdrawals-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20"></polyline>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
              </svg>
            </div>
            <br/>
            <p>13 total withdrawals <button className="pendingorders-viewbutton"
                                              onClick={()=> {
                                                setShowDatabaseConfiguration(true);
                                                setShowPendingOrders(false);
                                                setShowTotalOrders(true);
                                              }}>
                                                view
                                      </button>
            </p>
            <p>20 of it was pending withdrawals <button className="pendingorders-viewbutton"                          
                                         onClick={()=> {
                                           setShowDatabaseConfiguration(true);
                                           setShowTotalOrders(false);
                                           setShowPendingOrders(true);
                                         }}>
                                          view
                                </button>
            </p>
            <p>22 of it was a successful withdrawal <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                            setShowAcceptedOrders(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>While 22 withdrawals are rejected <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                            setShowAcceptedOrders(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>Processing transaction id: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">Search widthdrawal by transaction ID</button>
            <br/>
            <p>PROCESSING TRANSACTION ID TNX-123asd-123aqwe</p>
          </div>
        </div>

        {/*  REGISTERED MFATIP REGISTRANTS WITH PENDING DOCUMENTS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
              setShowRegisteredRegistrantsWithPendingDocuments(true);
             }}>
          <div className="card-inner">
            <div className="card-header">REGISTERED MFATIP REGISTRANTS WITH PENDING DOCUMENTS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingRegistrations.count}</div>
              <div className={`stat-change ${Number(statsData.pendingRegistrations.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingRegistrations.change)}
              </div>
            </div>
            <div className="card-icon registrations-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatisticsCardOperationScope = ({ stats, setShowDatabaseConfiguration, setShowPendingPublicRegistrationModal, setShowPendingPrivateRegistrationModal, setShowPendingOrders, setShowPendingDeposits, setShowPendingWithdrawals, setShowRegisteredRegistrantsWithPendingDocuments }) => {
  // Sample stats data if not provided
  const defaultStats = {
    pendingOrders: { count: 24, change: 1200 },
    pendingDeposits: { count: 18, change: 3500 },
    pendingWithdrawals: { count: 9, change: -850 },
    pendingRegistrations: { count: 32, change: 6400 }
  };

  // Use provided stats or default
  const statsData = stats || defaultStats;

  // Format the change value as a peso currency
  const formatPeso = (amount) => {
    // Make sure amount is a number
    const numAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return '₱0';
    }
    
    const sign = numAmount > 0 ? '+' : '';
    return `${sign}₱${Math.abs(numAmount).toLocaleString()}`;
  };

  return (
    <div className="statistics-container">
      <h1>Operation Scope</h1>
      <div className="statistics-grid">

        {/* PENDING ORDERS */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">PENDING ORDERS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count} pending orders</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <br/>
            <p>20 pending orders <button className="pendingorders-viewbutton"
                                         onClick={()=> {
                                          setShowDatabaseConfiguration(true);
                                          setShowPendingOrders(true);
                                         }}>view</button></p>
            <p>42 total orders ( check operation basis )</p>
            <p>22 accepted orders ( check accepted orders ) </p>
            <p>20 orders needed to be accepted ( total orders count minus pending orders count )</p>
            <p>Find by ID: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">Find transaction by transaction ID</button>
          </div>
        </div>

        {/* PENDING DEPOSITS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
              setShowPendingDeposits(true);
             }}>
          <div className="card-inner">
            <div className="card-header">PENDING DEPOSITS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingDeposits.count} pending deposits</div>
              <div className={`stat-change ${Number(statsData.pendingDeposits.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingDeposits.change)}
              </div>
            </div>
            <div className="card-icon deposits-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <br/>
            <button className="readproduct-readproductbutton">View all pending deposits</button>
            <br />
            <p>27 total deposits <button className="pendingorders-viewbutton"
                                              onClick={()=> {
                                                setShowDatabaseConfiguration(true);
                                                setShowPendingOrders(false);
                                              }}>
                                                view
                                      </button>
            </p>
            <p>20 of it was pending deposits <button className="pendingorders-viewbutton"                          
                                         onClick={()=> {
                                           setShowDatabaseConfiguration(true);
                                           setShowPendingOrders(true);
                                         }}>
                                          view
                                </button>
            </p>
            <p>22 of it was a successful deposit <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>While 22 deposits are rejected <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>Processing transaction id: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">View pending deposit by transaction ID</button>
            <br/>
            <p>PROCESSING TRANSACTION ID TNX-123asd-123aqwe</p>
          </div>
        </div>

        {/* PENDING WITHDRAWALS */}
        <div className="statistics-card"
              onClick={()=> {
                setShowDatabaseConfiguration(true);
                setShowPendingWithdrawals(true);
               }}>
          <div className="card-inner">
            <div className="card-header">PENDING WITHDRAWALS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingWithdrawals.count} pending withdrawals</div>
              <div className={`stat-change ${Number(statsData.pendingWithdrawals.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingWithdrawals.change)}
              </div>
            </div>
            <div className="card-icon withdrawals-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20"></polyline>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
              </svg>
            </div>
            <br />
            <p>27 total withdrawals <button className="pendingorders-viewbutton"
                                              onClick={()=> {
                                                setShowDatabaseConfiguration(true);
                                                setShowPendingOrders(false);
                                              }}>
                                                view
                                      </button>
            </p>
            <p>20 of it was pending withdrawals <button className="pendingorders-viewbutton"                          
                                         onClick={()=> {
                                           setShowDatabaseConfiguration(true);
                                           setShowPendingOrders(true);
                                         }}>
                                          view
                                </button>
            </p>
            <p>22 of it was a successful withdrawal <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>While 22 withdrawals are rejected <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>Processing transaction id: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">View pending withdrawal by transaction ID</button>
            <br/>
            <p>PROCESSING TRANSACTION ID TNX-123asd-123aqwe</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const PendingPublicRegistrationsModal = ({ onClose, setShowDatabaseConfiguration, setShowPendingPublicRegistrationModal, onViewDetails, onEdit }) => {
  // This would typically come from props, but we're using sample data here
  const [registrants, setRegistrants] = useState(sampleRegistrants);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrants, setFilteredRegistrants] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  // Example user data as provided
  const [user, setUser] = useState({
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
  });

  useEffect(() => {
    setFilteredRegistrants(registrants);
  }, [registrants]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredRegistrants(registrants);
      return;
    }
    
    const filtered = registrants.filter(
      registrant => 
        registrant.id.toString().toLowerCase().includes(term) || 
        registrant.fullName.toLowerCase().includes(term)
    );
    
    setFilteredRegistrants(filtered);
  };

  const handleClose = () => {

   // setIsClosing(true);
   // setTimeout(() => {
   //   onClose();
   // }, 300); // Match this time with the animation duration in CSS

   setShowPendingPublicRegistrationModal(false);
   setShowDatabaseConfiguration(false);
    
  };

  return (
    <div className={`pending-registrations-container ${isClosing ? 'closing' : ''}`}>
      <div className="pending-registrations-header">
        <h2>Pending Public Registrations</h2>
        <button 
          className="close-button" 
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes className="close-icon" />
        </button>
      </div>
      
      <div className="search-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID or Full Name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="status-legend">
          <span className="legend-item">
            <span className="status-dot status-registered"></span>
            Registered
          </span>
          <span className="legend-item">
            <span className="status-dot status-pending-approval"></span>
            Pending Approval
          </span>
          <span className="legend-item">
            <span className="status-dot status-pending-documents"></span>
            Pending Documents
          </span>
        </div>
      </div>
      
      <div className="registrants-table-container">
        <table className="registrants-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>First Registration</th>
              <th>Public Registration</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrants.length > 0 ? (
              filteredRegistrants.map((registrant) => (
                <tr key={registrant.id} className="registrant-row">
                  <td className="registrant-id-cell" data-label="ID">
                    <span className="registrant-id">{registrant.id}</span>
                  </td>
                  <td className="registrant-name-cell" data-label="Full Name">
                    <div className="registrant-name-info">
                      <span className="registrant-name">{registrant.fullName}</span>
                      <span className="registrant-email">{registrant.email}</span>
                    </div>
                  </td>
                  <td className="registrant-status-cell" data-label="Status">
                    <span className={`registrant-status status-${registrant.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {registrant.status}
                    </span>
                  </td>
                  <td className="date-cell" data-label="Registration Date">
                    <div className="date-with-icon">
                      <FaCalendarAlt className="date-icon" />
                      <span>{registrant.registrationDate}</span>
                    </div>
                  </td>
                  <td className="date-cell" data-label="First Registration">
                    <div className="date-with-icon">
                      <FaUserClock className="date-icon" />
                      <span>{registrant.firstRegistrationDate}</span>
                    </div>
                  </td>
                  <td className="date-cell" data-label="Public Registration">
                    <div className="date-with-icon">
                      <FaIdCard className="date-icon" />
                      <span>{registrant.publicRegistrationDate}</span>
                    </div>
                  </td>
                  <td className="date-cell" data-label="DOB">
                    <span>{registrant.dateOfBirth}</span>
                  </td>
                  <td className="actions-cell" data-label="Actions">
                    <div className="registrant-actions">
                      <button 
                        className="action-button view-button" 
                        onClick={() => onViewDetails(registrant.id)}
                        aria-label="View Details"
                        title="View Details"
                      >  
                          view
                        <FaEye />
                      </button>
                      <button 
                        className="action-button edit-button" 
                        onClick={() => onEdit(registrant.id)}
                        aria-label="Edit"
                        title="Edit Registration"
                      >
                        edit
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  <FaExclamationTriangle className="no-results-icon" />
                  No pending registrations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PendingPrivateRegistrationsModal = ({ onClose, setShowDatabaseConfiguration, setShowPendingPrivateRegistrationModal,onViewDetails, onEdit }) => {
  // This would typically come from props, but we're using sample data here
  const [registrants, setRegistrants] = useState(sampleRegistrants);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrants, setFilteredRegistrants] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  // Example user data as provided
  const [user, setUser] = useState({
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
  });

  useEffect(() => {
    setFilteredRegistrants(registrants);
  }, [registrants]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredRegistrants(registrants);
      return;
    }
    
    const filtered = registrants.filter(
      registrant => 
        registrant.id.toString().toLowerCase().includes(term) || 
        registrant.fullName.toLowerCase().includes(term)
    );
    
    setFilteredRegistrants(filtered);
  };

  const handleClose = () => {

   // setIsClosing(true);
   // setTimeout(() => {
   //   onClose();
   // }, 300); // Match this time with the animation duration in CSS

   setShowPendingPrivateRegistrationModal(false);
   setShowDatabaseConfiguration(false);
    
  };

  return (
    <div className={`pending-registrations-container ${isClosing ? 'closing' : ''}`}>
      <div className="pending-registrations-header">
        <h2>Pending Registrations</h2>
        <button 
          className="close-button" 
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes className="close-icon" />
        </button>
      </div>
      
      <div className="search-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID or Full Name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="status-legend">
          <span className="legend-item">
            <span className="status-dot status-registered"></span>
            Registered
          </span>
          <span className="legend-item">
            <span className="status-dot status-pending-approval"></span>
            Pending Approval
          </span>
          <span className="legend-item">
            <span className="status-dot status-pending-documents"></span>
            Pending Documents
          </span>
        </div>
      </div>
      
      <div className="registrants-table-container">
        <table className="registrants-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>First Registration</th>
              <th>Public Registration</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrants.length > 0 ? (
              filteredRegistrants.map((registrant) => (
                <tr key={registrant.id} className="registrant-row">
                  <td className="registrant-id-cell" data-label="ID">
                    <span className="registrant-id">{registrant.id}</span>
                  </td>
                  <td className="registrant-name-cell" data-label="Full Name">
                    <div className="registrant-name-info">
                      <span className="registrant-name">{registrant.fullName}</span>
                      <span className="registrant-email">{registrant.email}</span>
                    </div>
                  </td>
                  <td className="registrant-status-cell" data-label="Status">
                    <span className={`registrant-status status-${registrant.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {registrant.status}
                    </span>
                  </td>
                  <td className="date-cell" data-label="Registration Date">
                    <div className="date-with-icon">
                      <FaCalendarAlt className="date-icon" />
                      <span>{registrant.registrationDate}</span>
                    </div>
                  </td>
                  <td className="date-cell" data-label="First Registration">
                    <div className="date-with-icon">
                      <FaUserClock className="date-icon" />
                      <span>{registrant.firstRegistrationDate}</span>
                    </div>
                  </td>
                  <td className="date-cell" data-label="Public Registration">
                    <div className="date-with-icon">
                      <FaIdCard className="date-icon" />
                      <span>{registrant.publicRegistrationDate}</span>
                    </div>
                  </td>
                  <td className="date-cell" data-label="DOB">
                    <span>{registrant.dateOfBirth}</span>
                  </td>
                  <td className="actions-cell" data-label="Actions">
                    <div className="registrant-actions">
                      <button 
                        className="action-button view-button" 
                        onClick={() => onViewDetails(registrant.id)}
                        aria-label="View Details"
                        title="View Details"
                      >  
                          view
                        <FaEye />
                      </button>
                      <button 
                        className="action-button edit-button" 
                        onClick={() => onEdit(registrant.id)}
                        aria-label="Edit"
                        title="Edit Registration"
                      >
                        edit
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  <FaExclamationTriangle className="no-results-icon" />
                  No pending registrations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TotalOrders = ({ setShowDatabaseConfiguration, setShowTotalOrders, setShowPendingOrders, setShowPendingOrderDetails }) => {
  // Sample transaction data
  const sampleTransactions = [
    {
      id: "ORD-12345",
      date: "2025-03-12",
      type: "Online",
      amount: 278.50,
      status: "Pending",
      paymentmethod: "Credit Card",
      details: {
        products: [
          { name: "Organic Coffee", price: 89.50, quantity: 3 },
          { name: "Herbal Tea", price: 10.00, quantity: 1 }
        ],
        shippingInfo: {
          address: "123 Main Street",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 278.50,
          shippingTotal: 15.00,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 48.75,
          totalCapital: 214.75,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 1250,
          totalWeightKilos: 1.25,
          total: 293.50
        }
      }
    },
    {
      id: "ORD-54321",
      date: "2025-03-11",
      type: "In-Store",
      amount: 156.75,
      status: "Pending",
      paymentmethod: "Cash",
      details: {
        products: [
          { name: "Green Tea", price: 45.25, quantity: 2 },
          { name: "Black Tea", price: 33.00, quantity: 2 }
        ],
        shippingInfo: {
          address: "456 Elm Street",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 156.75,
          shippingTotal: 10.00,
          totalTransactionGiveaway: 5.00,
          totalOmsiaProfit: 32.75,
          totalCapital: 129.00,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 750,
          totalWeightKilos: 0.75,
          total: 166.75
        }
      }
    },
    {
      id: "ORD-67890",
      date: "2025-03-10",
      type: "Online",
      amount: 455.25,
      status: "Pending",
      paymentmethod: "PayPal",
      details: {
        products: [
          { name: "Oolong Tea", price: 120.75, quantity: 3 },
          { name: "Chai Spices", price: 46.50, quantity: 2 }
        ],
        shippingInfo: {
          address: "789 Oak Drive",
          city: "Portland",
          state: "OR",
          zipCode: "97201",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 455.25,
          shippingTotal: 20.00,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 89.25,
          totalCapital: 366.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 1850,
          totalWeightKilos: 1.85,
          total: 475.25
        }
      }
    },
    {
      id: "ORD-98765",
      date: "2025-03-09",
      type: "Online",
      amount: 323.50,
      status: "Pending",
      paymentmethod: "Credit Card",
      details: {
        products: [
          { name: "White Tea", price: 78.50, quantity: 2 },
          { name: "Matcha Powder", price: 55.50, quantity: 3 }
        ],
        shippingInfo: {
          address: "321 Pine Lane",
          city: "Denver",
          state: "CO",
          zipCode: "80201",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 323.50,
          shippingTotal: 12.50,
          totalTransactionGiveaway: 10.00,
          totalOmsiaProfit: 61.00,
          totalCapital: 265.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 1100,
          totalWeightKilos: 1.10,
          total: 336.00
        }
      }
    },
    {
      id: "ORD-24680",
      date: "2025-03-08",
      type: "In-Store",
      amount: 189.25,
      status: "Pending",
      paymentmethod: "Debit Card",
      details: {
        products: [
          { name: "Jasmine Tea", price: 65.75, quantity: 2 },
          { name: "Earl Grey", price: 28.75, quantity: 2 }
        ],
        shippingInfo: {
          address: "654 Maple Avenue",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 189.25,
          shippingTotal: 8.75,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 40.00,
          totalCapital: 158.00,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 900,
          totalWeightKilos: 0.90,
          total: 198.00
        }
      }
    },
    {
      id: "ORD-13579",
      date: "2025-03-07",
      type: "Online",
      amount: 512.75,
      status: "Pending",
      paymentmethod: "Bitcoin",
      details: {
        products: [
          { name: "Pu-erh Tea", price: 195.50, quantity: 2 },
          { name: "Tea Accessories", price: 40.75, quantity: 3 }
        ],
        shippingInfo: {
          address: "987 Birch Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 512.75,
          shippingTotal: 25.00,
          totalTransactionGiveaway: 15.00,
          totalOmsiaProfit: 98.75,
          totalCapital: 424.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 2200,
          totalWeightKilos: 2.20,
          total: 537.75
        }
      }
    }
  ];

  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeRow, setActiveRow] = useState(null);

  // Filter transactions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(transaction => 
      transaction.id.toLowerCase().includes(query) ||
      transaction.date.toLowerCase().includes(query) ||
      transaction.details.shippingInfo.address.toLowerCase().includes(query) ||
      transaction.details.shippingInfo.city.toLowerCase().includes(query)
    );
    
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };

  // Button action handlers with visual feedback
  const handleAcceptOrder = (id) => {
    showStatusMessage(`Order ${id} has been accepted`);
    // Update the table UI to reflect acceptance
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === id ? {...t, status: 'Processing'} : t
      )
    );
  };

  const handleRejectOrder = (id) => {
    showStatusMessage(`Order ${id} has been rejected`);
    // Update the table UI to reflect rejection
    setTransactions(prevTransactions => 
      prevTransactions.filter(t => t.id !== id)
    );
  };

  const handleMessageOrder = (id) => {
    showStatusMessage(`Sending message regarding order ${id}`);
  };

  const handleEditOrder = (id) => {
    showStatusMessage(`Editing order ${id}`);
  };

  return (
    <div className="pending-orders-container">
      <div className="header-section">
        <h1 className="page-title">Total Orders</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false);
              setShowPendingOrders(false);
            }}>
          <span className="close-icon">✕</span>
        </div>
      </div>

      <div className="search-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by ID, Date, Location or Address..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <span className="clear-search" onClick={() => setSearchQuery('')}>✕</span>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Total Kilos</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className={`order-row ${activeRow === transaction.id ? 'active-row' : ''}`}
                onMouseEnter={() => setActiveRow(transaction.id)}
                onMouseLeave={() => setActiveRow(null)}
              >
                <td className="order-id">{transaction.id}</td>
                <td>{transaction.date}</td>
                <td className="order-amount">${transaction.amount.toFixed(2)}</td>
                <td>{transaction.details.shippingInfo.city}, {transaction.details.shippingInfo.state}</td>
                <td>{transaction.details.orderSummary.totalWeightKilos} kg</td>
                <td>{transaction.details.orderSummary.totalItems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {
                      setShowPendingOrders(false);
                      setShowPendingOrderDetails(true);
                    }}
                  >
                    View
                  </button>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEditOrder(transaction.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="accept-btn" 
                    onClick={() => handleAcceptOrder(transaction.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn" 
                    onClick={() => handleRejectOrder(transaction.id)}
                  >
                    Reject
                  </button>
                  <button 
                    className="message-btn" 
                    onClick={() => handleMessageOrder(transaction.id)}
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-results">
          <p>No orders found matching your search</p>
        </div>
      )}
    </div>
  );
};

const PendingOrders = ({ setShowDatabaseConfiguration, setShowPendingOrders, setShowPendingOrderDetails }) => {
  // Sample transaction data
  const sampleTransactions = [
    {
      id: "ORD-12345",
      date: "2025-03-12",
      type: "Online",
      amount: 278.50,
      status: "Pending",
      paymentmethod: "Credit Card",
      details: {
        products: [
          { name: "Organic Coffee", price: 89.50, quantity: 3 },
          { name: "Herbal Tea", price: 10.00, quantity: 1 }
        ],
        shippingInfo: {
          address: "123 Main Street",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 278.50,
          shippingTotal: 15.00,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 48.75,
          totalCapital: 214.75,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 1250,
          totalWeightKilos: 1.25,
          total: 293.50
        }
      }
    },
    {
      id: "ORD-54321",
      date: "2025-03-11",
      type: "In-Store",
      amount: 156.75,
      status: "Pending",
      paymentmethod: "Cash",
      details: {
        products: [
          { name: "Green Tea", price: 45.25, quantity: 2 },
          { name: "Black Tea", price: 33.00, quantity: 2 }
        ],
        shippingInfo: {
          address: "456 Elm Street",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 156.75,
          shippingTotal: 10.00,
          totalTransactionGiveaway: 5.00,
          totalOmsiaProfit: 32.75,
          totalCapital: 129.00,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 750,
          totalWeightKilos: 0.75,
          total: 166.75
        }
      }
    },
    {
      id: "ORD-67890",
      date: "2025-03-10",
      type: "Online",
      amount: 455.25,
      status: "Pending",
      paymentmethod: "PayPal",
      details: {
        products: [
          { name: "Oolong Tea", price: 120.75, quantity: 3 },
          { name: "Chai Spices", price: 46.50, quantity: 2 }
        ],
        shippingInfo: {
          address: "789 Oak Drive",
          city: "Portland",
          state: "OR",
          zipCode: "97201",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 455.25,
          shippingTotal: 20.00,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 89.25,
          totalCapital: 366.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 1850,
          totalWeightKilos: 1.85,
          total: 475.25
        }
      }
    },
    {
      id: "ORD-98765",
      date: "2025-03-09",
      type: "Online",
      amount: 323.50,
      status: "Pending",
      paymentmethod: "Credit Card",
      details: {
        products: [
          { name: "White Tea", price: 78.50, quantity: 2 },
          { name: "Matcha Powder", price: 55.50, quantity: 3 }
        ],
        shippingInfo: {
          address: "321 Pine Lane",
          city: "Denver",
          state: "CO",
          zipCode: "80201",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 323.50,
          shippingTotal: 12.50,
          totalTransactionGiveaway: 10.00,
          totalOmsiaProfit: 61.00,
          totalCapital: 265.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 1100,
          totalWeightKilos: 1.10,
          total: 336.00
        }
      }
    },
    {
      id: "ORD-24680",
      date: "2025-03-08",
      type: "In-Store",
      amount: 189.25,
      status: "Pending",
      paymentmethod: "Debit Card",
      details: {
        products: [
          { name: "Jasmine Tea", price: 65.75, quantity: 2 },
          { name: "Earl Grey", price: 28.75, quantity: 2 }
        ],
        shippingInfo: {
          address: "654 Maple Avenue",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 189.25,
          shippingTotal: 8.75,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 40.00,
          totalCapital: 158.00,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 900,
          totalWeightKilos: 0.90,
          total: 198.00
        }
      }
    },
    {
      id: "ORD-13579",
      date: "2025-03-07",
      type: "Online",
      amount: 512.75,
      status: "Pending",
      paymentmethod: "Bitcoin",
      details: {
        products: [
          { name: "Pu-erh Tea", price: 195.50, quantity: 2 },
          { name: "Tea Accessories", price: 40.75, quantity: 3 }
        ],
        shippingInfo: {
          address: "987 Birch Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 512.75,
          shippingTotal: 25.00,
          totalTransactionGiveaway: 15.00,
          totalOmsiaProfit: 98.75,
          totalCapital: 424.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 2200,
          totalWeightKilos: 2.20,
          total: 537.75
        }
      }
    }
  ];

  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeRow, setActiveRow] = useState(null);

  // Filter transactions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(transaction => 
      transaction.id.toLowerCase().includes(query) ||
      transaction.date.toLowerCase().includes(query) ||
      transaction.details.shippingInfo.address.toLowerCase().includes(query) ||
      transaction.details.shippingInfo.city.toLowerCase().includes(query)
    );
    
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };

  // Button action handlers with visual feedback
  const handleAcceptOrder = (id) => {
    showStatusMessage(`Order ${id} has been accepted`);
    // Update the table UI to reflect acceptance
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === id ? {...t, status: 'Processing'} : t
      )
    );
  };

  const handleRejectOrder = (id) => {
    showStatusMessage(`Order ${id} has been rejected`);
    // Update the table UI to reflect rejection
    setTransactions(prevTransactions => 
      prevTransactions.filter(t => t.id !== id)
    );
  };

  const handleMessageOrder = (id) => {
    showStatusMessage(`Sending message regarding order ${id}`);
  };

  const handleEditOrder = (id) => {
    showStatusMessage(`Editing order ${id}`);
  };

  return (
    <div className="pending-orders-container">
      <div className="header-section">
        <h1 className="page-title">Pending Orders</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false);
              setShowPendingOrders(false);
            }}>
          <span className="close-icon">✕</span>
        </div>
      </div>

      <div className="search-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by ID, Date, Location or Address..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <span className="clear-search" onClick={() => setSearchQuery('')}>✕</span>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Total Kilos</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className={`order-row ${activeRow === transaction.id ? 'active-row' : ''}`}
                onMouseEnter={() => setActiveRow(transaction.id)}
                onMouseLeave={() => setActiveRow(null)}
              >
                <td className="order-id">{transaction.id}</td>
                <td>{transaction.date}</td>
                <td className="order-amount">${transaction.amount.toFixed(2)}</td>
                <td>{transaction.details.shippingInfo.city}, {transaction.details.shippingInfo.state}</td>
                <td>{transaction.details.orderSummary.totalWeightKilos} kg</td>
                <td>{transaction.details.orderSummary.totalItems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {
                      setShowPendingOrders(false);
                      setShowPendingOrderDetails(true);
                    }}
                  >
                    View
                  </button>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEditOrder(transaction.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="accept-btn" 
                    onClick={() => handleAcceptOrder(transaction.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn" 
                    onClick={() => handleRejectOrder(transaction.id)}
                  >
                    Reject
                  </button>
                  <button 
                    className="message-btn" 
                    onClick={() => handleMessageOrder(transaction.id)}
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-results">
          <p>No orders found matching your search</p>
        </div>
      )}
    </div>
  );
};

const AcceptedOrders = ({ setShowDatabaseConfiguration, setShowPendingOrders, setShowPendingOrderDetails }) => {
  // Sample transaction data
  const sampleTransactions = [
    {
      id: "ORD-12345",
      date: "2025-03-12",
      type: "Online",
      amount: 278.50,
      status: "Pending",
      paymentmethod: "Credit Card",
      details: {
        products: [
          { name: "Organic Coffee", price: 89.50, quantity: 3 },
          { name: "Herbal Tea", price: 10.00, quantity: 1 }
        ],
        shippingInfo: {
          address: "123 Main Street",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 278.50,
          shippingTotal: 15.00,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 48.75,
          totalCapital: 214.75,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 1250,
          totalWeightKilos: 1.25,
          total: 293.50
        }
      }
    },
    {
      id: "ORD-54321",
      date: "2025-03-11",
      type: "In-Store",
      amount: 156.75,
      status: "Pending",
      paymentmethod: "Cash",
      details: {
        products: [
          { name: "Green Tea", price: 45.25, quantity: 2 },
          { name: "Black Tea", price: 33.00, quantity: 2 }
        ],
        shippingInfo: {
          address: "456 Elm Street",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 156.75,
          shippingTotal: 10.00,
          totalTransactionGiveaway: 5.00,
          totalOmsiaProfit: 32.75,
          totalCapital: 129.00,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 750,
          totalWeightKilos: 0.75,
          total: 166.75
        }
      }
    },
    {
      id: "ORD-67890",
      date: "2025-03-10",
      type: "Online",
      amount: 455.25,
      status: "Pending",
      paymentmethod: "PayPal",
      details: {
        products: [
          { name: "Oolong Tea", price: 120.75, quantity: 3 },
          { name: "Chai Spices", price: 46.50, quantity: 2 }
        ],
        shippingInfo: {
          address: "789 Oak Drive",
          city: "Portland",
          state: "OR",
          zipCode: "97201",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 455.25,
          shippingTotal: 20.00,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 89.25,
          totalCapital: 366.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 1850,
          totalWeightKilos: 1.85,
          total: 475.25
        }
      }
    },
    {
      id: "ORD-98765",
      date: "2025-03-09",
      type: "Online",
      amount: 323.50,
      status: "Pending",
      paymentmethod: "Credit Card",
      details: {
        products: [
          { name: "White Tea", price: 78.50, quantity: 2 },
          { name: "Matcha Powder", price: 55.50, quantity: 3 }
        ],
        shippingInfo: {
          address: "321 Pine Lane",
          city: "Denver",
          state: "CO",
          zipCode: "80201",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 323.50,
          shippingTotal: 12.50,
          totalTransactionGiveaway: 10.00,
          totalOmsiaProfit: 61.00,
          totalCapital: 265.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 1100,
          totalWeightKilos: 1.10,
          total: 336.00
        }
      }
    },
    {
      id: "ORD-24680",
      date: "2025-03-08",
      type: "In-Store",
      amount: 189.25,
      status: "Pending",
      paymentmethod: "Debit Card",
      details: {
        products: [
          { name: "Jasmine Tea", price: 65.75, quantity: 2 },
          { name: "Earl Grey", price: 28.75, quantity: 2 }
        ],
        shippingInfo: {
          address: "654 Maple Avenue",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 189.25,
          shippingTotal: 8.75,
          totalTransactionGiveaway: 0,
          totalOmsiaProfit: 40.00,
          totalCapital: 158.00,
          totalItems: 4,
          totalProducts: 2,
          totalWeightGrams: 900,
          totalWeightKilos: 0.90,
          total: 198.00
        }
      }
    },
    {
      id: "ORD-13579",
      date: "2025-03-07",
      type: "Online",
      amount: 512.75,
      status: "Pending",
      paymentmethod: "Bitcoin",
      details: {
        products: [
          { name: "Pu-erh Tea", price: 195.50, quantity: 2 },
          { name: "Tea Accessories", price: 40.75, quantity: 3 }
        ],
        shippingInfo: {
          address: "987 Birch Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        },
        orderSummary: {
          merchandiseTotal: 512.75,
          shippingTotal: 25.00,
          totalTransactionGiveaway: 15.00,
          totalOmsiaProfit: 98.75,
          totalCapital: 424.00,
          totalItems: 5,
          totalProducts: 2,
          totalWeightGrams: 2200,
          totalWeightKilos: 2.20,
          total: 537.75
        }
      }
    }
  ];

  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeRow, setActiveRow] = useState(null);

  // Filter transactions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(transaction => 
      transaction.id.toLowerCase().includes(query) ||
      transaction.date.toLowerCase().includes(query) ||
      transaction.details.shippingInfo.address.toLowerCase().includes(query) ||
      transaction.details.shippingInfo.city.toLowerCase().includes(query)
    );
    
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
  };

  // Button action handlers with visual feedback
  const handleAcceptOrder = (id) => {
    showStatusMessage(`Order ${id} has been accepted`);
    // Update the table UI to reflect acceptance
    setTransactions(prevTransactions => 
      prevTransactions.map(t => 
        t.id === id ? {...t, status: 'Processing'} : t
      )
    );
  };

  const handleRejectOrder = (id) => {
    showStatusMessage(`Order ${id} has been rejected`);
    // Update the table UI to reflect rejection
    setTransactions(prevTransactions => 
      prevTransactions.filter(t => t.id !== id)
    );
  };

  const handleMessageOrder = (id) => {
    showStatusMessage(`Sending message regarding order ${id}`);
  };

  const handleEditOrder = (id) => {
    showStatusMessage(`Editing order ${id}`);
  };

  return (
    <div className="pending-orders-container">
      <div className="header-section">
        <h1 className="page-title">Accepted Orders</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false);
              setShowPendingOrders(false);
            }}>
          <span className="close-icon">✕</span>
        </div>
      </div>

      <div className="search-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by ID, Date, Location or Address..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <span className="clear-search" onClick={() => setSearchQuery('')}>✕</span>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Total Kilos</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className={`order-row ${activeRow === transaction.id ? 'active-row' : ''}`}
                onMouseEnter={() => setActiveRow(transaction.id)}
                onMouseLeave={() => setActiveRow(null)}
              >
                <td className="order-id">{transaction.id}</td>
                <td>{transaction.date}</td>
                <td className="order-amount">${transaction.amount.toFixed(2)}</td>
                <td>{transaction.details.shippingInfo.city}, {transaction.details.shippingInfo.state}</td>
                <td>{transaction.details.orderSummary.totalWeightKilos} kg</td>
                <td>{transaction.details.orderSummary.totalItems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {
                      setShowPendingOrders(false);
                      setShowPendingOrderDetails(true);
                    }}
                  >
                    View
                  </button>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEditOrder(transaction.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="accept-btn" 
                    onClick={() => handleAcceptOrder(transaction.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn" 
                    onClick={() => handleRejectOrder(transaction.id)}
                  >
                    Reject
                  </button>
                  <button 
                    className="message-btn" 
                    onClick={() => handleMessageOrder(transaction.id)}
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-results">
          <p>No orders found matching your search</p>
        </div>
      )}
    </div>
  );
};

const PendingDeposits = ({ setShowDatabaseConfiguration, setShowPendingDeposits, transactions, onClose, onView, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only pending deposit transactions
    const pendingDeposits = transactions.filter(
      transaction => transaction.type === 'deposit' && transaction.status === 'pending'
    );
    setFilteredTransactions(pendingDeposits);
  }, [transactions]);

  useEffect(() => {
    if (searchQuery) {
      const results = transactions.filter(transaction => 
        // Search by transaction ID
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Search by name or contact info (assuming these would be in details)
        (transaction.details?.shippingInfo?.address && 
         transaction.details.shippingInfo.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Add other search fields as needed based on your data structure
        (transaction.paymentmethod && 
         transaction.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTransactions(results);
    } else {
      // Reset to show only pending deposits when search is cleared
      const pendingDeposits = transactions.filter(
        transaction => transaction.type === 'deposit' && transaction.status === 'pending'
      );
      setFilteredTransactions(pendingDeposits);
    }
  }, [searchQuery, transactions]);

  const handleClose = () => {
   // setIsVisible(false);
    // Delay actual closing to allow for animation
   // setTimeout(() => {
   //   onClose();
   // }, 300);

    setShowDatabaseConfiguration(false);
    setShowPendingDeposits(false);

  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'visible' : ''}`}>
        <div className="modal-header">
          <h2>Pending Deposits</h2>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="pending-deposits-container">
          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No pending deposits found</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transaction-row">
                    <td className="transaction-id">{transaction.id}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td className="amount">
                      <FaMoneyBillWave className="amount-icon" />
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="status">
                      <div className="status-indicator">
                        <FaClock className="status-icon pulse" />
                        <span>Pending</span>
                      </div>
                    </td>
                    <td>{transaction.paymentmethod}</td>
                    <td className="actions">
                      <button 
                        className="view-button" 
                        onClick={() => onView(transaction.id)}
                        aria-label="View transaction details"
                      >
                        <FaEye /> View
                      </button>
                      <button 
                        className="edit-button" 
                        onClick={() => onEdit(transaction.id)}
                        aria-label="Edit transaction"
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const PendingWithdrawals = ({ setShowDatabaseConfiguration, setShowPendingWithdrawals, transactions, onClose, onView, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only pending deposit transactions
    const pendingDeposits = transactions.filter(
      transaction => transaction.type === 'deposit' && transaction.status === 'pending'
    );
    setFilteredTransactions(pendingDeposits);
  }, [transactions]);

  useEffect(() => {
    if (searchQuery) {
      const results = transactions.filter(transaction => 
        // Search by transaction ID
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Search by name or contact info (assuming these would be in details)
        (transaction.details?.shippingInfo?.address && 
         transaction.details.shippingInfo.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Add other search fields as needed based on your data structure
        (transaction.paymentmethod && 
         transaction.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTransactions(results);
    } else {
      // Reset to show only pending deposits when search is cleared
      const pendingDeposits = transactions.filter(
        transaction => transaction.type === 'deposit' && transaction.status === 'pending'
      );
      setFilteredTransactions(pendingDeposits);
    }
  }, [searchQuery, transactions]);

  const handleClose = () => {
   // setIsVisible(false);
    // Delay actual closing to allow for animation
   // setTimeout(() => {
   //   onClose();
   // }, 300);

    setShowDatabaseConfiguration(false);
    setShowPendingWithdrawals(false);

  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'visible' : ''}`}>
        <div className="modal-header">
          <h2>Pending Withdrawals</h2>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="pending-deposits-container">
          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No pending deposits found</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transaction-row">
                    <td className="transaction-id">{transaction.id}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td className="amount">
                      <FaMoneyBillWave className="amount-icon" />
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="status">
                      <div className="status-indicator">
                        <FaClock className="status-icon pulse" />
                        <span>Pending</span>
                      </div>
                    </td>
                    <td>{transaction.paymentmethod}</td>
                    <td className="actions">
                      <button 
                        className="view-button" 
                        onClick={() => onView(transaction.id)}
                        aria-label="View transaction details"
                      >
                        <FaEye /> View
                      </button>
                      <button 
                        className="edit-button" 
                        onClick={() => onEdit(transaction.id)}
                        aria-label="Edit transaction"
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const MfatipPendingRegistrants = ({ setShowDatabaseConfiguration, setShowRegisteredRegistrantsWithPendingDocuments, registrants, onClose, onView, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegistrants, setFilteredRegistrants] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only registrants with pending documents
    const pendingDocumentsRegistrants = registrants.filter(
      registrant => registrant.status && registrant.status.indication === 'pending documents'
    );
    setFilteredRegistrants(pendingDocumentsRegistrants);
    
    // Check for duplicate information
    const duplicates = findDuplicates(registrants);
    setDuplicateWarnings(duplicates);
    
    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [registrants]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  };

  // Function to find duplicate registrants (by name, phone, or email)
  const findDuplicates = (registrantsList) => {
    const duplicateInfo = {};
    const nameMap = {};
    const phoneMap = {};
    const emailMap = {};
    
    registrantsList.forEach(registrant => {
      // Check for duplicate names
      const fullName = `${registrant.name.firstname} ${registrant.name.middlename} ${registrant.name.lastname}`.toLowerCase();
      if (nameMap[fullName]) {
        nameMap[fullName].push(registrant.id);
        if (!duplicateInfo[registrant.id]) duplicateInfo[registrant.id] = [];
        duplicateInfo[registrant.id].push('name');
      } else {
        nameMap[fullName] = [registrant.id];
      }
      
      // Check for duplicate phone numbers
      const phone = registrant.contact.phonenumber;
      if (phone && phoneMap[phone]) {
        phoneMap[phone].push(registrant.id);
        if (!duplicateInfo[registrant.id]) duplicateInfo[registrant.id] = [];
        duplicateInfo[registrant.id].push('phone');
      } else if (phone) {
        phoneMap[phone] = [registrant.id];
      }
      
      // Check for duplicate emails
      const email = registrant.contact.emailaddress;
      if (email && emailMap[email]) {
        emailMap[email].push(registrant.id);
        if (!duplicateInfo[registrant.id]) duplicateInfo[registrant.id] = [];
        duplicateInfo[registrant.id].push('email');
      } else if (email) {
        emailMap[email] = [registrant.id];
      }
    });
    
    return duplicateInfo;
  };

  useEffect(() => {
    if (searchQuery) {
      const results = registrants.filter(registrant => 
        // Filter by pending documents status first
        registrant.status && 
        registrant.status.indication === 'pending documents' &&
        (
          // Then search by various fields
          registrant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          registrant.name.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (registrant.name.middlename && registrant.name.middlename.toLowerCase().includes(searchQuery.toLowerCase())) ||
          registrant.name.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (registrant.contact.phonenumber && registrant.contact.phonenumber.includes(searchQuery)) ||
          (registrant.contact.emailaddress && registrant.contact.emailaddress.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
      setFilteredRegistrants(results);
    } else {
      // Reset to show only pending documents registrants when search is cleared
      const pendingDocumentsRegistrants = registrants.filter(
        registrant => registrant.status && registrant.status.indication === 'pending documents'
      );
      setFilteredRegistrants(pendingDocumentsRegistrants);
    }
  }, [searchQuery, registrants]);

  const handleClose = () => {
   // setIsVisible(false);
    // Delay actual closing to allow for animation
   // setTimeout(() => {
   //   onClose();
   // }, 300);

   setShowDatabaseConfiguration(false);
   setShowRegisteredRegistrantsWithPendingDocuments(false);

  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRegistrationDate = (registrant) => {
    // Assume the first transaction or status request might be the registration date
    // This logic might need adjustment based on your actual data structure
    if (registrant.transactions && registrant.transactions.length > 0) {
      return registrant.transactions[0].date;
    } else if (registrant.status && 
              registrant.status.requests && 
              registrant.status.requests.length > 0) {
      return registrant.status.requests[0].date;
    }
    return "N/A"; // No date found
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div 
        ref={modalRef}
        className={`mfatip-pending-registrants-modal ${isVisible ? 'visible' : ''}`}
      >
        <div className="modal-header">
          <h2>
            <FaFileAlt className="header-icon" />
            MFATIP Registrants with Pending Documents
          </h2>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, phone number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="results-count">
            {filteredRegistrants.length} registrant{filteredRegistrants.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        <div className="registrants-container">
          {filteredRegistrants.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No registrants with pending documents found</p>
            </div>
          ) : (
            <table className="registrants-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrants.map((registrant) => (
                  <tr 
                    key={registrant.id} 
                    className={`registrant-row ${duplicateWarnings[registrant.id] ? 'has-duplicates' : ''}`}
                  >
                    <td className="registrant-id">
                      <FaIdCard className="id-icon" />
                      {registrant.id}
                    </td>
                    <td className="name-cell">
                      <FaUserCircle className="user-icon" />
                      <div className="name-details">
                        <span className="full-name">
                          {registrant.name.firstname} {registrant.name.middlename} {registrant.name.lastname}
                        </span>
                        {registrant.name.nickname && (
                          <span className="nickname">({registrant.name.nickname})</span>
                        )}
                      </div>
                      {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('name') && (
                        <div className="duplicate-warning" title="Duplicate name found">
                          <FaExclamationTriangle className="warning-icon" />
                        </div>
                      )}
                    </td>
                    <td className="contact-cell">
                      <div className="contact-details">
                        <div className="phone-number">
                          <FaPhone className="contact-icon" />
                          {registrant.contact.phonenumber || 'N/A'}
                          {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('phone') && (
                            <FaExclamationTriangle className="warning-icon-small" title="Duplicate phone number found" />
                          )}
                        </div>
                        <div className="email-address">
                          <FaEnvelope className="contact-icon" />
                          {registrant.contact.emailaddress || 'N/A'}
                          {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('email') && (
                            <FaExclamationTriangle className="warning-icon-small" title="Duplicate email found" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="date-cell">
                      <FaCalendarAlt className="date-icon" />
                      <span>{formatDate(getRegistrationDate(registrant))}</span>
                    </td>
                    <td className="status-cell">
                      <div className="status-indicator pending">
                        <FaExclamationCircle className="status-icon pulse" />
                        <span>Pending Documents</span>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="view-button" 
                          onClick={() => onView(registrant.id)}
                          aria-label="View registrant details"
                        >
                          <FaEye className="action-icon" />
                          <span className="action-text">View</span>
                        </button>
                        <button 
                          className="edit-button" 
                          onClick={() => onEdit(registrant.id)}
                          aria-label="Edit registrant"
                        >
                          <FaEdit className="action-icon" />
                          <span className="action-text">Edit</span>
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => onDelete(registrant.id)}
                          aria-label="Delete registrant"
                        >
                          <FaTrash className="action-icon" />
                          <span className="action-text">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ transaction, onClose,setShowPendingOrders, setShowPendingOrderDetails }) => {
  if (!transaction) return null;

  const {
    id,
    date,
    type,
    amount,
    status,
    paymentmethod,
    details
  } = transaction;

  const { products, shippingInfo, orderSummary } = details || {};
  const { address, city, state, zipCode, country } = shippingInfo || {};

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="order-details-modal">
        <button className="close-button" onClick={()=> {
           setShowPendingOrderDetails(false)
           setShowPendingOrders(true)
        }}>×</button>
        <h2 className="modal-title">Order Details</h2>
        
        <div className="order-section">
          <h3>Transaction Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Order ID:</span>
              <span className="info-value highlight">{id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date:</span>
              <span className="info-value">{formatDate(date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{type}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Amount:</span>
              <span className="info-value highlight">{formatCurrency(amount)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value status-${status.toLowerCase()}`}>{status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Method:</span>
              <span className="info-value">{paymentmethod}</span>
            </div>
          </div>
        </div>

        {shippingInfo && (
          <div className="order-section">
            <h3>Shipping Information</h3>
            <p className="address-line">{address}</p>
            <p className="address-line">{city}, {state} {zipCode}</p>
            <p className="address-line">{country}</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="order-section">
            <h3>Products</h3>
            <div className="products-list">
              {products.map((product, index) => (
                <div key={index} className="product-item">
                  {/* Assuming product has name and price properties */}
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">{formatCurrency(product.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {orderSummary && (
          <div className="order-section">
            <h3>Order Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Merchandise Total:</span>
                <span className="summary-value">{formatCurrency(orderSummary.merchandiseTotal)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Shipping Total:</span>
                <span className="summary-value">{formatCurrency(orderSummary.shippingTotal)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Items:</span>
                <span className="summary-value">{orderSummary.totalItems}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Products:</span>
                <span className="summary-value">{orderSummary.totalProducts}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Weight:</span>
                <span className="summary-value">{orderSummary.totalWeightKilos} kg ({orderSummary.totalWeightGrams} g)</span>
              </div>
              <div className="summary-item highlight-row">
                <span className="summary-label">Total:</span>
                <span className="summary-value total-value">{formatCurrency(orderSummary.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GCashPaymentLink = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipientMobile, setRecipientMobile] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');

  // GCash uses a specific format for their payment links
  const generatePaymentLink = () => {
    // Validate inputs
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!recipientMobile || !recipientMobile.match(/^09\d{9}$|^\+639\d{9}$/)) {
      setError('Please enter a valid Philippine mobile number (e.g., 09xxxxxxxxx or +639xxxxxxxxx)');
      return;
    }

    // Clear previous errors
    setError('');

    // Format the mobile number to ensure it's in the correct format
    // GCash typically uses +63 format
    let formattedMobile = recipientMobile;
    if (recipientMobile.startsWith('09')) {
      formattedMobile = '+63' + recipientMobile.substring(1);
    }

    // Create the payment link
    // Note: This is a simplified version. The actual GCash payment link structure may vary.
    const paymentLink = `https://www.gcash.com/fund-transfer?receiver=${encodeURIComponent(formattedMobile)}&amount=${encodeURIComponent(amount)}&description=${encodeURIComponent(description)}`;
    
    setGeneratedLink(paymentLink);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Payment link copied to clipboard!');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-600">GCash Payment Link Generator</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount (PHP)
        </label>
        <input
          id="amount"
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description (Optional)
        </label>
        <input
          id="description"
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="What's this payment for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
          Recipient's GCash Number
        </label>
        <input
          id="mobile"
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="09xxxxxxxxx or +639xxxxxxxxx"
          value={recipientMobile}
          onChange={(e) => setRecipientMobile(e.target.value)}
        />
      </div>
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={generatePaymentLink}
      >
        Generate Payment Link
      </button>
      
      {generatedLink && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Link
          </label>
          <div className="flex">
            <input
              readOnly
              className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={generatedLink}
            />
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
              onClick={copyToClipboard}
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this link with your payer to request payment via GCash
          </p>
        </div>
      )}
    </div>
  );
};

const StatisticsCardDailyTasks = ({ stats, setShowDatabaseConfiguration, setShowPendingPublicRegistrationModal, setShowPendingPrivateRegistrationModal, setShowPendingOrders, setShowPendingDeposits, setShowPendingWithdrawals, setShowRegisteredRegistrantsWithPendingDocuments }) => {
  // Sample stats data if not provided
  const defaultStats = {
    pendingOrders: { count: 24, change: 1200 },
    pendingDeposits: { count: 18, change: 3500 },
    pendingWithdrawals: { count: 9, change: -850 },
    pendingRegistrations: { count: 32, change: 6400 }
  };

  // Use provided stats or default
  const statsData = stats || defaultStats;

  // Format the change value as a peso currency
  const formatPeso = (amount) => {
    // Make sure amount is a number
    const numAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return '₱0';
    }
    
    const sign = numAmount > 0 ? '+' : '';
    return `${sign}₱${Math.abs(numAmount).toLocaleString()}`;
  };

  return (
    <div className="statistics-container">
      <h1>Daily Operation</h1>
      <div className="statistics-grid">

       {/* ACCEPTED ORDERS */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">ACCEPTED ORDERS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count} accepted orders</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <button className="readproduct-readproductbutton"
                     onClick={()=> {
                      setShowDatabaseConfiguration(true);
                      setShowPendingOrders(true);
                     }}>View all accepted orders</button>
          </div>
        </div>

         {/* DEPOSITED */}
         <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
              setShowPendingDeposits(true);
             }}>
          <div className="card-inner">
            <div className="card-header">SUCCESSFUL DEPOSITS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingDeposits.count} sucessful deposits</div>
              <div className={`stat-change ${Number(statsData.pendingDeposits.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingDeposits.change)}
              </div>
            </div>
            <div className="card-icon deposits-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <button className="readproduct-readproductbutton">View all successful deposits</button>
            <br/>
            <br/>
            <p>27 total deposits <button className="pendingorders-viewbutton"
                                              onClick={()=> {
                                                setShowDatabaseConfiguration(true);
                                                setShowPendingOrders(false);
                                              }}>
                                                view
                                      </button>
            </p>
            <p>20 pending deposits <button className="pendingorders-viewbutton"                          
                                         onClick={()=> {
                                           setShowDatabaseConfiguration(true);
                                           setShowPendingOrders(true);
                                         }}>
                                          view
                                </button>
            </p>
            <p>22 successful deposits <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                          }}>
                                            view
                                    </button>
            </p>
            <p>While 22 deposits are rejected <button className="pendingorders-viewbutton"
                                          onClick={()=> {
                                            setShowDatabaseConfiguration(true);
                                            setShowPendingOrders(false);
                                          }}>
                                            view
                                    </button>
            </p>
            <br/>
            <br/>
            <p>Processing transaction id: <input className="pendingorders-findbyidfield" type="text"/></p>
            <button className="readproduct-readproductbutton">View successful deposit by transaction ID</button>
          </div>
        </div>

          {/* REJECTED DEPOSITS */}
          <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
              setShowPendingDeposits(true);
             }}>
          <div className="card-inner">
            <div className="card-header">REJECTED DEPOSITS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingDeposits.count} rejected deposits</div>
              <div className={`stat-change ${Number(statsData.pendingDeposits.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingDeposits.change)}
              </div>
            </div>
            <div className="card-icon deposits-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <br/>
            <button className="readproduct-readproductbutton">View all rejected deposits</button>
          </div>
        </div>

          {/* WITHDRAWNS */}
          <div className="statistics-card"
              onClick={()=> {
                setShowDatabaseConfiguration(true);
                setShowPendingWithdrawals(true);
               }}>
          <div className="card-inner">
            <div className="card-header">WITHDRAWS</div>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingWithdrawals.count}</div>
              <div className={`stat-change ${Number(statsData.pendingWithdrawals.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingWithdrawals.change)}
              </div>
            </div>
            <div className="card-icon withdrawals-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20"></polyline>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatisticsCardProductCRUD = ({ stats, setShowDatabaseConfiguration, setShowCreateProduct, setShowProductReader}) => {
  // Sample stats data if not provided
  const defaultStats = {
    pendingOrders: { count: 24, change: 1200 },
    pendingDeposits: { count: 18, change: 3500 },
    pendingWithdrawals: { count: 9, change: -850 },
    pendingRegistrations: { count: 32, change: 6400 }
  };

  // Use provided stats or default
  const statsData = stats || defaultStats;

  // Format the change value as a peso currency
  const formatPeso = (amount) => {
    // Make sure amount is a number
    const numAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return '₱0';
    }
    
    const sign = numAmount > 0 ? '+' : '';
    return `${sign}₱${Math.abs(numAmount).toLocaleString()}`;
  };

  return (
    <div className="statistics-container">
      <h1>CRUD Operations ( PRODUCT )</h1>
      <div className="statistics-grid">

          {/* PENDING ORDERS */}
          <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">Create ( product )</div>
            <button className="readproduct-readproductbutton"
                    onClick={()=> {
                      setShowDatabaseConfiguration(true);
                      setShowCreateProduct(true)
                     }}>Show create product form</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count}</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
         </div>

          {/* PENDING PUBLIC CITIZENSHIPS REGISTRATIONS */}
          <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">Read ( product )</div>
            <p>Product ID:</p>
            <input type="text"
                   className="readproduct-productidfield"/>
            <button className="readproduct-readproductbutton">Read product</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count}</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* PENDING ORDERS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
             }}>
          <div className="card-inner">
            <div className="card-header">Update ( product )</div>
            <p>Product ID:</p>
            <input type="text"
                   className="readproduct-productidfield"/>
            <button className="readproduct-readproductbutton">Read product</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count}</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* PENDING DEPOSITS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
             }}>
          <div className="card-inner">
            <div className="card-header">Delete ( product ) </div>
            <p>Product ID:</p>
            <input type="text"
                   className="readproduct-productidfield"/>
            <button className="readproduct-readproductbutton">Read product</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingDeposits.count}</div>
              <div className={`stat-change ${Number(statsData.pendingDeposits.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingDeposits.change)}
              </div>
            </div>
            <div className="card-icon deposits-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ProductReader = ({ product, onClose, setShowProductReader, setShowPendingOrders}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animation delay for entrance
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleClose = () => {

   // setIsVisible(false);
   // setTimeout(() => {
   //   onClose();
   // }, 300); // Wait for exit animation

   setShowProductReader(false);
   setShowPendingOrders(true);

  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className={`product-viewer-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="product-viewer-container">
        <button className="close-button" onClick={handleClose}>
          <X size={24} />
        </button>
        
        <div className="product-header">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-rating">
            <Star className="icon" />
            <span className="highlight">{product.rating}</span>
            <span className="reviews">({product.reviews} reviews)</span>
          </div>
        </div>
        
        <div className="product-grid">
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <div className="main-image">
                <img src={product.images[0].url} alt={product.name} />
              </div>
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}
            
            <div className="thumbnail-container">
              {product.images && product.images.slice(1).map((image, index) => (
                <div key={index} className="thumbnail">
                  <img src={image.url} alt={`${product.name} - View ${index + 2}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-info">
            <div className="info-section">
              <div className="price-container">
                <Tag className="icon" />
                <span className="label">Price:</span>
                <span className="price highlight">{formatCurrency(product.price)}</span>
              </div>
              
              <div className="stock-container">
                <Package className="icon" />
                <span className="label">In Stock:</span>
                <span className={`stock ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                  {product.stock > 0 ? product.stock : 'Out of Stock'}
                </span>
              </div>
              
              <div className="category-container">
                <Info className="icon" />
                <span className="label">Category:</span>
                <span className="category">{product.category}</span>
              </div>
              
              <div className="weight-container">
                <Truck className="icon" />
                <span className="label">Weight:</span>
                <span className="weight">{product.weightingrams}g</span>
              </div>
            </div>
            
            <div className="description-container">
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="features-container">
                <h2>Features</h2>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <Award className="icon" />
                      <span>{feature.name}: {feature.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.specifications && product.specifications.length > 0 && (
              <div className="specs-container">
                <h2>Specifications</h2>
                <div className="specs-grid">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="spec-item">
                      <span className="spec-name">{spec.name}:</span>
                      <span className="spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {product.warranty && (
              <div className="warranty-container">
                <FileText className="icon" />
                <span className="label">Warranty:</span>
                <span className="warranty">{product.warranty}</span>
              </div>
            )}

            {product.warranty && (
              <div className="warranty-container">
                <FileText className="icon" />
                <span className="label">Specifications:</span>
                <span className="warranty">{product.warranty}</span>
              </div>
            )}

             {product.warranty && (
              <div className="warranty-container">
                <FileText className="icon" />
                <span className="label">Features:</span>
                <span className="warranty">{product.warranty}</span>
              </div>
            )}
            
            {product.videoUrl && (
              <div className="video-container">
                <Video className="icon" />
                <span className="video-label">Product Video</span>
                <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                  Watch Video
                </a>
              </div>
            )}
          </div>

        </div>
        
        {product.focuseddata && (
          <div className="focused-data">
            <h2>Pricing Details</h2>
            <div className="focused-grid">
              <div className="focused-item">
                <span className="focused-label">Price:</span>
                <span className="focused-value highlight">{formatCurrency(product.focuseddata.price.price)}</span>
              </div>
              <div className="focused-item">
                <span className="focused-label">Capital:</span>
                <span className="focused-value">{formatCurrency(product.focuseddata.price.capital)}</span>
              </div>
              <div className="focused-item">
                <span className="focused-label">Transaction:</span>
                <span className="focused-value">{formatCurrency(product.focuseddata.price.transactiongiveaway)}</span>
              </div>
              <div className="focused-item">
                <span className="focused-label">Profit:</span>
                <span className="focused-value highlight">{formatCurrency(product.focuseddata.price.omsiapprofit)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/*
        {product.orderdetails && (
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-grid">
              <div className="order-section">
                <h3>Quantity</h3>
                <div className="order-item">
                  <span className="quantity-value highlight">{product.orderdetails.quantity}</span>
                </div>
              </div>
              
              <div className="order-section">
                <h3>Product</h3>
                <div className="order-item">
                  <span className="order-label">Price:</span>
                  <span className="order-value">{formatCurrency(product.orderdetails.product.price)}</span>
                </div>
                <div className="order-item">
                  <span className="order-label">Capital:</span>
                  <span className="order-value">{formatCurrency(product.orderdetails.product.capital)}</span>
                </div>
                <div className="order-item">
                  <span className="order-label">Transaction:</span>
                  <span className="order-value">{formatCurrency(product.orderdetails.product.transactiongiveaway)}</span>
                </div>
                <div className="order-item">
                  <span className="order-label">Profit:</span>
                  <span className="order-value highlight">{formatCurrency(product.orderdetails.product.omsiapprofit)}</span>
                </div>
              </div>
              
              <div className="order-section">
                <h3>Shipment</h3>
                <div className="order-item">
                  <span className="order-label">Total Weight:</span>
                  <span className="order-value">{product.orderdetails.shipment.totalkilos}kg</span>
                </div>
                <div className="order-item">
                  <span className="order-label">Shipping Fee:</span>
                  <span className="order-value highlight">{formatCurrency(product.orderdetails.shipment.totalshipmentfee)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        */}

        {/*
        <div className="action-buttons">
          <button className="add-to-cart-button">
            <ShoppingCart className="icon" />
            Add to Cart
          </button>
        </div>
        */}

      </div>
    </div>
  );
};

const CreateProduct = ({setShowDatabaseConfiguration, setShowCreateProduct}) => {

 const [showCreateProductConfiguration, setShowCreateProductConfiguration] = useState(false);

 return (
  <div id="database-createproductcontainer">

    <div id="database-createproductcontainer-viewcontainer">

      <div id="database-createproductcontainer-viewcontainer-closebuttoncontainer">
        <button id="database-createproductcontainer-viewcontainer-closebuttoncontainer-closebutton"
                onClick={()=> {
                  setShowDatabaseConfiguration(false)
                  setShowCreateProduct(false)
                }}>
          <FaTimes />
        </button>
      </div>

      <div id="database-createproductcontainer-viewcontainer-headerindicationcontainer">
        <h1 id="database-createproductcontainer-viewcontainer-headerindicationcontainer-headerindication">Create Product</h1>
      </div>

      <Col className="database-createproductcontainer-viewcontainer-formcontainer">
        <form className="database-createproductcontainer-viewcontainer-formcontainer-form">
           <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer">
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-imageslayoutcontainer">
              <div className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-imagescontainer">
                  <label htmlFor="productimage" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-imagescontainer-label"><FaFileAlt size={30}/> Select image</label>
                  <input style={{display:"none"}} id="productimage" type="file"/>
                 <button className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-imagescontainer-addimagebutton">add image tp product images</button>
              </div>
            </Col>
            <Col xs={6}
                 md={6}
                 lg={6}
                 className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer">
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer">
                <Col xs={12}
                     md={6}
                     lg={6}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaMoneyBillWave size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Price: </span><input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/></p>
                </Col>
                <Col xs={12}
                     md={6}
                     lg={6}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaExclamationTriangle size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">In stock: </span><input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/></p>
                </Col>
                <Col xs={12}
                     md={6}
                     lg={6}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaEnvelope size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Category: </span><input type="text" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/></p>
                </Col>
                <Col xs={12}
                     md={6}
                     lg={6}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaInfoCircle size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Weight in grams: </span><input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/></p>
                </Col>
              </Row>
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer">
                <Col xs={12}
                     md={12}
                     lg={12}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-descpriptionfieldheaderindicationcontainer">
                  <h1 className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-descpriptionfieldheaderindicationcontainer-descriptioheaderindication">Description</h1>
                </Col>
                <Col xs={12}
                     md={12}
                     lg={12}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                  <textarea className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-descpriptionfieldheaderindicationcontainer-descriptionfield"/>
                </Col>
              </Row>
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer">
                <Col xs={12}
                     md={6}
                     lg={6}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaInfoCircle size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Warranty: </span><input type="text" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/></p>
                </Col>
              </Row>
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer">
                <Col xs={12}
                     md={6}
                     lg={6}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaEye size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Product video: </span><input type="text" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/></p>
                </Col>
              </Row>
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer">
                <Col xs={12}
                     md={12}
                     lg={12}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaEye size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Specifications: </span><input type="text" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/><button className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-addspecificationbutton">add specification</button></p>
                </Col>
              </Row>
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer">
                <Col xs={12}
                     md={12}
                     lg={12}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer">
                   <p className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldindication"><FaEye size={30}/> <span className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldspanindication">Features: </span><input type="text" className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-productfieldfieldindication"/><button className="database-createproductcontainer-viewcontainer-formcontainer-form-imagesandproductdetailsgridcontainer-productdetailslayoutcontainer-productdetailsgridcontainer-pricefieldcontainer-addfeaturebutton">add feature</button></p>
                </Col>
              </Row>
            </Col>
            <Col xs={12}
                 md={12}
                 lg={12}
                 className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer">
              <Row className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer">
                <Col xs={12}
                     md={3}
                     lg={3}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer">
                  <p className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-fieldindication">Price: <input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-field"/></p>
                </Col>
                <Col xs={12}
                     md={3}
                     lg={3}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer">
                  <p className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-fieldindication">Capital: <input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-field"/></p>
                </Col>
                <Col xs={12}
                     md={3}
                     lg={3}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer">
                  <p className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-fieldindication">Transaction give away: <input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-field"/></p>
                </Col>
                <Col xs={12}
                     md={3}
                     lg={3}
                     className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer">
                  <p className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-fieldindication">Profit: <input type="number" className="database-createproductcontainer-viewcontainer-formcontainer-form-pricingdetailslayoutcontainer-gridcontainer-colcontainer-field"/></p>
                </Col>
              </Row>
            </Col>
            <Col xs={12}
                 md={12}
                 lg={12}
                 className="database-createproductcontainer-viewcontainer-formcontainer-form-submitbuttoncontainer">
              <button className="database-createproductcontainer-viewcontainer-formcontainer-form-submitbuttoncontainer-createproductbutton">Create Product</button>
            </Col>
           </Row>
        </form>
      </Col>

    </div>

    {
      showCreateProductConfiguration && (
       <div id="database-createproductcontainer-configurationcontainer">
       </div>
      )
    }

  </div>
 )
}

const DeleteProductReader = ({ product, onClose, onDelete, isOpen }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false);
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    
    try {
      setIsDeleting(true);
      // Replace this with your actual delete API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay
      onDelete(product.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-product-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="delete-product-modal" style={{
        width: '100%',
        height: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <button className="close-button" onClick={onClose} style={{
          position: 'absolute',
          right: '16px',
          top: '16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10
        }}>
          <X size={24} />
        </button>

        <div className="modal-content" style={{
          padding: '24px',
          height: '100%',
          width: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="icon-container" style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            {isConfirming ? (
              <AlertCircle size={64} className="warning-icon" style={{ color: '#ff4d4f' }} />
            ) : (
              <Trash size={64} className="trash-icon" style={{ color: '#ff4d4f' }} />
            )}
          </div>

          <h2 className="modal-title" style={{
            textAlign: 'center',
            fontSize: '24px',
            marginBottom: '16px'
          }}>
            {isConfirming ? "Are you sure?" : "Delete Product"}
          </h2>

          <p className="product-info" style={{
            textAlign: 'center',
            fontSize: '16px',
            marginBottom: '24px'
          }}>
            {isConfirming ? (
              "This action cannot be undone. This will permanently delete the product."
            ) : (
              <>You're about to delete <strong>{product.name}</strong></>
            )}
          </p>

          {!isConfirming && (
            <div className="product-details" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              width: '100%',
              flex: 1,
              overflowY: 'auto'
            }}>
              <div className="product-basic-info" style={{
                backgroundColor: '#f7f7f7',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '12px' }}>Basic Information</h3>
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Stock:</strong> {product.stock} units</p>
                <p><strong>Weight:</strong> {product.weightingrams} grams</p>
                <p><strong>Rating:</strong> {product.rating} ({product.reviews} reviews)</p>
                <p><strong>Warranty:</strong> {product.warranty || "None"}</p>
              </div>
              
              <div className="product-description" style={{
                backgroundColor: '#f7f7f7',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '12px' }}>Description</h3>
                <p>{product.description}</p>
              </div>
              
              {product.features && product.features.length > 0 && (
                <div className="product-features" style={{
                  backgroundColor: '#f7f7f7',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ marginBottom: '12px' }}>Features</h3>
                  <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                    {product.features.map((feature, index) => (
                      <li key={index}><strong>{feature.title}:</strong> {feature.description}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.specifications && product.specifications.length > 0 && (
                <div className="product-specifications" style={{
                  backgroundColor: '#f7f7f7',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ marginBottom: '12px' }}>Specifications</h3>
                  <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                    {product.specifications.map((spec, index) => (
                      <li key={index}><strong>{spec.name}:</strong> {spec.value}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.videoUrl && (
                <div className="product-video" style={{
                  backgroundColor: '#f7f7f7',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ marginBottom: '12px' }}>Product Video</h3>
                  <p><a href={product.videoUrl} target="_blank" rel="noopener noreferrer">View Video</a></p>
                </div>
              )}
              
              {product.focuseddata && (
                <div className="product-focused-data" style={{
                  backgroundColor: '#f7f7f7',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ marginBottom: '12px' }}>Financial Details</h3>
                  <p><strong>Base Price:</strong> ${product.focuseddata.price?.price || 0}</p>
                  <p><strong>Capital:</strong> ${product.focuseddata.price?.capital || 0}</p>
                  <p><strong>Transaction Giveaway:</strong> ${product.focuseddata.price?.transactiongiveaway || 0}</p>
                  <p><strong>Profit:</strong> ${product.focuseddata.price?.omsiapprofit || 0}</p>
                </div>
              )}
            </div>
          )}

          {!isConfirming && product.images && product.images.length > 0 && (
            <div className="product-images" style={{
              width: '100%',
              marginTop: '24px'
            }}>
              <h3 style={{ marginBottom: '12px' }}>Product Images</h3>
              <div className="image-gallery" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                width: '100%'
              }}>
                {product.images.map((image, index) => (
                  <div key={index} className="image-container" style={{
                    border: '1px solid #eaeaea',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={image.url} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className="product-image"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    {image.caption && (
                      <p className="image-caption" style={{
                        padding: '8px',
                        margin: '0',
                        backgroundColor: '#f7f7f7',
                        fontSize: '14px'
                      }}>
                        {image.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="button-group" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '32px',
            padding: '16px',
            borderTop: '1px solid #eaeaea'
          }}>
            <button
              className="cancel-button"
              onClick={onClose}
              disabled={isDeleting}
              style={{
                padding: '10px 24px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: isDeleting ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button
              className={`delete-button ${isConfirming ? 'confirm' : ''}`}
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: isConfirming ? '#ff4d4f' : '#ff7875',
                color: 'white',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isDeleting ? (
                <div className="loading-spinner" style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  borderTop: '3px solid white',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : isConfirming ? (
                "Confirm Delete"
              ) : (
                "Delete Product"
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const StatisticsCardRegistrantCRUD = ({ stats, setShowDatabaseConfiguration, setShowCreateProduct, setShowProductReader}) => {
  // Sample stats data if not provided
  const defaultStats = {
    pendingOrders: { count: 24, change: 1200 },
    pendingDeposits: { count: 18, change: 3500 },
    pendingWithdrawals: { count: 9, change: -850 },
    pendingRegistrations: { count: 32, change: 6400 }
  };

  // Use provided stats or default
  const statsData = stats || defaultStats;

  // Format the change value as a peso currency
  const formatPeso = (amount) => {
    // Make sure amount is a number
    const numAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return '₱0';
    }
    
    const sign = numAmount > 0 ? '+' : '';
    return `${sign}₱${Math.abs(numAmount).toLocaleString()}`;
  };

  return (
    <div className="statistics-container">
      <h1>CRUD Operations ( REGISTRANT )</h1>
      <div className="statistics-grid">

          {/* PENDING ORDERS */}
          <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">Create ( registrant )</div>
            <button className="readproduct-readproductbutton"
                    onClick={()=> {
                      setShowDatabaseConfiguration(true);
                      setShowCreateProduct(true)
                     }}>Show create registrant form</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count}</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
         </div>

          {/* PENDING PUBLIC CITIZENSHIPS REGISTRATIONS */}
          <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">Read ( registrant )</div>
            <p>Product ID:</p>
            <input type="text"
                   className="readproduct-productidfield"/>
            <button className="readproduct-readproductbutton">Read registrant</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count}</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* PENDING ORDERS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
             }}>
          <div className="card-inner">
            <div className="card-header">Update ( registrant )</div>
            <p>Product ID:</p>
            <input type="text"
                   className="readproduct-productidfield"/>
            <button className="readproduct-readproductbutton">Read registrant</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingOrders.count}</div>
              <div className={`stat-change ${Number(statsData.pendingOrders.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingOrders.change)}
              </div>
            </div>
            <div className="card-icon orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* PENDING DEPOSITS */}
        <div className="statistics-card"
             onClick={()=> {
              setShowDatabaseConfiguration(true);
             }}>
          <div className="card-inner">
            <div className="card-header">Delete ( registrant ) </div>
            <p>Product ID:</p>
            <input type="text"
                   className="readproduct-productidfield"/>
            <button className="readproduct-readproductbutton">Read registrant</button>
            <div className="card-content">
              <div className="stat-value">{statsData.pendingDeposits.count}</div>
              <div className={`stat-change ${Number(statsData.pendingDeposits.change) >= 0 ? 'positive' : 'negative'}`}>
                {formatPeso(statsData.pendingDeposits.change)}
              </div>
            </div>
            <div className="card-icon deposits-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DatabaseComponent;
