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
  },
  quantity: {
    type: 'number',
    default: 0
  }
});

const merchandisetransactiondataschemestatusesschememessagesscheme = new Schema({
  message: {
    type: "string"
  }
})

const merchandisetransactiondataschemestatusesscheme = new Schema({
 date: {
  type: 'string'
 },
 type: {
  type: 'string'
 },
 indication: {
  type: 'string'
 },
 messages: [merchandisetransactiondataschemestatusesschememessagesscheme]
})

const merchandisetransactiondatascheme = new Schema({
id: {
type: 'string'
},
date: {
 type: String
},
intent: {
type: 'string'
},
statusesandlogs: {
status: {
type: 'string'
},
indication: {
type: 'string'
},
date: {
  type: 'string'
},
logs: [merchandisetransactiondataschemestatusesscheme]
},
details: {
merchandise: {
 list: [productDataSchema]
},
paymentmethod: {
type: 'string'
}
},
system: {
  thistransactionismadeby: {
    id: {
    type: 'string'
    },
    omsiapcitizenship: {
     type: 'string'
    },
    birthcertificatereferencenumber: {
     type: 'string'
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
    }
    },
    address: {
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
    postal_zip_code: {
      type: 'string'
    },
    country: {
      type: 'string'
    }
    }
  },
  thistransactionismainlyintendedto: {
    id: {
    type: 'string'
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
    }
    },
    address: {
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
      postal_zip_code: {
        type: 'string'
      },
      country: {
        type: 'string'
      }
    }
  },
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
}
});

const MerchandiseTransactionDataModel = mongoose.model('MerchandiseTransaction', merchandisetransactiondatascheme);

module.exports = MerchandiseTransactionDataModel;