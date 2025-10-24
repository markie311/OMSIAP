const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const merchandisetransactiondatascheme = require('../transactions/merchandisetransactiondatascheme.js')

const productImageDataSchema = new Schema({
  url: { type: String }
});

const productVideoDataSchema = new Schema({
  url: { type: String }
});

const productFeaturesDataSchema = new Schema({
  data: { type: String }
});

const productSpecificationDataSchema = new Schema({
  authentications: {
    producttype: {
     type: String
    },
    id: {
     type: String
    }
  },
  details: {
   productname: {
     type: String
   },
   category: {
     type: String
   },
   description: {
     type: String
   },
   features: [productFeaturesDataSchema],
   webaddress: {
     type: 'string'
   },
   weightingrams: {
     type: Number,
     default: 0
   },
   warranty: {
     type: String
   },
   for: {
    age: {
      type: String
    },
    part: {
      type: String
    },
    gender: {
      type: String
    },
    reminder: {
      type: String
    }
   },
   price: {
     amount: {
       type: Number,
       default: 0
     },
     capital: {
       type: Number,
       default: 0
     },
     shipping: {
       type: Number,
       default: 0
     },
     transactiongiveaway: {
       type: Number,
       default: 0
     },
     profit: {
       type: Number,
       default: 0
     }
   },
   specifications: []
  },
  images: [productImageDataSchema],
  videos: [productVideoDataSchema],
  customerfeedback: {
   rating: {
     type: Number,
     default: 0
   },
   reviews: {
     type: Number,
     default: 0,
   }
  },
  system: {
   stocks: {
    type: Number,
    default: 0
   }
  }
});


const purchaseSchema = new mongoose.Schema({
  merchandisetransactionid: {
    type: 'string'
  },
  identification: {
    birthcertificatereferencenumber: {
      type: String,
      default: ""
    },
    name: {
     firstname: {
       type: String,
       default: ""
     },
     middlename: {
       type: String,
       default: ""
     },
     lastname: {
       type: String,
       default: ""
     },
     nickname: {
       type: String,
       default: ""
     }
    }
  },
  location: {
    street: {
      type: String,
      default: ""
    },
    trademark: {
      type: String,
      default: ""
    },
    baranggay: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    province: {
      type: String,
      default: ""
    },
    postal_zip_code: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: ""
    }
  },
  date: {
    month: {
      type: String,
      default: ""
    },
    year: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    day: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    }
  },
  specification: [productSpecificationDataSchema],
  ordersummary: {
    merchandisetotal: {
    type: 'number',
    default: 0
    },
    shippingtotal:{
    type: 'number',
    default: 0
    },
    processingfee: {
     type: Number,
     default: 0
    },
    totalcapital: {
    type: 'number',
    default: 0
    },
    totaltransactiongiveaway: {
    type: 'number',
    default: 0
    },
    totalprofit: {
    type: 'number',
    default: 0
    },
    totalitems: {
    type: 'number',
    default: 0
    },
    totalweightgrams: {
    type: 'number',
    default: 0
    },
    totalweightkilos: {
    type: 'number',
    default: 0
    }
  },
  shippinginfo: {
    street: {
    type: 'string'
    },
    trademark: {
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
    zipcode: {
    type: 'string'
    },
    country: {
    type: 'string'
    } 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const productDataSchema = new Schema({
 authentications: {
   producttype: {
    type: String
   },
   id: {
    type: String
   }
 },
 details: {
  productname: {
    type: String
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  features: [productFeaturesDataSchema],
  weightingrams: {
    type: Number,
    default: 0
  },
  webaddress: {
    type: 'string'
  },
  warranty: {
    type: String
  },
  price: {
    amount: {
      type: Number,
      default: 0
    },
    capital: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    transactiongiveaway: {
      type: Number,
      default: 0
    },
    profit: {
      type: Number,
      default: 0
    }
  },
  specifications: [productSpecificationDataSchema]
 },
 images: [productImageDataSchema],
 videos: [productVideoDataSchema],
 customerfeedback: {
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0,
  }
 },
 system: {
  purchases: {
    total: [purchaseSchema],
    pending: [purchaseSchema],
    accepted: [purchaseSchema],
    rejected: [purchaseSchema]
  }
 }
});

// Option 1: Export just the schema if you're creating the model elsewhere
// module.exports = productDataSchema;

// Option 2: Create and export the model directly
const ProductDataModel = mongoose.model('Product', productDataSchema);
module.exports = ProductDataModel;
