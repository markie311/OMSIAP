const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrantstatusrequests = new Schema({
 purpose: {
    type: 'string'
 },
 message: {
    type: 'string'
 },
 status: {
    type: 'string'
 },
 date: {
    type: string
 }
})

const transactiondatascheme = new Schema({
 id: {
   type: 'string'
 },
 date: {
   type: 'string'
 },
 type: {
    type: 'string'
 },
 amount: {
   type: 'number',
   default: 0
 },
 status: [transactionrequestsstatusdatascheme]
 products: [productdatascheme]   
})

const transactionrequestsstatusdatascheme = new Schema({
  type: {
    type: 'string'
  },
  status: {
    type: 'string'
  },
  date: {
   type: 'string'
  },
  message: {
    type: 'string'
  },
  indication: {
    type: 'string'
  }
})  

const productdatascheme = new Schema(
 {
  id: {
    type: 'string'
  },
  name: {
    type: 'string'
  },
  price: {
    type: 'number',
    default: 0
  },
  category: {
   type: 'string'
  },
  description: {
    type: 'string'
  },
  images: [],
  stock: {
    type: 'number',
    default: 0
  },
  rating: {
    type: 'number',
    default: 0
  },
  reviews: {
    type: 'number',
    default: 0
  },
  specifications: [],
  videoUrl: {
    type: 'string'
  }, // Placeholder for video URL
  features: [],
  warranty: {
    type: 'string'
  }
 }
)

const registrantdatascheme = new Schema({
  id: {
    type: 'string'
  },
  loginstatus: {
    type: 'string'
  },
  status: {
   indication: {
    type: 'string'
   },
   requests: [registrantstatusrequests]
  },
  name: {
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
  contact: {
    phonenumber: {
     type: 'string'
    },
    telephonenumber: {
     type: 'string'
    },
    emailaddress: {
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
     }
    }
  },
  personaldata: {
    age: {
      type: 'number',
      default: 0
    },
    sex: {
     type: 'string'
    },
    bloodtype: {
     type: 'string'
    },
    dob: {
      type: 'string'
    },
    citizenship: {
      type: 'string'
    },
    civil_status: {
        type: 'string'
    },
    government_issued_identification: {
      type: 'string'
    } 
  },
  credits: {
    omsiapawasto: {
     id: {
        type: 'string'
     },
     amount: {
      type: 'number',
      default: 0
     },
     transactions: {
       deposits: [transactiondatascheme],
       widthdrawals: [transactiondatascheme],
       successful_deposits: [transactiondatascheme],
       successful_widthdrawals: [transactiondatascheme]
      }
        }
   },
   order: {
    name: {
     firstname: {
       type: 'string'
     },
     middlename: {
        type: 'string'
     },
     lastname: {
       type: 'string'
     }
    },
    shippingdetails: {
     street: {
      type: 'string'
     },
     baranggay: {
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
     postal_zipcode: {
      type: 'string'
     }
    },
    paymentdetails: {
     merchandise_total: {
       type: 'number',
       defailt: 0
     },
     merchandise_total_weight: {
       type: 'number',
       default: 0
     },
     merchandise_count: {
       type: 'number',
       default: 0
     },
     total_payment: {
      type: 'string',
      default: 0
     },
     totalshipment: {
      type: 'string',
      default: 0
     },
    },
    products: [productdatascheme]
    }
});

module.exports = registrantdatascheme;