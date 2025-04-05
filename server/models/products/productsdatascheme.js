const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productimagedatascheme = new Schema({
  url: { type: "string" }
});

const productvideodatascheme = new Schema({
  url: { type: "string" }
});

const productfeaturesdatascheme = new Schema({
  data: { type: "string" }
});

const productspecificationdatascheme = new Schema({
  authentications: {
    producttype: {
     type: 'string'
    },
    id: {
     type: 'string'
    }
  },
  details: {
   productname: {
     type: 'string'
   },
   category: {
     type: 'string'
   },
   description: {
     type: 'string'
   },
   features: [productfeaturesdatascheme],
   weightingrams: {
     type: 'number',
     default: 0
   },
   warranty: {
     type: 'string'
   },
   for: {
    age: {
      type: 'string'
    },
    part: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    reminder: {
      type: 'string'
    }
   },
   price: {
     amount: {
       type: 'number',
       default: 0
     },
     capital: {
       type: 'number',
       default: 0
     },
     transactiongiveaway: {
       type: 'number',
       default: 0
     },
     profit: {
       type: 'number',
       default: 0
     }
   },
   specifications: []
  },
  images: [productimagedatascheme],
  videos: [productvideodatascheme],
  customerfeedback: {
   rating: {
     type: 'number',
     default: 0
   },
   reviews: {
     type: 'number',
     default: 0,
   }
  },
  system: {
   stocks: []
  }
});

const productdatascheme = new Schema({
 authentications: {
   producttype: {
    type: 'string'
   },
   id: {
    type: 'string'
   }
 },
 details: {
  productname: {
    type: 'string'
  },
  category: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  features: [productfeaturesdatascheme],
  weightingrams: {
    type: 'number',
    default: 0
  },
  warranty: {
    type: 'string'
  },
  price: {
    amount: {
      type: 'number',
      default: 0
    },
    capital: {
      type: 'number',
      default: 0
    },
    transactiongiveaway: {
      type: 'number',
      default: 0
    },
    profit: {
      type: 'number',
      default: 0
    }
  },
  specifications: [productspecificationdatascheme]
 },
 images: [productimagedatascheme],
 videos: [productvideodatascheme],
 customerfeedback: {
  rating: {
    type: 'number',
    default: 0
  },
  reviews: {
    type: 'number',
    default: 0,
  }
 },
 system: {
  purchases: {
    total: [],
    pending: [],
    accepted: [],
    rejected: []
  }
 }
})

module.exports = productdatascheme;