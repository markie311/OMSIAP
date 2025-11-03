const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currencyexchangetransactiondataschemestatusesschememessagesscheme = new Schema({
message: {
type: "string"
}
}) 
  
const currencyexchangetransactiondataschemestatusesscheme = new Schema({
date: {
type: 'string'
},
type: {
type: 'string'
},
indication: {
type: 'string'
},
messages: [currencyexchangetransactiondataschemestatusesschememessagesscheme]
})

const currencyexchangetransactiondatascheme = new Schema({
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
logs: [currencyexchangetransactiondataschemestatusesscheme]
},
details: {
paymentmethod: {
type: 'string'
},
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
},
nickname: {
 type: 'string'
}
},
contact: {
phonenumber: {
 type: 'string'
},
emailaddress: {
 type: 'string'
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
},
nickname: {
 type: 'string'
}
},
contact: {
phonenumber: {
type: 'string'
},
emailaddress: {
type: 'string'
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
}
},
amounts: {
 intent: {
  type: 'number',
  default: 0
 },
 phppurchaseorexchangeamount: {
  type: 'number',
  default: 0
 },
 deductions: {
  successfulprocessing: {
    amount: {
     type: 'number',
     default: 0
    },
    reasons: {
      type: 'string'
    }
  },
  rejectionprocessing: {
    amount: {
     type: 'number',
     default: 0
    },
    reasons: {
     type: 'string'
    }
  }
 },
 profit: {
  type: 'number',
  default: 0
 },
 omsiapawasamounttorecieve: {
  type: 'number',
  default: 0
 }
},
referrence: {
 number: {
  type: 'string'
 },
 gcashtransactionrecieptimage: {
  type: 'string'
 }
}
}
});

const CurrencyExhangeTransactionDataModel = mongoose.model("CurrencyExchange", currencyexchangetransactiondatascheme)

module.exports = CurrencyExhangeTransactionDataModel;