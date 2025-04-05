const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const producttransactiondatascheme = require('../transactions/merchandisetransactiondatascheme.js')
const currencyexchangetransactiondatascheme = require('../transactions/currencyexchangetransactiondatascheme.js')

const registrantstatusrequestsmessagesscheme = new Schema({
  message: {
    type: 'string'
  }
})

const registrantstatusrequestsscheme = new Schema({
  date: {
    type: 'string'
  },
  type: {
    type: 'string'
  },
  indication: {
    type: 'string'
  },
  messages: [registrantstatusrequestsmessagesscheme]
})

const registrantdatascheme = new Schema({
 id: {
  type: 'string'
 },
 registrationstatusesandlogs: {
  type: {
   type: "string"
  },
  indication: {
   type: 'string'
  },
  deviceloginstatus: {
    type: 'string'
  },
  registrationlog: [registrantstatusrequestsscheme]
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
  type: 'string',
 },
 sex: {
  type: 'string'
 },
 bloodtype: {
  type: 'string'
 },
 height: {
  type: 'string'
 },
 weight: {
 type: 'string'
 },
 deviceprofilepicture: {
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
  frontphoto: {
   name: {
    type: 'string'
   },
   description: {
    type: 'string'
   },
   image: {
    type: 'string'
   },
   uploaddate: {
    type: 'string'
   }
  },
  backphoto: {
    name: {
      type: 'string'
     },
     description: {
      type: 'string'
     },
     image: {
      type: 'string'
     },
     uploaddate: {
      type: 'string'
     }
  }
 },
 birthcertificate: {
  frontphoto: {
    name: {
     type: 'string'
    },
    description: {
     type: 'string'
    },
    image: {
      type: 'string'
    },
    uploaddate: {
     type: 'string'
    }
   },
   backphoto: {
     name: {
       type: 'string'
      },
      description: {
       type: 'string'
      },
      image: {
        type: 'string'
      },
      uploaddate: {
       type: 'string'
      }
   }
 }
 },
 passwords: {
  account: {
    password: {
      type: 'string'
    }
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
    currencyexchange: {
      total: [currencyexchangetransactiondatascheme],
      pending: [currencyexchangetransactiondatascheme],
      successful: [currencyexchangetransactiondatascheme],
      rejected: [currencyexchangetransactiondatascheme]
    },
    widthdrawals: {
      total: [],
      pending: [],
      successful: [],
      rejected: []
    },
    omsiapawastransfer: []
  }
}
 },
 transactions: {
   merchandise: {
     total: [],
     pending: [],
     accepted: [],
     rejected: []
   },
}
});

module.exports = registrantdatascheme;