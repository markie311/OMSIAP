const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productdatascheme = require('../products/productsdatascheme.js');

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
logs: [merchandisetransactiondataschemestatusesscheme]
},
details: {
merchandise: {
thistransactionismadeby: {
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
list: [productdatascheme],
ordersummary: {
merchandisetotal: {
type: 'number',
default: 0
},
shippingtotal:{
type: 'number',
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
},
paymentmethod: {
type: 'string'
}
}
});

module.exports = merchandisetransactiondatascheme;