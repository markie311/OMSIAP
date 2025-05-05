"use client"

import "../../styles/database/database.scss"

import { useState, useEffect, useRef } from "react"

import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap"

import { FaEye, 
         FaRecycle,
         FaRedoAlt,
         FaCoins,
         FaQuestionCircle,
         FaLayerGroup, 
         FaSpinner,
         FaHistory,
         FaEdit, 
         FaFileImage, 
         FaBoxOpen, 
         FaWeight, 
         FaCheckCircle, 
         FaYoutube, 
         FaClipboardList,
         FaPlus,
         FaStar, 
         FaTimes, 
         FaSearch, 
         FaExclamationTriangle, 
         FaCalendarAlt, 
         FaLock, 
         FaEllipsisH,
         FaEyeSlash, 
         FaArrowLeft,
         FaArrowRight,
         FaFileUpload, 
         FaUserClock, 
         FaIdCard, 
         FaReceipt, 
         FaTag, 
         FaDollarSign, 
         FaCircle, 
         FaCreditCard,
         FaShippingFast,
         FaBox, 
         FaCheck, 
         FaUser, 
         FaAddressCard, 
         FaEnvelope, 
         FaTimesCircle, 
         FaExclamationCircle, 
         FaMoneyBillWave, 
         FaClock, 
         FaFileAlt, 
         FaUserCircle,
         FaPhone, 
         FaTrash, 
         FaInfoCircle, 
         FaTruckMonster} from 'react-icons/fa';

import { X, Star, Package, ShoppingCart, Tag, Info, FileText, Video, Award, Truck, AlertCircle, Trash, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import axiosCreatedInstance from '../lib/axiosutil.js';

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
      pendingOrders: { count: 24 },
      pendingDeposits: { count: 18 },
      pendingWithdrawals: { count: 9 },
      pendingRegistrations: { count: 32 }
    };

  const [showDatabaseConfiguration, setShowDatabaseConfiguration] = useState(false);
  const [showPendingPublicRegistrationModal, setShowPendingPublicRegistrationModal] = useState(false);
  const [showPendingPrivateRegistrationModal, setShowPendingPrivateRegistrationModal] = useState(false);


  const [showTotalOrders, setShowTotalOrders] = useState(false)
  const [showPendingOrders, setShowPendingOrders] = useState(false)
  const [showConfirmedOrders, setShowConfirmedOrders] = useState(false)
  const [showOrdersForShipping, setShowOrdersForShipping] = useState(false)
  const [showShippedOrders, setShowShippedOrders] = useState(false)
  const [showSuccessfulOrders, setShowSuccessfulOrders] = useState(false)
  const [showRejectedOrders, setShowRejectedOrders] = useState(false)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const [showTotalCurrencyExchange, setShowTotalCurrencyExchange] = useState(false)
  const [showPendingCurrencyExchange, setShowPendingCurrencyExchange] = useState(false)
  const [showSuccessfulCurrencyExchange, setShowSuccessfulCurrencyExchange] = useState(false)
  const [showRejectedCurrencyExchange, setShowRejectedCurrencyExchange] = useState(false)

  const [showTotalWithdrawals, setShowTotalWithdrawals] = useState(false)
  const [showPendingWithdrawals, setShowPendingWithdrawals] = useState(false)
  const [showSuccessfulWithdrawals, setShowSuccessfulWithdrawals] = useState(false)
  const [showRejectedWithdrawals, setShowRejectedWithdrawals] = useState(false)

  const [showCreditTransaction, setShowCreditTransaction] = useState(false)
  
  const [showRegisteredRegistrantsWithVerifiedDocuments, setShowRegisteredRegistrantsWithVerifiedDocuments] = useState(false)
  const [showRegisteredRegistrantsWithPendingDocuments, setShowRegisteredRegistrantsWithPendingDocuments] = useState(false)
  const [showRegisteredRegistrantsWithRejectedDocuments, setShowRegisteredRegistrantsWithRejectedDocuments] = useState(false)

  const [acceptorderloadingindication, acceptorderloadingindicationcb] = useState(false)

  const [showCreateProduct, setShowCreateProduct] = useState(false)

  const [showPendingOrderDetails, setShowPendingOrderDetails] = useState(false)

  const [showProductReader, setShowProductReader] = useState(false)
  const [showUpdateProductForm, setShowUpdateProductForm] = useState(false)

  const [showDeleteProductReader, setShowDeleteProductReader] = useState(false)

  const [showCreateRegistrantForm, setShowCreateRegistrantForm] = useState(false)
  const [showRegistrantDetailsDisplay, setShowRegistrantDetailsDisplay] = useState(false)
  const [showUpdateRegistrantFormDisplay, setShowUpdateRegistrantFormDisplay] = useState(false)

  const [deleteproductfield, deleteproductfieldcb] = useState("")
   
  const [omsiapdata, omsiapdatacb] = useState({
     _id: "Code-113-1143",
     people: [
      {
        id: "MFATIP-1111-1111",
        loginstatus: "active",
        status: {
          type: "complete",
          indication: "Documents verified",
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
        id: "MFATIP-2222-2222",
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
      },
      {
        id: "MFATIP-3333-3333",
        loginstatus: "active",
        status: {
          type: "incomplete",
          indication: "rejected documents",
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
     ],
     products: [],
     transactions: {
       orders: {
        total: [
        ],
        pending: [
        ],
        accepted: [
        ],
        rejected: [
        ]
       },
       deposits: {
        total: [
        ],
        pending: [
        ],
        successful: [
        ],
        rejected: [
        ]
       },
       withdrawals: {
        total: [
        ],
        pending: [ 
        ],
        successful: [
        ],
        rejected: [
        ]
       }
     },
     pendingfunds: 0
  })

  const [totalorders, totalorderscb] = useState([])
  const [pendingorders, pendingorderscb] = useState([])
  const [confirmedorders, confirmedorderscb] = useState([])
  const [ordersforshipping, ordersforshippingcb] = useState([])
  const [shippedorders, shippedorderscb] = useState([])
  const [successfulorders, successfulorderscb] = useState([])
  const [rejectedorders, rejectedorderscb] = useState([])

  const [totalcurrencyexchange, totalcurrencyexchangecb] = useState([])
  const [pendingcurrencyexchange, pendingcurrencyexchangecb] = useState([])
  const [successfulcurrencyexchange, successfulcurrencyexchangecb] = useState([])
  const [rejectedcurrencyexchange, rejectedcurrencyexchangecb] = useState([])

  const [totalwithdrawals, totalwithdrawalscb] = useState([])
  const [pendingwithdrawals, pendingwithdrawalscb] = useState([])
  const [successfulwithdrawals, successfulwithdrawalscb] = useState([])
  const [rejectedwithdrawals, rejectedwithdrawalscb] = useState([])
 
  const [verifiedmfatipregistrants, verifiedmfatipregistrantscb] = useState([])
  const [pendingmfatipregistrants, pendingmfatipregistrantscb] = useState([])
  const [mfatipregistrantsrejecteddocuments, mfatipregistrantsrejecteddocumentscb] = useState([])
  
  const [orderDetailsObject, setOrderDetailsObject] = useState(
   {
    id: "ID",
    date: "Date",
    type: "Type",
    amount: 0,
    status: "Status",
    paymentmethod: "Payment method",
    details: {
    products: [],
    shippingInfo: {
      street: "street",
      trademark: "trademark",
      baranggay: "baranggay",
      city: "city",
      province: "province",
      zipcode: "zipcode",
      country: "country"
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
   }
  )

  useEffect(() => {

    fetchOmsiapData();

  }, [
    totalorderscb, pendingorderscb, confirmedorderscb,  ordersforshippingcb, shippedorderscb, successfulorderscb, rejectedorderscb,
    totalcurrencyexchangecb, pendingcurrencyexchangecb, successfulcurrencyexchangecb, rejectedcurrencyexchangecb,
    totalwithdrawalscb, pendingwithdrawalscb, successfulwithdrawalscb, rejectedwithdrawalscb,
    verifiedmfatipregistrantscb, pendingmfatipregistrantscb, mfatipregistrantsrejecteddocumentscb
  ]);

  // Client-side fetchOmsiapData function 
  const fetchOmsiapData = async () => {

  try {
    const response = await axiosCreatedInstance.get("/omsiap/getomsiapdata");
    const omsiapdata = response.data;
    
    // Process transactions data
    if (omsiapdata && omsiapdata.transactions) {
      // Update orders data
      if (omsiapdata.transactions.orders) {
        totalorderscb(omsiapdata.transactions.orders.total || []);
        pendingorderscb(omsiapdata.transactions.orders.pending || []);
        confirmedorderscb(omsiapdata.transactions.orders.confirmed || []);
        rejectedorderscb(omsiapdata.transactions.orders.rejected || []);
        // Add new order status categories
        ordersforshippingcb(omsiapdata.transactions.orders.forshipping || []);
        shippedorderscb(omsiapdata.transactions.orders.shipped || []);
        successfulorderscb(omsiapdata.transactions.orders.successful || []);
      }
      
      // Update currency exchange data
      if (omsiapdata.transactions.currencyexchange) {
        totalcurrencyexchangecb(omsiapdata.transactions.currencyexchange.total || []);
        pendingcurrencyexchangecb(omsiapdata.transactions.currencyexchange.pending || []);
        successfulcurrencyexchangecb(omsiapdata.transactions.currencyexchange.successful || []);
        rejectedcurrencyexchangecb(omsiapdata.transactions.currencyexchange.rejected || []);
      }
      
      // Update withdrawals data
      if (omsiapdata.transactions.withdrawals) {
        totalwithdrawalscb(omsiapdata.transactions.withdrawals.total || []);
        pendingwithdrawalscb(omsiapdata.transactions.withdrawals.pending || []);
        successfulwithdrawalscb(omsiapdata.transactions.withdrawals.successful || []);
        rejectedwithdrawalscb(omsiapdata.transactions.withdrawals.rejected || []);
      }
    }
    
    // Process MFATIP registrants data
    if (omsiapdata && omsiapdata.people) {
      const verified = omsiapdata.people.filter(person => 
        person.status && person.status.type === "complete"
      );
      
      const pending = omsiapdata.people.filter(person => 
        person.status &&
        person.status.type === "incomplete" &&
        person.status.indication === "pending documents"
      );
      
      const rejected = omsiapdata.people.filter(person => 
        person.status &&
        person.status.type === "incomplete" &&
        person.status.indication === "rejected documents"
      );
      
      verifiedmfatipregistrantscb(verified);
      pendingmfatipregistrantscb(pending);
      mfatipregistrantsrejecteddocumentscb(rejected);
    }
  } catch (err) {
    console.error('Error fetching OMSIAP data:', err);
  }
  };


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
  address: "Street",
  city: "City",
  state: "State",
  zipCode: "Zip code",
  country: "Country"
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

  const [credittransactionobject, credittransactionobjectcb] = useState({
    id: "ID",
    date: "2025-03-20T10:30:00Z",
    type: "Credit",
    amount: 1250.00,
    status: "Completed",
    paymentmethod: "Credit Card",
    details: {
      products: [
        {
          name: "Premium Widget",
          quantity: 2,
          price: 450.00
        },
        {
          name: "Deluxe Gadget",
          quantity: 1,
          price: 350.00
        }
      ],
      shippingInfo: {
        address: "123 Main Street, Apt 4B",
        city: "Metropolis",
        state: "NY",
        zipCode: "10001",
        country: "United States"
      },
      orderSummary: {
        merchandiseTotal: 1250.00,
        shippingTotal: 0.00,
        totalTransactionGiveaway: 0.00,
        totalOmsiaProfit: 312.50,
        totalCapital: 937.50,
        totalItems: 3,
        totalProducts: 2,
        totalWeightGrams: 1500,
        totalWeightKilos: 1.5,
        total: 1250.00
      },
      reference: {
        referencenumber: 1231232,
        transactionimage: null
      }
    }
  });

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


  const [product, setproduct] = useState({
    id: "12312312",
    name: "12312312",
    price: 0,
    category: "12312312",
    description: "12312312",
    weightingrams: 1000,
    images: ['../images/market/products/lighter.jpg', '../images/market/products/lighter.jpg', '../images/market/products/lighter.jpg', '../images/market/products/lighter.jpg'],
    stock: 0,
    rating: 0,
    reviews: 0,
    specifications: ["Specification 1", "Specification 2", "Specification 3"],
    videoUrl: "12312312", 
    features: ["Feature 1", "Feature 2", "Feature 3"],
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
  });

  const [registrantdata, setregistrantdata] = useState({
    id: "12312312",
    loginstatus: "12312312",
    status: {
    type: "12312312",
    indication: "12312312",
    requests: []
  },
  name: {
  firstname: "12312312",
  middlename: "12312312",
  lastname: "12312312",
  nickname: "12312312"
  },
  contact: {
  phonenumber: "12312312",
  telephonenumber: "12312312",
  emailaddress: "12312312",
  address: {
    street: "12312312",
    baranggay: "12312312",
    trademark: "12312312",
    city: "12312312",
    province: "12312312",
    country: "12312312"
  }
  },
  personaldata: {
  age: "12312312",
  sex: "12312312",
  bloodtype: "12312312",
  dob: "12312312",
  citizenship: "12312312",
  civil_status: "12312312",
  government_issued_identification: {
    frontphoto: {
      name: "12312312",
      description: "12312312",
      image: {
      data: "12312312",
      contenttype: "12312312"
      },
      uploaddate: "12312312"
    },
    backphoto: {
      name: "12312312",
        description: "12312312",
        image: {
        data: "12312312",
        contenttype: "12312312"
        },
        uploaddate: "12312312"
    }
  },
  birthcertificate: {
    frontphoto: {
      name: "12312312",
      description: "12312312",
      image: {
        data: "12312312",
        contenttype: "12312312"
      },
      uploaddate: "12312312"
      },
      backphoto: {
        name: "12312312",
        description: "12312312",
        image: {
          data: "12312312",
          contenttype: "12312312"
        },
        uploaddate: "12312312"
      }
  }
  },
  credits: {
  omsiapawasto: {
    id: "12312312",
    amount: "12312312",
    transactions: {
      deposits: [],
      widthdrawals: [],
      successful_deposits: [],
      successful_widthdrawals: []
    }
  }
  },
  transactions: []
  })

 return (
   <div id="database-container">
     <div id="database-container-viewcontainer">

       <DatabaseHeader />

       <FilterDataByDate data={data}/>

       <StatisticsCardOperationBasis stats={customStats}

       
                                     setShowDatabaseConfiguration={setShowDatabaseConfiguration}

                                     setShowTotalOrders={setShowTotalOrders}
                                     setShowPendingOrders={setShowPendingOrders}
                                     setShowConfirmedOrders={setShowConfirmedOrders}
                                     setShowOrdersForShipping={setShowOrdersForShipping}
                                     setShowShippedOrders={setShowShippedOrders}
                                     setShowSuccessfulOrders={setShowSuccessfulOrders}
                                     setShowRejectedOrders={setShowRejectedOrders}
                                     setShowOrderDetails={setShowOrderDetails}

                                     setShowTotalCurrencyExchange={setShowTotalCurrencyExchange}
                                     setShowPendingCurrencyExchange={setShowPendingCurrencyExchange}
                                     setShowSuccessfulCurrencyExchange={setShowSuccessfulCurrencyExchange}
                                     setShowRejectedCurrencyExchange={setShowRejectedCurrencyExchange}
               
                                     setShowTotalWithdrawals={setShowTotalWithdrawals}
                                     setShowPendingWithdrawals={setShowPendingWithdrawals}
                                     setShowSuccessfulWithdrawals={setShowSuccessfulWithdrawals}
                                     setShowRejectedWithdrawals={setShowRejectedWithdrawals}

                                     
                                     setShowRegisteredRegistrantsWithVerifiedDocuments={setShowRegisteredRegistrantsWithVerifiedDocuments}
                                     setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                                     setShowRegisteredRegistrantsWithRejectedDocuments={setShowRegisteredRegistrantsWithRejectedDocuments}

                                     totalorders={totalorders}
                                     pendingorders={pendingorders}
                                     confirmedorders={confirmedorders}
                                     ordersforshipping={ordersforshipping}
                                     shippedorders={shippedorders}
                                     successfulorders={successfulorders}
                                     rejectedorders={rejectedorders}

                                     totalcurrencyexchange={totalcurrencyexchange}
                                     pendingcurrencyexchange={pendingcurrencyexchange}
                                     successfulcurrencyexchange={successfulcurrencyexchange}
                                     rejectedcurrencyexchange={rejectedcurrencyexchange}

                                     totalwithdrawals={totalwithdrawals}
                                     pendingwithdrawals={pendingwithdrawals}
                                     successfulwithdrawals={successfulwithdrawals}
                                     rejectedwithdrawals={rejectedwithdrawals}

                                     verifiedmfatipregistrants={verifiedmfatipregistrants}
                                     pendingmfatipregistrants={pendingmfatipregistrants}
                                     mfatipregistrantsrejecteddocuments={mfatipregistrantsrejecteddocuments}

                                     setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal}
                                     setShowPendingPrivateRegistrationModal={setShowPendingPrivateRegistrationModal}
                       />

{/*
       <StatisticsCardOperationScope stats={customStats}

                                     setShowDatabaseConfiguration={setShowDatabaseConfiguration}


                                     setShowTotalOrders={setShowTotalOrders}
                                     setShowPendingOrders={setShowPendingOrders}
                                     setShowAcceptedOrders={setShowAcceptedOrders}
                                     setShowRejectedOrders={setShowRejectedOrders}
                                     setShowOrderDetails={setShowOrderDetails}


                                     setShowTotalCurrencyExchange={setShowTotalCurrencyExchange}
                                     setShowPendingCurrencyExchange={setShowPendingCurrencyExchange}
                                     setShowSuccessfulCurrencyExchange={setShowSuccessfulCurrencyExchange}
                                     setShowRejectedCurrencyExchange={setShowRejectedCurrencyExchange}

                                     setShowTotalWithdrawals={setShowTotalWithdrawals}
                                     setShowPendingWithdrawals={setShowPendingWithdrawals}
                                     setShowSuccessfulWithdrawals={setShowSuccessfulWithdrawals}
                                     setShowRejectedWithdrawals={setShowRejectedWithdrawals}

                                     setShowRegisteredRegistrantsWithVerifiedDocuments={setShowRegisteredRegistrantsWithVerifiedDocuments}
                                     setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                                     setShowRegisteredRegistrantsWithRejectedDocuments={setShowRegisteredRegistrantsWithRejectedDocuments}

                                     totalorders={totalorders}
                                     pendingorders={pendingorders}
                                     acceptedorders={acceptedorders}
                                     rejectedorders={rejectedorders}

                                     totalcurrencyexchange={totalcurrencyexchange}
                                     pendingcurrencyexchange={pendingcurrencyexchange}
                                     successfulcurrencyexchange={successfulcurrencyexchange}
                                     rejectedcurrencyexchange={rejectedcurrencyexchange}

                                     totalwithdrawals={totalwithdrawals}
                                     pendingwithdrawals={pendingwithdrawals}
                                     successfulwithdrawals={successfulwithdrawals}
                                     rejectedwithdrawals={rejectedwithdrawals}

                                     verifiedmfatipregistrants={verifiedmfatipregistrants}
                                     pendingmfatipregistrants={pendingmfatipregistrants}
                                     mfatipregistrantsrejecteddocuments={mfatipregistrantsrejecteddocuments}

                                     setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal}
                                     setShowPendingPrivateRegistrationModal={setShowPendingPrivateRegistrationModal}
                                     

                                    />

        <StatisticsCardDailyTasks stats={customStats}

                                  setShowDatabaseConfiguration={setShowDatabaseConfiguration}

                                  setShowTotalOrders={setShowTotalOrders}
                                  setShowPendingOrders={setShowPendingOrders}
                                  setShowAcceptedOrders={setShowAcceptedOrders}
                                  setShowRejectedOrders={setShowRejectedOrders}
                                  setShowOrderDetails={setShowOrderDetails}

                                  setShowTotalCurrencyExchange={setShowTotalCurrencyExchange}
                                  setShowPendingCurrencyExchange={setShowPendingCurrencyExchange}
                                  setShowSuccessfulCurrencyExchange={setShowSuccessfulCurrencyExchange}
                                  setShowRejectedCurrencyExchange={setShowRejectedCurrencyExchange}

                                  setShowTotalWithdrawals={setShowTotalWithdrawals}
                                  setShowPendingWithdrawals={setShowPendingWithdrawals}
                                  setShowSuccessfulWithdrawals={setShowSuccessfulWithdrawals}
                                  setShowRejectedWithdrawals={setShowRejectedWithdrawals}

                                  setShowRegisteredRegistrantsWithVerifiedDocuments={setShowRegisteredRegistrantsWithVerifiedDocuments}
                                  setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                                  setShowRegisteredRegistrantsWithRejectedDocuments={setShowRegisteredRegistrantsWithRejectedDocuments}

                                  totalorders={totalorders}
                                  pendingorders={pendingorders}
                                  acceptedorders={acceptedorders}
                                  rejectedorders={rejectedorders}

                                  totalcurrencyexchange={totalcurrencyexchange}
                                  pendingcurrencyexchange={pendingcurrencyexchange}
                                  successfulcurrencyexchange={successfulcurrencyexchange}
                                  rejectedcurrencyexchange={rejectedcurrencyexchange}

                                  totalwithdrawals={totalwithdrawals}
                                  pendingwithdrawals={pendingwithdrawals}
                                  successfulwithdrawals={successfulwithdrawals}
                                  rejectedwithdrawals={rejectedwithdrawals}

                                  verifiedmfatipregistrants={verifiedmfatipregistrants}
                                  pendingmfatipregistrants={pendingmfatipregistrants}
                                  mfatipregistrantsrejecteddocuments={mfatipregistrantsrejecteddocuments}

                                  setShowPendingPublicRegistrationModal={setShowPendingPublicRegistrationModal}
                                  setShowPendingPrivateRegistrationModal={setShowPendingPrivateRegistrationModal}
                              
                                  setShowPendingCurrencyExchange={setShowPendingCurrencyExchange}
                                  setShowPendingWithdrawals={setShowPendingWithdrawals}
                       />
*/}
         <StatisticsCardProductCRUD stats={customStats}
                                    setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                    setShowCreateProduct={setShowCreateProduct}
                                    setShowProductReader={setShowProductReader}
                                    setShowUpdateProductForm={setShowUpdateProductForm}
                                    setShowDeleteProductReader={setShowDeleteProductReader}
                                    setproduct={setproduct}

                                    deleteproductfield={deleteproductfield}
                                    deleteproductfieldcb={deleteproductfieldcb}
                       />

         <StatisticsCardRegistrantCRUD stats={customStats}
                                       setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                       setShowCreateProduct={setShowCreateProduct}
                                       setShowProductReader={setShowProductReader}
                                       setShowCreateRegistrantForm={setShowCreateRegistrantForm}
                                       setShowRegistrantDetailsDisplay={setShowRegistrantDetailsDisplay}
                                       setShowUpdateRegistrantFormDisplay={setShowUpdateRegistrantFormDisplay}

                                       setregistrantdata={setregistrantdata}
                       />
     </div>

     {
      showDatabaseConfiguration && (
        <div id="database-configurationcontainer">

           {
            showTotalOrders && (
              <TotalOrders totalorders={totalorders}
                           setOrderDetailsObject={setOrderDetailsObject}

                           setShowDatabaseConfiguration={setShowDatabaseConfiguration}

                           setShowTotalOrders={setShowTotalOrders}
                           setShowPendingOrders={setShowPendingOrders}
                           setShowOrderDetails={setShowOrderDetails}

                           acceptorderloadingindication={acceptorderloadingindication}
                           acceptorderloadingindicationcb={acceptorderloadingindicationcb}

                           />
            )
            }

            {
            showPendingOrders && (
              <PendingOrders pendingorders={pendingorders}
                             setOrderDetailsObject={setOrderDetailsObject}

                             setShowDatabaseConfiguration={setShowDatabaseConfiguration}

                             setShowTotalOrders={setShowTotalOrders}
                             setShowPendingOrders={setShowPendingOrders}
                             setShowOrderDetails={setShowOrderDetails}

                             acceptorderloadingindication={acceptorderloadingindication}
                             acceptorderloadingindicationcb={acceptorderloadingindicationcb}

                             fetchOmsiapData={fetchOmsiapData}

                             />
            )
            }

            {
            showConfirmedOrders && (
              <ConfirmedOrders confirmedorders={confirmedorders}
                               setOrderDetailsObject={setOrderDetailsObject}

                               setShowDatabaseConfiguration={setShowDatabaseConfiguration}

                               setShowTotalOrders={setShowTotalOrders}
                               setShowConfirmedOrders={setShowConfirmedOrders}
                               setShowOrderDetails={setShowOrderDetails}

                               fetchOmsiapData={fetchOmsiapData}

                             />
            )
            }

           {
            showOrdersForShipping && (
              <OrdersForShipping ordersforshipping={ordersforshipping}
                                 setOrderDetailsObject={setOrderDetailsObject}

                                 setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                 setShowOrdersForShipping={setShowOrdersForShipping}

                                 setShowTotalOrders={setShowTotalOrders}
                                 setShowConfirmedOrders={setShowConfirmedOrders}
                                 setShowOrderDetails={setShowOrderDetails}

                                 fetchOmsiapData={fetchOmsiapData}
                                />
            )
            }

            {
            showShippedOrders && (
              <ShippedOrders shippedorders={shippedorders}
                             setOrderDetailsObject={setOrderDetailsObject}

                             setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                             setShowShippedOrders={setShowShippedOrders}
                             setShowOrdersForShipping={setShowOrdersForShipping}

                             setShowTotalOrders={setShowTotalOrders}
                             setShowConfirmedOrders={setShowConfirmedOrders}
                             setShowOrderDetails={setShowOrderDetails}

                                />
            )
            }

            {
            showSuccessfulOrders && (
              <SuccessfulOrders successfulorders={successfulorders}
                                setOrderDetailsObject={setOrderDetailsObject}
   
                                setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                setShowSuccessfulOrders={setShowSuccessfulOrders}
                                setShowOrdersForShipping={setShowOrdersForShipping}

                                setShowTotalOrders={setShowTotalOrders}
                                setShowConfirmedOrders={setShowConfirmedOrders}
                                setShowOrderDetails={setShowOrderDetails}

                                />
            )
            }

           {
            showRejectedOrders && (
              <RejectedOrders rejectedorders={rejectedorders}
                              setOrderDetailsObject={setOrderDetailsObject}

                              setShowDatabaseConfiguration={setShowDatabaseConfiguration}

                              setShowTotalOrders={setShowTotalOrders}
                              setShowConfirmedOrders={setShowConfirmedOrders}
                              setShowPendingOrders={setShowPendingOrders}
                              setShowRejectedOrders={setShowRejectedOrders}
                              setShowOrderDetails={setShowOrderDetails}

                             />
            )
            }

            {
              showOrderDetails && (
                <OrderDetailsModal transaction={orderDetailsObject} 
                                   setShowOrderDetails={setShowOrderDetails}/>
              )
            }

            {
            showTotalCurrencyExchange && (
              <TotalCurrencyExchange totalcurrencyexchange={totalcurrencyexchange}
                                     credittransactionobjectcb={credittransactionobjectcb}

                                     setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                     setShowTotalCurrencyExchange={setShowTotalCurrencyExchange}

                                     setShowCreditTransaction={setShowCreditTransaction}

                             />
            )
            }

            {
            showPendingCurrencyExchange && (
              <PendingCurrencyExchange pendingcurrencyexchange={pendingcurrencyexchange}
                                       credittransactionobjectcb={credittransactionobjectcb}

                                       setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                       setShowPendingCurrencyExchange={setShowPendingCurrencyExchange}

                                       setShowCreditTransaction={setShowCreditTransaction}

                             />
            )
            }

           {
            showSuccessfulCurrencyExchange && (
              <SuccessfulCurrencyExchange successfulcurrencyexchange={successfulcurrencyexchange}
                                          credittransactionobjectcb={credittransactionobjectcb}

                                          setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                          setShowSuccessfulCurrencyExchange={setShowSuccessfulCurrencyExchange}

                                          setShowCreditTransaction={setShowCreditTransaction}

                             />
            )
           }

           {
            showRejectedCurrencyExchange && (
              <RejectedCurrencyExchange rejectedcurrencyexchange={rejectedcurrencyexchange}
                                        credittransactionobjectcb={credittransactionobjectcb}

                                        setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                        setShowRejectedCurrencyExchange={setShowRejectedCurrencyExchange}

                                        setShowCreditTransaction={setShowCreditTransaction}

                             />
            )
            }

            {
              showTotalWithdrawals && (
                <TotalWithdrawals totalwithdrawals={totalwithdrawals}
                                  credittransactionobjectcb={credittransactionobjectcb}

                                  setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                  setShowTotalWithdrawals={setShowTotalWithdrawals}
                                  
                                  setShowCreditTransaction={setShowCreditTransaction}/>
              )
            }

            {
              showPendingWithdrawals && (
                <PendingWithdrawals pendingwithdrawals={pendingwithdrawals}
                                    credittransactionobjectcb={credittransactionobjectcb}

                                    setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                    setShowPendingWithdrawals={setShowPendingWithdrawals}
                                    
                                    setShowCreditTransaction={setShowCreditTransaction}/>
              )
            }

            {
              showSuccessfulWithdrawals && (
                <SuccessfulWithdrawals successfulwithdrawals={successfulwithdrawals}
                                       credittransactionobjectcb={credittransactionobjectcb}

                                       setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                       setShowSuccessfulWithdrawals={setShowSuccessfulWithdrawals}
                                       
                                       setShowCreditTransaction={setShowCreditTransaction}/>
              )
            }

            {
              showRejectedWithdrawals && (
                <RejectedWithdrawals rejectedwithdrawals={rejectedwithdrawals}
                                     credittransactionobjectcb={credittransactionobjectcb}       

                                     setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                     setShowRejectedWithdrawals={setShowRejectedWithdrawals}
                                  
                                     setShowCreditTransaction={setShowCreditTransaction}/>
              )
            }

            {
              showCreditTransaction && (
                <CreditTransactionModal credittransactionobject={credittransactionobject}
                                        setShowCreditTransaction={setShowCreditTransaction}/>
              )
            }


            {
            showRegisteredRegistrantsWithVerifiedDocuments && (
              <MfatipRegisteredRegistrantsWithVerifiedDocuments verifiedmfatipregistrants={verifiedmfatipregistrants}
                                                                setregistrantdata={setregistrantdata}

                                                                setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                                                setShowRegisteredRegistrantsWithVerifiedDocuments={setShowRegisteredRegistrantsWithVerifiedDocuments}
                                                                setShowRegistrantDetailsDisplay={setShowRegistrantDetailsDisplay}
                             />
            )
            }


           {
            showRegisteredRegistrantsWithPendingDocuments && (
              <MfatipRegisteredRegistrantsWithPendingDocuments pendingmfatipregistrants={pendingmfatipregistrants}
                                                               setregistrantdata={setregistrantdata}

                                                               setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                                               setShowRegisteredRegistrantsWithPendingDocuments={setShowRegisteredRegistrantsWithPendingDocuments}
                                                               setShowRegistrantDetailsDisplay={setShowRegistrantDetailsDisplay}
                             />
            )
            }

           {
            showRegisteredRegistrantsWithRejectedDocuments && (
              <MfatipRegisteredRegistrantsWithRejectedDocuments mfatipregistrantsrejecteddocuments={mfatipregistrantsrejecteddocuments}
                                                                setregistrantdata={setregistrantdata}

                                                                setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                                                setShowRegisteredRegistrantsWithRejectedDocuments={setShowRegisteredRegistrantsWithRejectedDocuments}
                                                                setShowRegistrantDetailsDisplay={setShowRegistrantDetailsDisplay}
                             />
            )
            }


           
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
              showProductReader && (
                <ProductReader product={product} 
                               setShowPendingOrders={setShowPendingOrders}
                               setShowProductReader={setShowProductReader}/>
              )
            }

            {
              showUpdateProductForm && (
                <UpdateProduct setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                               setShowUpdateProductForm={setShowUpdateProductForm}
                               productToUpdate={product}
                 />
              )
            }

            {
             showDeleteProductReader && (
              <DeleteProductReader product={product}
                                   setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                   setShowUpdateProductForm={setShowUpdateProductForm}
                                   productToUpdate={product}
                                   deleteproductfield={deleteproductfield} />
             )
            }

            {
              showCreateProduct && (
                <CreateProduct  setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                setShowCreateProduct={setShowCreateProduct}/>
              )
            }

            {
              showCreateRegistrantForm && (
                <RegistrationForm setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                  setShowCreateRegistrantForm={setShowCreateRegistrantForm}/>
              )
            }

            {
              showRegistrantDetailsDisplay && (
                <ReadRegistrantFormDetails  registrantData={registrantdata}
                                            setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                            setShowRegistrantDetailsDisplay={setShowRegistrantDetailsDisplay}
                                  
                                            registrantdata={registrantdata}/>
              )
            }

            {
              showUpdateRegistrantFormDisplay && (
                <UpdateRegistrationForm registrantData={registrantdata}
                                        setShowDatabaseConfiguration={setShowDatabaseConfiguration}
                                        setShowUpdateRegistrantFormDisplay={setShowUpdateRegistrantFormDisplay}
                                        registrantdata={registrantdata}
                                        setregistrantdata={setregistrantdata}/>
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


const StatisticsCardOperationBasis = ({ 
  stats, 
  setShowDatabaseConfiguration, 

  setShowTotalOrders, 
  setShowPendingOrders, 
  setShowConfirmedOrders, 
  setShowOrdersForShipping,
  setShowShippedOrders,
  setShowSuccessfulOrders,
  setShowRejectedOrders,
  setShowOrderDetails,

  setShowTotalCurrencyExchange,
  setShowPendingCurrencyExchange,
  setShowSuccessfulCurrencyExchange,
  setShowRejectedCurrencyExchange,

  setShowTotalWithdrawals,
  setShowPendingWithdrawals,
  setShowSuccessfulWithdrawals,
  setShowRejectedWithdrawals,

  setShowRegisteredRegistrantsWithVerifiedDocuments,
  setShowRegisteredRegistrantsWithPendingDocuments,
  setShowRegisteredRegistrantsWithRejectedDocuments,

  totalorders,
  pendingorders,
  confirmedorders,
  ordersforshipping,
  shippedorders,
  successfulorders,
  rejectedorders,

  totalcurrencyexchange,
  pendingcurrencyexchange,
  successfulcurrencyexchange,
  rejectedcurrencyexchange,

  totalwithdrawals,
  pendingwithdrawals,
  successfulwithdrawals,
  rejectedwithdrawals,

  verifiedmfatipregistrants,
  pendingmfatipregistrants,
  mfatipregistrantsrejecteddocuments

}) => {


  // Sample stats data if not provided
  const defaultStats = {
    pendingOrders: { count: 24 },
    pendingDeposits: { count: 18 },
    pendingWithdrawals: { count: 9 },
    pendingRegistrations: { count: 32 }
  };

  // Use provided stats or default
  const statsData = stats || defaultStats;

  return (
    <div className="statistics-container">
      <h1 className="dashboard-title">Operation Basis</h1>
      <div className="statistics-grid">

        {/* TOTAL ORDERS */}
        <div className="statistics-card orders-card">
          <div className="card-inner">
            <div className="card-header">
              <span>TOTAL ORDERS</span>
              <div className="card-icon orders-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="stat-value">{totalorders.length} total orders</div>
            </div>
            <div className="card-details">
              <div className="detail-item">
                <span>{totalorders.length} total orders</span>
                <button className="action-button" onClick={() => {

                  setShowDatabaseConfiguration(true);
                  setShowTotalOrders(true);
                  setShowPendingOrders(false)
                  setShowOrderDetails(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{pendingorders.length} pending orders</span>
                <button className="action-button" onClick={() => {
                   
                   setShowDatabaseConfiguration(true);

                   setShowTotalOrders(false)
                   setShowPendingOrders(true)
                   setShowOrderDetails(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{confirmedorders.length} confirmed orders</span>
                <button className="action-button" onClick={() => {

                  setShowDatabaseConfiguration(true);
                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(true);

                  
                  setShowPendingOrders(false);

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{ordersforshipping.length} orders for shipping</span>
                <button className="action-button" onClick={() => {

                  setShowDatabaseConfiguration(true);
                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrdersForShipping(true)

                  
                  setShowPendingOrders(false);

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{shippedorders.length} shipped orders</span>
                <button className="action-button" onClick={() => {

                  setShowDatabaseConfiguration(true);
                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrdersForShipping(false)
                  setShowShippedOrders(true)

                  
                  setShowPendingOrders(false);

                }}>view</button>
              </div>
              <div className="detail-item">
                <span onClick={()=> {
                  console.log(rejectedorders.length)
                  console.log(rejectedorders)
                }}>{successfulorders.length} successful orders</span>
                <button className="action-button" onClick={() => {

                  setShowDatabaseConfiguration(true);
                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false);
                  setShowSuccessfulOrders(true)

                  setShowRejectedOrders(false)
                  
                  
                  setShowPendingOrders(false);

                }}>view</button>
              </div>
              <div className="detail-item">
                <span onClick={()=> {
                  console.log(rejectedorders.length)
                  console.log(rejectedorders)
                }}>{rejectedorders.length} rejected order</span>
                <button className="action-button" onClick={() => {

                  setShowDatabaseConfiguration(true);
                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false);

                  setShowRejectedOrders(true)
                  
                  
                  setShowPendingOrders(false);

                }}>view</button>
              </div>
            </div>
            <div className="search-container">
              <div className="search-field">
                <label>Transaction ID:</label>
                <input className="transaction-id-input" type="text" placeholder="Enter transaction ID"/>
              </div>
              <button className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>
            <div className="transaction-info">
              <span className="transaction-label">TRANSACTION ID:</span>
              <span className="transaction-value">TNX-123asd-123aqwe</span>
            </div>
          </div>
        </div>

        {/* TOTAL CURRENCY EXCHANGE */}
        <div className="statistics-card deposits-card" onClick={() => {
          setShowDatabaseConfiguration(true);
          setShowPendingCurrencyExchange(true);
        }}>
          <div className="card-inner">
            <div className="card-header">
              <span>TOTAL CURRENCY EXCHANGE</span>
              <div className="card-icon deposits-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="stat-value">{totalcurrencyexchange.length} total currency exchange</div>
            </div>
            <div className="card-details">
              <div className="detail-item">
                <span>{totalcurrencyexchange.length} total currency exchange</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation();

                  setShowDatabaseConfiguration(true);

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(true)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)



                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{pendingcurrencyexchange.length} pending currency exchange</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation();

                  setShowDatabaseConfiguration(true);

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)

                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(true)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)


                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{successfulcurrencyexchange.length} successful currency exchange</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation();

                  setShowDatabaseConfiguration(true);

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)

                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(true)
                  setShowRejectedCurrencyExchange(false)



                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{rejectedcurrencyexchange.length} rejected currency exchange</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation();

                  setShowDatabaseConfiguration(true);

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)

                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(true)



                }}>view</button>
              </div>
            </div>
            <div className="search-container">
              <div className="search-field">
                <label>Transaction ID:</label>
                <input className="transaction-id-input" type="text" placeholder="Enter transaction ID" onClick={(e) => e.stopPropagation()}/>
              </div>
              <button className="search-button" onClick={(e) => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>
            <div className="transaction-info">
              <span className="transaction-label">TRANSACTION ID:</span>
              <span className="transaction-value">TNX-123asd-123aqwe</span>
            </div>
          </div>
        </div>

        {/* TOTAL WITHDRAWALS */}
        <div className="statistics-card withdrawals-card">
          <div className="card-inner">
            <div className="card-header">
              <span>TOTAL WITHDRAWALS</span>
              <div className="card-icon withdrawals-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 10 4 15 9 20"></polyline>
                  <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="stat-value">{totalwithdrawals.length} total withdrawals</div>
            </div>
            <div className="card-details">
              <div className="detail-item">
                <span>{totalwithdrawals.length} total withdrawals</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()

                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(true)
                  setShowPendingWithdrawals(false)
                  setShowSuccessfulWithdrawals(false)
                  setShowRejectedWithdrawals(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{pendingwithdrawals.length} pending withdrawals</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()

                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(false)
                  setShowPendingWithdrawals(true)
                  setShowSuccessfulWithdrawals(false)
                  setShowRejectedWithdrawals(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{successfulwithdrawals.length} successful withdrawals</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()
                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(true)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(false)
                  setShowPendingWithdrawals(false)
                  setShowSuccessfulWithdrawals(true)
                  setShowRejectedWithdrawals(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{rejectedwithdrawals.length} rejected withdrawals</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()

                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(true)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(false)
                  setShowPendingWithdrawals(false)
                  setShowSuccessfulWithdrawals(false)
                  setShowRejectedWithdrawals(true)

                }}>view</button>
              </div>
            </div>
            <div className="search-container">
              <div className="search-field">
                <label>Transaction ID:</label>
                <input className="transaction-id-input" type="text" placeholder="Enter transaction ID" onClick={(e) => e.stopPropagation()}/>
              </div>
              <button className="search-button" onClick={(e) => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>
            <div className="transaction-info">
              <span className="transaction-label">TRANSACTION ID:</span>
              <span className="transaction-value">TNX-123asd-123aqwe</span>
            </div>
          </div>
        </div>

         {/*  REGISTERED MFATIP REGISTRANTS WITH PENDING DOCUMENTS */}
         <div className="statistics-card withdrawals-card">
          <div className="card-inner">
            <div className="card-header">
              <span>REGISTERED MFATIP REGISTRANTS WITH PENDING DOCUMENTS</span>
              <div className="card-icon withdrawals-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="stat-value">{pendingmfatipregistrants.length} total registrants with pending documents status</div>
            </div>
            <div className="card-details">
              <div className="detail-item">
                <span>{verifiedmfatipregistrants.length} total MFATIP registered registrants pending documents verified</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()

                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(false)
                  setShowPendingWithdrawals(false)
                  setShowSuccessfulWithdrawals(false)
                  setShowRejectedWithdrawals(false)

                  setShowRegisteredRegistrantsWithVerifiedDocuments(true)
                  setShowRegisteredRegistrantsWithPendingDocuments(false)
                  setShowRegisteredRegistrantsWithRejectedDocuments(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{pendingmfatipregistrants.length} total MFATIP registered registrants with pending documents status</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()

                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(false)
                  setShowPendingWithdrawals(false)
                  setShowSuccessfulWithdrawals(false)
                  setShowRejectedWithdrawals(false)

                  setShowRegisteredRegistrantsWithVerifiedDocuments(false)
                  setShowRegisteredRegistrantsWithPendingDocuments(true)
                  setShowRegisteredRegistrantsWithRejectedDocuments(false)

                }}>view</button>
              </div>
              <div className="detail-item">
                <span>{mfatipregistrantsrejecteddocuments.length} total MFATIP registered registrants pending documents rejected</span>
                <button className="action-button" onClick={(e) => {

                  e.stopPropagation()

                  setShowDatabaseConfiguration(true)

                  setShowTotalOrders(false)
                  setShowPendingOrders(false)
                  setShowConfirmedOrders(false)
                  setShowOrderDetails(false)
 
                  setShowTotalCurrencyExchange(false)
                  setShowPendingCurrencyExchange(false)
                  setShowSuccessfulCurrencyExchange(false)
                  setShowRejectedCurrencyExchange(false)
                  
                  setShowTotalWithdrawals(false)
                  setShowPendingWithdrawals(false)
                  setShowSuccessfulWithdrawals(false)
                  setShowRejectedWithdrawals(false)

                  setShowRegisteredRegistrantsWithVerifiedDocuments(false)
                  setShowRegisteredRegistrantsWithPendingDocuments(false)
                  setShowRegisteredRegistrantsWithRejectedDocuments(true)

                }}>view</button>
              </div>
            </div>
            <div className="search-container">
              <div className="search-field">
                <label>Transaction ID:</label>
                <input className="transaction-id-input" type="text" placeholder="Enter transaction ID" onClick={(e) => e.stopPropagation()}/>
              </div>
              <button className="search-button" onClick={(e) => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>
            <div className="transaction-info">
              <span className="transaction-label">TRANSACTION ID:</span>
              <span className="transaction-value">TNX-123asd-123aqwe</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

};

const StatisticsCardProductCRUD = ({ 
  setShowDatabaseConfiguration, 
  setShowCreateProduct, 
  setShowProductReader,
  setShowUpdateProductForm,
  setShowDeleteProductReader,
  setproduct,
  deleteproductfield,
  deleteproductfieldcb
}) => {

  const [readproductfield, readproductfieldcb] = useState("")
  const [updateproductfield, updateproductfieldcb] = useState("")
  const [readproductloadingindication, readproductloadingindicationcb] = useState(false)
  const [updateproductloadingindication, updateproductloadingindicationcb] = useState(false)
  const [viewproducttobedeletedloadingindication, viewproducttobedeletedloadingindicationcb] = useState(false)

  return (
    <div className="statistics-container">
      <h1 className="main-title">PRODUCT MANAGEMENT</h1>
      <div className="statistics-grid">

        {/* CREATE PRODUCT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Create Product</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <p className="card-description">Add new products to your inventory</p>
              <button 
                className="action-button"
                onClick={() => {
                  setShowDatabaseConfiguration(true);
                  setShowCreateProduct(true);
                }}
              >
                Create Product
              </button>
            </div>
          </div>
        </div>

        {/* READ PRODUCT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Read Product</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="input-container">
                <label htmlFor="read-product-id">Product ID:</label>
                <input 
                  type="text"
                  id="read-product-id" 
                  className="input-field"
                  value={readproductfield}
                  onChange={(evt)=> {
                    readproductfieldcb(evt.target.value)
                  }}
                  placeholder="Enter product ID" 
                />
              </div>
              <p className="readproduct-responsemessage"></p>
              {
                readproductloadingindication ? 
                (
                  <Spinner animation="border" variant="warning" />
                )
                :
                (
                  <button 
                    className="action-button"
                    onClick={async () => {

                      document.querySelectorAll(".readproduct-responsemessage")[0].innerText = "";
                      document.querySelectorAll(".readproduct-responsemessage")[0].style.color = "white";
                      document.querySelectorAll(".readproduct-responsemessage")[0].style.display = "none";
                      
                      readproductloadingindicationcb(true);
                      
                      try {
                        const response = await axiosCreatedInstance.post("/products/getproducttobeviewed", {
                          id: readproductfield
                        });
                        
                        const product = response.data.data;
                        const message = response.data.message;

                        console.log(product)
                        
                        switch(message) {
                          case "Product found":
                            setproduct(product);
                            readproductloadingindicationcb(false);
                            document.querySelectorAll(".readproduct-responsemessage")[0].innerText = "Product found with the given ID";
                            document.querySelectorAll(".readproduct-responsemessage")[0].style.color = "green";
                            document.querySelectorAll(".readproduct-responsemessage")[0].style.display = "block";
                            setShowDatabaseConfiguration(true);
                            setShowProductReader(true);
                            break;
                            
                          case "Product not found":
                            readproductloadingindicationcb(false);
                            document.querySelectorAll(".readproduct-responsemessage")[0].innerText = "No product found with the given ID";
                            document.querySelectorAll(".readproduct-responsemessage")[0].style.color = "red";
                            document.querySelectorAll(".readproduct-responsemessage")[0].style.display = "block";
                            break;
                            
                          default:
                            readproductloadingindicationcb(false);
                            document.querySelectorAll(".readproduct-responsemessage")[0].innerText = "Error: " + message;
                            document.querySelectorAll(".readproduct-responsemessage")[0].style.color = "red";
                            document.querySelectorAll(".readproduct-responsemessage")[0].style.display = "block";
                        }
                      } catch (error) {
                        readproductloadingindicationcb(false);
                        document.querySelectorAll(".readproduct-responsemessage")[0].innerText = "Error connecting to server";
                        document.querySelectorAll(".readproduct-responsemessage")[0].style.color = "red";
                        document.querySelectorAll(".readproduct-responsemessage")[0].style.display = "block";
                        console.error("Error:", error);
                      }
                    }}
                  >
                    View Product
                </button>
                )
              }
             
            </div>
          </div>
        </div>

        {/* UPDATE PRODUCT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Update Product</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="input-container">
                <label htmlFor="update-product-id">Product ID:</label>
                <input 
                  type="text" 
                  id="update-product-id"
                  className="input-field"
                  value={updateproductfield}
                  onChange={(evt)=> {
                    updateproductfieldcb(evt.target.value)
                  }}
                  placeholder="Enter product ID" 
                />
              </div>
              <p className="updateproduct-responsemessage">Response message</p>
              {
                updateproductloadingindication ? 
                (
                    <Spinner animation="border" variant="warning" />
                )
                :
                (
                <button 
                   className="action-button"
                   onClick={async () => {
                    // Reference the response message element once
                    const responseMessage = document.querySelectorAll(".updateproduct-responsemessage")[0];
                    
                    // Reset the message display
                    responseMessage.innerText = "";
                    responseMessage.style.color = "white";
                    responseMessage.style.display = "none";
                    
                    // Show loading indicator
                    updateproductloadingindicationcb(true);
                    
                    try {
                      // Fetch the product data
                      const response = await axiosCreatedInstance.post("/products/getproducttobeupdated", {
                        id: updateproductfield
                      });
                      
                      const { data: product, message } = response.data;
                      console.log(product);
                      
                      // Handle the response based on message
                      switch(message) {
                        case "Product found":
                          setproduct(product);
                          responseMessage.innerText = "Product found with the given ID";
                          responseMessage.style.color = "green";
                          responseMessage.style.display = "block";
                          setShowDatabaseConfiguration(true);
                          setShowUpdateProductForm(true);
                          break;
                          
                        case "Product not found":
                          responseMessage.innerText = "No product found with the given ID";
                          responseMessage.style.color = "red";
                          responseMessage.style.display = "block";
                          break;
                          
                        default:
                          responseMessage.innerText = `Error: ${message}`;
                          responseMessage.style.color = "red";
                          responseMessage.style.display = "block";
                      }
                    } catch (error) {
                      // Handle network or server errors
                      responseMessage.innerText = `Error connecting to server: ${error.message || "Unknown error"}`;
                      responseMessage.style.color = "red";
                      responseMessage.style.display = "block";
                      console.error("Error:", error);
                    } finally {
                      // Always hide the loading indicator when done
                      updateproductloadingindicationcb(false);
                    }
                  }}
                >
                  Edit Product
                </button>
                )
              }
           
            </div>
          </div>
        </div>

        {/* DELETE PRODUCT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Delete Product</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="input-container">
                <label htmlFor="delete-product-id">Product ID:</label>
                <input 
                  type="text" 
                  id="delete-product-id"
                  className="input-field"
                  value={deleteproductfield}
                  onChange={(evt)=> {
                    deleteproductfieldcb(evt.target.value)
                  }}
                  placeholder="Enter product ID" 
                />
              </div>
              <p className="viewproducttobedeleted-responsemessage">Response message</p>
              {
                viewproducttobedeletedloadingindication ? 
                (
                <Spinner animation="border" variant="warning" />
                )
                :
                (
                <button 
                 className="action-button danger"
                 onClick={ async () => {
                    
                   document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.display = "none"
                   document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].innerText = "Response message"
                   document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.color = "white"
 
                   viewproducttobedeletedloadingindicationcb(true)

                   try {
                    const response = await axiosCreatedInstance.post("/products/getproducttobedeleted", {
                      id: deleteproductfield
                    });
                    
                    const product = response.data.data;
                    const message = response.data.message;

                    console.log(product)
                    
                    switch(message) {
                      case "Product found":
                        setproduct(product);
                        readproductloadingindicationcb(false);
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].innerText = "Product found with the given ID";
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.color = "green";
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.display = "block";
                        setShowDatabaseConfiguration(true)
                        setShowDeleteProductReader(true)
                        break;
                        
                      case "Product not found":
                        viewproducttobedeletedloadingindicationcb(false);
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].innerText = "No product found with the given ID";
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.color = "red";
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.display = "block";
                        break;
                        
                      default:
                        viewproducttobedeletedloadingindicationcb(false);
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].innerText = "Error: " + message;
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.color = "red";
                        document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.display = "block";
                    }
                  } catch (error) {
                    viewproducttobedeletedloadingindicationcb(false);
                    document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].innerText = "Error connecting to server";
                    document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.color = "red";
                    document.querySelectorAll(".viewproducttobedeleted-responsemessage")[0].style.display = "block";
                    console.error("Error:", error);
                  }

                 }}
                >
                 View product
               </button>
                )
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatisticsCardRegistrantCRUD = ({ 
  setShowDatabaseConfiguration, 
  setShowCreateRegistrantForm, 
  setShowRegistrantDetailsDisplay,
  setShowUpdateRegistrantFormDisplay,
  setregistrantdata
}) => {


  const [readregistrantfieldvalue, readregistrantfieldvaluecb] = useState("");
  const [updateregistrantfieldvalue, updateregistrantfieldvaluecb] = useState("");
  const [readregistrantviewregistrantloadingindication, readregistrantviewregistrantloadingindicationcb] = useState(false);
  const [updateregistrantviewregistrantloadingindication, updateregistrantviewregistrantloadingindicationcb] = useState(false);

  function handleReadRegistrantIDField(evt) {
    readregistrantfieldvaluecb(evt.target.value)
  }

  return (
    <div className="statistics-container">
      <h1 className="main-title">REGISTRANT MANAGEMENT</h1>

      <div className="statistics-grid">

        {/* CREATE REGISTRANT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Create Registrant</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="17" y1="11" x2="23" y2="11"></line>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <p className="card-description">Add new registrants to the system</p>
              <button 
                className="action-button"
                onClick={() => {
                  setShowDatabaseConfiguration(true);
                  setShowCreateRegistrantForm(true);
                }}
              >
                Create Registrant
              </button>
            </div>
          </div>
        </div>

        {/* READ REGISTRANT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Read Registrant</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="input-container">
                <label htmlFor="read-registrant-id">Registrant ID:</label>
                <input 
                  type="text"
                  id="read-registrant-id" 
                  className="input-field"
                  placeholder="Enter registrant ID" 
                  value={readregistrantfieldvalue}
                  onChange={handleReadRegistrantIDField}
                />
                <p className="readregistrant-responsemessage">Response message</p>
              </div>
              {
                readregistrantviewregistrantloadingindication ? 
                (
                 <Spinner animation="border" variant="warning" />
                )
                :
                (
                  <button 
                  className="action-button"
                  onClick={ async () => {

                    document.querySelectorAll(".readregistrant-responsemessage")[0].innerText = ""
                    document.querySelectorAll(".readregistrant-responsemessage")[0].style.color = "white"
                    document.querySelectorAll(".readregistrant-responsemessage")[0].style.display = "none"
                    readregistrantviewregistrantloadingindicationcb(true)

                  await axiosCreatedInstance.post("/people/getregistranttobeviewed", {
                    id: readregistrantfieldvalue
                  } ).then((response)=> {
  
                    const registrant = response.data.data;
                    const message = response.data.message;

                    switch(message) {
                      case "Registrant found":
                        setregistrantdata(registrant)
                        readregistrantviewregistrantloadingindicationcb(false)
                        document.querySelectorAll(".readregistrant-responsemessage")[0].innerText = "Registrant found with the given ID"
                        document.querySelectorAll(".readregistrant-responsemessage")[0].style.color = "green"
                        document.querySelectorAll(".readregistrant-responsemessage")[0].style.display = "block"
                        setShowDatabaseConfiguration(true);
                        setShowRegistrantDetailsDisplay(true);
                      break;
                      case "Registrant not found":
                        readregistrantviewregistrantloadingindicationcb(false)
                        document.querySelectorAll(".readregistrant-responsemessage")[0].innerText = "No registrant found with the given ID"
                        document.querySelectorAll(".readregistrant-responsemessage")[0].style.color = "red"
                        document.querySelectorAll(".readregistrant-responsemessage")[0].style.display = "block"
                      break;
                    }

                   })
                 }}
                >
                  View Registrant
                 </button>
                )
              }
          
            </div>
          </div>
        </div>

        {/* UPDATE REGISTRANT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Update Registrant</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="input-container">
                <label htmlFor="update-registrant-id">Registrant ID:</label>
                <input 
                  type="text" 
                  id="update-registrant-id"
                  value={updateregistrantfieldvalue}
                  onChange={(evt)=> {
                    updateregistrantfieldvaluecb(evt.target.value)
                  }}
                  className="input-field"
                  placeholder="Enter registrant ID" 
                />
              </div>
              <p className="updateregistrant-responsemessage"></p>
              {
                updateregistrantviewregistrantloadingindication ? 
                (
                  <Spinner animation="border" variant="warning" />
                ) 
                :
                (
                <button 
                   className="action-button"
                   onClick={ async () => {

                    document.querySelectorAll(".updateregistrant-responsemessage")[0].innerText = ""
                    document.querySelectorAll(".updateregistrant-responsemessage")[0].style.color = "white"
                    document.querySelectorAll(".updateregistrant-responsemessage")[0].style.display = "none"
                    updateregistrantviewregistrantloadingindicationcb(true)

                    await axiosCreatedInstance.post("/people/getregistranttobeupdated", {
                      id: updateregistrantfieldvalue
                    } ).then((response)=> {
    
                      const registrant = response.data.data;
                      const message = response.data.message;

                      switch(message) {
                        case "Registrant found":
                          setregistrantdata(registrant)
                          updateregistrantviewregistrantloadingindicationcb(false)
                          document.querySelectorAll(".updateregistrant-responsemessage")[0].innerText = "Registrant found with the given ID"
                          document.querySelectorAll(".updateregistrant-responsemessage")[0].style.color = "green"
                          document.querySelectorAll(".updateregistrant-responsemessage")[0].style.display = "block"
                          setShowDatabaseConfiguration(true)
                          setShowUpdateRegistrantFormDisplay(true)
                        break;
                        case "Registrant not found":
                          updateregistrantviewregistrantloadingindicationcb(false)
                          document.querySelectorAll(".updateregistrant-responsemessage")[0].innerText = "No registrant found with the given ID"
                          document.querySelectorAll(".updateregistrant-responsemessage")[0].style.color = "red"
                          document.querySelectorAll(".updateregistrant-responsemessage")[0].style.display = "block"
                        break;
                      }

                     })

                   }}
                >
                  Edit Registrant
                </button>
                )
              }
              
            </div>
          </div>
        </div>

        {/* DELETE REGISTRANT */}
        <div className="statistics-card">
          <div className="card-inner">
            <div className="card-header">
              <span>Delete Registrant</span>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <line x1="5" y1="12" x2="19" y2="12" stroke="red"></line>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <div className="input-container">
                <label htmlFor="delete-registrant-id">Registrant ID:</label>
                <input 
                  type="text" 
                  id="delete-registrant-id"
                  className="input-field"
                  placeholder="Enter registrant ID" 
                />
              </div>
              <button 
                className="action-button danger"
                onClick={() => setShowDatabaseConfiguration(true)}
              >
                Remove Registrant
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};


const OrderAcceptButton = ({ order, onAccept }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(order.id);
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? (
      <Spinner animation="border" variant="light" />
    ) : (
      <button 
        className="accept-btn" 
        onClick={handleAccept}
        disabled={isLoading}
      >
        Accept
      </button>
    )
  );
};

const ConfirmOrderButton = ({ order, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      await onConfirm(order._id);
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? (
      <Spinner animation="border" variant="light" />
    ) : (
      <button 
        className="accept-btn" 
        onClick={handleConfirmOrder}
        disabled={isLoading}
      >
        Confirm order
      </button>
    )
  );
};

const OrderForShippingButton = ({ order, onOrderForShipping }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleOrderForShipping = async () => {
    setIsLoading(true);
    try {
      await onOrderForShipping(order._id);
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? (
      <Spinner animation="border" variant="light" />
    ) : (
      <button 
        className="accept-btn" 
        onClick={handleOrderForShipping}
        disabled={isLoading}
      >
        Order for shipping
      </button>
    )
  );
};

const OrderShippedButton = ({ order, onOrderShipped }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleOrderShipped = async () => {
    setIsLoading(true);
    try {
      await onOrderShipped(order._id);
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? (
      <Spinner animation="border" variant="light" />
    ) : (
      <button 
        className="accept-btn" 
        onClick={handleOrderShipped}
        disabled={isLoading}
      >
        Order shipped
      </button>
    )
  );
};

const TotalOrders = ({ 
  totalorders,
  pendingorders,
  acceptedorders,
  rejectedorders,

  totaldeposits,
  pendingdeposits,
  successfuldeposits,
  rejecteddeposits,

  totalwithdrawals,
  pendingwithdrawals,
  successfulwithdrawals,
  rejectedwithdrawals,

  verifiedmfatipregistrants,
  pendingmfatipregistrants,
  mfatipregistrantsrejecteddocuments,

  totalorderscb,
  pendingorderscb,
  acceptedorderscb,
  rejectedorderscb,

  totaldepositscb,
  pendingdepositscb,
  successfuldepositscb,
  rejecteddepositscb,

  totalwithdrawalscb,
  pendingwithdrawalscb,
  successfulwithdrawalscb,
  rejectedwithdrawalscb,

  verifiedmfatipregistrantscb,
  pendingmfatipregistrantscb,
  mfatipregistrantsrejecteddocumentscb,
  
  acceptorderloadingindication,
  acceptorderloadingindicationcb,

  setOrderDetailsObject, 
  setShowDatabaseConfiguration, 
  setShowTotalOrders, 
  setShowPendingOrders, 
  setShowOrderDetails, 

  }) => {

  const [transactions, setTransactions] = useState(totalorders);
  const [filteredTransactions, setFilteredTransactions] = useState(totalorders);
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
  const filtered = transactions.filter(transaction => {
    // Check if the property exists before accessing its toLowerCase method
    const idMatch = transaction.id?.toLowerCase().includes(query) || false;
    const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
    
    // Safely access nested properties
    const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
    const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
    
    return idMatch || dateMatch || addressMatch || cityMatch;
  });
  
  setFilteredTransactions(filtered);
}, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    
    setStatusMessage(message);

    {/*
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
    */}

  };

  // Button action handlers with visual feedback
  const handleAcceptOrder = async (id) => {

    // Prevent multiple simultaneous requests
    if (acceptorderloadingindicationcb) {
      acceptorderloadingindicationcb(true);
    }
  
    try {
      // Send request to backend to accept the order
      const response = await axiosCreatedInstance.post("/omsiap/acceptorder", { id });
      
      // Show success status message based on backend response
      showStatusMessage(response.data.message || `Order ${id} has been accepted successfully`);


    } catch (error) {
      // Handle different types of backend errors
      if (error.response) {

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.message || 
                             `Failed to accept Order ${id}. Server responded with an error.`;
        showStatusMessage(errorMessage, 'error');

        console.error('Backend error response:', error.response.data);


      } else if (error.request) {

        // The request was made but no response was received
        showStatusMessage(`No response received when trying to accept Order ${id}. Please check your network connection.`, 'error');
        console.error('No response received:', error.request);

      } else {

        // Something happened in setting up the request that triggered an Error
        showStatusMessage(`Error in processing Order ${id}. Please try again.`, 'error');
        console.error('Error setting up request:', error.message);

      }
    } finally {

      // Ensure loading indication is set to false
      if (acceptorderloadingindicationcb) {
        acceptorderloadingindicationcb(false);
      }

    }
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
              setShowTotalOrders(false);
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
                <td className="order-id">{transaction.id}s</td>
                <td>{transaction.statusesandlogs.date}</td>
                <td className="order-amount">${transaction.system.ordersummary.merchandisetotal}</td>
                <td>{transaction.system.shippinginfo.street}, {transaction.system.shippinginfo.trademark}, {transaction.system.shippinginfo.baranggay}, {transaction.system.shippinginfo.city}, {transaction.system.shippinginfo.province}, {transaction.system.shippinginfo.zipcode}, {transaction.system.shippinginfo.country}</td>
                <td>{transaction.system.ordersummary.totalweightkilos} kg</td>
                <td>{transaction.system.ordersummary.totalitems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {

                      setShowOrderDetails(true);

                      setOrderDetailsObject(transaction)


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

                  <OrderAcceptButton key={transaction.id}
                                     order={transaction}
                                     onAccept={handleAcceptOrder}/>
                  
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

const PendingOrders = ({ 
  pendingorders, 
  setOrderDetailsObject, 
  setShowDatabaseConfiguration, 
  setShowPendingOrders, 

  setShowOrderDetails,

  acceptorderloadingindication,
  acceptorderloadingindicationcb,
  
  setShowPendingOrderDetails,

  fetchOmsiapData }) => {

  const [transactions, setTransactions] = useState(pendingorders);
  const [filteredTransactions, setFilteredTransactions] = useState(pendingorders);
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
  const filtered = transactions.filter(transaction => {
    // Check if the property exists before accessing its toLowerCase method
    const idMatch = transaction.id?.toLowerCase().includes(query) || false;
    const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
    
    // Safely access nested properties
    const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
    const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
    
    return idMatch || dateMatch || addressMatch || cityMatch;
  });
  
  setFilteredTransactions(filtered);
}, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);
    {/*
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
    */}
  };

// Improved handleConfirmOrder function with robust error handling
const handleConfirmOrder = async (_id) => {
  // Prevent multiple simultaneous requests
  if (acceptorderloadingindicationcb) {
    acceptorderloadingindicationcb(true);
  }
  
  try {
    // Validate input
    if (!_id) {
      showStatusMessage('Order ID is missing', 'error');
      return;
    }
    
    // Send request to backend to accept the order
    const response = await axiosCreatedInstance.post("/omsiap/confirmorder", { _id });
    
    // Show success status message based on backend response
    showStatusMessage(
      response.data.message || `Order ${_id} has been confirmed successfully`,
      'success'
    );
    
    // Update the UI with fresh data
    await fetchOmsiapData();
    
  } catch (error) {
    // Handle different types of backend errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message || 
                           `Failed to confirm Order ${_id}. Server responded with an error.`;
      
      showStatusMessage(errorMessage, 'error');
      console.error('Backend error response:', error.response.data);
      
      // Handle specific error status codes
      switch(error.response.status) {
        case 404:
          showStatusMessage(`Order ${_id} could not be found. It may have been deleted or moved.`, 'error');
          break;
        case 400:
          // The message from the server should already be descriptive
          break;
        case 401:
          showStatusMessage('You are not authorized to confirm this order. Please log in again.', 'error');
          break;
        case 403:
          showStatusMessage('You do not have permission to confirm orders.', 'error');
          break;
        case 500:
          showStatusMessage('The server encountered an error. Please try again later.', 'error');
          break;
      }
      
    } else if (error.request) {
      // The request was made but no response was received
      showStatusMessage(
        `No response received when trying to confirm Order ${_id}. Please check your network connection.`, 
        'error'
      );
      console.error('No response received:', error.request);
      
    } else {
      // Something happened in setting up the request that triggered an Error
      showStatusMessage(`Error in processing Order ${_id}. Please try again.`, 'error');
      console.error('Error setting up request:', error.message);
    }
  } finally {
    // Ensure loading indication is set to false regardless of outcome
    if (acceptorderloadingindicationcb) {
      acceptorderloadingindicationcb(false);
    }
    
    // Refresh the data even if there was an error, as the operation might have succeeded
    // despite the client receiving an error
    try {
      await fetchOmsiapData();
    } catch (refreshError) {
      console.error('Failed to refresh data after order confirmation:', refreshError);
    }
  }
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
                <td className="order-id">{transaction.id}s</td>
                <td>{transaction.statusesandlogs.date}</td>
                <td className="order-amount">${transaction.system.ordersummary.merchandisetotal}</td>
                <td>{transaction.system.shippinginfo.street}, {transaction.system.shippinginfo.trademark}, {transaction.system.shippinginfo.baranggay}, {transaction.system.shippinginfo.city}, {transaction.system.shippinginfo.province}, {transaction.system.shippinginfo.zipcode}, {transaction.system.shippinginfo.country}</td>
                <td>{transaction.system.ordersummary.totalweightkilos} kg</td>
                <td>{transaction.system.ordersummary.totalitems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {

                      setShowOrderDetails(true)

                      setOrderDetailsObject(transaction)
                      

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

                  <ConfirmOrderButton key={transaction._id}
                                      order={transaction}
                                      onConfirm={handleConfirmOrder}/>

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

const ConfirmedOrders = ({ 
  confirmedorders,
  setOrderDetailsObject,

  setShowDatabaseConfiguration, 
  setShowConfirmedOrders,

  setShowOrderDetails,

  setShowPendingOrders, 
  setShowPendingOrderDetails,

  fetchOmsiapData

}) => {

  const [transactions, setTransactions] = useState(confirmedorders);
  const [filteredTransactions, setFilteredTransactions] = useState(confirmedorders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeRow, setActiveRow] = useState(null);

  const [onorderforshippingloadingindication, onorderforshippingloadingindicationcb] = useState(false)

 // Filter transactions based on search query
 useEffect(() => {

  if (!searchQuery.trim()) {
    setFilteredTransactions(transactions);
    return;
  }

  const query = searchQuery.toLowerCase();
  const filtered = transactions.filter(transaction => {
    // Check if the property exists before accessing its toLowerCase method
    const idMatch = transaction.id?.toLowerCase().includes(query) || false;
    const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
    
    // Safely access nested properties
    const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
    const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
    
    return idMatch || dateMatch || addressMatch || cityMatch;
  });
  
  setFilteredTransactions(filtered);
}, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);

    {/*
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
    */}

  };

// Improved handleOrderForShipping function with shipping-specific messaging
const handleOrderForShipping = async (_id) => {
  // Prevent multiple simultaneous requests
  if (onorderforshippingloadingindicationcb) {
    onorderforshippingloadingindicationcb(true);
  }
  
  try {
    // Validate input
    if (!_id) {
      showStatusMessage('Order ID is missing', 'error');
      return;
    }
    
    // Send request to backend to mark the order for shipping
    const response = await axiosCreatedInstance.post("/omsiap/orderforshipping", { _id });
    
    // Show success status message based on backend response
    showStatusMessage(
      response.data.message || `Order ${_id} has been marked for shipping successfully`,
      'success'
    );
    
    // Update the UI with fresh data
    await fetchOmsiapData();
    
  } catch (error) {
    // Handle different types of backend errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message ||
                           `Failed to mark Order ${_id} for shipping. Server responded with an error.`;
      
      showStatusMessage(errorMessage, 'error');
      console.error('Backend error response:', error.response.data);
      
      // Handle specific error status codes
      switch(error.response.status) {
        case 404:
          showStatusMessage(`Order ${_id} could not be found. It may have been deleted or moved.`, 'error');
          break;
        case 400:
          // The message from the server should already be descriptive
          // Check for specific shipping-related errors
          if (error.response.data.message && error.response.data.message.includes('status')) {
            showStatusMessage('This order cannot be marked for shipping. It may need to be confirmed first.', 'error');
          }
          break;
        case 401:
          showStatusMessage('You are not authorized to mark this order for shipping. Please log in again.', 'error');
          break;
        case 403:
          showStatusMessage('You do not have permission to update order shipping status.', 'error');
          break;
        case 500:
          showStatusMessage('The server encountered an error while preparing the order for shipping. Please try again later.', 'error');
          break;
      }
      
    } else if (error.request) {
      // The request was made but no response was received
      showStatusMessage(
        `No response received when trying to mark Order ${_id} for shipping. Please check your network connection.`,
        'error'
      );
      console.error('No response received:', error.request);
      
    } else {
      // Something happened in setting up the request that triggered an Error
      showStatusMessage(`Error processing shipping request for Order ${_id}. Please try again.`, 'error');
      console.error('Error setting up request:', error.message);
    }
  } finally {
    // Ensure loading indication is set to false regardless of outcome
    if (onorderforshippingloadingindicationcb) {
      onorderforshippingloadingindicationcb(false);
    }
    
    // Refresh the data even if there was an error, as the operation might have succeeded
    // despite the client receiving an error
    try {
      await fetchOmsiapData();
    } catch (refreshError) {
      console.error('Failed to refresh data after updating shipping status:', refreshError);
    }
  }
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
              setShowConfirmedOrders(false);
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
                <td className="order-id">{transaction.id}s</td>
                <td>{transaction.statusesandlogs.date}</td>
                <td className="order-amount">${transaction.system.ordersummary.merchandisetotal}</td>
                <td>{transaction.system.shippinginfo.street}, {transaction.system.shippinginfo.trademark}, {transaction.system.shippinginfo.baranggay}, {transaction.system.shippinginfo.city}, {transaction.system.shippinginfo.province}, {transaction.system.shippinginfo.zipcode}, {transaction.system.shippinginfo.country}</td>
                <td>{transaction.system.ordersummary.totalweightkilos} kg</td>
                <td>{transaction.system.ordersummary.totalitems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {

                      setShowOrderDetails(true)

                      setOrderDetailsObject(transaction)

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
                  <OrderForShippingButton key={transaction._id}
                                          order={transaction}
                                          onOrderForShipping={handleOrderForShipping}/>
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

const OrdersForShipping = ({ 
  ordersforshipping,
  setOrderDetailsObject,

  setShowDatabaseConfiguration,
  setShowOrdersForShipping,

  setShowConfirmedOrders,

  setShowOrderDetails,

  setShowPendingOrders, 
  setShowPendingOrderDetails,
  
  fetchOmsiapData

}) => {

  const [transactions, setTransactions] = useState(ordersforshipping)
  const [filteredTransactions, setFilteredTransactions] = useState(ordersforshipping)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [activeRow, setActiveRow] = useState(null)

  const [ordershippedloadingindication, ordershippedloadingindicationcb] = useState(false)

 // Filter transactions based on search query
 useEffect(() => {

  if (!searchQuery.trim()) {
    setFilteredTransactions(transactions);
    return;
  }

  const query = searchQuery.toLowerCase();
  const filtered = transactions.filter(transaction => {
    // Check if the property exists before accessing its toLowerCase method
    const idMatch = transaction.id?.toLowerCase().includes(query) || false;
    const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
    
    // Safely access nested properties
    const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
    const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
    
    return idMatch || dateMatch || addressMatch || cityMatch;
  });
  
  setFilteredTransactions(filtered);
}, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);

    {/*
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
    */}

  };

  // Improved handleOrderShipped function with shipping-specific messaging
const handleOrderShipped = async (_id) => {
  // Prevent multiple simultaneous requests
  if (ordershippedloadingindicationcb) {
    ordershippedloadingindicationcb(true);
  }
  
  try {
    // Validate input
    if (!_id) {
      showStatusMessage('Order ID is missing', 'error');
      return;
    }
    
    // Send request to backend to mark the order as shipped
    const response = await axiosCreatedInstance.post("/omsiap/ordershipped", { _id });
    
    // Show success status message based on backend response
    showStatusMessage(
      response.data.message || `Order ${_id} has been marked as shipped successfully`,
      'success'
    );
    
    // Update the UI with fresh data
    await fetchOmsiapData();
    
  } catch (error) {
    // Handle different types of backend errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message ||
                           `Failed to mark Order ${_id} as shipped. Server responded with an error.`;
      
      showStatusMessage(errorMessage, 'error');
      console.error('Backend error response:', error.response.data);
      
      // Handle specific error status codes
      switch(error.response.status) {
        case 404:
          showStatusMessage(`Order ${_id} could not be found. It may have been deleted or moved.`, 'error');
          break;
        case 400:
          // The message from the server should already be descriptive
          // Check for specific shipping-related errors
          if (error.response.data.message && error.response.data.message.includes('status')) {
            showStatusMessage('This order cannot be marked as shipped. It may need to be prepared for shipping first.', 'error');
          }
          break;
        case 401:
          showStatusMessage('You are not authorized to mark this order as shipped. Please log in again.', 'error');
          break;
        case 403:
          showStatusMessage('You do not have permission to update order shipping status.', 'error');
          break;
        case 500:
          showStatusMessage('The server encountered an error while marking the order as shipped. Please try again later.', 'error');
          break;
      }
      
    } else if (error.request) {
      // The request was made but no response was received
      showStatusMessage(
        `No response received when trying to mark Order ${_id} as shipped. Please check your network connection.`,
        'error'
      );
      console.error('No response received:', error.request);
      
    } else {
      // Something happened in setting up the request that triggered an Error
      showStatusMessage(`Error processing shipment update for Order ${_id}. Please try again.`, 'error');
      console.error('Error setting up request:', error.message);
    }
  } finally {
    // Ensure loading indication is set to false regardless of outcome
    if (ordershippedloadingindicationcb) {
      ordershippedloadingindicationcb(false);
    }
    
    // Refresh the data even if there was an error, as the operation might have succeeded
    // despite the client receiving an error
    try {
      await fetchOmsiapData();
    } catch (refreshError) {
      console.error('Failed to refresh data after marking order as shipped:', refreshError);
    }
  }
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
        <h1 className="page-title">Orders For Shipping</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false);
              setShowOrdersForShipping(false);
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
                 <td className="order-id">{transaction.id}s</td>
                <td>{transaction.statusesandlogs.date}</td>
                <td className="order-amount">${transaction.system.ordersummary.merchandisetotal}</td>
                <td>{transaction.system.shippinginfo.street}, {transaction.system.shippinginfo.trademark}, {transaction.system.shippinginfo.baranggay}, {transaction.system.shippinginfo.city}, {transaction.system.shippinginfo.province}, {transaction.system.shippinginfo.zipcode}, {transaction.system.shippinginfo.country}</td>
                <td>{transaction.system.ordersummary.totalweightkilos} kg</td>
                <td>{transaction.system.ordersummary.totalitems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {

                      setShowOrderDetails(true)

                      setOrderDetailsObject(transaction)

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
                  <OrderShippedButton key={transaction._id}
                                      order={transaction}
                                      onOrderShipped={handleOrderShipped}/>
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

const ShippedOrders = ({ 
  shippedorders,
  setOrderDetailsObject,

  setShowDatabaseConfiguration,
  setShowShippedOrders,

  setShowOrdersForShipping,

  setShowConfirmedOrders,

  setShowOrderDetails,

  setShowPendingOrders, 
  setShowPendingOrderDetails 

}) => {

  const [transactions, setTransactions] = useState(shippedorders)
  const [filteredTransactions, setFilteredTransactions] = useState(shippedorders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [activeRow, setActiveRow] = useState(null)

 // Filter transactions based on search query
 useEffect(() => {

  if (!searchQuery.trim()) {
    setFilteredTransactions(transactions);
    return;
  }

  const query = searchQuery.toLowerCase();
  const filtered = transactions.filter(transaction => {
    // Check if the property exists before accessing its toLowerCase method
    const idMatch = transaction.id?.toLowerCase().includes(query) || false;
    const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
    
    // Safely access nested properties
    const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
    const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
    
    return idMatch || dateMatch || addressMatch || cityMatch;
  });
  
  setFilteredTransactions(filtered);
}, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);

    {/*
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
    */}

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
        <h1 className="page-title">Shipped Orders</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false)
              setShowShippedOrders(false)
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
                <td className="order-id">{transaction.id}s</td>
                <td>{transaction.statusesandlogs.date}</td>
                <td className="order-amount">${transaction.system.ordersummary.merchandisetotal}</td>
                <td>{transaction.system.shippinginfo.street}, {transaction.system.shippinginfo.trademark}, {transaction.system.shippinginfo.baranggay}, {transaction.system.shippinginfo.city}, {transaction.system.shippinginfo.province}, {transaction.system.shippinginfo.zipcode}, {transaction.system.shippinginfo.country}</td>
                <td>{transaction.system.ordersummary.totalweightkilos} kg</td>
                <td>{transaction.system.ordersummary.totalitems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {

                      setShowOrderDetails(true)

                      setOrderDetailsObject(transaction)

                    }}
                  >
                    View
                  </button>

                  <button 
                    className="message-btn" 
                    onClick={() => handleMessageOrder(transaction.id)}
                  >
                    Message
                  </button>

                  {/*
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
                  */}
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

const SuccessfulOrders = ({ 
  successfulorders,
  setOrderDetailsObject,

  setShowDatabaseConfiguration,
  setShowSuccessfulOrders,
  setShowOrdersForShipping,

  setShowConfirmedOrders,

  setShowOrderDetails,

  setShowPendingOrders, 
  setShowPendingOrderDetails 

}) => {

  const [transactions, setTransactions] = useState(successfulorders)
  const [filteredTransactions, setFilteredTransactions] = useState(successfulorders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [activeRow, setActiveRow] = useState(null)

 // Filter transactions based on search query
 useEffect(() => {

  if (!searchQuery.trim()) {
    setFilteredTransactions(transactions);
    return;
  }

  const query = searchQuery.toLowerCase();
  const filtered = transactions.filter(transaction => {
    // Check if the property exists before accessing its toLowerCase method
    const idMatch = transaction.id?.toLowerCase().includes(query) || false;
    const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
    
    // Safely access nested properties
    const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
    const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
    
    return idMatch || dateMatch || addressMatch || cityMatch;
  });
  
  setFilteredTransactions(filtered);
}, [searchQuery, transactions]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Show status message with animation
  const showStatusMessage = (message) => {
    setStatusMessage(message);

    {/*
    setTimeout(() => {
      setStatusMessage('');
    }, 3000);
    */}

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
        <h1 className="page-title">Successful Orders</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false);
              setShowSuccessfulOrders(false);
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
                <td className="order-id">{transaction.id}s</td>
                <td>{transaction.statusesandlogs.date}</td>
                <td className="order-amount">${transaction.system.ordersummary.merchandisetotal}</td>
                <td>{transaction.system.shippinginfo.street}, {transaction.system.shippinginfo.trademark}, {transaction.system.shippinginfo.baranggay}, {transaction.system.shippinginfo.city}, {transaction.system.shippinginfo.province}, {transaction.system.shippinginfo.zipcode}, {transaction.system.shippinginfo.country}</td>
                <td>{transaction.system.ordersummary.totalweightkilos} kg</td>
                <td>{transaction.system.ordersummary.totalitems}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn" 
                    onClick={() => {

                      setShowOrderDetails(true)

                      setOrderDetailsObject(transaction)

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

const RejectedOrders = ({ 
  rejectedorders,
  setOrderDetailsObject,
  setShowDatabaseConfiguration, 
  setShowOrderDetails,
  setShowRejectedOrders,

  setShowPendingOrders, 
  setShowPendingOrderDetails 

}) => {
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

  const [transactions, setTransactions] = useState(rejectedorders);
  const [filteredTransactions, setFilteredTransactions] = useState(rejectedorders);
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
    const filtered = transactions.filter(transaction => {
      // Check if the property exists before accessing its toLowerCase method
      const idMatch = transaction.id?.toLowerCase().includes(query) || false;
      const dateMatch = transaction.date?.toLowerCase().includes(query) || false;
      
      // Safely access nested properties
      const addressMatch = transaction.details?.shippingInfo?.address?.toLowerCase().includes(query) || false;
      const cityMatch = transaction.details?.shippingInfo?.city?.toLowerCase().includes(query) || false;
      
      return idMatch || dateMatch || addressMatch || cityMatch;
    });
    
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
        <h1 className="page-title">Rejected Orders</h1>
        <div className="close-button" 
            onClick={()=>{
              setShowDatabaseConfiguration(false)
              setShowRejectedOrders(false)
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

                      setShowOrderDetails(true)

                      setOrderDetailsObject(transaction)

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

const OrderDetailsModal = ({ setShowOrderDetails, transaction }) => {
  const [stockStatus, setStockStatus] = useState({});
  const [isChecking, setIsChecking] = useState({});
  
  if (!transaction) return null;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      setShowOrderDetails(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return 'var(--status-default)';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'var(--status-pending)';
      case 'processing':
        return 'var(--status-processing)';
      case 'shipped':
        return 'var(--status-shipped)';
      case 'delivered':
        return 'var(--status-delivered)';
      case 'accepted':
        return 'var(--status-delivered)';
      case 'rejected':
      case 'cancelled':
        return 'var(--status-cancelled)';
      default:
        return 'var(--status-default)';
    }
  };
  
  // Check stock availability
  const checkStock = (productId) => {
    setIsChecking(prev => ({ ...prev, [productId]: true }));
    
    // Simulate API call to check stock
    setTimeout(() => {
      // Generate random stock status for demonstration
      const available = Math.floor(Math.random() * 20);
      setStockStatus(prev => ({ 
        ...prev, 
        [productId]: {
          count: available,
          status: available > 0 ? 'available' : 'out-of-stock'
        }
      }));
      setIsChecking(prev => ({ ...prev, [productId]: false }));
    }, 800);
  };
  
  // Get stock status indicator color
  const getStockStatusColor = (status) => {
    switch(status) {
      case 'available':
        return 'var(--status-shipped)';
      case 'out-of-stock':
        return 'var(--status-cancelled)';
      default:
        return 'var(--status-default)';
    }
  };
  
  // Get fallback image when product image is not available
  const getFallbackImage = (category) => {
    switch(category?.toLowerCase()) {
      case 'electronics':
        return '/images/electronics-placeholder.jpg';
      case 'clothing':
        return '/images/clothing-placeholder.jpg';
      case 'furniture':
        return '/images/furniture-placeholder.jpg';
      case 'food':
        return '/images/food-placeholder.jpg';
      default:
        return '/images/product-placeholder.jpg';
    }
  };
  
  // Extract data from the merchandise transaction schema
  const id = transaction.id || 'No ID';
  const date = transaction.statusesandlogs?.date || 'No Date';
  const status = transaction.statusesandlogs?.status || 'Unknown';
  const paymentMethod = transaction.details?.paymentmethod || 'Unknown';
  
  // Extract shipping information
  const shippingInfo = transaction.system?.shippinginfo || {};
  const {
    street = '',
    trademark = '',
    baranggay = '',
    city = '',
    province = '',
    zipcode = '',
    country = ''
  } = shippingInfo;
  
  // Extract products from merchandise list
  const products = transaction.details?.merchandise?.list || [];
  
  // Extract order summary
  const orderSummary = transaction.system?.ordersummary || {};
  const {
    merchandisetotal = 0,
    shippingtotal = 0,
    totalcapital = 0,
    totaltransactiongiveaway = 0,
    totalprofit = 0,
    totalitems = 0,
    totalweightgrams = 0,
    totalweightkilos = 0
  } = orderSummary;
  
  // Calculate total amount
  const totalAmount = Number(merchandisetotal || 0) + Number(shippingtotal || 0);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="order-details-modal">
        <button className="close-button" 
                onClick={() => setShowOrderDetails(false)}>
          <FaTimes />
        </button>
        <h2 className="modal-title">Order Details</h2>
        
        <div className="order-section">
          <h3><FaReceipt className="section-icon" /> Transaction Information</h3>
          <div className="info-grid transaction-info">
            <div className="info-item">
              <span className="info-label">Order ID:</span>
              <span className="info-value highlight">{id}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><FaCalendarAlt className="info-icon" /> Date:</span>
              <span className="info-value bright-text">{formatDate(date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><FaTag className="info-icon" /> Intent:</span>
              <span className="info-value bright-text">{transaction.intent || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><FaDollarSign className="info-icon" /> Total Amount:</span>
              <span className="info-value highlight">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value status-badge" style={{ backgroundColor: getStatusColor(status) }}>
                <FaCircle className="status-icon" />
                {status}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label"><FaCreditCard className="info-icon" /> Payment Method:</span>
              <span className="info-value bright-text">{paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="order-section">
          <h3><FaShippingFast className="section-icon" /> Shipping Information</h3>
          <div className="shipping-info">
            {street && <p className="address-line">{street}</p>}
            {trademark && <p className="address-line">{trademark}</p>}
            {baranggay && <p className="address-line">{baranggay}</p>}
            <p className="address-line">
              {city}{city && province ? ', ' : ''}{province} {zipcode}
            </p>
            {country && <p className="address-line">{country}</p>}
          </div>
        </div>

        {products && products.length > 0 && (
          <div className="order-section">
            <h3><FaBox className="section-icon" /> Products</h3>
            <div className="products-list enhanced">
              {products.map((product, index) => {
                const productId = product.authentications?.id || `product-${index}`;
                const productStockStatus = stockStatus[productId];
                const productImage = product.images && product.images.length > 0 
                  ? product.images[0].url 
                  : getFallbackImage(product.details?.category);
                
                return (
                  <div key={index} className="product-item enhanced">
                    <div className="product-image-container">
                      <img 
                        src={productImage} 
                        alt={product.details?.productname || 'Product'} 
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = getFallbackImage();
                        }}
                      />
                    </div>
                    
                    <div className="product-details">
                      <div className="product-info-primary">
                        <span className="product-name">{product.details?.productname || 'Unnamed Product'}</span>
                        <span className="product-price">
                          {formatCurrency(product.details?.price?.amount)}
                        </span>
                      </div>
                      
                      <div className="product-info-secondary">
                        {product.details?.category && 
                          <span className="product-category">
                            <FaTag className="category-icon" /> {product.details.category}
                          </span>
                        }
                        {product.details?.weightingrams && 
                          <span className="product-weight">
                            <FaWeight className="weight-icon" /> {product.details.weightingrams}g
                          </span>
                        }
                        {product.quantity && 
                          <span className="product-quantity">
                            <FaLayerGroup className="quantity-icon" /> Qty: {product.quantity}
                          </span>
                        }
                      </div>
                      
                      {product.details?.description && (
                        <p className="product-description">{product.details.description}</p>
                      )}
                    </div>
                    
                    <div className="product-stock-check">
                      {!productStockStatus && !isChecking[productId] ? (
                        <button 
                          className="check-stock-btn"
                          onClick={() => checkStock(productId)}
                        >
                          <FaSearch className="check-icon" /> Check Stock
                        </button>
                      ) : isChecking[productId] ? (
                        <div className="checking-status">
                          <FaSpinner className="spin-icon" /> Checking...
                        </div>
                      ) : (
                        <div className="stock-status" 
                             style={{ backgroundColor: getStockStatusColor(productStockStatus.status) }}>
                          {productStockStatus.status === 'available' ? (
                            <>
                              <FaCheckCircle className="status-icon" /> 
                              In Stock ({productStockStatus.count} available)
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="status-icon" /> 
                              Out of Stock
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="order-section summary-section">
          <h3><FaReceipt className="section-icon" /> Order Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Merchandise Total:</span>
              <span className="summary-value">{formatCurrency(merchandisetotal)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Shipping Total:</span>
              <span className="summary-value">{formatCurrency(shippingtotal)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Capital:</span>
              <span className="summary-value">{formatCurrency(totalcapital)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Transaction Giveaway:</span>
              <span className="summary-value">{formatCurrency(totaltransactiongiveaway)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Profit:</span>
              <span className="summary-value">{formatCurrency(totalprofit)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Items:</span>
              <span className="summary-value">{totalitems}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Weight:</span>
              <span className="summary-value">{totalweightkilos} kg ({totalweightgrams} g)</span>
            </div>
            <div className="summary-item highlight-row">
              <span className="summary-label">Total:</span>
              <span className="summary-value total-value">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
        
        {/* Customer Information Section */}
        {transaction.system?.thistransactionismadeby && (
          <div className="order-section">
            <h3><FaUser className="section-icon" /> Customer Information</h3>
            <div className="customer-info">
              {transaction.system.thistransactionismadeby.name && (
                <p className="customer-name">
                  {transaction.system.thistransactionismadeby.name.firstname || ''}{' '}
                  {transaction.system.thistransactionismadeby.name.middlename || ''}{' '}
                  {transaction.system.thistransactionismadeby.name.lastname || ''}
                </p>
              )}
              {transaction.system.thistransactionismadeby.id && (
                <p className="customer-id">Customer ID: {transaction.system.thistransactionismadeby.id}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Transaction Status History */}
        {transaction.statusesandlogs?.logs && transaction.statusesandlogs.logs.length > 0 && (
          <div className="order-section">
            <h3><FaHistory className="section-icon" /> Transaction History</h3>
            <div className="status-history">
              {transaction.statusesandlogs.logs.map((log, index) => (
                <div key={index} className="status-log">
                  <br/>
                  <div className="log-date">Date: {log.date}</div>
                  <div className="log-type">Type: {log.type}</div>
                  <div className="log-indication">Indication: {log.indication}</div>
                  <p>Messages:</p>
                  {log.messages && log.messages.length > 0 && (
                    <div className="log-messages">
                      {log.messages.map((msg, msgIndex) => (
                        <div key={msgIndex} className="log-message">{msg.message}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const CurrencyExchangeAcceptButton = ({ order, onAccept }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(order.id);
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? (
      <Spinner animation="border" variant="light" />
    ) : (
      <button 
        className="accept-btn" 
        onClick={handleAccept}
        disabled={isLoading}
      >
        Accept
      </button>
    )
  );
};

const TotalCurrencyExchange = ({ 
  setShowDatabaseConfiguration, 
  setShowTotalCurrencyExchange, 
  setShowCreditTransaction,
  totalcurrencyexchange,
  credittransactionobjectcb,
  onClose, 
  onView, 
  onEdit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only currency exchange transactions
    const currencyExchanges = totalcurrencyexchange.filter(
      transaction => transaction.intent === 'currency exchange' 
    );
    setFilteredTransactions(currencyExchanges);
  }, [totalcurrencyexchange]);

  useEffect(() => {
    if (searchQuery) {
      const results = totalcurrencyexchange.filter(transaction => 
        // Search by transaction ID
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Search by name
        (transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Search by contact info
        (transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Search by payment method
        (transaction.details?.paymentmethod && 
         transaction.details.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Search by reference number
        (transaction.details?.referrence?.number && 
         transaction.details.referrence.number.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTransactions(results);
    } else {
      // Reset to show only currency exchanges when search is cleared
      const currencyExchanges = totalcurrencyexchange.filter(
        transaction => transaction.intent === 'currency exchange' 
      );
      setFilteredTransactions(currencyExchanges);
    }
  }, [searchQuery, totalcurrencyexchange]);

  const handleAcceptCurrencyExchange = async (id) => {
    try {
      // Initialize status message
      showStatusMessage("Processing request...");
      document.querySelectorAll(".status-message")[0].style.color = "white";
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#3b82f6";
      
      // Show animation for the affected row
      setAnimateRow(id);
      
      // Make API call to accept the currency exchange
      const response = await axiosCreatedInstance.post("/omsiap/acceptcurrencyexchange/accept", { id });
      
      // Handle different response statuses
      switch(response.data.status) {
        case 'EXCHANGE_APPROVED':
          showStatusMessage("Exchange approved successfully!");
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#10b981"; // Green
          break;
          
        case 'TRANSACTION_NOT_FOUND':
          showStatusMessage("Transaction not found. Please refresh the page.");
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
          break;
          
        case 'NOT_FOUND':
          showStatusMessage("System data not found. Please contact administrator.");
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
          break;
          
        default:
          showStatusMessage("Request processed with status: " + response.data.status);
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#f59e0b"; // Amber
      }
    } catch (error) {
      console.error("Error accepting currency exchange:", error);
      
      if (error.response && error.response.data) {
        showStatusMessage(error.response.data.message || "Error processing request");
      } else {
        showStatusMessage("Network error or server unavailable");
      }
      
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
      document.querySelectorAll(".status-message")[0].style.color = "white";
    } finally {
      setTimeout(() => {
        setAnimateRow(null);
      }, 800);
    }
  };

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    
    // Optionally auto-hide the message after some time
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    showStatusMessage("Rejecting transaction...");
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    showStatusMessage("Opening message interface...");
    // Message sending logic would go here
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

  // Helper function to get customer full name
  const getCustomerName = (transaction) => {
    if (!transaction.details?.thistransactionismadeby?.name) return "Unknown";
    
    const { firstname, middlename, lastname } = transaction.details.thistransactionismadeby.name;
    let fullName = firstname || "";
    
    if (middlename) fullName += ` ${middlename}`;
    if (lastname) fullName += ` ${lastname}`;
    
    return fullName.trim() || "Unknown";
  };

  // Helper function to get transaction status with proper formatting
  const getTransactionStatus = (transaction) => {
    if (!transaction.statusesandlogs) return { status: "Unknown", indication: "" };
    return {
      status: transaction.statusesandlogs.status || "Unknown",
      indication: transaction.statusesandlogs.indication || ""
    };
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in': ''}`}>
        <div className="modal-header">
          <h2>Total Currency Exchange</h2>
          <button className="close-button" onClick={()=> {
             setShowDatabaseConfiguration(false)
             setShowTotalCurrencyExchange(false)
          }}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone, or reference number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {statusMessage && (
          <div style={{position:"relative", top: "2vh"}}
               className="status-message">
            {statusMessage}
          </div>
        )}
        
        <div className="pending-deposits-container">
          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No currency exchange transaction found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount (PHP)</th>
                    <th>Amount (OMSIAP)</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Reference</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const statusInfo = getTransactionStatus(transaction);
                    const customerName = getCustomerName(transaction);
                    const logDate = transaction.statusesandlogs?.logs?.[0]?.date || transaction.date;
                    
                    return (
                      <tr 
                        key={transaction.id} 
                        className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''}`}
                      >
                        <td className="transaction-id" title={transaction.id}>
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="customer-name">{customerName}</td>
                        <td className="date-cell">{formatDate(logDate)}</td>
                        <td className="amount">
                          <div className="amount-wrapper">
                            <FaMoneyBillWave className="amount-icon" />
                            <span>₱{transaction.details?.amounts?.phppurchaseorexchangeamount?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="omsiap-amount">
                          <div className="amount-wrapper">
                            <FaCoins className="amount-icon" />
                            <span>{transaction.details?.amounts?.omsiapawasamounttorecieve?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="status">
                          <div className={`status-indicator ${statusInfo.status}`}>
                            {statusInfo.status === 'pending' ? (
                              <FaClock className="status-icon pulse" />
                            ) : statusInfo.status === 'completed' ? (
                              <FaCheckCircle className="status-icon success" />
                            ) : statusInfo.status === 'rejected' ? (
                              <FaTimesCircle className="status-icon error" />
                            ) : (
                              <FaQuestionCircle className="status-icon" />
                            )}
                            <span>{statusInfo.status}</span>
                            {statusInfo.indication && (
                              <span className="status-indication">{statusInfo.indication}</span>
                            )}
                          </div>
                        </td>
                        <td className="payment-method">{transaction.details?.paymentmethod || 'N/A'}</td>
                        <td className="reference-number">{transaction.details?.referrence?.number || 'N/A'}</td>
                        <td className="actions">
                          <div className="action-buttons">
                            <button 
                              className="view-button" 
                              onClick={() => {
                                setShowCreditTransaction(true)
                                credittransactionobjectcb(transaction)
                              }}
                              aria-label="View transaction details"
                            >
                              <FaEye />
                              <span className="button-text">View</span>
                            </button>
                            <button 
                              className="edit-button" 
                              onClick={() => onEdit(transaction.id)}
                              aria-label="Edit transaction"
                            >
                              <FaEdit />
                              <span className="button-text">Edit</span>
                            </button>
                            <CurrencyExchangeAcceptButton 
                              key={transaction.id}
                              order={transaction}
                              onAccept={handleAcceptCurrencyExchange}
                            />
                            <button 
                              className="reject-button" 
                              onClick={() => handleReject(transaction.id)}
                              aria-label="Reject transaction"
                            >
                              <FaTimesCircle />
                              <span className="button-text">Reject</span>
                            </button>
                            <button 
                              className="message-button" 
                              onClick={() => handleMessage(transaction.id)}
                              aria-label="Message about transaction"
                            >
                              <FaEnvelope />
                              <span className="button-text">Message</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PendingCurrencyExchange = ({ 
  setShowDatabaseConfiguration,
  setShowPendingCurrencyExchange, 
  setShowCreditTransaction, 
  pendingcurrencyexchange,
  credittransactionobjectcb, 
  onClose, 
  onView, 
  onEdit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only pending currency exchange transactions
    const pendingExchanges = pendingcurrencyexchange.filter(
      transaction => transaction.intent === 'currency exchange' && 
      transaction.statusesandlogs?.status === 'pending'
    );
    setFilteredTransactions(pendingExchanges);
  }, [pendingcurrencyexchange]);

  useEffect(() => {
    if (searchQuery) {
      const results = pendingcurrencyexchange.filter(transaction => 
        // Only include pending currency exchanges
        transaction.intent === 'currency exchange' && 
        transaction.statusesandlogs?.status === 'pending' &&
        (
          // Search by transaction ID
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // Search by name
          (transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          // Search by contact info
          (transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          // Search by payment method
          (transaction.details?.paymentmethod && 
           transaction.details.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase())) ||
          // Search by reference number
          (transaction.details?.referrence?.number && 
           transaction.details.referrence.number.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
      setFilteredTransactions(results);
    } else {
      // Reset to show only pending currency exchanges when search is cleared
      const pendingExchanges = pendingcurrencyexchange.filter(
        transaction => transaction.intent === 'currency exchange' && 
        transaction.statusesandlogs?.status === 'pending'
      );
      setFilteredTransactions(pendingExchanges);
    }
  }, [searchQuery, pendingcurrencyexchange]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow for animation
    setTimeout(() => {
      setShowDatabaseConfiguration(false);
      setShowPendingCurrencyExchange(false);
    }, 300);
  };

  const handleAcceptCurrencyExchange = async (id) => {
    try {
      // Initialize status message
      showStatusMessage("Processing request...");
      document.querySelectorAll(".status-message")[0].style.color = "white";
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#3b82f6";
      
      // Show animation for the affected row
      setAnimateRow(id);
      
      // Make API call to accept the currency exchange
      const response = await axiosCreatedInstance.post("/omsiap/acceptcurrencyexchange/accept", { id });
      
      // Handle different response statuses
      switch(response.data.status) {
        case 'EXCHANGE_APPROVED':
          showStatusMessage("Exchange approved successfully!");
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#10b981"; // Green
          break;
          
        case 'TRANSACTION_NOT_FOUND':
          showStatusMessage("Transaction not found. Please refresh the page.");
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
          break;
          
        case 'NOT_FOUND':
          showStatusMessage("System data not found. Please contact administrator.");
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
          break;
          
        default:
          showStatusMessage("Request processed with status: " + response.data.status);
          document.querySelectorAll(".status-message")[0].style.backgroundColor = "#f59e0b"; // Amber
      }
    } catch (error) {
      console.error("Error accepting currency exchange:", error);
      
      if (error.response && error.response.data) {
        showStatusMessage(error.response.data.message || "Error processing request");
      } else {
        showStatusMessage("Network error or server unavailable");
      }
      
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
      document.querySelectorAll(".status-message")[0].style.color = "white";
    } finally {
      setTimeout(() => {
        setAnimateRow(null);
      }, 800);
    }
  };

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    
    // Optionally auto-hide the message after some time
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    showStatusMessage("Rejecting transaction...");
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    showStatusMessage("Opening message interface...");
    // Message sending logic would go here
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

  // Helper function to get customer full name
  const getCustomerName = (transaction) => {
    if (!transaction.details?.thistransactionismadeby?.name) return "Unknown";
    
    const { firstname, middlename, lastname } = transaction.details.thistransactionismadeby.name;
    let fullName = firstname || "";
    
    if (middlename) fullName += ` ${middlename}`;
    if (lastname) fullName += ` ${lastname}`;
    
    return fullName.trim() || "Unknown";
  };

  // Helper function to get transaction status with proper formatting
  const getTransactionStatus = (transaction) => {
    if (!transaction.statusesandlogs) return { status: "Unknown", indication: "" };
    return {
      status: transaction.statusesandlogs.status || "Unknown",
      indication: transaction.statusesandlogs.indication || ""
    };
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in': ''}`}>
        <div className="modal-header">
          <h2>Pending Currency Exchange</h2>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone, or reference number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {statusMessage && (
          <div style={{position:"relative", top: "2vh"}}
               className="status-message">
            {statusMessage}
          </div>
        )}
        
        <div className="pending-deposits-container">
          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No pending currency exchange found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount (PHP)</th>
                    <th>Amount (OMSIAP)</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Reference</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const statusInfo = getTransactionStatus(transaction);
                    const customerName = getCustomerName(transaction);
                    const logDate = transaction.statusesandlogs?.logs?.[0]?.date || transaction.date;
                    
                    return (
                      <tr 
                        key={transaction.id} 
                        className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''}`}
                      >
                        <td className="transaction-id" title={transaction.id}>
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="customer-name">{customerName}</td>
                        <td className="date-cell">{formatDate(logDate)}</td>
                        <td className="amount">
                          <div className="amount-wrapper">
                            <FaMoneyBillWave className="amount-icon" />
                            <span>₱{transaction.details?.amounts?.phppurchaseorexchangeamount?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="omsiap-amount">
                          <div className="amount-wrapper">
                            <FaCoins className="amount-icon" />
                            <span>{transaction.details?.amounts?.omsiapawasamounttorecieve?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="status">
                          <div className={`status-indicator ${statusInfo.status}`}>
                            {statusInfo.status === 'pending' ? (
                              <FaClock className="status-icon pulse" />
                            ) : statusInfo.status === 'completed' ? (
                              <FaCheckCircle className="status-icon success" />
                            ) : statusInfo.status === 'rejected' ? (
                              <FaTimesCircle className="status-icon error" />
                            ) : (
                              <FaQuestionCircle className="status-icon" />
                            )}
                            <span>{statusInfo.status}</span>
                            {statusInfo.indication && (
                              <span className="status-indication">{statusInfo.indication}</span>
                            )}
                          </div>
                        </td>
                        <td className="payment-method">{transaction.details?.paymentmethod || 'N/A'}</td>
                        <td className="reference-number">{transaction.details?.referrence?.number || 'N/A'}</td>
                        <td className="actions">
                          <div className="action-buttons">
                            <button 
                              className="view-button" 
                              onClick={() => {
                                setShowCreditTransaction(true)
                                credittransactionobjectcb(transaction)
                              }}
                              aria-label="View transaction details"
                            >
                              <FaEye />
                              <span className="button-text">View</span>
                            </button>
                            <button 
                              className="edit-button" 
                              onClick={() => onEdit(transaction.id)}
                              aria-label="Edit transaction"
                            >
                              <FaEdit />
                              <span className="button-text">Edit</span>
                            </button>
                            <button 
                              className="accept-button" 
                              onClick={() => handleAcceptCurrencyExchange(transaction.id)}
                              aria-label="Accept transaction"
                            >
                              <FaCheckCircle />
                              <span className="button-text">Accept</span>
                            </button>
                            <button 
                              className="reject-button" 
                              onClick={() => handleReject(transaction.id)}
                              aria-label="Reject transaction"
                            >
                              <FaTimesCircle />
                              <span className="button-text">Reject</span>
                            </button>
                            <button 
                              className="message-button" 
                              onClick={() => handleMessage(transaction.id)}
                              aria-label="Message about transaction"
                            >
                              <FaEnvelope />
                              <span className="button-text">Message</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SuccessfulCurrencyExchange = ({ 

  setShowDatabaseConfiguration, 
  setShowSuccessfulCurrencyExchange, 
  setShowCreditTransaction, 
  setShowPendingCurrencyExchange, 

  successfulcurrencyexchange, 
  credittransactionobjectcb,

  onClose, 
  onView, 
  onEdit
  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only pending deposit transactions
    const pendingDeposits = successfulcurrencyexchange.filter(
      transaction => transaction.type === 'currency exchange' && transaction.status === 'successful'
    );
    setFilteredTransactions(pendingDeposits);
  }, [successfulcurrencyexchange]);

  useEffect(() => {
    if (searchQuery) {
      const results = successfulcurrencyexchange.filter(transaction => 
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
      const pendingDeposits = successfulcurrencyexchange.filter(
        transaction => transaction.type === 'currency exchange' && transaction.status === 'successful'
      );
      setFilteredTransactions(pendingDeposits);
    }
  }, [searchQuery, successfulcurrencyexchange]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow for animation
    setTimeout(() => {
      setShowDatabaseConfiguration(false);
      setShowPendingCurrencyExchange(false);
    }, 300);
  };

  const handleAccept = (id) => {
    setAnimateRow(id);
    // Additional accept logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    // Message sending logic would go here
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
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in': ''}`}>
        <div className="modal-header">
          <h2>Successful Currency Exchange</h2>
          <button className="close-button" onClick={()=> {
            setShowDatabaseConfiguration(false)
            setShowSuccessfulCurrencyExchange(false)
          }}>
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
              <p>No successful currency exchange found</p>
            </div>
          ) : (
            <div className="table-responsive">
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
                    <tr 
                      key={transaction.id} 
                      className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''}`}
                    >
                      <td className="transaction-id">{transaction.id}</td>
                      <td className="date-cell">{formatDate(transaction.date)}</td>
                      <td className="amount">
                        <div className="amount-wrapper">
                          <FaMoneyBillWave className="amount-icon" />
                          <span>₱{transaction.amount.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="status">
                        <div className="status-indicator">
                          <FaClock className="status-icon pulse" />
                          <span>Pending</span>
                        </div>
                      </td>
                      <td className="payment-method">{transaction.paymentmethod}</td>
                      <td className="actions">
                        <div className="action-buttons">
                          <button 
                            className="view-button" 
                            onClick={() => {
                              setShowCreditTransaction(true)
                              credittransactionobjectcb(transaction)
                            }}
                            aria-label="View transaction details"
                          >
                            <FaEye />
                            <span className="button-text">View</span>
                          </button>
                          <button 
                            className="edit-button" 
                            onClick={() => onEdit(transaction.id)}
                            aria-label="Edit transaction"
                          >
                            <FaEdit />
                            <span className="button-text">Edit</span>
                          </button>
                          <button 
                            className="accept-button" 
                            onClick={() => handleAccept(transaction.id)}
                            aria-label="Accept transaction"
                          >
                            <FaCheckCircle />
                            <span className="button-text">Accept</span>
                          </button>
                          <button 
                            className="reject-button" 
                            onClick={() => handleReject(transaction.id)}
                            aria-label="Reject transaction"
                          >
                            <FaTimesCircle />
                            <span className="button-text">Reject</span>
                          </button>
                          <button 
                            className="message-button" 
                            onClick={() => handleMessage(transaction.id)}
                            aria-label="Message about transaction"
                          >
                            <FaEnvelope />
                            <span className="button-text">Message</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RejectedCurrencyExchange = ({ 
  setShowDatabaseConfiguration, 
  setShowRejectedCurrencyExchange, 
  setShowCreditTransaction, 
  setShowPendingCurrencyExchange, 
  rejectedcurrencyexchange, 
  credittransactionobjectcb,
  onClose, 
  onView, 
  onEdit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only rejected currency exchange transactions
    const rejectedExchanges = rejectedcurrencyexchange.filter(
      transaction => transaction.intent === 'currency exchange' && 
      transaction.statusesandlogs?.status === 'rejected'
    );
    setFilteredTransactions(rejectedExchanges);
  }, [rejectedcurrencyexchange]);

  useEffect(() => {
    if (searchQuery) {
      const results = rejectedcurrencyexchange.filter(transaction => 
        // Search by transaction ID
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Search by name
        (transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Search by contact info
        (transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Search by payment method
        (transaction.details?.paymentmethod && 
         transaction.details.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Search by reference number
        (transaction.details?.referrence?.number && 
         transaction.details.referrence.number.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTransactions(results);
    } else {
      // Reset to show only rejected currency exchanges when search is cleared
      const rejectedExchanges = rejectedcurrencyexchange.filter(
        transaction => transaction.intent === 'currency exchange' && 
        transaction.statusesandlogs?.status === 'rejected'
      );
      setFilteredTransactions(rejectedExchanges);
    }
  }, [searchQuery, rejectedcurrencyexchange]);

  const handleReactivate = async (id) => {
    try {
      // Initialize status message
      showStatusMessage("Processing reactivation request...");
      document.querySelectorAll(".status-message")[0].style.color = "white";
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#3b82f6";
      
      // Show animation for the affected row
      setAnimateRow(id);
      
      // Make API call to reactivate the currency exchange (you'll need to implement this)
      // const response = await axiosCreatedInstance.post("/omsiap/reactivatecurrencyexchange", { id });
      
      // For now, just show a status message
      showStatusMessage("Reactivation request sent. Awaiting processing.");
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#f59e0b"; // Amber
      
      // Here you would handle the actual status update after API call
      
    } catch (error) {
      console.error("Error reactivating currency exchange:", error);
      
      showStatusMessage("Error processing reactivation request");
      document.querySelectorAll(".status-message")[0].style.backgroundColor = "#ef4444"; // Red
      document.querySelectorAll(".status-message")[0].style.color = "white";
    } finally {
      setTimeout(() => {
        setAnimateRow(null);
      }, 800);
    }
  };

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    
    // Auto-hide the message after some time
    setTimeout(() => {
      setStatusMessage("");
    }, 5000);
  };

  const handleMessage = (id) => {
    showStatusMessage("Opening message interface...");
    // Message sending logic would go here
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

  // Helper function to get customer full name
  const getCustomerName = (transaction) => {
    if (!transaction.details?.thistransactionismadeby?.name) return "Unknown";
    
    const { firstname, middlename, lastname } = transaction.details.thistransactionismadeby.name;
    let fullName = firstname || "";
    
    if (middlename) fullName += ` ${middlename}`;
    if (lastname) fullName += ` ${lastname}`;
    
    return fullName.trim() || "Unknown";
  };

  // Helper function to get transaction status with proper formatting
  const getTransactionStatus = (transaction) => {
    if (!transaction.statusesandlogs) return { status: "Unknown", indication: "" };
    return {
      status: transaction.statusesandlogs.status || "Unknown",
      indication: transaction.statusesandlogs.indication || ""
    };
  };

  // Helper function to get rejection reason if available
  const getRejectionReason = (transaction) => {
    if (!transaction.statusesandlogs?.logs) return "No reason provided";
    
    // Find the rejection log entry
    const rejectionLog = transaction.statusesandlogs.logs.find(log => 
      log.status === 'rejected' || log.action === 'reject'
    );
    
    return rejectionLog?.reason || rejectionLog?.message || "No reason provided";
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in': ''}`}>
        <div className="modal-header">
          <h2>Rejected Currency Exchange</h2>
          <button className="close-button" onClick={()=> {
            setShowDatabaseConfiguration(false)
            setShowRejectedCurrencyExchange(false)
          }}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone, or reference number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {statusMessage && (
          <div style={{position:"relative", top: "2vh"}}
               className="status-message">
            {statusMessage}
          </div>
        )}
        
        <div className="pending-deposits-container">
          {filteredTransactions.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No rejected currency exchange transactions found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount (PHP)</th>
                    <th>Amount (OMSIAP)</th>
                    <th>Rejection Reason</th>
                    <th>Payment Method</th>
                    <th>Reference</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const statusInfo = getTransactionStatus(transaction);
                    const customerName = getCustomerName(transaction);
                    const logDate = transaction.statusesandlogs?.logs?.[0]?.date || transaction.date;
                    const rejectionReason = getRejectionReason(transaction);
                    
                    return (
                      <tr 
                        key={transaction.id} 
                        className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''}`}
                      >
                        <td className="transaction-id" title={transaction.id}>
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="customer-name">{customerName}</td>
                        <td className="date-cell">{formatDate(logDate)}</td>
                        <td className="amount">
                          <div className="amount-wrapper">
                            <FaMoneyBillWave className="amount-icon" />
                            <span>₱{transaction.details?.amounts?.phppurchaseorexchangeamount?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="omsiap-amount">
                          <div className="amount-wrapper">
                            <FaCoins className="amount-icon" />
                            <span>{transaction.details?.amounts?.omsiapawasamounttorecieve?.toFixed(2) || '0.00'}</span>
                          </div>
                        </td>
                        <td className="rejection-reason">
                          <div className="reason-wrapper" title={rejectionReason}>
                            <FaInfoCircle className="reason-icon" />
                            <span>{rejectionReason.substring(0, 20)}{rejectionReason.length > 20 ? '...' : ''}</span>
                          </div>
                        </td>
                        <td className="payment-method">{transaction.details?.paymentmethod || 'N/A'}</td>
                        <td className="reference-number">{transaction.details?.referrence?.number || 'N/A'}</td>
                        <td className="actions">
                          <div className="action-buttons">
                            <button 
                              className="view-button" 
                              onClick={() => {
                                setShowCreditTransaction(true)
                                credittransactionobjectcb(transaction)
                              }}
                              aria-label="View transaction details"
                            >
                              <FaEye />
                              <span className="button-text">View</span>
                            </button>
                            <button 
                              className="edit-button" 
                              onClick={() => onEdit(transaction.id)}
                              aria-label="Edit transaction"
                            >
                              <FaEdit />
                              <span className="button-text">Edit</span>
                            </button>
                            <button 
                              className="reactivate-button" 
                              onClick={() => handleReactivate(transaction.id)}
                              aria-label="Reactivate transaction"
                            >
                              <FaRedoAlt />
                              <span className="button-text">Reactivate</span>
                            </button>
                            <button 
                              className="message-button" 
                              onClick={() => handleMessage(transaction.id)}
                              aria-label="Message about transaction"
                            >
                              <FaEnvelope />
                              <span className="button-text">Message</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



const TotalWithdrawals = ({
  setShowDatabaseConfiguration, 
  setShowTotalWithdrawals,  
  setShowCreditTransaction,

  totalwithdrawals,
  credittransactionobjectcb,

  onClose, 
  onView, 
  onEdit 
}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only withdrawal transactions
    const withdrawalTransactions = totalwithdrawals.filter(
      transaction => transaction.intent === 'withdrawal' 
    );
    setFilteredTransactions(withdrawalTransactions);
  }, [totalwithdrawals]);

  useEffect(() => {
    if (searchQuery) {
      const results = totalwithdrawals.filter(transaction => {
        // Base transaction ID search
        const idMatch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Sender information search
        const senderMatch = transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Recipient information search
        const recipientMatch = transaction.details?.thistransactionismainlyintendedto?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Payment method search
        const paymentMethodMatch = transaction.details?.paymentmethod?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Reference number search
        const referenceMatch = transaction.details?.referrence?.referencenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return idMatch || senderMatch || recipientMatch || paymentMethodMatch || referenceMatch;
      });
      
      setFilteredTransactions(results);
    } else {
      // Reset to show only withdrawal transactions when search is cleared
      const withdrawalTransactions = totalwithdrawals.filter(
        transaction => transaction.intent === 'withdrawal'
      );
      setFilteredTransactions(withdrawalTransactions);
    }
  }, [searchQuery, totalwithdrawals]);

  const handleAccept = (id) => {
    setAnimateRow(id);
    // Additional accept logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    // Message sending logic would go here
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionStatus = (transaction) => {
    // Check the current status from the statusesandlogs
    if (transaction.statusesandlogs && transaction.statusesandlogs.status) {
      return transaction.statusesandlogs.status;
    }
    return 'Pending'; // Default status if none found
  };

  const toggleExpandTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="status-icon success" />;
      case 'pending':
        return <FaClock className="status-icon pulse" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon error" />;
      case 'processing':
        return <FaMoneyBillWave className="status-icon" />;
      default:
        return <FaClock className="status-icon pulse" />;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₱0.00';
    return `₱${Number(amount).toFixed(2)}`;
  };

  const formatName = (nameObj) => {
    if (!nameObj) return 'N/A';
    const { firstname = '', middlename = '', lastname = '' } = nameObj;
    return `${firstname} ${middlename ? middlename + ' ' : ''}${lastname}`.trim();
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in' : ''}`}>
        <div className="modal-header">
          <h2>Total Withdrawals</h2>
          <button className="close-button" onClick={() => {
            setShowDatabaseConfiguration(false);
            setShowTotalWithdrawals(false);
          }}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone number, or reference..."
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
              <p>No withdrawal transactions found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const transactionStatus = getTransactionStatus(transaction);
                    const statusClass = getStatusClass(transactionStatus);
                    const statusIcon = getStatusIcon(transactionStatus);
                    
                    // Get the latest log entry date if available
                    const latestLogDate = transaction.statusesandlogs?.logs?.length > 0 
                      ? transaction.statusesandlogs.logs[transaction.statusesandlogs.logs.length - 1].date 
                      : transaction.date;
                    
                    return (
                      <>
                        <tr 
                          key={transaction.id}
                          className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''} ${expandedTransaction === transaction.id ? 'expanded' : ''}`}
                          onClick={() => toggleExpandTransaction(transaction.id)}
                        >
                          <td className="transaction-id">{transaction.id}</td>
                          <td className="date-cell">{formatDate(latestLogDate)}</td>
                          <td className="sender-cell">
                            {formatName(transaction.details?.thistransactionismadeby?.name)}
                          </td>
                          <td className="recipient-cell">
                            {formatName(transaction.details?.thistransactionismainlyintendedto?.name)}
                          </td>
                          <td className="amount">
                            <div className="amount-wrapper">
                              <FaMoneyBillWave className="amount-icon" />
                              <span>{formatCurrency(transaction.details?.amounts?.phpamounttorecieve)}</span>
                            </div>
                          </td>
                          <td className="status">
                            <div className={`status-indicator ${statusClass}`}>
                              {statusIcon}
                              <span>{transactionStatus}</span>
                            </div>
                          </td>
                          <td className="payment-method">{transaction.details?.paymentmethod || 'N/A'}</td>
                          <td className="actions">
                            <div className="action-buttons">
                              <button 
                                className="view-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCreditTransaction(true);
                                  credittransactionobjectcb(transaction);
                                }}
                                aria-label="View transaction details"
                              >
                                <FaEye />
                                <span className="button-text">View</span>
                              </button>
                              <button 
                                className="edit-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(transaction.id);
                                }}
                                aria-label="Edit transaction"
                              >
                                <FaEdit />
                                <span className="button-text">Edit</span>
                              </button>
                              <button 
                                className="accept-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAccept(transaction.id);
                                }}
                                aria-label="Accept transaction"
                              >
                                <FaCheckCircle />
                                <span className="button-text">Accept</span>
                              </button>
                              <button 
                                className="reject-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(transaction.id);
                                }}
                                aria-label="Reject transaction"
                              >
                                <FaTimesCircle />
                                <span className="button-text">Reject</span>
                              </button>
                              <button 
                                className="message-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessage(transaction.id);
                                }}
                                aria-label="Message about transaction"
                              >
                                <FaEnvelope />
                                <span className="button-text">Message</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedTransaction === transaction.id && (
                          <tr className="expanded-details-row">
                            <td colSpan="8">
                              <div className="expanded-details">
                                <div className="detail-section">
                                  <h3><FaIdCard /> Transaction Details</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Reference Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.referencenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">GCash Phone Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.gcashphonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Intent Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.intent)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Deductions:</span>
                                      <span className="detail-value">
                                        {formatCurrency(
                                          (transaction.details?.amounts?.deductions?.successfulprocessing?.amount || 0) + 
                                          (transaction.details?.amounts?.deductions?.rejectionprocessing?.amount || 0)
                                        )}
                                      </span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Profit:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.profit)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Final Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.phpamounttorecieve)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Sender Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismadeby?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismadeby?.contact?.address ? 
                                          `${transaction.details.thistransactionismadeby.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Recipient Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismainlyintendedto?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismainlyintendedto?.contact?.address ? 
                                          `${transaction.details.thistransactionismainlyintendedto.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaHistory /> Transaction History</h3>
                                  <div className="status-timeline">
                                    {transaction.statusesandlogs?.logs?.map((log, index) => (
                                      <div key={index} className="status-log-item">
                                        <div className="status-log-date">{formatDate(log.date)}</div>
                                        <div className="status-log-content">
                                          <div className="status-log-type">{log.type}</div>
                                          <div className="status-log-indication">{log.indication}</div>
                                          {log.messages?.map((msgObj, msgIndex) => (
                                            <div key={msgIndex} className="status-log-message">{msgObj.message}</div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    {(!transaction.statusesandlogs?.logs || transaction.statusesandlogs.logs.length === 0) && 
                                      <div className="no-logs">No status logs available</div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const PendingWithdrawals = ({ 
  setShowDatabaseConfiguration, 
  setShowPendingWithdrawals, 
  setShowCreditTransaction, 

  pendingwithdrawals = [], // Default empty array
  credittransactionobjectcb, 

  onClose, 
  onView, 
  onEdit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [animateRow, setAnimateRow] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  // Combined useEffect for initial load and animations
  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Check if pendingwithdrawals exists before filtering
    if (pendingwithdrawals && pendingwithdrawals.length > 0) {
      // Initial filtering of only pending withdrawal transactions
      const pendingWithdrawalsList = pendingwithdrawals.filter(
        transaction => transaction.intent === 'withdrawal' && 
        transaction.statusesandlogs && 
        transaction.statusesandlogs.status && 
        transaction.statusesandlogs.status.toLowerCase() === 'pending'
      );
      setFilteredTransactions(pendingWithdrawalsList);
    } else {
      // Initialize with empty array if pendingwithdrawals is undefined or empty
      setFilteredTransactions([]);
    }
  }, [pendingwithdrawals]);

  // Separate useEffect for search functionality
  useEffect(() => {
    // Only proceed if pendingwithdrawals exists
    if (!pendingwithdrawals || pendingwithdrawals.length === 0) return;
    
    if (searchQuery) {
      const results = pendingwithdrawals.filter(transaction => {
        // Only include pending withdrawals
        const isPendingWithdrawal = transaction.intent === 'withdrawal' && 
                                  transaction.statusesandlogs && 
                                  transaction.statusesandlogs.status && 
                                  transaction.statusesandlogs.status.toLowerCase() === 'pending';
        
        if (!isPendingWithdrawal) return false;
        
        // Base transaction ID search
        const idMatch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Sender information search
        const senderMatch = transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Recipient information search
        const recipientMatch = transaction.details?.thistransactionismainlyintendedto?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Payment method search
        const paymentMethodMatch = transaction.details?.paymentmethod?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Reference number search
        const referenceMatch = transaction.details?.referrence?.referencenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return idMatch || senderMatch || recipientMatch || paymentMethodMatch || referenceMatch;
      });
      
      setFilteredTransactions(results);
    } else {
      // Reset to show only pending withdrawals when search is cleared
      const pendingWithdrawalsList = pendingwithdrawals.filter(
        transaction => transaction.intent === 'withdrawal' && 
        transaction.statusesandlogs && 
        transaction.statusesandlogs.status && 
        transaction.statusesandlogs.status.toLowerCase() === 'pending'
      );
      setFilteredTransactions(pendingWithdrawalsList);
    }
  }, [searchQuery, pendingwithdrawals]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow for animation
    setTimeout(() => {
      setShowDatabaseConfiguration(false);
      setShowPendingWithdrawals(false);
    }, 300);
  };

  const handleAccept = (id) => {
    setAnimateRow(id);
    // Additional accept logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    // Message sending logic would go here
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₱0.00';
    return `₱${Number(amount).toFixed(2)}`;
  };

  const formatName = (nameObj) => {
    if (!nameObj) return 'N/A';
    const { firstname = '', middlename = '', lastname = '' } = nameObj;
    return `${firstname} ${middlename ? middlename + ' ' : ''}${lastname}`.trim();
  };

  const toggleExpandTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in': ''}`}>
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
              placeholder="Search by ID, name, email, phone number, or reference..."
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
              <p>No pending withdrawals found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    // Get the latest log entry date if available
                    const latestLogDate = transaction.statusesandlogs?.logs?.length > 0 
                      ? transaction.statusesandlogs.logs[transaction.statusesandlogs.logs.length - 1].date 
                      : transaction.date;
                    
                    return (
                      <>
                        <tr 
                          key={transaction.id} 
                          className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''} ${expandedTransaction === transaction.id ? 'expanded' : ''}`}
                          onClick={() => toggleExpandTransaction(transaction.id)}
                        >
                          <td className="transaction-id">{transaction.id}</td>
                          <td className="date-cell">{formatDate(latestLogDate)}</td>
                          <td className="sender-cell">
                            {formatName(transaction.details?.thistransactionismadeby?.name)}
                          </td>
                          <td className="recipient-cell">
                            {formatName(transaction.details?.thistransactionismainlyintendedto?.name)}
                          </td>
                          <td className="amount">
                            <div className="amount-wrapper">
                              <FaMoneyBillWave className="amount-icon" />
                              <span>{formatCurrency(transaction.details?.amounts?.phpamounttorecieve)}</span>
                            </div>
                          </td>
                          <td className="payment-method">{transaction.details?.paymentmethod || 'N/A'}</td>
                          <td className="actions">
                            <div className="action-buttons">
                              <button 
                                className="view-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCreditTransaction(true);
                                  credittransactionobjectcb(transaction);
                                }}
                                aria-label="View transaction details"
                              >
                                <FaEye />
                                <span className="button-text">View</span>
                              </button>
                              <button 
                                className="edit-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(transaction.id);
                                }}
                                aria-label="Edit transaction"
                              >
                                <FaEdit />
                                <span className="button-text">Edit</span>
                              </button>
                              <button 
                                className="accept-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAccept(transaction.id);
                                }}
                                aria-label="Accept transaction"
                              >
                                <FaCheckCircle />
                                <span className="button-text">Accept</span>
                              </button>
                              <button 
                                className="reject-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(transaction.id);
                                }}
                                aria-label="Reject transaction"
                              >
                                <FaTimesCircle />
                                <span className="button-text">Reject</span>
                              </button>
                              <button 
                                className="message-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessage(transaction.id);
                                }}
                                aria-label="Message about transaction"
                              >
                                <FaEnvelope />
                                <span className="button-text">Message</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedTransaction === transaction.id && (
                          <tr className="expanded-details-row">
                            <td colSpan="7">
                              <div className="expanded-details">
                                <div className="detail-section">
                                  <h3><FaIdCard /> Transaction Details</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Reference Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.referencenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">GCash Phone Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.gcashphonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Intent Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.intent)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Deductions:</span>
                                      <span className="detail-value">
                                        {formatCurrency(
                                          (transaction.details?.amounts?.deductions?.successfulprocessing?.amount || 0) + 
                                          (transaction.details?.amounts?.deductions?.rejectionprocessing?.amount || 0)
                                        )}
                                      </span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Profit:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.profit)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Final Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.phpamounttorecieve)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Sender Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismadeby?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismadeby?.contact?.address ? 
                                          `${transaction.details.thistransactionismadeby.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Recipient Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismainlyintendedto?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismainlyintendedto?.contact?.address ? 
                                          `${transaction.details.thistransactionismainlyintendedto.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaHistory /> Transaction History</h3>
                                  <div className="status-timeline">
                                    {transaction.statusesandlogs?.logs?.map((log, index) => (
                                      <div key={index} className="status-log-item">
                                        <div className="status-log-date">{formatDate(log.date)}</div>
                                        <div className="status-log-content">
                                          <div className="status-log-type">{log.type}</div>
                                          <div className="status-log-indication">{log.indication}</div>
                                          {log.messages?.map((msgObj, msgIndex) => (
                                            <div key={msgIndex} className="status-log-message">{msgObj.message}</div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    {(!transaction.statusesandlogs?.logs || transaction.statusesandlogs.logs.length === 0) && 
                                      <div className="no-logs">No status logs available</div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SuccessfulWithdrawals = ({
  setShowDatabaseConfiguration, 
  setShowSuccessfulWithdrawals, 
  setShowCreditTransaction,
  setShowPendingDeposits,

  successfulwithdrawals,
  credittransactionobjectcb,

  onClose, 
  onView, 
  onEdit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only successful withdrawal transactions
    const successfulWithdrawalsData = successfulwithdrawals.filter(
      transaction => transaction.intent === 'withdrawal' && 
      (transaction.statusesandlogs?.status === 'completed' || transaction.status === 'successful')
    );
    setFilteredTransactions(successfulWithdrawalsData);
  }, [successfulwithdrawals]);

  useEffect(() => {
    if (searchQuery) {
      const results = successfulwithdrawals.filter(transaction => {
        // Base transaction ID search
        const idMatch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Sender information search
        const senderMatch = transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Recipient information search
        const recipientMatch = transaction.details?.thistransactionismainlyintendedto?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Payment method search
        const paymentMethodMatch = transaction.details?.paymentmethod?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Reference number search
        const referenceMatch = transaction.details?.referrence?.referencenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return idMatch || senderMatch || recipientMatch || paymentMethodMatch || referenceMatch;
      });
      
      setFilteredTransactions(results);
    } else {
      // Reset to show only successful withdrawals when search is cleared
      const successfulWithdrawalsData = successfulwithdrawals.filter(
        transaction => transaction.intent === 'withdrawal' && 
        (transaction.statusesandlogs?.status === 'completed' || transaction.status === 'successful')
      );
      setFilteredTransactions(successfulWithdrawalsData);
    }
  }, [searchQuery, successfulwithdrawals]);

  const handleAccept = (id) => {
    setAnimateRow(id);
    // Additional accept logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    // Message sending logic would go here
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionStatus = (transaction) => {
    // Check the current status from the statusesandlogs
    if (transaction.statusesandlogs && transaction.statusesandlogs.status) {
      return transaction.statusesandlogs.status;
    }
    return transaction.status || 'Completed'; // Default status if none found
  };

  const toggleExpandTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-completed';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return <FaCheckCircle className="status-icon success" />;
      case 'pending':
        return <FaClock className="status-icon pulse" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon error" />;
      case 'processing':
        return <FaMoneyBillWave className="status-icon" />;
      default:
        return <FaCheckCircle className="status-icon success" />;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₱0.00';
    return `₱${Number(amount).toFixed(2)}`;
  };

  const formatName = (nameObj) => {
    if (!nameObj) return 'N/A';
    const { firstname = '', middlename = '', lastname = '' } = nameObj;
    return `${firstname} ${middlename ? middlename + ' ' : ''}${lastname}`.trim();
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in' : ''}`}>
        <div className="modal-header">
          <h2>Successful Withdrawals</h2>
          <button className="close-button" onClick={() => {
            setShowDatabaseConfiguration(false);
            setShowSuccessfulWithdrawals(false);
          }}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone number, or reference..."
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
              <p>No successful withdrawal transactions found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const transactionStatus = getTransactionStatus(transaction);
                    const statusClass = getStatusClass(transactionStatus);
                    const statusIcon = getStatusIcon(transactionStatus);
                    
                    // Get the latest log entry date if available
                    const latestLogDate = transaction.statusesandlogs?.logs?.length > 0 
                      ? transaction.statusesandlogs.logs[transaction.statusesandlogs.logs.length - 1].date 
                      : transaction.date;
                    
                    return (
                      <>
                        <tr 
                          key={transaction.id}
                          className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''} ${expandedTransaction === transaction.id ? 'expanded' : ''}`}
                          onClick={() => toggleExpandTransaction(transaction.id)}
                        >
                          <td className="transaction-id">{transaction.id}</td>
                          <td className="date-cell">{formatDate(latestLogDate)}</td>
                          <td className="sender-cell">
                            {formatName(transaction.details?.thistransactionismadeby?.name)}
                          </td>
                          <td className="recipient-cell">
                            {formatName(transaction.details?.thistransactionismainlyintendedto?.name)}
                          </td>
                          <td className="amount">
                            <div className="amount-wrapper">
                              <FaMoneyBillWave className="amount-icon" />
                              <span>{formatCurrency(transaction.details?.amounts?.phpamounttorecieve || transaction.amount)}</span>
                            </div>
                          </td>
                          <td className="status">
                            <div className={`status-indicator ${statusClass}`}>
                              {statusIcon}
                              <span>{transactionStatus}</span>
                            </div>
                          </td>
                          <td className="payment-method">{transaction.details?.paymentmethod || transaction.paymentmethod || 'N/A'}</td>
                          <td className="actions">
                            <div className="action-buttons">
                              <button 
                                className="view-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCreditTransaction(true);
                                  credittransactionobjectcb(transaction);
                                }}
                                aria-label="View transaction details"
                              >
                                <FaEye />
                                <span className="button-text">View</span>
                              </button>
                              <button 
                                className="edit-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(transaction.id);
                                }}
                                aria-label="Edit transaction"
                              >
                                <FaEdit />
                                <span className="button-text">Edit</span>
                              </button>
                              <button 
                                className="message-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessage(transaction.id);
                                }}
                                aria-label="Message about transaction"
                              >
                                <FaEnvelope />
                                <span className="button-text">Message</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedTransaction === transaction.id && (
                          <tr className="expanded-details-row">
                            <td colSpan="8">
                              <div className="expanded-details">
                                <div className="detail-section">
                                  <h3><FaIdCard /> Transaction Details</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Reference Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.referencenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">GCash Phone Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.gcashphonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Intent Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.intent)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Deductions:</span>
                                      <span className="detail-value">
                                        {formatCurrency(
                                          (transaction.details?.amounts?.deductions?.successfulprocessing?.amount || 0) + 
                                          (transaction.details?.amounts?.deductions?.rejectionprocessing?.amount || 0)
                                        )}
                                      </span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Profit:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.profit)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Final Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.phpamounttorecieve || transaction.amount)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Sender Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismadeby?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismadeby?.contact?.address ? 
                                          `${transaction.details.thistransactionismadeby.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Recipient Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismainlyintendedto?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismainlyintendedto?.contact?.address ? 
                                          `${transaction.details.thistransactionismainlyintendedto.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaHistory /> Transaction History</h3>
                                  <div className="status-timeline">
                                    {transaction.statusesandlogs?.logs?.map((log, index) => (
                                      <div key={index} className="status-log-item">
                                        <div className="status-log-date">{formatDate(log.date)}</div>
                                        <div className="status-log-content">
                                          <div className="status-log-type">{log.type}</div>
                                          <div className="status-log-indication">{log.indication}</div>
                                          {log.messages?.map((msgObj, msgIndex) => (
                                            <div key={msgIndex} className="status-log-message">{msgObj.message}</div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    {(!transaction.statusesandlogs?.logs || transaction.statusesandlogs.logs.length === 0) && 
                                      <div className="no-logs">No status logs available</div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RejectedWithdrawals = ({
  setShowDatabaseConfiguration, 
  setShowRejectedWithdrawals, 
  setShowCreditTransaction, 
  setShowPendingDeposits,

  rejectedwithdrawals,
  credittransactionobjectcb,

  onClose, 
  onView, 
  onEdit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animateRow, setAnimateRow] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  useEffect(() => {
    // Animation effect on mount
    setIsVisible(true);
    
    // Initial filtering of only rejected withdrawal transactions
    const rejectedWithdrawalsData = rejectedwithdrawals.filter(
      transaction => transaction.intent === 'withdrawal' && 
      (transaction.statusesandlogs?.status === 'rejected' || transaction.status === 'rejected')
    );
    setFilteredTransactions(rejectedWithdrawalsData);
  }, [rejectedwithdrawals]);

  useEffect(() => {
    if (searchQuery) {
      const results = rejectedwithdrawals.filter(transaction => {
        // Base transaction ID search
        const idMatch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Sender information search
        const senderMatch = transaction.details?.thistransactionismadeby?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.details?.thistransactionismadeby?.contact?.emailaddress?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Recipient information search
        const recipientMatch = transaction.details?.thistransactionismainlyintendedto?.name?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.name?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Payment method search
        const paymentMethodMatch = transaction.details?.paymentmethod?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (transaction.paymentmethod && transaction.paymentmethod.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Reference number search
        const referenceMatch = transaction.details?.referrence?.referencenumber?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return idMatch || senderMatch || recipientMatch || paymentMethodMatch || referenceMatch;
      });
      
      setFilteredTransactions(results);
    } else {
      // Reset to show only rejected withdrawals when search is cleared
      const rejectedWithdrawalsData = rejectedwithdrawals.filter(
        transaction => transaction.intent === 'withdrawal' && 
        (transaction.statusesandlogs?.status === 'rejected' || transaction.status === 'rejected')
      );
      setFilteredTransactions(rejectedWithdrawalsData);
    }
  }, [searchQuery, rejectedwithdrawals]);

  const handleAccept = (id) => {
    setAnimateRow(id);
    // Additional accept logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleReject = (id) => {
    setAnimateRow(id);
    // Additional reject logic would go here
    setTimeout(() => {
      setAnimateRow(null);
      // Here you'd update the transaction status
    }, 800);
  };

  const handleMessage = (id) => {
    // Message sending logic would go here
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionStatus = (transaction) => {
    // Check the current status from the statusesandlogs
    if (transaction.statusesandlogs && transaction.statusesandlogs.status) {
      return transaction.statusesandlogs.status;
    }
    return transaction.status || 'Rejected'; // Default status if none found
  };

  const toggleExpandTransaction = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-rejected';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'successful':
        return <FaCheckCircle className="status-icon success" />;
      case 'pending':
        return <FaClock className="status-icon pulse" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon error" />;
      case 'processing':
        return <FaMoneyBillWave className="status-icon" />;
      default:
        return <FaTimesCircle className="status-icon error" />;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₱0.00';
    return `₱${Number(amount).toFixed(2)}`;
  };

  const formatName = (nameObj) => {
    if (!nameObj) return 'N/A';
    const { firstname = '', middlename = '', lastname = '' } = nameObj;
    return `${firstname} ${middlename ? middlename + ' ' : ''}${lastname}`.trim();
  };

  const getRejectionReason = (transaction) => {
    // Try to find rejection reason in logs
    if (transaction.statusesandlogs?.logs) {
      const rejectionLog = transaction.statusesandlogs.logs.find(log => 
        log.type === 'Rejection' || log.type === 'rejection' ||
        log.indication?.toLowerCase().includes('reject')
      );
      
      if (rejectionLog && rejectionLog.messages && rejectionLog.messages.length > 0) {
        return rejectionLog.messages[0].message;
      }
    }
    
    // If no specific rejection reason found
    return "Transaction was rejected";
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'visible' : ''}`}>
      <div className={`pending-deposits-modal ${isVisible ? 'slide-in' : ''}`}>
        <div className="modal-header">
          <h2>Rejected Withdrawals</h2>
          <button className="close-button" onClick={() => {
            setShowDatabaseConfiguration(false);
            setShowRejectedWithdrawals(false);
          }}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone number, or reference..."
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
              <p>No rejected withdrawal transactions found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const transactionStatus = getTransactionStatus(transaction);
                    const statusClass = getStatusClass(transactionStatus);
                    const statusIcon = getStatusIcon(transactionStatus);
                    
                    // Get the latest log entry date if available
                    const latestLogDate = transaction.statusesandlogs?.logs?.length > 0 
                      ? transaction.statusesandlogs.logs[transaction.statusesandlogs.logs.length - 1].date 
                      : transaction.date;
                    
                    return (
                      <>
                        <tr 
                          key={transaction.id}
                          className={`transaction-row ${animateRow === transaction.id ? 'row-animate' : ''} ${expandedTransaction === transaction.id ? 'expanded' : ''}`}
                          onClick={() => toggleExpandTransaction(transaction.id)}
                        >
                          <td className="transaction-id">{transaction.id}</td>
                          <td className="date-cell">{formatDate(latestLogDate)}</td>
                          <td className="sender-cell">
                            {formatName(transaction.details?.thistransactionismadeby?.name)}
                          </td>
                          <td className="recipient-cell">
                            {formatName(transaction.details?.thistransactionismainlyintendedto?.name)}
                          </td>
                          <td className="amount">
                            <div className="amount-wrapper">
                              <FaMoneyBillWave className="amount-icon" />
                              <span>{formatCurrency(transaction.details?.amounts?.phpamounttorecieve || transaction.amount)}</span>
                            </div>
                          </td>
                          <td className="status">
                            <div className={`status-indicator ${statusClass}`}>
                              {statusIcon}
                              <span>{transactionStatus}</span>
                            </div>
                          </td>
                          <td className="payment-method">{transaction.details?.paymentmethod || transaction.paymentmethod || 'N/A'}</td>
                          <td className="actions">
                            <div className="action-buttons">
                              <button 
                                className="view-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCreditTransaction(true);
                                  credittransactionobjectcb(transaction);
                                }}
                                aria-label="View transaction details"
                              >
                                <FaEye />
                                <span className="button-text">View</span>
                              </button>
                              <button 
                                className="edit-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(transaction.id);
                                }}
                                aria-label="Edit transaction"
                              >
                                <FaEdit />
                                <span className="button-text">Edit</span>
                              </button>
                              <button 
                                className="accept-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAccept(transaction.id);
                                }}
                                aria-label="Reprocess transaction"
                              >
                                <FaRecycle />
                                <span className="button-text">Reprocess</span>
                              </button>
                              <button 
                                className="message-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessage(transaction.id);
                                }}
                                aria-label="Message about transaction"
                              >
                                <FaEnvelope />
                                <span className="button-text">Message</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedTransaction === transaction.id && (
                          <tr className="expanded-details-row">
                            <td colSpan="8">
                              <div className="expanded-details">
                                <div className="detail-section">
                                  <h3><FaIdCard /> Transaction Details</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Reference Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.referencenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">GCash Phone Number:</span>
                                      <span className="detail-value">{transaction.details?.referrence?.gcashphonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Intent Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.intent)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Deductions:</span>
                                      <span className="detail-value">
                                        {formatCurrency(
                                          (transaction.details?.amounts?.deductions?.successfulprocessing?.amount || 0) + 
                                          (transaction.details?.amounts?.deductions?.rejectionprocessing?.amount || 0)
                                        )}
                                      </span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Rejection Reason:</span>
                                      <span className="detail-value rejection-reason">{getRejectionReason(transaction)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Final Amount:</span>
                                      <span className="detail-value">{formatCurrency(transaction.details?.amounts?.phpamounttorecieve || transaction.amount)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Sender Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismadeby?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismadeby?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismadeby?.contact?.address ? 
                                          `${transaction.details.thistransactionismadeby.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismadeby.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaUser /> Recipient Information</h3>
                                  <div className="detail-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Name:</span>
                                      <span className="detail-value">{formatName(transaction.details?.thistransactionismainlyintendedto?.name)}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Phone:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.phonenumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Email:</span>
                                      <span className="detail-value">{transaction.details?.thistransactionismainlyintendedto?.contact?.emailaddress || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Address:</span>
                                      <span className="detail-value">
                                        {transaction.details?.thistransactionismainlyintendedto?.contact?.address ? 
                                          `${transaction.details.thistransactionismainlyintendedto.contact.address.street || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.baranggay || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.city || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.province || ''}, 
                                           ${transaction.details.thistransactionismainlyintendedto.contact.address.postal_zip_code || ''}` 
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="detail-section">
                                  <h3><FaHistory /> Transaction History</h3>
                                  <div className="status-timeline">
                                    {transaction.statusesandlogs?.logs?.map((log, index) => (
                                      <div key={index} className="status-log-item">
                                        <div className="status-log-date">{formatDate(log.date)}</div>
                                        <div className="status-log-content">
                                          <div className="status-log-type">{log.type}</div>
                                          <div className="status-log-indication">{log.indication}</div>
                                          {log.messages?.map((msgObj, msgIndex) => (
                                            <div key={msgIndex} className="status-log-message">{msgObj.message}</div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    {(!transaction.statusesandlogs?.logs || transaction.statusesandlogs.logs.length === 0) && 
                                      <div className="no-logs">No status logs available</div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const CreditTransactionModal = ({ credittransactionobject, setShowCreditTransaction }) => {
  // Destructure the transaction data for easier access
  const {
    _id, // Using _id as id per request
    intent,
    statusesandlogs,
    details
  } = credittransactionobject || {};

  // Get current status from statusesandlogs
  const currentStatus = statusesandlogs?.status || 'Pending';
  
  // Get transaction type from intent
  const type = intent || 'Transaction';
  
  // Get relevant transaction data
  const paymentmethod = details?.paymentmethod || 'N/A';
  const amount = details?.amounts?.intent || 0;
  const date = statusesandlogs?.logs?.[0]?.date || new Date().toISOString();
  
  // Determine transaction type
  const isCurrencyExchange = type?.toLowerCase().includes('exchange');
  const isWithdrawal = type?.toLowerCase().includes('withdrawal');
  const isDeposit = type?.toLowerCase().includes('deposit');
  
  // Get transaction image from the correct path in the schema
  // Currency exchange has gcashtransactionrecieptimage while withdrawal does not
  const transactionImage = details?.referrence?.gcashtransactionrecieptimage;
  
  // State to control image modal visibility
  const [showImageModal, setShowImageModal] = useState(false);

  // Format date for better readability
  const formattedDate = new Date(date).toLocaleString();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP' // Using PHP as the currency based on field names
    }).format(value || 0);
  };

  // Handle image click to open the image modal
  const handleImageClick = (e) => {
    e.stopPropagation(); // Stop event from bubbling up
    setShowImageModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Handle closing the image modal
  const handleCloseImageModal = (e) => {
    if (e) e.stopPropagation();
    setShowImageModal(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Handle modal container click (to prevent closing when clicking inside the content)
  const handleModalContainerClick = (e) => {
    e.stopPropagation(); // Prevent event from reaching the overlay
  };

  // Get reference numbers based on transaction type
  // Withdrawal uses referencenumber, currency exchange uses number
  const referenceNumber = isCurrencyExchange 
    ? details?.referrence?.number 
    : details?.referrence?.referencenumber;
    
  // Get GCash phone number for withdrawal
  const gcashPhoneNumber = details?.referrence?.gcashphonenumber;

  // Get sender and recipient info
  const sender = details?.thistransactionismadeby || {};
  const recipient = details?.thistransactionismainlyintendedto || {};

  // Function to format name
  const formatName = (nameObj) => {
    if (!nameObj) return 'N/A';
    const { firstname, middlename, lastname, nickname } = nameObj;
    let fullName = [firstname, middlename, lastname].filter(Boolean).join(' ');
    return fullName || nickname || 'N/A';
  };

  // Function to format address
  const formatAddress = (addressObj) => {
    if (!addressObj) return [];
    
    const addressLines = [];
    
    if (addressObj.trademark) {
      addressLines.push(addressObj.trademark);
    }
    
    const streetBarangay = [
      addressObj.street,
      addressObj.baranggay
    ].filter(Boolean).join(', ');
    
    if (streetBarangay) {
      addressLines.push(streetBarangay);
    }
    
    const cityProvZip = [
      addressObj.city,
      addressObj.province,
      addressObj.postal_zip_code || addressObj.zipcode
    ].filter(Boolean).join(', ');
    
    if (cityProvZip) {
      addressLines.push(cityProvZip);
    }
    
    if (addressObj.country) {
      addressLines.push(addressObj.country);
    }
    
    return addressLines;
  };

  // Create portal for the image modal to render at the document body level
  const imageModal = showImageModal && transactionImage && (
    <div 
      className="transaction-image-modal-overlay" 
      onClick={handleCloseImageModal}
    >
      <div 
        className="transaction-image-modal-container"
        onClick={handleModalContainerClick}
      >
        <button 
          className="transaction-image-modal-close-button" 
          onClick={handleCloseImageModal}
          aria-label="Close"
        >×</button>
        <div className="transaction-image-modal-content">
          <img 
            src={transactionImage} 
            alt="Transaction Receipt" 
            className="transaction-image-modal-full"
          />
        </div>
      </div>
    </div>
  );

  // Get appropriate transaction title based on type
  const getTransactionTitle = () => {
    if (isCurrencyExchange) return "Currency Exchange Transaction Details";
    if (isWithdrawal) return "Withdrawal Transaction Details";
    if (isDeposit) return "Deposit Transaction Details";
    return "Transaction Details";
  };

  return (
    <>
      <div className="credit-transaction-modal-overlay">
        <div className="credit-transaction-modal-container">
          <div className="credit-transaction-modal-header">
            <h2>{getTransactionTitle()}</h2>
            <button 
              className="credit-transaction-modal-close-button" 
              onClick={() => setShowCreditTransaction(false)}
              aria-label="Close"
            >×</button>
          </div>
          
          <div className="credit-transaction-modal-content">
            <div className="credit-transaction-modal-main-info">
              <div className="credit-transaction-modal-info-item">
                <span className="credit-transaction-modal-label">Transaction ID:</span>
                <span className="credit-transaction-modal-value">{_id}</span>
              </div>
              
              <div className="credit-transaction-modal-info-item">
                <span className="credit-transaction-modal-label">Date:</span>
                <span className="credit-transaction-modal-value">{formattedDate}</span>
              </div>
              
              <div className="credit-transaction-modal-info-item">
                <span className="credit-transaction-modal-label">Type:</span>
                <span className={`credit-transaction-modal-value credit-transaction-modal-type credit-transaction-modal-type-${type?.toLowerCase()}`}>
                  {type}
                </span>
              </div>
              
              <div className="credit-transaction-modal-info-item">
                <span className="credit-transaction-modal-label">Amount:</span>
                <span className={`credit-transaction-modal-value credit-transaction-modal-amount credit-transaction-modal-amount-${type?.toLowerCase()}`}>
                  {formatCurrency(amount)}
                </span>
              </div>
              
              <div className="credit-transaction-modal-info-item">
                <span className="credit-transaction-modal-label">Status:</span>
                <span className={`credit-transaction-modal-value credit-transaction-modal-status credit-transaction-modal-status-${currentStatus?.toLowerCase()}`}>
                  {currentStatus}
                </span>
              </div>
              
              <div className="credit-transaction-modal-info-item">
                <span className="credit-transaction-modal-label">Payment Method:</span>
                <span className="credit-transaction-modal-value">{paymentmethod}</span>
              </div>
              
              {referenceNumber && (
                <div className="credit-transaction-modal-info-item">
                  <span className="credit-transaction-modal-label">Reference Number:</span>
                  <span className="credit-transaction-modal-value">{referenceNumber}</span>
                </div>
              )}
              
              {gcashPhoneNumber && (
                <div className="credit-transaction-modal-info-item">
                  <span className="credit-transaction-modal-label">GCash Phone Number:</span>
                  <span className="credit-transaction-modal-value">{gcashPhoneNumber}</span>
                </div>
              )}
            </div>
            
            {/* Transaction Image Thumbnail - Only for currency exchange */}
            {transactionImage && (
              <div className="credit-transaction-modal-section">
                <h3>Transaction Receipt</h3>
                <div className="credit-transaction-modal-image-container">
                  <img 
                    src={transactionImage} 
                    alt="Transaction Receipt" 
                    className="credit-transaction-modal-thumbnail"
                    onClick={handleImageClick}
                  />
                  <div className="credit-transaction-modal-image-caption">
                    Click to view full image
                  </div>
                </div>
              </div>
            )}
            
            {details && (
              <>
                {/* Currency Exchange Details */}
                {isCurrencyExchange && (
                  <div className="credit-transaction-modal-section">
                    <h3>Currency Exchange Details</h3>
                    <div className="credit-transaction-modal-details-grid">
                      <div className="credit-transaction-modal-details-item">
                        <span className="credit-transaction-modal-label">Exchange Amount:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-highlight-amount">
                          {formatCurrency(details.amounts?.phppurchaseorexchangeamount || amount)}
                        </span>
                      </div>
                      
                      {details.amounts?.deductions?.successfulprocessing?.amount > 0 && (
                        <div className="credit-transaction-modal-details-item">
                          <span className="credit-transaction-modal-label">Processing Fee:</span>
                          <span className="credit-transaction-modal-value">
                            {formatCurrency(details.amounts.deductions.successfulprocessing.amount)}
                          </span>
                        </div>
                      )}
                      
                      {details.amounts?.profit > 0 && (
                        <div className="credit-transaction-modal-details-item">
                          <span className="credit-transaction-modal-label">Exchange Fee:</span>
                          <span className="credit-transaction-modal-value">
                            {formatCurrency(details.amounts.profit)}
                          </span>
                        </div>
                      )}
                      
                      <div className="credit-transaction-modal-details-item credit-transaction-modal-total">
                        <span className="credit-transaction-modal-label">Total Amount to Receive:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-highlight-total">
                          {formatCurrency(details.amounts?.omsiapawasamounttorecieve || amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Deposit Details */}
                {isDeposit && (
                  <div className="credit-transaction-modal-section">
                    <h3>Deposit Details</h3>
                    <div className="credit-transaction-modal-details-grid">
                      <div className="credit-transaction-modal-details-item">
                        <span className="credit-transaction-modal-label">Deposit Amount:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-highlight-amount">
                          {formatCurrency(details.amounts?.phppurchaseorexchangeamount || amount)}
                        </span>
                      </div>
                      
                      {details.amounts?.deductions?.successfulprocessing?.amount > 0 && (
                        <div className="credit-transaction-modal-details-item">
                          <span className="credit-transaction-modal-label">Processing Fee:</span>
                          <span className="credit-transaction-modal-value">
                            {formatCurrency(details.amounts.deductions.successfulprocessing.amount)}
                          </span>
                        </div>
                      )}
                      
                      <div className="credit-transaction-modal-details-item credit-transaction-modal-total">
                        <span className="credit-transaction-modal-label">Total Added to Balance:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-highlight-total">
                          {formatCurrency(details.amounts?.omsiapawasamounttorecieve || amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Withdrawal Details */}
                {isWithdrawal && (
                  <div className="credit-transaction-modal-section">
                    <h3>Withdrawal Details</h3>
                    <div className="credit-transaction-modal-details-grid">
                      <div className="credit-transaction-modal-details-item">
                        <span className="credit-transaction-modal-label">Withdrawal Amount:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-highlight-amount">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      
                      {details.amounts?.deductions?.successfulprocessing?.amount > 0 && (
                        <div className="credit-transaction-modal-details-item">
                          <span className="credit-transaction-modal-label">Processing Fee:</span>
                          <span className="credit-transaction-modal-value">
                            {formatCurrency(details.amounts.deductions.successfulprocessing.amount)}
                          </span>
                        </div>
                      )}
                      
                      {details.amounts?.profit > 0 && (
                        <div className="credit-transaction-modal-details-item">
                          <span className="credit-transaction-modal-label">Service Fee:</span>
                          <span className="credit-transaction-modal-value">
                            {formatCurrency(details.amounts.profit)}
                          </span>
                        </div>
                      )}
                      
                      <div className="credit-transaction-modal-details-item credit-transaction-modal-total">
                        <span className="credit-transaction-modal-label">Total Amount to Receive:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-highlight-total">
                          {formatCurrency(details.amounts?.phpamounttorecieve || amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Display rejection details if applicable */}
                {details.amounts?.deductions?.rejectionprocessing?.amount > 0 && (
                  <div className="credit-transaction-modal-section">
                    <h3>Rejection Details</h3>
                    <div className="credit-transaction-modal-details-grid">
                      <div className="credit-transaction-modal-details-item">
                        <span className="credit-transaction-modal-label">Rejection Fee:</span>
                        <span className="credit-transaction-modal-value credit-transaction-modal-rejection-fee">
                          {formatCurrency(details.amounts.deductions.rejectionprocessing.amount)}
                        </span>
                      </div>
                      
                      {details.amounts?.deductions?.rejectionprocessing?.reasons && (
                        <div className="credit-transaction-modal-details-item credit-transaction-modal-full-width">
                          <span className="credit-transaction-modal-label">Rejection Reason:</span>
                          <span className="credit-transaction-modal-value">
                            {details.amounts.deductions.rejectionprocessing.reasons}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Display sender information if available */}
                {sender?.contact?.address && (
                  <div className="credit-transaction-modal-section">
                    <h3>Sender Information</h3>
                    <div className="credit-transaction-modal-address-info">
                      {formatName(sender.name) !== 'N/A' && <p><strong>{formatName(sender.name)}</strong></p>}
                      {formatAddress(sender.contact.address).map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                      {sender.contact.phonenumber && <p>Phone: {sender.contact.phonenumber}</p>}
                      {sender.contact.emailaddress && <p>Email: {sender.contact.emailaddress}</p>}
                    </div>
                  </div>
                )}
                
                {/* Display recipient information if available */}
                {recipient?.contact?.address && (
                  <div className="credit-transaction-modal-section">
                    <h3>Recipient Information</h3>
                    <div className="credit-transaction-modal-address-info">
                      {formatName(recipient.name) !== 'N/A' && <p><strong>{formatName(recipient.name)}</strong></p>}
                      {formatAddress(recipient.contact.address).map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                      {recipient.contact.phonenumber && <p>Phone: {recipient.contact.phonenumber}</p>}
                      {recipient.contact.emailaddress && <p>Email: {recipient.contact.emailaddress}</p>}
                    </div>
                  </div>
                )}
                
                {/* Transaction Status Log */}
                {statusesandlogs?.logs?.length > 0 && (
                  <div className="credit-transaction-modal-section">
                    <h3>Transaction History</h3>
                    <div className="credit-transaction-modal-status-timeline">
                      {statusesandlogs.logs.map((log, index) => (
                        <div key={index} className="credit-transaction-modal-status-item">
                          <div className="credit-transaction-modal-status-date">
                            {new Date(log.date).toLocaleString()}
                          </div>
                          <div className={`credit-transaction-modal-status-badge credit-transaction-modal-status-${log.indication?.toLowerCase() || 'neutral'}`}>
                            {log.type}
                          </div>
                          {log.messages && log.messages.length > 0 && (
                            <div className="credit-transaction-modal-status-messages">
                              {log.messages.map((msgItem, msgIndex) => (
                                <p key={msgIndex} className="credit-transaction-modal-status-message">
                                  {msgItem.message}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Render image modal OUTSIDE the main modal container */}
      {imageModal}
    </>
  );
};






const MfatipRegisteredRegistrantsWithVerifiedDocuments = ({ 

  setShowDatabaseConfiguration, 
  setShowRegisteredRegistrantsWithVerifiedDocuments, 
  setShowRegistrantDetailsDisplay, 

  verifiedmfatipregistrants, 
  setregistrantdata,

  onClose, 
  onView, 
  onEdit, 
  onDelete,
  onVerify, 
  onReject 

}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegistrants, setFilteredRegistrants] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Animation effect on mount with slight delay for better visual effect
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    // Initial filtering of only registrants with pending documents
    const pendingDocumentsRegistrants = verifiedmfatipregistrants.filter(
      registrant => registrant.status && registrant.status.indication === 'Documents verified'
    );
    setFilteredRegistrants(pendingDocumentsRegistrants);
    
    // Check for duplicate information
    const duplicates = findDuplicates(verifiedmfatipregistrants);
    setDuplicateWarnings(duplicates);
    
    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [verifiedmfatipregistrants]);

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
      const fullName = `${registrant.name.firstname} ${registrant.name.middlename || ''} ${registrant.name.lastname}`.toLowerCase().trim();
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
      const results = verifiedmfatipregistrants.filter(registrant => 
        // Filter by pending documents status first
        registrant.status && 
        registrant.status.indication === 'Documents verified' &&
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
      const pendingDocumentsRegistrants = verifiedmfatipregistrants.filter(
        registrant => registrant.status && registrant.status.indication === 'Documents verified'
      );
      setFilteredRegistrants(pendingDocumentsRegistrants);
    }
  }, [searchQuery, verifiedmfatipregistrants]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow for animation
    setTimeout(() => {
      setShowDatabaseConfiguration(false);
      setShowRegisteredRegistrantsWithVerifiedDocuments(false);
    }, 300);
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
            MFATIP Registrants with Verified Documents
          </h2>
          <button className="close-button" onClick={handleClose} aria-label="Close">
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
              aria-label="Search registrants"
            />
            {searchQuery && (
              <button 
                className="clear-search-button" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="results-count">
            <span className="count-number">{filteredRegistrants.length}</span> registrant{filteredRegistrants.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        <div className="registrants-container">
          {filteredRegistrants.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No registrants with pending documents found</p>
              {searchQuery && (
                <button className="reset-search-button" onClick={() => setSearchQuery('')}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
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
                  {filteredRegistrants.map((registrant, index) => (
                    <tr 
                      key={registrant.id} 
                      className={`registrant-row ${duplicateWarnings[registrant.id] ? 'has-duplicates' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="registrant-id">
                        <div className="id-container">
                          <FaIdCard className="id-icon" />
                          <span>{registrant.id}</span>
                        </div>
                      </td>
                      <td className="name-cell">
                        <div className="name-flex-container">
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
                        </div>
                      </td>
                      <td className="contact-cell">
                        <div className="contact-details">
                          <div className="phone-number">
                            <FaPhone className="contact-icon" />
                            <span>{registrant.contact.phonenumber || 'N/A'}</span>
                            {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('phone') && (
                              <FaExclamationTriangle className="warning-icon-small" title="Duplicate phone number found" />
                            )}
                          </div>
                          <div className="email-address">
                            <FaEnvelope className="contact-icon" />
                            <span>{registrant.contact.emailaddress || 'N/A'}</span>
                            {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('email') && (
                              <FaExclamationTriangle className="warning-icon-small" title="Duplicate email found" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-flex-container">
                          <FaCalendarAlt className="date-icon" />
                          <span>{formatDate(getRegistrationDate(registrant))}</span>
                        </div>
                      </td>
                      <td className="status-cell">
                        <div className="status-indicator pending">
                          <FaExclamationCircle className="status-icon pulse" />
                          <span>{registrant.status.indication}</span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="view-button" 
                            onClick={() => {
                              setShowRegistrantDetailsDisplay(true)
                              setregistrantdata(registrant)
                            }}
                            aria-label="View registrant details"
                          >
                            <FaEye className="action-icon" />
                            <span className="action-text">View</span>
                          </button>
                          <button 
                            className="verify-button" 
                            onClick={() => onVerify(registrant.id)}
                            aria-label="Verify registrant documents"
                          >
                            <FaCheckCircle className="action-icon" />
                            <span className="action-text">Verify</span>
                          </button>
                          <button 
                            className="reject-button" 
                            onClick={() => onReject(registrant.id)}
                            aria-label="Reject registrant documents"
                          >
                            <FaTimesCircle className="action-icon" />
                            <span className="action-text">Reject</span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MfatipRegisteredRegistrantsWithPendingDocuments = ({ 

  setShowDatabaseConfiguration, 
  setShowRegisteredRegistrantsWithPendingDocuments, 
  setShowRegistrantDetailsDisplay, 

  pendingmfatipregistrants, 
  setregistrantdata,

  onClose, 
  onView, 
  onEdit,
  onDelete, 
  onVerify, 
  onReject
  
  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegistrants, setFilteredRegistrants] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Animation effect on mount with slight delay for better visual effect
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    // Initial filtering of only registrants with pending documents
    const pendingDocumentsRegistrants = pendingmfatipregistrants.filter(
      registrant => registrant.status && registrant.status.indication === 'pending documents'
    );
    setFilteredRegistrants(pendingDocumentsRegistrants);
    
    // Check for duplicate information
    const duplicates = findDuplicates(pendingmfatipregistrants);
    setDuplicateWarnings(duplicates);
    
    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pendingmfatipregistrants]);

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
      const fullName = `${registrant.name.firstname} ${registrant.name.middlename || ''} ${registrant.name.lastname}`.toLowerCase().trim();
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
      const results = pendingmfatipregistrants.filter(registrant => 
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
      const pendingDocumentsRegistrants = pendingmfatipregistrants.filter(
        registrant => registrant.status && registrant.status.indication === 'pending documents'
      );
      setFilteredRegistrants(pendingDocumentsRegistrants);
    }
  }, [searchQuery, pendingmfatipregistrants]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow for animation
    setTimeout(() => {
      setShowDatabaseConfiguration(false);
      setShowRegisteredRegistrantsWithPendingDocuments(false);
    }, 300);
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
          <button className="close-button" onClick={handleClose} aria-label="Close">
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
              aria-label="Search registrants"
            />
            {searchQuery && (
              <button 
                className="clear-search-button" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="results-count">
            <span className="count-number">{filteredRegistrants.length}</span> registrant{filteredRegistrants.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        <div className="registrants-container">
          {filteredRegistrants.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No registrants with pending documents found</p>
              {searchQuery && (
                <button className="reset-search-button" onClick={() => setSearchQuery('')}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
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
                  {filteredRegistrants.map((registrant, index) => (
                    <tr 
                      key={registrant.id} 
                      className={`registrant-row ${duplicateWarnings[registrant.id] ? 'has-duplicates' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="registrant-id">
                        <div className="id-container">
                          <FaIdCard className="id-icon" />
                          <span>{registrant.id}</span>
                        </div>
                      </td>
                      <td className="name-cell">
                        <div className="name-flex-container">
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
                        </div>
                      </td>
                      <td className="contact-cell">
                        <div className="contact-details">
                          <div className="phone-number">
                            <FaPhone className="contact-icon" />
                            <span>{registrant.contact.phonenumber || 'N/A'}</span>
                            {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('phone') && (
                              <FaExclamationTriangle className="warning-icon-small" title="Duplicate phone number found" />
                            )}
                          </div>
                          <div className="email-address">
                            <FaEnvelope className="contact-icon" />
                            <span>{registrant.contact.emailaddress || 'N/A'}</span>
                            {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('email') && (
                              <FaExclamationTriangle className="warning-icon-small" title="Duplicate email found" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-flex-container">
                          <FaCalendarAlt className="date-icon" />
                          <span>{formatDate(getRegistrationDate(registrant))}</span>
                        </div>
                      </td>
                      <td className="status-cell">
                        <div className="status-indicator pending">
                          <FaExclamationCircle className="status-icon pulse" />
                          <span>{registrant.status.indication}</span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="view-button" 
                            onClick={() => {
                              setShowRegistrantDetailsDisplay(true)
                              setregistrantdata(registrant)
                            }}
                            aria-label="View registrant details"
                          >
                            <FaEye className="action-icon" />
                            <span className="action-text">View</span>
                          </button>
                          <button 
                            className="verify-button" 
                            onClick={() => onVerify(registrant.id)}
                            aria-label="Verify registrant documents"
                          >
                            <FaCheckCircle className="action-icon" />
                            <span className="action-text">Verify</span>
                          </button>
                          <button 
                            className="reject-button" 
                            onClick={() => onReject(registrant.id)}
                            aria-label="Reject registrant documents"
                          >
                            <FaTimesCircle className="action-icon" />
                            <span className="action-text">Reject</span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MfatipRegisteredRegistrantsWithRejectedDocuments = ({ 

  setShowDatabaseConfiguration, 
  setShowRegisteredRegistrantsWithRejectedDocuments, 
  setShowRegistrantDetailsDisplay,

  mfatipregistrantsrejecteddocuments, 
  setregistrantdata,

  onClose, 
  onView, 
  onEdit, 
  onDelete, 
  onVerify, 
  onReject

  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRegistrants, setFilteredRegistrants] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Animation effect on mount with slight delay for better visual effect
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    // Initial filtering of only registrants with pending documents
    const pendingDocumentsRegistrants = mfatipregistrantsrejecteddocuments.filter(
      registrant => registrant.status && registrant.status.indication === 'rejected documents'
    );
    setFilteredRegistrants(pendingDocumentsRegistrants);
    
    // Check for duplicate information
    const duplicates = findDuplicates(mfatipregistrantsrejecteddocuments);
    setDuplicateWarnings(duplicates);
    
    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mfatipregistrantsrejecteddocuments]);

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
      const fullName = `${registrant.name.firstname} ${registrant.name.middlename || ''} ${registrant.name.lastname}`.toLowerCase().trim();
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
      const results = mfatipregistrantsrejecteddocuments.filter(registrant => 
        // Filter by pending documents status first
        registrant.status && 
        registrant.status.indication === 'rejected documents' &&
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
      const pendingDocumentsRegistrants = mfatipregistrantsrejecteddocuments.filter(
        registrant => registrant.status && registrant.status.indication === 'rejected documents'
      );
      setFilteredRegistrants(pendingDocumentsRegistrants);
    }
  }, [searchQuery, mfatipregistrantsrejecteddocuments]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow for animation
    setTimeout(() => {
      setShowDatabaseConfiguration(false);
      setShowRegisteredRegistrantsWithRejectedDocuments(false);
    }, 300);
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
            MFATIP Registrants with Rejected Documents
          </h2>
          <button className="close-button" onClick={handleClose} aria-label="Close">
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
              aria-label="Search registrants"
            />
            {searchQuery && (
              <button 
                className="clear-search-button" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="results-count">
            <span className="count-number">{filteredRegistrants.length}</span> registrant{filteredRegistrants.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        <div className="registrants-container">
          {filteredRegistrants.length === 0 ? (
            <div className="no-results">
              <FaExclamationCircle className="no-results-icon" />
              <p>No registrants with pending documents found</p>
              {searchQuery && (
                <button className="reset-search-button" onClick={() => setSearchQuery('')}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
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
                  {filteredRegistrants.map((registrant, index) => (
                    <tr 
                      key={registrant.id} 
                      className={`registrant-row ${duplicateWarnings[registrant.id] ? 'has-duplicates' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="registrant-id">
                        <div className="id-container">
                          <FaIdCard className="id-icon" />
                          <span>{registrant.id}</span>
                        </div>
                      </td>
                      <td className="name-cell">
                        <div className="name-flex-container">
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
                        </div>
                      </td>
                      <td className="contact-cell">
                        <div className="contact-details">
                          <div className="phone-number">
                            <FaPhone className="contact-icon" />
                            <span>{registrant.contact.phonenumber || 'N/A'}</span>
                            {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('phone') && (
                              <FaExclamationTriangle className="warning-icon-small" title="Duplicate phone number found" />
                            )}
                          </div>
                          <div className="email-address">
                            <FaEnvelope className="contact-icon" />
                            <span>{registrant.contact.emailaddress || 'N/A'}</span>
                            {duplicateWarnings[registrant.id] && duplicateWarnings[registrant.id].includes('email') && (
                              <FaExclamationTriangle className="warning-icon-small" title="Duplicate email found" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-flex-container">
                          <FaCalendarAlt className="date-icon" />
                          <span>{formatDate(getRegistrationDate(registrant))}</span>
                        </div>
                      </td>
                      <td className="status-cell">
                        <div className="status-indicator pending">
                          <FaExclamationCircle className="status-icon pulse" />
                          <span>{registrant.status.indication}</span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="view-button" 
                            onClick={() => {
                              setShowRegistrantDetailsDisplay(true)
                              setregistrantdata(registrant)
                            }}
                            aria-label="View registrant details"
                          >
                            <FaEye className="action-icon" />
                            <span className="action-text">View</span>
                          </button>
                          <button 
                            className="verify-button" 
                            onClick={() => onVerify(registrant.id)}
                            aria-label="Verify registrant documents"
                          >
                            <FaCheckCircle className="action-icon" />
                            <span className="action-text">Verify</span>
                          </button>
                          <button 
                            className="reject-button" 
                            onClick={() => onReject(registrant.id)}
                            aria-label="Reject registrant documents"
                          >
                            <FaTimesCircle className="action-icon" />
                            <span className="action-text">Reject</span>
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
            </div>
          )}
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






const CreateProduct = ({ setShowDatabaseConfiguration, setShowCreateProduct }) => {
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [features, setFeatures] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    weightingrams: '',
    description: '',
    warranty: '',
    videoUrl: '',
    capital: '',
    transactiongiveaway: '',
    omsiapprofit: ''
  });

  const [createproductloadingindication, createproductloadingindicationcb] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Add specification
  const addSpecification = (e) => {
    e.preventDefault();
    const specField = document.getElementById('specification-input');
    if (specField.value.trim()) {
      setSpecifications([...specifications, specField.value]);
      specField.value = '';
    }
  };

  // Remove specification
  const removeSpecification = (index) => {
    const updatedSpecs = [...specifications];
    updatedSpecs.splice(index, 1);
    setSpecifications(updatedSpecs);
  };

  // Add feature
  const addFeature = (e) => {
    e.preventDefault();
    const featureField = document.getElementById('feature-input');
    if (featureField.value.trim()) {
      setFeatures([...features, featureField.value]);
      featureField.value = '';
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    
    const responseMessage = document.querySelectorAll(".createproduct-responsemessage")[0];
    responseMessage.style.color = "white";
    responseMessage.innerText = "";
    responseMessage.style.display = "none";
    
    createproductloadingindicationcb(true);
    
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Add images - for multer
    images.forEach((image) => {
      formData.append('images', image.file);
    });
    
    // Add specifications and features as simple string arrays
    formData.append('specifications', JSON.stringify(specifications));
    formData.append('features', JSON.stringify(features));
    
    try {
      // Send the data to the backend
      const response = await axiosCreatedInstance.post("/products/addproduct", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Important for multer
        }
      });
      
      // Process the response
      const { message, productId } = response.data;
      
      // Update response message state
      if (message === "Product added successfully") {
        responseMessage.style.color = "green";
        responseMessage.innerText = `Product added successfully! Product ID: ${productId}`;
      } else {
        responseMessage.style.color = "red";
        responseMessage.innerText = message || "Unknown error occurred";
      }
      
      responseMessage.style.display = "block";
      createproductloadingindicationcb(false);
      
      // Return false to prevent any potential form submission
      return false;
    } catch (error) {
      // Handle network or other errors
      createproductloadingindicationcb(false);
      
      let errorText = "An unexpected error occurred";
      
      if (error.response) {
        // The server responded with an error status
        errorText = `Error: ${error.response.data.message || "Server error"}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorText = "Network error: Please check your connection and try again";
      } else {
        // Something else happened
        errorText = `Error: ${error.message}`;
      }
      
      responseMessage.style.color = "red";
      responseMessage.innerText = errorText;
      responseMessage.style.display = "block";
      
      // Return false to prevent any potential form submission
      return false;
    }
  };
  
  // Helper function to reset the form
  const resetForm = () => {
    // Reset all form fields
    setProductData({
      name: "",
      price: 0,
      category: "",
      description: "",
      weightingrams: 0,
      stock: 0,
      videoUrl: "",
      warranty: "",
      quantity: 0,
      capital: 0,
      transactiongiveaway: 0,
      omsiapprofit: 0
    });
    
    // Reset images, specifications and features
    setImages([]);
    setSpecifications([]);
    setFeatures([]);
  };

  return (
    <div className="create-product-container">
      <Container fluid className="create-product-view">
        <Row className="header-row">
          <Col xs={12} className="d-flex justify-content-between align-items-center">
            <h1 className="create-product-title">Create New Product</h1>
            <Button 
              variant="none" 
              className="close-button"
              onClick={() => {
                setShowDatabaseConfiguration(false);
                setShowCreateProduct(false);
              }}
            >
              <FaTimes />
            </Button>
          </Col>
        </Row>

        <Form className="product-form">
          <Row>
            {/* Product Name */}
            <Col xs={12} className="mb-4">
              <Form.Group>
                <Form.Label className="form-label">
                  <FaTag className="form-icon" /> Product Name
                </Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={productData.name}
                  onChange={handleInputChange}
                  className="form-control-dark"
                  required
                />
              </Form.Group>
            </Col>
            
            {/* Image Upload Section */}
            <Col xs={12} md={6} className="mb-4">
              <div className="image-upload-section">
                <h2 className="section-title">Product Images</h2>
                
                <div className="image-upload-container">
                  <label htmlFor="product-images" className="image-upload-label">
                    <FaFileImage className="upload-icon" />
                    <span>Select Images</span>
                  </label>
                  <input 
                    id="product-images" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden-input"
                  />
                </div>
                
                <div className="images-preview-container">
                  {images.length > 0 ? (
                    <Row className="image-grid">
                      {images.map((img, index) => (
                        <Col xs={6} sm={4} md={4} key={index} className="image-preview-col">
                          <div className="image-preview-wrapper">
                            <img src={img.preview} alt={`Product preview ${index}`} className="image-preview" />
                            <Button 
                              variant="danger" 
                              size="sm" 
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="no-images-placeholder">
                      <p>No images selected</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>
            
            {/* Product Details Section */}
            <Col xs={12} md={6} className="mb-4">
              <div className="product-details-section">
                <h2 className="section-title">Product Details</h2>
                
                <Row>
                  <Col xs={12} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaMoneyBillWave className="form-icon" /> Price
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="price" 
                        value={productData.price}
                        onChange={handleInputChange}
                        className="form-control-dark"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaBoxOpen className="form-icon" /> Stock
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="stock" 
                        value={productData.stock}
                        onChange={handleInputChange}
                        className="form-control-dark"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaTag className="form-icon" /> Category
                      </Form.Label>
                      <Form.Control 
                        type="text" 
                        name="category" 
                        value={productData.category}
                        onChange={handleInputChange}
                        className="form-control-dark"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaWeight className="form-icon" /> Weight (g)
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="weightingrams" 
                        value={productData.weightingrams}
                        onChange={handleInputChange}
                        className="form-control-dark"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaInfoCircle className="form-icon" /> Description
                      </Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4}
                        name="description" 
                        value={productData.description}
                        onChange={handleInputChange}
                        className="form-control-dark"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={12} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaInfoCircle className="form-icon" /> Warranty
                      </Form.Label>
                      <Form.Control 
                        type="text" 
                        name="warranty" 
                        value={productData.warranty}
                        onChange={handleInputChange}
                        className="form-control-dark"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaYoutube className="form-icon" /> Video URL
                      </Form.Label>
                      <Form.Control 
                        type="text" 
                        name="videoUrl" 
                        value={productData.videoUrl}
                        onChange={handleInputChange}
                        className="form-control-dark"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>
            
            {/* Specifications Section */}
            <Col xs={12} className="mb-4">
              <div className="specifications-section">
                <h2 className="section-title">
                  <FaClipboardList className="section-icon" /> Specifications
                </h2>
                
                <div className="add-item-container">
                  <Form.Control 
                    type="text" 
                    id="specification-input"
                    className="form-control-dark"
                    placeholder="Enter specification"
                  />
                  <Button 
                    variant="outline-light" 
                    className="add-button"
                    onClick={addSpecification}
                  >
                    <FaPlus /> Add
                  </Button>
                </div>
                
                {specifications.length > 0 && (
                  <div className="items-list">
                    {specifications.map((spec, index) => (
                      <div key={index} className="item-pill">
                        <span>{spec}</span>
                        <Button 
                          variant="none" 
                          size="sm" 
                          className="remove-item-btn"
                          onClick={() => removeSpecification(index)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
            
            {/* Features Section */}
            <Col xs={12} className="mb-4">
              <div className="features-section">
                <h2 className="section-title">
                  <FaStar className="section-icon" /> Features
                </h2>
                
                <div className="add-item-container">
                  <Form.Control 
                    type="text" 
                    id="feature-input"
                    className="form-control-dark"
                    placeholder="Enter feature"
                  />
                  <Button 
                    variant="outline-light" 
                    className="add-button"
                    onClick={addFeature}
                  >
                    <FaPlus /> Add
                  </Button>
                </div>
                
                {features.length > 0 && (
                  <div className="items-list">
                    {features.map((feature, index) => (
                      <div key={index} className="item-pill">
                        <span>{feature}</span>
                        <Button 
                          variant="none" 
                          size="sm" 
                          className="remove-item-btn"
                          onClick={() => removeFeature(index)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
            
            {/* Pricing Details */}
            <Col xs={12} className="mb-4">
              <div className="pricing-details-section">
                <h2 className="section-title">Pricing Details</h2>
                
                <Row>
                  <Col xs={12} sm={6} md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaMoneyBillWave className="form-icon" /> Price
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="price" 
                        value={productData.price}
                        onChange={handleInputChange}
                        className="form-control-dark"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaMoneyBillWave className="form-icon" /> Capital
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="capital" 
                        value={productData.capital}
                        onChange={handleInputChange}
                        className="form-control-dark"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaMoneyBillWave className="form-icon" /> Transaction Fee
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="transactiongiveaway" 
                        value={productData.transactiongiveaway}
                        onChange={handleInputChange}
                        className="form-control-dark"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} sm={6} md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label className="form-label">
                        <FaMoneyBillWave className="form-icon" /> Profit
                      </Form.Label>
                      <Form.Control 
                        type="number" 
                        name="omsiapprofit" 
                        value={productData.omsiapprofit}
                        onChange={handleInputChange}
                        className="form-control-dark"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>
             
            <p className="createproduct-responsemessage">Product added successfully</p>

            {/* Submit Button */}
            <Col xs={12}
                 md={1}
                 lg={1} 
                 className="text-center mb-4">
              {
                createproductloadingindication ? 
                (
                  <Spinner animation="border" variant="warning" />
                )
                :
                (
                 <Button type="button" 
                         className="submit-button" 
                         size="lg"
                         onClick={handleSubmit}>
                   Create Product
                 </Button>
                )
              }
            </Col>

            <Col xs={12}
                 md={3}
                 lg={3} 
                 className="text-center mb-4">
                 <Button className="submit-button" size="lg"
                         onClick={resetForm}>
                   Reset 
                 </Button>
            </Col>
          </Row>
        </Form>

      </Container>
    </div>
  );
};

const ProductReader = ({ product, onClose, setShowProductReader, setShowPendingOrders }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  
  // Convert file system paths to web paths
  const convertImagePath = (path) => {
    // Check if the path is a file system path
    if (path && path.includes('\\')) {
      // Extract just the filename
      const filename = path.split('\\').pop();
      // Create a web-friendly path
      return `../images/market/products/${filename}`;
    }
    // Already a web path or another format
    return path;
  };
  
  // Get image URLs from the product data and convert them
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => convertImagePath(img.url)) 
    : [`../images/market/products/${product.name}-image1.jpg`]; // Fallback
  
  useEffect(() => {
    // Animation delay for entrance
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowProductReader(false);
      setShowPendingOrders(true);
    }, 300); // Wait for exit animation
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const openFullScreen = () => {
    setIsFullScreenVisible(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenVisible(false);
  };

  const renderThumbnails = () => {
    return productImages.map((image, index) => (
      <div 
        key={index} 
        className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
        onClick={() => setCurrentImageIndex(index)}
      >
        <img src={image} alt={`${product.name} - View ${index + 1}`} />
      </div>
    ));
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
            <div className="carousel-container">
              {productImages.length > 0 && (
                <div className="main-image" onClick={openFullScreen}>
                  <img src={productImages[currentImageIndex]} alt={product.name} />
                  <div className="fullscreen-hint">
                    <Maximize2 size={20} />
                    <span>Click for fullscreen</span>
                  </div>
                </div>
              )}
              
              {productImages.length > 1 && (
                <>
                  <button className="carousel-button prev" onClick={prevImage}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="carousel-button next" onClick={nextImage}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {productImages.length > 1 && (
                <div className="thumbnail-container">
                  {renderThumbnails()}
                </div>
              )}
              
              {productImages.length > 1 && (
                <div className="carousel-indicators">
                  {productImages.map((_, index) => (
                    <div
                      key={index}
                      className={`indicator ${currentImageIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    ></div>
                  ))}
                </div>
              )}
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
            
            {product.specifications && product.specifications.length > 0 && (
              <div className="specs-container">
                <h2>Specifications</h2>
                <div className="specs-grid">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="spec-item">
                      <span className="spec-name">Specification {index + 1}:</span>
                      <span className="spec-value">{spec.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="features-container">
                <h2>Features</h2>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <Award className="icon" />
                      <span className="feature-value">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.warranty && (
              <div className="warranty-container">
                <FileText className="icon" />
                <span className="label">Warranty:</span>
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
      </div>
      
      {/* Fullscreen Image Modal */}
      {isFullScreenVisible && (
        <div className="fullscreen-modal">
          <button className="fullscreen-close" onClick={closeFullScreen}>
            <X size={32} />
          </button>
          
          <div className="fullscreen-image-container">
            <img src={productImages[currentImageIndex]} alt={product.name} />
          </div>
          
          <div className="fullscreen-controls">
            <button className="fullscreen-button prev" onClick={prevImage}>
              <ChevronLeft size={32} />
            </button>
            <div className="fullscreen-indicators">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`fullscreen-indicator ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                ></div>
              ))}
            </div>
            <button className="fullscreen-button next" onClick={nextImage}>
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UpdateProduct = ({ setShowDatabaseConfiguration, setShowUpdateProductForm, productToUpdate }) => {

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [features, setFeatures] = useState([]);

  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    weightingrams: '',
    description: '',
    warranty: '',
    videoUrl: '',
    capital: '',
    transactiongiveaway: '',
    omsiapprofit: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Function to convert backend image paths to frontend-friendly paths
  const convertImagePath = (path) => {
    if (!path) return '';
    
    // If path already starts with "../images" or "http", use it as is
    if (path.startsWith("../images") || path.startsWith("http")) {
      return path;
    }
    
    // Extract the filename from backend path
    const pathParts = path.split('\\');
    const filename = pathParts[pathParts.length - 1];
    
    // For paths like "C:\Users\Mark Anthony\Desktop\OMSIAP\view\public\images\market\products\mizta-image1.jpg"
    // Convert to "../images/market/products/mizta-image1.jpg"
    if (path.includes("\\images\\market\\products\\")) {
      return `../images/market/products/${filename}`;
    }
    
    // Check if the path includes "/images/market/products/"
    if (path.includes("/images/market/products/")) {
      const parts = path.split("/images/market/products/");
      return `../images/market/products/${parts[parts.length - 1]}`;
    }
    
    // Fallback: construct path based on filename
    return `../images/market/products/${filename}`;
  };

  // Effect to load product data when productToUpdate changes
  useEffect(() => {
    if (productToUpdate && productToUpdate._id) {
      // Set product data
      setProductData({
        name: productToUpdate.name || '',
        price: productToUpdate.price || '',
        stock: productToUpdate.stock || '',
        category: productToUpdate.category || '',
        weightingrams: productToUpdate.weightingrams || '',
        description: productToUpdate.description || '',
        warranty: productToUpdate.warranty || '',
        videoUrl: productToUpdate.videoUrl || '',
        capital: productToUpdate.focuseddata?.price?.capital || productToUpdate.capital || '',
        transactiongiveaway: productToUpdate.focuseddata?.price?.transactiongiveaway || productToUpdate.transactiongiveaway || '',
        omsiapprofit: productToUpdate.focuseddata?.price?.omsiapprofit || productToUpdate.omsiapprofit || ''
      });

      // Set specifications and features
      setSpecifications(
        productToUpdate.specifications?.map(spec => 
          typeof spec === 'string' ? { name: spec } : spec
        ) || []
      );
      
      setFeatures(
        productToUpdate.features?.map(feature => 
          typeof feature === 'string' ? { name: feature } : feature
        ) || []
      );

      // Set existing images
      if (productToUpdate.images && productToUpdate.images.length > 0) {
        const formattedImages = productToUpdate.images.map((img, index) => {
          const imgUrl = typeof img === 'string' ? img : img.url;
          return {
            id: img._id || `existing-${index}`,
            url: convertImagePath(imgUrl),
            originalUrl: imgUrl // Store original URL for backend reference
          };
        });
        setExistingImages(formattedImages);
      } else {
        setExistingImages([]);
      }

      setDataLoaded(true);
    }
  }, [productToUpdate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  // Remove new image
  const removeNewImage = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete([...imagesToDelete, imageToRemove.id]);
    
    const updatedExistingImages = [...existingImages];
    updatedExistingImages.splice(index, 1);
    setExistingImages(updatedExistingImages);
  };

  // Add specification
  const addSpecification = (e) => {
    e.preventDefault();
    const specField = document.getElementById('specification-input');
    if (specField.value.trim()) {
      setSpecifications([...specifications, { name: specField.value.trim() }]);
      specField.value = '';
    }
  };

  // Remove specification
  const removeSpecification = (index) => {
    const updatedSpecs = [...specifications];
    updatedSpecs.splice(index, 1);
    setSpecifications(updatedSpecs);
  };

  // Add feature
  const addFeature = (e) => {
    e.preventDefault();
    const featureField = document.getElementById('feature-input');
    if (featureField.value.trim()) {
      setFeatures([...features, { name: featureField.value.trim() }]);
      featureField.value = '';
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    
    if (!productToUpdate || !productToUpdate._id) {
      alert("No product selected for update");
      return false;
    }
    
    const responseMessage = document.querySelectorAll(".updateproduct-responsemessage")[0];
    responseMessage.style.color = "white";
    responseMessage.innerText = "";
    responseMessage.style.display = "none";
    
    setIsLoading(true);
    
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Add product ID
    formData.append('productId', productToUpdate._id);
    
    // Add product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Add new images
    images.forEach((image) => {
      formData.append('newImages', image.file);
    });
    
    // Add images to delete - send only the IDs or relative paths
    if (imagesToDelete.length > 0) {
      // Create an array of image IDs or relative paths to delete
      const imagesToDeleteData = imagesToDelete.map(imageId => {
        // Find the original image data if available
        const originalImage = existingImages.find(img => img.id === imageId);
        
        if (originalImage) {
          // If the URL is an absolute path, extract just the relative part
          const url = originalImage.originalUrl || originalImage.url || imageId;
          if (url.includes("images/market/products/")) {
            return "../" + url.split("images/market/products/").pop();
          }
          return url;
        }
        return imageId;
      });
      
      formData.append('imagesToDelete', JSON.stringify(imagesToDeleteData));
    }
    
    // Handle specifications and features
    const formattedSpecifications = specifications.map(spec => {
      return typeof spec === 'string' ? { name: spec } : 
             typeof spec === 'object' && spec.name ? spec : { name: spec.toString() };
    });
    
    const formattedFeatures = features.map(feature => {
      return typeof feature === 'string' ? { name: feature } : 
             typeof feature === 'object' && feature.name ? feature : { name: feature.toString() };
    });
    
    // Add specifications and features in the correct format
    formData.append('specifications', JSON.stringify(formattedSpecifications));
    formData.append('features', JSON.stringify(formattedFeatures));
    
    // Add focuseddata and orderdetails
    const focusedData = {
      price: {
        price: parseFloat(productData.price) || 0,
        capital: parseFloat(productData.capital) || 0,
        transactiongiveaway: parseFloat(productData.transactiongiveaway) || 0,
        omsiapprofit: parseFloat(productData.omsiapprofit) || 0
      }
    };
    
    const orderDetails = {
      quantity: 1, // Default value, adjust if you have a quantity field
      product: {
        price: parseFloat(productData.price) || 0,
        capital: parseFloat(productData.capital) || 0,
        transactiongiveaway: parseFloat(productData.transactiongiveaway) || 0,
        omsiapprofit: parseFloat(productData.omsiapprofit) || 0
      },
      shipment: {
        totalkilos: parseFloat(productData.weightingrams) / 1000 || 0,
        totalshipmentfee: 0 // Add a shipmentfee field if needed
      }
    };
    
    formData.append('focuseddata', JSON.stringify(focusedData));
    formData.append('orderdetails', JSON.stringify(orderDetails));
    
    try {
      // Send the data to the backend
      const response = await axiosCreatedInstance.put("/products/updateproduct", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Process the response
      const { message } = response.data;
      
      // Update response message state
      if (message === "Product updated successfully") {
        responseMessage.style.color = "green";
        responseMessage.innerText = "Product updated successfully!";
        
        // Optionally refresh the product data or redirect
        // refreshProductData(); // You would need to implement this function
      } else {
        responseMessage.style.color = "red";
        responseMessage.innerText = message || "Unknown error occurred";
      }
      
      responseMessage.style.display = "block";
      setIsLoading(false);
      
      // Return false to prevent any potential form submission
      return false;
    } catch (error) {
      // Error handling
      setIsLoading(false);
      
      let errorText = "An unexpected error occurred";
      
      if (error.response) {
        errorText = `Error: ${error.response.data.message || "Server error"}`;
      } else if (error.request) {
        errorText = "Network error: Please check your connection and try again";
      } else {
        errorText = `Error: ${error.message}`;
      }
      
      responseMessage.style.color = "red";
      responseMessage.innerText = errorText;
      responseMessage.style.display = "block";
      
      return false;
    }
  };

  return (
    <div className="update-product-container">
      <Container fluid className="update-product-view" style={{ backgroundColor: '#121212', color: 'white' }}>
        <Row className="header-row">
          <Col xs={12} className="d-flex justify-content-between align-items-center">
            <h1 className="update-product-title">Update Product</h1>
            <Button 
              variant="none" 
              className="close-button"
              style={{ color: 'white' }}
              onClick={() => {
                setShowDatabaseConfiguration(false);
                setShowUpdateProductForm(false);
              }}
            >
              <FaTimes />
            </Button>
          </Col>
        </Row>

        {!dataLoaded ? (
          <div className="text-center py-5">
            <h3>Please search for a product to update</h3>
          </div>
        ) : (
          <Form className="product-form">
            <Row>
              {/* Product Name */}
              <Col xs={12} className="mb-4">
                <Form.Group>
                  <Form.Label className="form-label">
                    <FaTag className="form-icon" /> Product Name
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={productData.name}
                    onChange={handleInputChange}
                    className="form-control-dark"
                    style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                    required
                  />
                </Form.Group>
              </Col>
              
              {/* Image Upload Section */}
              <Col xs={12} md={6} className="mb-4">
                <div className="image-upload-section" style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px' }}>
                  <h2 className="section-title">Product Images</h2>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <h5>Current Images</h5>
                      <Row className="image-grid">
                        {existingImages.map((img, index) => (
                          <Col xs={6} sm={4} md={4} key={`existing-${index}`} className="image-preview-col mb-3">
                            <div className="image-preview-wrapper" style={{ position: 'relative' }}>
                              <img 
                                src={img.url} 
                                alt={`Product image ${index}`} 
                                className="image-preview" 
                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                              <Button 
                                variant="danger" 
                                size="sm" 
                                className="remove-image-btn"
                                style={{ position: 'absolute', top: '5px', right: '5px' }}
                                onClick={() => removeExistingImage(index)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  
                  {/* Upload New Images */}
                  <div className="image-upload-container">
                    <label 
                      htmlFor="product-images" 
                      className="image-upload-label"
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        padding: '20px', 
                        border: '2px dashed #555', 
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaFileImage className="upload-icon" style={{ fontSize: '2rem', marginBottom: '10px' }} />
                      <span>Add New Images</span>
                    </label>
                    <input 
                      id="product-images" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  {/* New Images Preview */}
                  {images.length > 0 && (
                    <div className="mt-3">
                      <h5>New Images to Upload</h5>
                      <Row className="image-grid">
                        {images.map((img, index) => (
                          <Col xs={6} sm={4} md={4} key={`new-${index}`} className="image-preview-col mb-3">
                            <div className="image-preview-wrapper" style={{ position: 'relative' }}>
                              <img 
                                src={img.preview} 
                                alt={`New product image ${index}`} 
                                className="image-preview" 
                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                              <Button 
                                variant="danger" 
                                size="sm" 
                                className="remove-image-btn"
                                style={{ position: 'absolute', top: '5px', right: '5px' }}
                                onClick={() => removeNewImage(index)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              </Col>
              
              {/* Product Details Section */}
              <Col xs={12} md={6} className="mb-4">
                <div className="product-details-section" style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px' }}>
                  <h2 className="section-title">Product Details</h2>
                  
                  <Row>
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaMoneyBillWave className="form-icon" /> Price
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="price" 
                          value={productData.price}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaBoxOpen className="form-icon" /> Stock
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="stock" 
                          value={productData.stock}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaTag className="form-icon" /> Category
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          name="category" 
                          value={productData.category}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaWeight className="form-icon" /> Weight (g)
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="weightingrams" 
                          value={productData.weightingrams}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaInfoCircle className="form-icon" /> Description
                        </Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4}
                          name="description" 
                          value={productData.description}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaInfoCircle className="form-icon" /> Warranty
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          name="warranty" 
                          value={productData.warranty}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaYoutube className="form-icon" /> Video URL
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          name="videoUrl" 
                          value={productData.videoUrl}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              
              {/* Specifications Section */}
              <Col xs={12} className="mb-4">
                <div className="specifications-section" style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px' }}>
                  <h2 className="section-title">
                    <FaClipboardList className="section-icon" /> Specifications
                  </h2>
                  
                  <div className="add-item-container" style={{ display: 'flex', marginBottom: '15px' }}>
                    <Form.Control 
                      type="text" 
                      id="specification-input"
                      style={{ backgroundColor: '#333', color: 'white', borderColor: '#555', marginRight: '10px' }}
                      placeholder="Enter specification"
                    />
                    <Button 
                      variant="outline-light" 
                      className="add-button"
                      onClick={addSpecification}
                    >
                      <FaPlus /> Add
                    </Button>
                  </div>
                  
                  {specifications.length > 0 && (
                    <div className="items-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {specifications.map((spec, index) => (
                        <div 
                          key={index} 
                          className="item-pill"
                          style={{ 
                            backgroundColor: '#333', 
                            color: 'white', 
                            padding: '5px 10px', 
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span>{spec.name}</span>
                          <Button 
                            variant="none" 
                            size="sm" 
                            style={{ color: 'white', marginLeft: '5px', padding: '0' }}
                            onClick={() => removeSpecification(index)}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              
              {/* Features Section */}
              <Col xs={12} className="mb-4">
                <div className="features-section" style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px' }}>
                  <h2 className="section-title">
                    <FaStar className="section-icon" /> Features
                  </h2>
                  
                  <div className="add-item-container" style={{ display: 'flex', marginBottom: '15px' }}>
                    <Form.Control 
                      type="text" 
                      id="feature-input"
                      style={{ backgroundColor: '#333', color: 'white', borderColor: '#555', marginRight: '10px' }}
                      placeholder="Enter feature"
                    />
                    <Button 
                      variant="outline-light" 
                      className="add-button"
                      onClick={addFeature}
                    >
                      <FaPlus /> Add
                    </Button>
                  </div>
                  
                  {features.length > 0 && (
                    <div className="items-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="item-pill"
                          style={{ 
                            backgroundColor: '#333', 
                            color: 'white', 
                            padding: '5px 10px', 
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span>{feature.name}</span>
                          <Button 
                            variant="none" 
                            size="sm" 
                            style={{ color: 'white', marginLeft: '5px', padding: '0' }}
                            onClick={() => removeFeature(index)}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              
              {/* Pricing Details */}
              <Col xs={12} className="mb-4">
                <div className="pricing-details-section" style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '5px' }}>
                  <h2 className="section-title">Pricing Details</h2>
                  
                  <Row>
                    <Col xs={12} sm={6} md={3} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaMoneyBillWave className="form-icon" /> Price
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="price" 
                          value={productData.price}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} md={3} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaMoneyBillWave className="form-icon" /> Capital
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="capital" 
                          value={productData.capital}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} md={3} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaMoneyBillWave className="form-icon" /> Transaction Fee
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="transactiongiveaway" 
                          value={productData.transactiongiveaway}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} sm={6} md={3} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">
                          <FaMoneyBillWave className="form-icon" /> Profit
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          name="omsiapprofit" 
                          value={productData.omsiapprofit}
                          onChange={handleInputChange}
                          className="form-control-dark"
                          style={{ backgroundColor: '#333', color: 'white', borderColor: '#555' }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              
              <p className="updateproduct-responsemessage" style={{ display: 'none', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                Update status will appear here
              </p>

              {/* Submit Button */}
              <Col xs={12} md={6} lg={4} className="d-flex gap-3 mb-4">
                {isLoading ? (
                  <Spinner animation="border" variant="warning" />
                ) : (
                  <>
                    <Button 
                      type="button" 
                      className="submit-button" 
                      size="lg"
                      style={{ 
                        backgroundColor: '#4caf50', 
                        borderColor: '#4caf50',
                        flex: '1'
                      }}
                      onClick={handleSubmit}
                    >
                      Update Product
                    </Button>
                    
                    <Button 
                      type="button"
                      className="cancel-button" 
                      size="lg"
                      style={{ 
                        backgroundColor: '#f44336', 
                        borderColor: '#f44336',
                        flex: '1'
                      }}
                      onClick={() => {
                        setShowDatabaseConfiguration(false);
                        setShowUpdateProductForm(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </div>
  );
};

const DeleteProductReader = ({ product, onClose, setShowProductReader, setShowPendingOrders, deleteproductfield }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  
  // Convert file system paths to web paths
  const convertImagePath = (path) => {
    // Check if the path is a file system path
    if (path && path.includes('\\')) {
      // Extract just the filename
      const filename = path.split('\\').pop();
      // Create a web-friendly path
      return `../images/market/products/${filename}`;
    }
    // Already a web path or another format
    return path;
  };
  
  // Get image URLs from the product data and convert them
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => convertImagePath(img.url)) 
    : [`../images/market/products/${product.name}-image1.jpg`]; // Fallback
  
  useEffect(() => {
    // Animation delay for entrance
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowProductReader(false);
      setShowPendingOrders(true);
    }, 300); // Wait for exit animation
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const openFullScreen = () => {
    setIsFullScreenVisible(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenVisible(false);
  };

  const renderThumbnails = () => {
    return productImages.map((image, index) => (
      <div 
        key={index} 
        className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
        onClick={() => setCurrentImageIndex(index)}
      >
        <img src={image} alt={`${product.name} - View ${index + 1}`} />
      </div>
    ));
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
            <div className="carousel-container">
              {productImages.length > 0 && (
                <div className="main-image" onClick={openFullScreen}>
                  <img src={productImages[currentImageIndex]} alt={product.name} />
                  <div className="fullscreen-hint">
                    <Maximize2 size={20} />
                    <span>Click for fullscreen</span>
                  </div>
                </div>
              )}
              
              {productImages.length > 1 && (
                <>
                  <button className="carousel-button prev" onClick={prevImage}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="carousel-button next" onClick={nextImage}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {productImages.length > 1 && (
                <div className="thumbnail-container">
                  {renderThumbnails()}
                </div>
              )}
              
              {productImages.length > 1 && (
                <div className="carousel-indicators">
                  {productImages.map((_, index) => (
                    <div
                      key={index}
                      className={`indicator ${currentImageIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    ></div>
                  ))}
                </div>
              )}
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
            
            {product.specifications && product.specifications.length > 0 && (
              <div className="specs-container">
                <h2>Specifications</h2>
                <div className="specs-grid">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="spec-item">
                      <span className="spec-name">Specification {index + 1}:</span>
                      <span className="spec-value">{spec.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="features-container">
                <h2>Features</h2>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <Award className="icon" />
                      <span className="feature-value">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.warranty && (
              <div className="warranty-container">
                <FileText className="icon" />
                <span className="label">Warranty:</span>
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
        
         <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                padding:"30px 10px"
               }}>
            <p className="deletingproductresponsemessage">Response message</p>
           <button style={{
                     position: "relative",
                     backgroundColor: "red",
                     color: "white"
                   }}
                   onClick={async () => {
                    try {
                      const response = await axiosCreatedInstance.post("/products/deleteproduct", {
                        id: deleteproductfield
                      });
                      
                      // Get your message display element
                      const messageElement = document.querySelectorAll(".deletingproductresponsemessage")[0]; // Replace with your actual element ID
                      
                      // Update the message element with success response
                      if (messageElement) {
                        messageElement.textContent = response.data.message || "Product deleted successfully";
                        messageElement.className = "success-message"; // Add appropriate CSS class for success styling
                        
                        // Optionally auto-hide the message after a few seconds
                        setTimeout(() => {
                          messageElement.textContent = "";
                          messageElement.className = "";
                        }, 5000);
                      }
                      
                      // Additional success handling (e.g., refresh product list)
                      // You might want to add code here to refresh your product list or navigate elsewhere
                      
                    } catch (error) {
                      // Get your message display element
                      const messageElement = document.getElementById("responseMessage"); // Replace with your actual element ID
                      
                      // Update the message element with error response
                      if (messageElement) {
                        messageElement.textContent = error.response?.data?.message || "Error deleting product";
                        messageElement.className = "error-message"; // Add appropriate CSS class for error styling
                        
                        // Optionally auto-hide the message after a few seconds
                        setTimeout(() => {
                          messageElement.textContent = "";
                          messageElement.className = "";
                        }, 5000);
                      }
                      
                      console.error("Error deleting product:", error);
                    }
                  }}>
                    delete
           </button>
         </div>

      </div>
      
      {/* Fullscreen Image Modal */}
      {isFullScreenVisible && (
        <div className="fullscreen-modal">
          <button className="fullscreen-close" onClick={closeFullScreen}>
            <X size={32} />
          </button>
          
          <div className="fullscreen-image-container">
            <img src={productImages[currentImageIndex]} alt={product.name} />
          </div>
          
          <div className="fullscreen-controls">
            <button className="fullscreen-button prev" onClick={prevImage}>
              <ChevronLeft size={32} />
            </button>
            <div className="fullscreen-indicators">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`fullscreen-indicator ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                ></div>
              ))}
            </div>
            <button className="fullscreen-button next" onClick={nextImage}>
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};





const RegistrationForm = ({ onClose, setShowDatabaseConfiguration, setShowCreateRegistrantForm }) => {

  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    nickname: '',
    phonenumber: '',
    telephonenumber: '',
    emailaddress: '',
    street: '',
    baranggay: '',
    trademark: '',
    city: '',
    province: '',
    country: '',
    age: '',
    sex: '',
    bloodtype: '',
    dob: '',
    citizenship: '',
    civil_status: '',
    government_id: '',
    password: '',
    confirmPassword: '',
    birthcertificate_front: null,
    birthcertificate_back: null,
    governmentid_front: null,
    governmentid_back: null
  });

  const [createnewregistrantloadingindication, createnewregistrantloadingindicationcb] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Preview states for uploaded images
  const [previews, setPreviews] = useState({
    birthcertificate_front: null,
    birthcertificate_back: null,
    governmentid_front: null,
    governmentid_back: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Update form data with the file
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
      
      // Generate preview for the uploaded image
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prevPreviews => ({
          ...prevPreviews,
          [name]: event.target.result
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    // Validate passwords before proceeding
    if (!validatePasswords()) {
      return;
    }
    
    createnewregistrantloadingindicationcb(true);

    console.log('Form submitted:', formData);

    // Here you would typically send the data to your backend
    // and handle the registration process using FormData to handle file uploads
    const formDataToSubmit = new FormData();
    
    // Append all form fields to FormData except confirmPassword (not needed on server)
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        formDataToSubmit.append(key, formData[key]);
      }
    });
    
    // Now you can use formDataToSubmit with fetch or axios
    try {
      await axiosCreatedInstance.post("/people/addregistrant", formDataToSubmit).then((response)=> {
        const responsemessage = response.data.message
        switch(responsemessage) {
          case "Registrant added successfully":
            createnewregistrantloadingindicationcb(false);
            document.querySelectorAll('.createregistrant-responsemessagecontainer')[0].innerText = "Registrant successfully created";
            document.querySelectorAll('.createregistrant-responsemessagecontainer')[0].style.display = "block";
            document.querySelectorAll('.createregistrant-responsemessagecontainer')[0].style.color = "green";
          break;
          case "A user with the same name and password already exists. Please use a different password.":
            createnewregistrantloadingindicationcb(false);
            document.querySelectorAll('.createregistrant-responsemessagecontainer')[0].innerText = "Registrant had a duplicate name in the system. Try a different password";
            document.querySelectorAll('.createregistrant-responsemessagecontainer')[0].style.display = "block";
            document.querySelectorAll('.createregistrant-responsemessagecontainer')[0].style.color = "red";
          break;
        }
        // Handle success
       
      })
    
    } catch (error) {
      // Handle error
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      createnewregistrantloadingindicationcb(false);
    }
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form-content">
        <div className="form-header">
          <h2>MFATIP Registration</h2>
          <button className="close-button" onClick={()=>{ 
            setShowDatabaseConfiguration(false)
            setShowCreateRegistrantForm(false)
          }}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  placeholder="Middle Name"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="Nickname"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="telephonenumber"
                  value={formData.telephonenumber}
                  onChange={handleChange}
                  placeholder="Telephone Number"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="emailaddress"
                  value={formData.emailaddress}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Secure Account</h3>
            <div className="form-group">
              <div className="input-group password-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  minLength="8"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <div className="input-group password-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  minLength="8"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {passwordError && (
                <div className="error-message">
                  {passwordError}
                </div>
              )}
              
              <div className="password-requirements">
                <small>Password must be at least 8 characters long</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Address</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="baranggay"
                  value={formData.baranggay}
                  onChange={handleChange}
                  placeholder="Barangay"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="trademark"
                  value={formData.trademark}
                  onChange={handleChange}
                  placeholder="Landmark"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Province"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaCalendarAlt />
                </div>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/*
              <div className="input-group">
                <div className="input-icon">
                  <FaIdCard />
                </div>
                <input
                  type="text"
                  name="bloodtype"
                  value={formData.bloodtype}
                  onChange={handleChange}
                  placeholder="Blood Type"
                />
              </div>
              */}

              <div className="input-group">
                <div className="input-icon">
                  <FaCalendarAlt />
                </div>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="Date of Birth"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaIdCard />
                </div>
                <input
                  type="text"
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleChange}
                  placeholder="Citizenship"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaIdCard />
                </div>
                <select
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                >
                  <option value="">Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
             
             {/*
              <div className="input-group">
                <div className="input-icon">
                  <FaIdCard />
                </div>
                <input
                  type="text"
                  name="government_id"
                  value={formData.government_id}
                  onChange={handleChange}
                  placeholder="Government ID"
                />
              </div>
             */}

            </div>
          </div>

          <div className="form-section">
            <h3>Document Uploads</h3>
            <div className="form-group document-uploads">
              <div className="upload-group">
                <h4>Birth Certificate</h4>
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="birthcertificate_front" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span>Front Side</span>
                    </label>
                    <input
                      type="file"
                      id="birthcertificate_front"
                      name="birthcertificate_front"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  {previews.birthcertificate_front && (
                    <div className="image-preview">
                      <img src={previews.birthcertificate_front} alt="Birth Certificate Front" />
                    </div>
                  )}
                </div>
                
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="birthcertificate_back" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span>Back Side</span>
                    </label>
                    <input
                      type="file"
                      id="birthcertificate_back"
                      name="birthcertificate_back"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  {previews.birthcertificate_back && (
                    <div className="image-preview">
                      <img src={previews.birthcertificate_back} alt="Birth Certificate Back" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="upload-group">
                <h4>Government ID</h4>
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="governmentid_front" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span>Front Side</span>
                    </label>
                    <input
                      type="file"
                      id="governmentid_front"
                      name="governmentid_front"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  {previews.governmentid_front && (
                    <div className="image-preview">
                      <img src={previews.governmentid_front} alt="Government ID Front" />
                    </div>
                  )}
                </div>
                
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="governmentid_back" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span>Back Side</span>
                    </label>
                    <input
                      type="file"
                      id="governmentid_back"
                      name="governmentid_back"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  {previews.governmentid_back && (
                    <div className="image-preview">
                      <img src={previews.governmentid_back} alt="Government ID Back" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        
          <div>
            <p className="createregistrant-responsemessagecontainer">Registrant added successfully</p>
          </div>

          <div className="form-actions">
            {
              createnewregistrantloadingindication ? 
              (
                <Spinner animation="border" variant="warning" />
              )
              :
              (
                <button type="submit" className="submit-button">Register</button>
              )
            }
            <button type="reset" className="reset-button">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReadRegistrantFormDetails = ({ setShowDatabaseConfiguration, setShowRegistrantDetailsDisplay, registrantdata, registrantData, onClose }) => {

  // Display sections with their respective data
  const [documentImage, setDocumentImage] = useState(null);
  const [showreadregistrantdocumentfullscreenview, setShowReadRegistrantDocumentFullScreenView] = useState(false)

  // Function to handle image click and set the document image
  const handleDocumentClick = (imageSource) => {
    setDocumentImage(imageSource);
    setShowReadRegistrantDocumentFullScreenView(true);
  };

  return (
    <div className="read-form-container">

      <div className="read-form-content">
        <div className="form-header">
          <h2>MFATIP Registrant Details</h2>
          <button className="close-button" onClick={()=> {
            setShowRegistrantDetailsDisplay(false);
          }}>
            ×
          </button>
        </div>
        
        <div className="form-details">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="details-group">
              <div className="detail-item">
                <div className="detail-icon">
                  <FaUser />
                </div>
                <div className="detail-content">
                  <label>First Name</label>
                  <p>{registrantData.name.firstname || 'N/A' }</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaUser />
                </div>
                <div className="detail-content">
                  <label>Middle Name</label>
                  <p>{registrantData.name.middlename || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaUser />
                </div>
                <div className="detail-content">
                  <label>Last Name</label>
                  <p>{registrantData.name.lastname || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaUser />
                </div>
                <div className="detail-content">
                  <label>Nickname</label>
                  <p>{registrantData.name.nickname || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="details-group">
              <div className="detail-item">
                <div className="detail-icon">
                  <FaPhone />
                </div>
                <div className="detail-content">
                  <label>Phone Number</label>
                  <p>{registrantData.contact.phonenumber || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaPhone />
                </div>
                <div className="detail-content">
                  <label>Telephone Number</label>
                  <p>{registrantData.contact.telephonenumber || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaEnvelope />
                </div>
                <div className="detail-content">
                  <label>Email Address</label>
                  <p>{registrantData.contact.emailaddress || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Address</h3>
            <div className="details-group">
              <div className="detail-item">
                <div className="detail-icon">
                  <FaAddressCard />
                </div>
                <div className="detail-content">
                  <label>Street</label>
                  <p>{registrantData.street || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaAddressCard />
                </div>
                <div className="detail-content">
                  <label>Barangay</label>
                  <p>{registrantData.contact.address.baranggay || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaAddressCard />
                </div>
                <div className="detail-content">
                  <label>Landmark</label>
                  <p>{registrantData.contact.address.trademark || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaAddressCard />
                </div>
                <div className="detail-content">
                  <label>City</label>
                  <p>{registrantData.contact.address.city || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaAddressCard />
                </div>
                <div className="detail-content">
                  <label>Province</label>
                  <p>{registrantData.contact.address.province || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaAddressCard />
                </div>
                <div className="detail-content">
                  <label>Country</label>
                  <p>{registrantData.contact.address.country || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="details-group">
              <div className="detail-item">
                <div className="detail-icon">
                  <FaCalendarAlt />
                </div>
                <div className="detail-content">
                  <label>Age</label>
                  <p>{registrantData.personaldata.age || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaUser />
                </div>
                <div className="detail-content">
                  <label>Sex</label>
                  <p>{registrantData.personaldata.sex ? registrantData.personaldata.sex.charAt(0).toUpperCase() + registrantData.personaldata.sex.slice(1) : 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaIdCard />
                </div>
                <div className="detail-content">
                  <label>Blood Type</label>
                  <p>{registrantData.personaldata.bloodtype || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaCalendarAlt />
                </div>
                <div className="detail-content">
                  <label>Date of Birth</label>
                  <p>{registrantData.personaldata.dob || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaIdCard />
                </div>
                <div className="detail-content">
                  <label>Citizenship</label>
                  <p>{registrantData.personaldata.citizenship || 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaIdCard />
                </div>
                <div className="detail-content">
                  <label>Civil Status</label>
                  <p>{registrantData.personaldata.civil_status ? registrantData.personaldata.civil_status.charAt(0).toUpperCase() + registrantData.personaldata.civil_status.slice(1) : 'N/A'}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon">
                  <FaIdCard />
                </div>
                <div className="detail-content">
                  <label>Government ID</label>
                  <p>{registrantData.personaldata.government_id || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Document Uploads</h3>
            <div className="details-group document-displays">
              <div className="document-group">
                <h4>Birth Certificate</h4>
                <div className="document-display">

                <div className="document-item">
                  <label>Front Side</label>
                  {registrantData.governmentid_front ? (
                    <div className="document-image">
                      <img src={registrantData.birthcertificate_front} 
                           alt="Government ID Front" 
                           onClick={()=> {
                            handleDocumentClick(registrantData.birthcertificate_front)
                           }}/>
                    </div>
                  ) : (
                    <p className="document-placeholder">No image uploaded</p>
                  )}
                </div>
                  
                  <div className="document-item">
                    <label>Back Side</label>
                    {registrantData.birthcertificate_back ? (
                      <div className="document-image">
                        <img src={registrantData.birthcertificate_back} 
                             alt="Birth Certificate Back"
                             onClick={()=> {
                              handleDocumentClick(registrantData.birthcertificate_back)
                             }} />
                      </div>
                    ) : (
                      <p className="document-placeholder">No image uploaded</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="document-group">
                <h4>Government ID</h4>
                <div className="document-display">
                  <div className="document-item">
                    <label>Front Side</label>
                    {registrantData.governmentid_back ? (
                      <div className="document-image">
                        <img src={registrantData.governmentid_front}
                             alt="Government ID Front" 
                             onClick={()=> {
                              handleDocumentClick(registrantData.governmentid_front)
                             }}/>
                      </div>
                    ) : (
                      <p className="document-placeholder">No image uploaded</p>
                    )}
                  </div>
                  
                  <div className="document-item">
                    <label>Back Side</label>
                    {registrantData.governmentid_back ? (
                      <div className="document-image">
                        <img src={registrantData.governmentid_back}
                             alt="Government ID Back" 
                             onClick={()=> {
                              handleDocumentClick(registrantData.governmentid_back)
                             }}/>
                      </div>
                    ) : (
                      <p className="document-placeholder">No image uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
 
      {
        showreadregistrantdocumentfullscreenview && (
          <div className="readregistrant-documentfullcontainerview">
            <div className="readregistrant-documentfullcontainerview-closebuttoncontainer">
              <p className="readregistrant-documentfullcontainerview-closebuttoncontainer-closebuttonheaderindication"
                 onClick={()=> {
                  setShowReadRegistrantDocumentFullScreenView(false)
                 }}>X</p>
            </div>
            <div className="readregistrant-documentfullcontainerview-imagedocumentfullscreenviewcontainer">
              <img src={documentImage}
                    className="readregistrant-documentfullcontainerview-imagedocumentfullscreenviewcontainer-imagedocument"/>
            </div>
          </div>
        )
      }
    

    </div>
  );
};

const UpdateRegistrationForm = ({ 
  onClose, 
  setShowDatabaseConfiguration, 
  setShowCreateRegistrantForm,
  setShowUpdateRegistrantFormDisplay,
  registrantData,
  setregistrantdata 
}) => {

  const [updateregistrantloadingindication, setUpdateRegistrantLoadingIndication] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Create a global change handler for nested fields
  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    
    // Parse the name to handle nested properties (e.g. "name.firstname")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setregistrantdata(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value
        }
      }));
    } else if (name.includes(':')) {
      // Handle even deeper nesting like "contact:address.street"
      const [grandparent, rest] = name.split(':');
      const [parent, child] = rest.split('.');
      setregistrantdata(prevData => ({
        ...prevData,
        [grandparent]: {
          ...prevData[grandparent],
          [parent]: {
            ...prevData[grandparent][parent],
            [child]: value
          }
        }
      }));
    } else {
      // Handle top-level fields
      setregistrantdata(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleDocumentFileChange = (e) => {
    const { name, files } = e.target;
  
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setregistrantdata(prevData => ({
          ...prevData,
          [name]: event.target.result
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswords = () => {
    if (registrantData.password !== registrantData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (registrantData.password && registrantData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords before proceeding (if password fields are enabled)
    if (registrantData.password && !validatePasswords()) {
      return;
    }
    
    setUpdateRegistrantLoadingIndication(true);
    
    // Create FormData to handle both text fields and files
    const formDataToSubmit = new FormData();
    
    // Add all top-level fields that aren't objects
    Object.keys(registrantData).forEach(key => {
      if (typeof registrantData[key] !== 'object' || registrantData[key] instanceof File) {
        formDataToSubmit.append(key, registrantData[key]);
      }
    });
    
    // Add nested fields as JSON strings
    if (registrantData.name) {
      formDataToSubmit.append('name', JSON.stringify(registrantData.name));
    }
    
    if (registrantData.contact) {
      formDataToSubmit.append('contact', JSON.stringify(registrantData.contact));
    }
    
    if (registrantData.personaldata) {
      formDataToSubmit.append('personaldata', JSON.stringify(registrantData.personaldata));
    }
    
    // Handle status field if it's an object
    if (registrantData.status && typeof registrantData.status === 'object') {
      formDataToSubmit.append('status', JSON.stringify(registrantData.status));
    }
    
    // Handle document uploads - process both File objects and data URLs
    const documentFields = [
      'birthcertificate_front', 
      'birthcertificate_back', 
      'governmentid_front', 
      'governmentid_back'
    ];
    
    documentFields.forEach(docField => {
      if (registrantData[docField] instanceof File) {
        // It's a File object from a fresh upload
        formDataToSubmit.append(docField, registrantData[docField]);
      } else if (typeof registrantData[docField] === 'string' && registrantData[docField].startsWith('data:')) {
        // It's a data URL from the preview, append with a special field name
        formDataToSubmit.append(`${docField}_dataurl`, registrantData[docField]);
      }
      // If neither condition is met, we don't send this field (it means no change)
    });
    
    const updateRegistrantMessage = (message, type = 'error') => {
      const messageElement = document.querySelector('.updateregistrant-responsemessagecontainer');
      if (messageElement) {
        messageElement.innerText = message;
        messageElement.style.display = "block";
        
        switch(type) {
          case 'success':
            messageElement.style.color = "green";
            break;
          case 'warning':
            messageElement.style.color = "orange";
            break;
          case 'error':
          default:
            messageElement.style.color = "red";
        }
      }
    };
  
    try {
      const response = await axiosCreatedInstance.post("/people/updateregistrant", formDataToSubmit);
      
      // Handle successful response
      if (response.data && response.data.registrant) {
        // Update local state with the returned data to reflect changes immediately
        setregistrantdata(prevData => {
          // Create a new object that merges the previous data with the updated data
          const updatedData = { ...prevData };
          
          // Update top-level fields
          if (response.data.registrant.name) {
            updatedData.name = response.data.registrant.name;
          }
          
          if (response.data.registrant.contact) {
            updatedData.contact = response.data.registrant.contact;
          }
          
          if (response.data.registrant.personaldata) {
            // Create personaldata if it doesn't exist
            if (!updatedData.personaldata) {
              updatedData.personaldata = {};
            }
            
            // Merge personal data excluding image objects to avoid duplication
            const { government_issued_identification, birthcertificate, ...otherPersonalData } = response.data.registrant.personaldata;
            
            // Update other personal data fields
            updatedData.personaldata = {
              ...updatedData.personaldata,
              ...otherPersonalData
            };
            
            // If government ID data was returned, update it
            if (government_issued_identification) {
              updatedData.personaldata.government_issued_identification = {
                ...(updatedData.personaldata.government_issued_identification || {}),
                ...government_issued_identification
              };
            }
            
            // If birth certificate data was returned, update it
            if (birthcertificate) {
              updatedData.personaldata.birthcertificate = {
                ...(updatedData.personaldata.birthcertificate || {}),
                ...birthcertificate
              };
            }
          }
          
          if (response.data.registrant.status) {
            updatedData.status = response.data.registrant.status;
          }
          
          if (response.data.registrant.loginstatus) {
            updatedData.loginstatus = response.data.registrant.loginstatus;
          }
          
          return updatedData;
        });
        
        // Clear any document fields from memory once successfully uploaded
        const clearedRegistrantData = { ...registrantData };
        documentFields.forEach(field => {
          if (response.data.updatedImages && response.data.updatedImages.includes(field)) {
            delete clearedRegistrantData[field];
          }
        });
        setregistrantdata(clearedRegistrantData);
        
        // Force image refresh for updated images
        if (response.data.updatedImages && response.data.updatedImages.length > 0) {
        //  forceRefreshImages(response.data.registrant.id, response.data.updatedImages);
        }
        
        // Show success message
        updateRegistrantMessage("Registrant successfully updated", "success");
        
      } else {
        // Handle success response without registrant data
        updateRegistrantMessage(response.data.message || "Update successful, but no data returned", "success");
      }
    } catch (error) {
      console.error("Update failed:", error);
      
      // Handle different types of errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage = error.response.data?.message || "Server error occurred";
        const errorCode = error.response.status;
        
        switch(errorCode) {
          case 400:
            updateRegistrantMessage(`Invalid data: ${errorMessage}`);
            break;
          case 401:
            updateRegistrantMessage("Authentication required. Please log in again.");
            break;
          case 403:
            updateRegistrantMessage("You don't have permission to update this registrant.");
            break;
          case 404:
            updateRegistrantMessage("Registrant not found. It may have been deleted.");
            break;
          case 409:
            updateRegistrantMessage("A user with the same name and password already exists. Please use a different password.");
            break;
          default:
            updateRegistrantMessage(`Server error (${errorCode}): ${errorMessage}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        updateRegistrantMessage("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        updateRegistrantMessage(`Request failed: ${error.message}`);
      }
    } finally {
      setUpdateRegistrantLoadingIndication(false);
    }
  };


  return (
    <div className="registration-form-container">
      <div className="registration-form-content">
        <div className="form-header">
          <h2>MFATIP Registration</h2>
          <button className="close-button" onClick={()=>{ 
            setShowDatabaseConfiguration(false)
            setShowUpdateRegistrantFormDisplay(false)
          }}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name.firstname"
                  value={registrantData.name?.firstname || ''}
                  onChange={handleNestedChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name.middlename"
                  value={registrantData.name?.middlename || ''}
                  onChange={handleNestedChange}
                  placeholder="Middle Name"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name.lastname"
                  value={registrantData.name?.lastname || ''}
                  onChange={handleNestedChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name.nickname"
                  value={registrantData.name?.nickname || ''}
                  onChange={handleNestedChange}
                  placeholder="Nickname"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="contact.phonenumber"
                  value={registrantData.contact?.phonenumber || ''}
                  onChange={handleNestedChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="contact.telephonenumber"
                  value={registrantData.contact?.telephonenumber || ''}
                  onChange={handleNestedChange}
                  placeholder="Telephone Number"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="contact.emailaddress"
                  value={registrantData.contact?.emailaddress || ''}
                  onChange={handleNestedChange}
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Address</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="contact:address.street"
                  value={registrantData.contact?.address?.street || ''}
                  onChange={handleNestedChange}
                  placeholder="Street"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="contact:address.baranggay"
                  value={registrantData.contact?.address?.baranggay || ''}
                  onChange={handleNestedChange}
                  placeholder="Barangay"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="contact:address.trademark"
                  value={registrantData.contact?.address?.trademark || ''}
                  onChange={handleNestedChange}
                  placeholder="Landmark"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="contact:address.city"
                  value={registrantData.contact?.address?.city || ''}
                  onChange={handleNestedChange}
                  placeholder="City"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="contact:address.province"
                  value={registrantData.contact?.address?.province || ''}
                  onChange={handleNestedChange}
                  placeholder="Province"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaAddressCard />
                </div>
                <input
                  type="text"
                  name="contact:address.country"
                  value={registrantData.contact?.address?.country || ''}
                  onChange={handleNestedChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <div className="input-group">
                <div className="input-icon">
                  <FaCalendarAlt />
                </div>
                <input
                  type="number"
                  name="personaldata.age"
                  value={registrantData.personaldata?.age || ''}
                  onChange={handleNestedChange}
                  placeholder="Age"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <select
                  name="personaldata.sex"
                  value={registrantData.personaldata?.sex || ''}
                  onChange={handleNestedChange}
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaCalendarAlt />
                </div>
                <input
                  type="date"
                  name="personaldata.dob"
                  value={registrantData.personaldata?.dob || ''}
                  onChange={handleNestedChange}
                  placeholder="Date of Birth"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaIdCard />
                </div>
                <input
                  type="text"
                  name="personaldata.citizenship"
                  value={registrantData.personaldata?.citizenship || ''}
                  onChange={handleNestedChange}
                  placeholder="Citizenship"
                />
              </div>
              <div className="input-group">
                <div className="input-icon">
                  <FaIdCard />
                </div>
                <select
                  name="personaldata.civil_status"
                  value={registrantData.personaldata?.civil_status || ''}
                  onChange={handleNestedChange}
                >
                  <option value="">Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Document Uploads</h3>
            <div className="form-group document-uploads">
              <div className="upload-group">
                <h4>Birth Certificate</h4>
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="birthcertificate_front" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span style={{color:"white"}}>Front Side</span>
                    </label>
                    <input
                      type="file"
                      id="birthcertificate_front"
                      name="birthcertificate_front"
                      accept="image/*"
                      onChange={handleDocumentFileChange}
                      className="file-input"
                    />
                  </div>
                  {registrantData.birthcertificate_front && (
                    <div className="image-preview">
                      <img src={registrantData.birthcertificate_front} alt="Birth Certificate Front" />
                    </div>
                  )}
                </div>
                
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="birthcertificate_back" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span style={{color:"white"}}>Back Side</span>
                    </label>
                    <input
                      type="file"
                      id="birthcertificate_back"
                      name="birthcertificate_back"
                      accept="image/*"
                      onChange={handleDocumentFileChange}
                      className="file-input"
                    />
                  </div>
                  {registrantData.birthcertificate_back && (
                    <div className="image-preview">
                      <img src={registrantData.birthcertificate_back} alt="Birth Certificate Back" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="upload-group">
                <h4>Government ID</h4>
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="governmentid_front" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span style={{color:"white"}}>Front Side</span>
                    </label>
                    <input
                      type="file"
                      id="governmentid_front"
                      name="governmentid_front"
                      accept="image/*"
                      onChange={handleDocumentFileChange}
                      className="file-input"
                    />
                  </div>
                  {registrantData.governmentid_front && (
                    <div className="image-preview">
                      <img src={registrantData.governmentid_front} alt="Government ID Front" />
                    </div>
                  )}
                </div>
                
                <div className="file-upload-container">
                  <div className="file-upload">
                    <label htmlFor="governmentid_back" className="upload-label">
                      <div className="input-icon">
                        <FaFileUpload />
                      </div>
                      <span style={{color:"white"}}>Back Side</span>
                    </label>
                    <input
                      type="file"
                      id="governmentid_back"
                      name="governmentid_back"
                      accept="image/*"
                      onChange={handleDocumentFileChange}
                      className="file-input"
                    />
                  </div>
                  {registrantData.governmentid_back && (
                    <div className="image-preview">
                      <img src={registrantData.governmentid_back} alt="Government ID Back" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        
          <div>
            <p className="updateregistrant-responsemessagecontainer" style={{display: "none"}}>Registrant added successfully</p>
          </div>

          <div className="form-actions">
            {
              updateregistrantloadingindication ? 
              (
                <Spinner animation="border" variant="warning" />
              )
              :
              (
                <button type="submit" className="submit-button">Update registrant</button>
              )
            }
            <button type="reset" className="reset-button">Reset</button>
          </div>
        </form>

      </div>
    </div>
  );
};



const RegistrantDetailsDisplay = ( {setShowDatabaseConfiguration, setShowRegistrantDetailsDisplay } ) => {
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

  // Section rendering functions
  const renderUserInfo = () => (
    <div className="user-section">
      <h2>User Information</h2>
      <div className="info-row">
        <span className="label">User ID:</span>
        <span className="value">{user.id}</span>
      </div>
      <div className="info-row">
        <span className="label">Login Status:</span>
        <span className="value">{user.loginstatus}</span>
      </div>
    </div>
  );

  const renderStatusInfo = () => (
    <div className="user-section">
      <h2>Status Information</h2>
      <div className="info-row">
        <span className="label">Type:</span>
        <span className="value">{user.status.type}</span>
      </div>
      <div className="info-row">
        <span className="label">Indication:</span>
        <span className="value">{user.status.indication}</span>
      </div>

      <h3>Requests</h3>
      {user.status.requests.map((request, index) => (
        <div key={index} className="request-item">
          <div className="info-row">
            <span className="label">Purpose:</span>
            <span className="value">{request.purpose}</span>
          </div>
          <div className="info-row">
            <span className="label">Message:</span>
            <span className="value">{request.message}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className="value">{request.status}</span>
          </div>
          <div className="info-row">
            <span className="label">Date:</span>
            <span className="value">{request.date}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="user-section">
      <h2>Personal Information</h2>
      <div className="info-row">
        <span className="label">Name:</span>
        <span className="value">
          {user.name.firstname} {user.name.middlename} {user.name.lastname} ({user.name.nickname})
        </span>
      </div>
      <div className="info-row">
        <span className="label">Age:</span>
        <span className="value">{user.personalinformation.age || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Sex:</span>
        <span className="value">{user.personalinformation.sex || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Blood Type:</span>
        <span className="value">{user.personalinformation.bloodtype || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Date of Birth:</span>
        <span className="value">{user.personalinformation.dob || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Citizenship:</span>
        <span className="value">{user.personalinformation.citizenship || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Civil Status:</span>
        <span className="value">{user.personalinformation.civil_status || "Not specified"}</span>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="user-section">
      <h2>Contact Information</h2>
      <div className="info-row">
        <span className="label">Phone Number:</span>
        <span className="value">{user.contact.phonenumber || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Telephone:</span>
        <span className="value">{user.contact.telephonenumber || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Email:</span>
        <span className="value">{user.contact.emailaddress || "Not specified"}</span>
      </div>
      
      <h3>Address</h3>
      <div className="info-row">
        <span className="label">Street:</span>
        <span className="value">{user.contact.address.street || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Barangay:</span>
        <span className="value">{user.contact.address.baranggay || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Trademark:</span>
        <span className="value">{user.contact.address.trademark || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">City:</span>
        <span className="value">{user.contact.address.city || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Province:</span>
        <span className="value">{user.contact.address.province || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Country:</span>
        <span className="value">{user.contact.address.country || "Not specified"}</span>
      </div>
    </div>
  );

  const renderCreditsInfo = () => (
    <div className="user-section">
      <h2>Credits Information</h2>
      <div className="info-row">
        <span className="label">OMSIAPAWASTO ID:</span>
        <span className="value">{user.credits.omsiapawasto.id || "Not specified"}</span>
      </div>
      <div className="info-row">
        <span className="label">Amount:</span>
        <span className="value">{user.credits.omsiapawasto.amount}</span>
      </div>
      
      <h3>Transactions</h3>
      <div className="transactions-container">
        <div className="transaction-section">
          <h4>Successful Deposits</h4>
          {user.credits.omsiapawasto.transactions.successful_deposits.length > 0 ? (
            user.credits.omsiapawasto.transactions.successful_deposits.map((tx, idx) => (
              <div key={idx} className="transaction-item">
                {JSON.stringify(tx)}
              </div>
            ))
          ) : (
            <div className="empty-state">No successful deposits</div>
          )}
        </div>
        
        <div className="transaction-section">
          <h4>Successful Withdrawals</h4>
          {user.credits.omsiapawasto.transactions.successful_withdrawals.length > 0 ? (
            user.credits.omsiapawasto.transactions.successful_withdrawals.map((tx, idx) => (
              <div key={idx} className="transaction-item">
                {JSON.stringify(tx)}
              </div>
            ))
          ) : (
            <div className="empty-state">No successful withdrawals</div>
          )}
        </div>
        
        <div className="transaction-section">
          <h4>Failed Deposits</h4>
          {user.credits.omsiapawasto.transactions.failed_deposits.length > 0 ? (
            user.credits.omsiapawasto.transactions.failed_deposits.map((tx, idx) => (
              <div key={idx} className="transaction-item">
                {JSON.stringify(tx)}
              </div>
            ))
          ) : (
            <div className="empty-state">No failed deposits</div>
          )}
        </div>
        
        <div className="transaction-section">
          <h4>Failed Withdrawals</h4>
          {user.credits.omsiapawasto.transactions.failed_withdrawals.length > 0 ? (
            user.credits.omsiapawasto.transactions.failed_withdrawals.map((tx, idx) => (
              <div key={idx} className="transaction-item">
                {JSON.stringify(tx)}
              </div>
            ))
          ) : (
            <div className="empty-state">No failed withdrawals</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-display">
      <div>
        <p onClick={()=> {
          setShowDatabaseConfiguration(false)
          setShowRegistrantDetailsDisplay(false)
        }}>x</p>
      </div>
      <header>
        <h1>User Profile</h1>
      </header>
      
      <main>
        {renderUserInfo()}
        {renderStatusInfo()}
        {renderPersonalInfo()}
        {renderContactInfo()}
        {renderCreditsInfo()}
      </main>
      
      <footer>
        <p>© MFATIP System</p>
      </footer>
    </div>
  );
};


export default DatabaseComponent;