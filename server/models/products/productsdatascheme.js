const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    total: [],
    pending: [],
    accepted: [],
    rejected: []
  }
 }
});

// Option 1: Export just the schema if you're creating the model elsewhere
// module.exports = productDataSchema;

// Option 2: Create and export the model directly
const ProductDataModel = mongoose.model('Product', productDataSchema);
module.exports = ProductDataModel;