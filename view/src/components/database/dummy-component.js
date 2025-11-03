// Sample Product Data
const sampleProducts = [
  {
    id: "PRD-2025-0001",
    name: "Premium Smartphone X12",
    price: 24999.99,
    category: "Electronics",
    description: "The latest Premium Smartphone X12 with 6.7-inch AMOLED display, 8GB RAM, 256GB storage, and 108MP quad camera system.",
    weightingrams: 189,
    images: [
      { url: "https://example.com/images/smartphone-x12-front.jpg" },
      { url: "https://example.com/images/smartphone-x12-back.jpg" },
      { url: "https://example.com/images/smartphone-x12-side.jpg" }
    ],
    stock: 75,
    rating: 4.8,
    reviews: 243,
    specifications: [
      { name: "Display: 6.7-inch AMOLED (2778 x 1284 pixels)" },
      { name: "Processor: OctaCore 2.5GHz" },
      { name: "RAM: 8GB LPDDR5" },
      { name: "Storage: 256GB UFS 3.1" },
      { name: "Battery: 5000mAh" }
    ],
    videoUrl: "https://example.com/videos/smartphone-x12-review.mp4",
    features: [
      { name: "Water and dust resistant (IP68)" },
      { name: "108MP quad camera system" },
      { name: "Face recognition and fingerprint sensor" },
      { name: "Fast charging (65W)" },
      { name: "Wireless charging support" }
    ],
    warranty: "1-year manufacturer warranty with option for extended coverage",
    quantity: 1,
    focuseddata: {
      price: {
        price: 24999.99,
        capital: 18750.00,
        transactiongiveaway: 750.00,
        omsiapprofit: 5499.99
      }
    },
    orderdetails: {
      quantity: 1,
      product: {
        price: 24999.99,
        capital: 18750.00,
        transactiongiveaway: 750.00,
        omsiapprofit: 5499.99
      },
      shipment: {
        totalkilos: 0.5,
        totalshipmentfee: 150.00
      }
    }
  },
  {
    id: "PRD-2025-0002",
    name: "Smart Home Security System",
    price: 12500.00,
    category: "Home Security",
    description: "Complete smart home security system with 4 HD cameras, motion sensors, smart doorbell, and 24/7 cloud recording capability.",
    weightingrams: 2500,
    images: [
      { url: "https://example.com/images/security-system-full.jpg" },
      { url: "https://example.com/images/security-system-camera.jpg" },
      { url: "https://example.com/images/security-system-doorbell.jpg" }
    ],
    stock: 35,
    rating: 4.7,
    reviews: 128,
    specifications: [
      { name: "4 HD Cameras (1080p)" },
      { name: "Smart Doorbell with Two-way Audio" },
      { name: "6 Motion Sensors" },
      { name: "Hub with Siren (110db)" },
      { name: "Battery Backup (12 hours)" }
    ],
    videoUrl: "https://example.com/videos/security-system-installation.mp4",
    features: [
      { name: "24/7 Cloud Recording (30-day history)" },
      { name: "Mobile App Control (iOS and Android)" },
      { name: "Voice Assistant Integration" },
      { name: "Tamper Detection" },
      { name: "Night Vision" }
    ],
    warranty: "2-year manufacturer warranty with professional installation option",
    quantity: 1,
    focuseddata: {
      price: {
        price: 12500.00,
        capital: 9000.00,
        transactiongiveaway: 500.00,
        omsiapprofit: 3000.00
      }
    },
    orderdetails: {
      quantity: 1,
      product: {
        price: 12500.00,
        capital: 9000.00,
        transactiongiveaway: 500.00,
        omsiapprofit: 3000.00
      },
      shipment: {
        totalkilos: 2.5,
        totalshipmentfee: 350.00
      }
    }
  },
  {
    id: "PRD-2025-0003",
    name: "Ultra HD Smart TV 65-inch",
    price: 45999.99,
    category: "Electronics",
    description: "65-inch Ultra HD Smart TV with QLED display, Dolby Vision, built-in voice assistant, and premium sound system.",
    weightingrams: 22000,
    images: [
      { url: "https://example.com/images/tv-front.jpg" },
      { url: "https://example.com/images/tv-angle.jpg" },
      { url: "https://example.com/images/tv-ports.jpg" }
    ],
    stock: 20,
    rating: 4.9,
    reviews: 86,
    specifications: [
      { name: "Display: 65-inch QLED 4K (3840 x 2160)" },
      { name: "Refresh Rate: 120Hz" },
      { name: "HDR: Dolby Vision, HDR10+" },
      { name: "Sound: 60W 2.1 Channel" },
      { name: "Connectivity: Wi-Fi 6, Bluetooth 5.0, HDMI 2.1 x4, USB 3.0 x3" }
    ],
    videoUrl: "https://example.com/videos/tv-review.mp4",
    features: [
      { name: "Built-in Voice Assistant" },
      { name: "AI-powered Upscaling" },
      { name: "Game Mode with VRR support" },
      { name: "Multi-View Feature" },
      { name: "Smart Home Integration" }
    ],
    warranty: "3-year manufacturer warranty with on-site service",
    quantity: 1,
    focuseddata: {
      price: {
        price: 45999.99,
        capital: 36000.00,
        transactiongiveaway: 1500.00,
        omsiapprofit: 8499.99
      }
    },
    orderdetails: {
      quantity: 1,
      product: {
        price: 45999.99,
        capital: 36000.00,
        transactiongiveaway: 1500.00,
        omsiapprofit: 8499.99
      },
      shipment: {
        totalkilos: 25.0,
        totalshipmentfee: 1200.00
      }
    }
  }
];

// Sample Transaction Data
const sampleTransactions = [
  {
    id: "TRX-2025-0001",
    date: "2025-03-15T09:30:45",
    type: "purchase",
    amount: 25149.99,
    status: "completed",
    paymentmethod: "Credit Card",
    details: {
      products: [
        {
          id: "PRD-2025-0001",
          name: "Premium Smartphone X12",
          price: 24999.99,
          category: "Electronics",
          description: "The latest Premium Smartphone X12 with 6.7-inch AMOLED display, 8GB RAM, 256GB storage, and 108MP quad camera system.",
          weightingrams: 189,
          images: [
            { url: "https://example.com/images/smartphone-x12-front.jpg" }
          ],
          stock: 74,
          rating: 4.8,
          reviews: 243,
          specifications: [
            { name: "Display: 6.7-inch AMOLED (2778 x 1284 pixels)" }
          ],
          videoUrl: "https://example.com/videos/smartphone-x12-review.mp4",
          features: [
            { name: "Water and dust resistant (IP68)" }
          ],
          warranty: "1-year manufacturer warranty with option for extended coverage",
          quantity: 1,
          focuseddata: {
            price: {
              price: 24999.99,
              capital: 18750.00,
              transactiongiveaway: 750.00,
              omsiapprofit: 5499.99
            }
          },
          orderdetails: {
            quantity: 1,
            product: {
              price: 24999.99,
              capital: 18750.00,
              transactiongiveaway: 750.00,
              omsiapprofit: 5499.99
            },
            shipment: {
              totalkilos: 0.5,
              totalshipmentfee: 150.00
            }
          }
        }
      ],
      shippingInfo: {
        street: "123 Rizal Street",
        trademark: "Near City Hall",
        baranggay: "San Antonio",
        city: "Makati",
        province: "Metro Manila",
        zipcode: "1200",
        country: "Philippines"
      },
      orderSummary: {
        merchandiseTotal: 24999.99,
        shippingTotal: 150.00,
        totalTransactionGiveaway: 750.00,
        totalOmsiaProfit: 5499.99,
        totalCapital: 18750.00,
        totalItems: 1,
        totalProducts: 1,
        totalWeightGrams: 189,
        totalWeightKilos: 0.189,
        total: 25149.99
      }
    }
  },
  {
    id: "TRX-2025-0002",
    date: "2025-03-16T14:22:33",
    type: "purchase",
    amount: 12850.00,
    status: "pending",
    paymentmethod: "Bank Transfer",
    details: {
      products: [
        {
          id: "PRD-2025-0002",
          name: "Smart Home Security System",
          price: 12500.00,
          category: "Home Security",
          description: "Complete smart home security system with 4 HD cameras, motion sensors, smart doorbell, and 24/7 cloud recording capability.",
          weightingrams: 2500,
          images: [
            { url: "https://example.com/images/security-system-full.jpg" }
          ],
          stock: 34,
          rating: 4.7,
          reviews: 128,
          specifications: [
            { name: "4 HD Cameras (1080p)" }
          ],
          videoUrl: "https://example.com/videos/security-system-installation.mp4",
          features: [
            { name: "24/7 Cloud Recording (30-day history)" }
          ],
          warranty: "2-year manufacturer warranty with professional installation option",
          quantity: 1,
          focuseddata: {
            price: {
              price: 12500.00,
              capital: 9000.00,
              transactiongiveaway: 500.00,
              omsiapprofit: 3000.00
            }
          },
          orderdetails: {
            quantity: 1,
            product: {
              price: 12500.00,
              capital: 9000.00,
              transactiongiveaway: 500.00,
              omsiapprofit: 3000.00
            },
            shipment: {
              totalkilos: 2.5,
              totalshipmentfee: 350.00
            }
          }
        }
      ],
      shippingInfo: {
        street: "456 Bonifacio Avenue",
        trademark: "Beside Central Park",
        baranggay: "Poblacion",
        city: "Quezon City",
        province: "Metro Manila",
        zipcode: "1100",
        country: "Philippines"
      },
      orderSummary: {
        merchandiseTotal: 12500.00,
        shippingTotal: 350.00,
        totalTransactionGiveaway: 500.00,
        totalOmsiaProfit: 3000.00,
        totalCapital: 9000.00,
        totalItems: 1,
        totalProducts: 1,
        totalWeightGrams: 2500,
        totalWeightKilos: 2.5,
        total: 12850.00
      }
    }
  },
  {
    id: "TRX-2025-0003",
    date: "2025-03-18T11:05:27",
    type: "purchase",
    amount: 47199.99,
    status: "accepted",
    paymentmethod: "GCash",
    details: {
      products: [
        {
          id: "PRD-2025-0003",
          name: "Ultra HD Smart TV 65-inch",
          price: 45999.99,
          category: "Electronics",
          description: "65-inch Ultra HD Smart TV with QLED display, Dolby Vision, built-in voice assistant, and premium sound system.",
          weightingrams: 22000,
          images: [
            { url: "https://example.com/images/tv-front.jpg" }
          ],
          stock: 19,
          rating: 4.9,
          reviews: 86,
          specifications: [
            { name: "Display: 65-inch QLED 4K (3840 x 2160)" }
          ],
          videoUrl: "https://example.com/videos/tv-review.mp4",
          features: [
            { name: "Built-in Voice Assistant" }
          ],
          warranty: "3-year manufacturer warranty with on-site service",
          quantity: 1,
          focuseddata: {
            price: {
              price: 45999.99,
              capital: 36000.00,
              transactiongiveaway: 1500.00,
              omsiapprofit: 8499.99
            }
          },
          orderdetails: {
            quantity: 1,
            product: {
              price: 45999.99,
              capital: 36000.00,
              transactiongiveaway: 1500.00,
              omsiapprofit: 8499.99
            },
            shipment: {
              totalkilos: 25.0,
              totalshipmentfee: 1200.00
            }
          }
        }
      ],
      shippingInfo: {
        street: "789 Mabini Street",
        trademark: "Near Central Mall",
        baranggay: "Santa Cruz",
        city: "Manila",
        province: "Metro Manila",
        zipcode: "1000",
        country: "Philippines"
      },
      orderSummary: {
        merchandiseTotal: 45999.99,
        shippingTotal: 1200.00,
        totalTransactionGiveaway: 1500.00,
        totalOmsiaProfit: 8499.99,
        totalCapital: 36000.00,
        totalItems: 1,
        totalProducts: 1,
        totalWeightGrams: 22000,
        totalWeightKilos: 22.0,
        total: 47199.99
      }
    }
  },
  {
    id: "TRX-2025-0004",
    date: "2025-03-20T16:47:12",
    type: "purchase",
    amount: 58999.98,
    status: "rejected",
    paymentmethod: "PayPal",
    details: {
      products: [
        {
          id: "PRD-2025-0001",
          name: "Premium Smartphone X12",
          price: 24999.99,
          category: "Electronics",
          description: "The latest Premium Smartphone X12 with 6.7-inch AMOLED display, 8GB RAM, 256GB storage, and 108MP quad camera system.",
          weightingrams: 189,
          images: [
            { url: "https://example.com/images/smartphone-x12-front.jpg" }
          ],
          stock: 75,
          rating: 4.8,
          reviews: 243,
          specifications: [
            { name: "Display: 6.7-inch AMOLED (2778 x 1284 pixels)" }
          ],
          videoUrl: "https://example.com/videos/smartphone-x12-review.mp4",
          features: [
            { name: "Water and dust resistant (IP68)" }
          ],
          warranty: "1-year manufacturer warranty with option for extended coverage",
          quantity: 1,
          focuseddata: {
            price: {
              price: 24999.99,
              capital: 18750.00,
              transactiongiveaway: 750.00,
              omsiapprofit: 5499.99
            }
          },
          orderdetails: {
            quantity: 1,
            product: {
              price: 24999.99,
              capital: 18750.00,
              transactiongiveaway: 750.00,
              omsiapprofit: 5499.99
            },
            shipment: {
              totalkilos: 0.5,
              totalshipmentfee: 150.00
            }
          }
        },
        {
          id: "PRD-2025-0003",
          name: "Ultra HD Smart TV 65-inch",
          price: 33999.99,
          category: "Electronics",
          description: "65-inch Ultra HD Smart TV with QLED display, Dolby Vision, built-in voice assistant, and premium sound system.",
          weightingrams: 22000,
          images: [
            { url: "https://example.com/images/tv-front.jpg" }
          ],
          stock: 20,
          rating: 4.9,
          reviews: 86,
          specifications: [
            { name: "Display: 65-inch QLED 4K (3840 x 2160)" }
          ],
          videoUrl: "https://example.com/videos/tv-review.mp4",
          features: [
            { name: "Built-in Voice Assistant" }
          ],
          warranty: "3-year manufacturer warranty with on-site service",
          quantity: 1,
          focuseddata: {
            price: {
              price: 33999.99,
              capital: 26000.00,
              transactiongiveaway: 1000.00,
              omsiapprofit: 6999.99
            }
          },
          orderdetails: {
            quantity: 1,
            product: {
              price: 33999.99,
              capital: 26000.00,
              transactiongiveaway: 1000.00,
              omsiapprofit: 6999.99
            },
            shipment: {
              totalkilos: 25.0,
              totalshipmentfee: 1200.00
            }
          }
        }
      ],
      shippingInfo: {
        street: "321 Aguinaldo Highway",
        trademark: "Across from Municipal Building",
        baranggay: "Bayan",
        city: "Cavite",
        province: "Cavite",
        zipcode: "4100",
        country: "Philippines"
      },
      orderSummary: {
        merchandiseTotal: 58999.98,
        shippingTotal: 1350.00,
        totalTransactionGiveaway: 1750.00,
        totalOmsiaProfit: 12499.98,
        totalCapital: 44750.00,
        totalItems: 2,
        totalProducts: 2,
        totalWeightGrams: 22189,
        totalWeightKilos: 22.189,
        total: 60349.98
      }
    }
  },
  {
    id: "TRX-2025-0005",
    date: "2025-03-21T10:15:33",
    type: "deposit",
    amount: 5000.00,
    status: "completed",
    paymentmethod: "Bank Transfer",
    details: {
      products: [],
      shippingInfo: {
        street: "",
        trademark: "",
        baranggay: "",
        city: "",
        province: "",
        zipcode: "",
        country: ""
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
        total: 5000.00
      }
    }
  },
  {
    id: "TRX-2025-0006",
    date: "2025-03-22T14:30:55",
    type: "withdrawal",
    amount: 3500.00,
    status: "pending",
    paymentmethod: "Bank Transfer",
    details: {
      products: [],
      shippingInfo: {
        street: "",
        trademark: "",
        baranggay: "",
        city: "",
        province: "",
        zipcode: "",
        country: ""
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
        total: 3500.00
      }
    }
  }
];

const transactionproductspecificationscheme = new Schema({
  authentications: {
    producttype: {
      type: 'string'
    },
    productid: {
      type: 'string'
    },
  },
  productname: {
    type: 'string'
  },
  rapportname: {
    type: 'string'
  },
  definition: {
    type: 'string'
  },
  details: {
   product: {
    name: {
      type: 'string'
    },
    rapportname: {
      type: 'string'
    },
    definition: {
      type: 'string'
    },
    category: {
      type: 'string'
    },
    specification: {
      for: {
      part: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      category:{
        type: 'string'
      }
      },
      set: {
      set: {
        type: 'boolean',
        default: false
      },
      productindication: {
        type: 'string'
      },
      pcs: {
        type: 'number',
        default: 0
      }
      },
      size:  {
        type: 'boolean',
        default: 0
      },
      color:  {
        type: 'boolean',
        default: 0
      },
      weight:  {
        type: 'number',
        default: 0
      },
      top: {
        type: 'string'
      },
      left: {
        type: 'string'
      },
      bottom: {
        type: 'string'
      },
      right: {
        type: 'string'
      },
      front: {
        type: 'string'
      },
      back: {
        type: 'string'
      }
    },
    pricesbreakdown: {
      price: {
        type: 'number',
        default: 0
      },
      capital:{
        type: 'number',
        default: 0
      },
      suggested_retail_price: {
        type: 'number',
        default: 0
      },
      vat: {
        type: 'number',
        default: 0
      }
    },
    cybervisual: {
      images: {
        maindisplayimage: {
          type: 'string'
        },
        maindisplayimages: [productimagescheme]
      },
      videos: [productvideoscheme]
    }
   },
   locations: {
    operations: [productlocationscheme]
   }
  },
  system: {
   request: {
    pcs: {
      type: 'number',
      default: 0
    },
    orderspecification: {
      type: 'string'
    },
    merchandise: {
      price: {
        type: 'number',
        default: 0
      },
      capital: {
        type: 'number',
        default: 0
      },
      suggested_retail_price: {
        type: 'number',
        default: 0
      },
      vat: {
        type: 'number',
        default: 0
      },
    },
    shipping: {
      category: {
        type: 'string',
      },
      weight: {
        type: 'string'
      },
      fee: {
        type: 'number',
        default: 0
      }
    },
    totalpayment: {
      price:{
        type: 'number',
        default: 0
      }
    },
    products: []
   },
   stocks: [],
   purchase: {
    people: [],
    xirbit: []
   }
  }
});

const productscheme = new Schema({
  productname: {
    type: "string"
  },
  rapportname: {
    type: 'string'
  },
  definition: {
    type: "string"
  },
  authentications: {
    producttype: {
    type: "string"
  },
    productid: {
    type: "string"
  },
  },
  specification: {
   for: {
    part: {
     type: 'string'
    },
    gender: {
     type: 'string'
   },
   category: {
    type: 'string'
   }
  },
  specifications: [transactionproductspecificationscheme]
  });

 const user = new Schema({
  authentications: {
   authenticationtype: {
     type: 'string'
   },
   authenticationid: {
     type: 'string'
   },
   privateauthenticationkey: [privateauthenticationkey],
   password: {
     set: {
       type: 'boolean',
       default: false
     },
     password: {
      type: 'string'
     }
   }
  },
  details: {
    surials: {
     firstname: {
      type: 'string'
     },
     middlename: {
      type: 'string'
     },
     lastname: {
      type: 'string'
     },
     nickname: {
      type: 'string'
     }
    },
    location: {
     address: {
       street: {
       type: 'string'
       },
       baranggay: {
       type: 'string'
       },
       trademark: {
       type: 'string'
       },
       city: {
       type: 'string'
       },
       province: {
       type: 'string'
       },
       country: {
       type: 'string'
       },
       coordinates: {
         lat: {
           type: 'number',
           default: 0,
         },
         lon: {
           type: 'number',
           default: 0,
         }
        }
     },
     shipment: {
       type: {
         type: 'string'
       },
       address: {
        street: {
          type: 'string'
        },
        baranggay: {
         type: 'string'
        },
        trademark: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        province: {
          type: 'string'
        },
       country: {
         type: 'string'
       },
       coordinates: {
         lat: {
           type: 'number',
           default: 0,
         },
         lon: {
           type: 'number',
           default: 0,
         }
        }
       }
     }
    },
    contact: [contactscheme]
  },
  moneyandfunds: {
   money: {
     amount: {
      type: 'number',
      default: 0
     },
     history: [transactionscheme]
   },
   funds: {
     amount: {
      type: 'number',
      default: 0
     },
     history: [transactionscheme]
   }
  },
  transactions: [transactionscheme],
  purchases: {
   current: [transactionscheme],
   last15days: [transactionscheme],
   history: [transactionscheme]
  },
  upgradedregistrations: [upgradedregistrations] 
 })
 

 reference: {
  referencenumber: {
    type: 'string'
  },
  transactionimage: {
    type: 'string'
  }
},
statuses: [statuses]

const currencyExchangeTransactionSchema = new Schema({
  id: {
    type: 'string',
    required: true
  },
  intent: {
    type: 'string',
    required: true
  },
  statusAndLogs: {
    status: {
      type: 'string',
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    indication: {
      type: 'string'
    },
    logs: [{ type: Schema.Types.ObjectId, ref: 'ProductTransactionStatusLog' }]
  },
  details: {
    paymentMethod: {
      type: 'string',
      required: true
    },
    sender: {
      id: {
        type: 'string',
        required: true
      },
      name: {
        firstName: {
          type: 'string',
          required: true
        },
        middleName: {
          type: 'string'
        },
        lastName: {
          type: 'string',
          required: true
        },
        nickname: {
          type: 'string'
        }
      },
      contact: {
        phoneNumber: {
          type: 'string',
          required: true
        },
        emailAddress: {
          type: 'string',
          required: true
        },
        address: {
          street: {
            type: 'string',
            required: true
          },
          landmark: {
            type: 'string'
          },
          barangay: {
            type: 'string',
            required: true
          },
          city: {
            type: 'string',
            required: true
          },
          province: {
            type: 'string',
            required: true
          },
          postalCode: {
            type: 'string',
            required: true
          },
          country: {
            type: 'string',
            required: true
          }
        }
      }
    },
    recipient: {
      id: {
        type: 'string',
        required: true
      },
      name: {
        firstName: {
          type: 'string',
          required: true
        },
        middleName: {
          type: 'string'
        },
        lastName: {
          type: 'string',
          required: true
        },
        nickname: {
          type: 'string'
        }
      },
      contact: {
        phoneNumber: {
          type: 'string',
          required: true
        },
        emailAddress: {
          type: 'string',
          required: true
        },
        address: {
          street: {
            type: 'string',
            required: true
          },
          landmark: {
            type: 'string'
          },
          barangay: {
            type: 'string',
            required: true
          },
          city: {
            type: 'string',
            required: true
          },
          province: {
            type: 'string',
            required: true
          },
          postalCode: {
            type: 'string',
            required: true
          },
          country: {
            type: 'string',
            required: true
          }
        }
      }
    }
  },
  amounts: {
    sourceAmount: {
      type: 'number',
      required: true,
      default: 0
    },
    targetAmount: {
      type: 'number',
      required: true,
      default: 0
    },
    phpEquivalent: {
      type: 'number',
      default: 0
    },
    deductions: {
      processingFee: {
        type: 'number',
        default: 0
      }
    },
    profit: {
      type: 'number',
      default: 0
    },
    recipientAmount: {
      type: 'number',
      default: 0
    }
  },
  timestamps: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  }
});