const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productImageDataSchema = new Schema({
  url: { type: String },
})

const productVideoDataSchema = new Schema({
  url: { type: String },
})

const productFeaturesDataSchema = new Schema({
  data: { type: String },
})

const productSpecificationDataSchema = new Schema({
  authentications: {
    producttype: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  details: {
    productname: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    features: [productFeaturesDataSchema],
    weightingrams: {
      type: Number,
      default: 0,
    },
    warranty: {
      type: String,
    },
    for: {
      age: {
        type: String,
      },
      part: {
        type: String,
      },
      gender: {
        type: String,
      },
      reminder: {
        type: String,
      },
    },
    price: {
      amount: {
        type: Number,
        default: 0,
      },
      capital: {
        type: Number,
        default: 0,
      },
      transactiongiveaway: {
        type: Number,
        default: 0,
      },
      profit: {
        type: Number,
        default: 0,
      },
    },
    specifications: [],
  },
  images: [productImageDataSchema],
  videos: [productVideoDataSchema],
  customerfeedback: {
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  system: {
    stocks: {
      type: Number,
      default: 0,
    },
  },
})

const productDataSchema = new Schema({
  authentications: {
    producttype: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  details: {
    productname: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    features: [productFeaturesDataSchema],
    weightingrams: {
      type: Number,
      default: 0,
    },
    warranty: {
      type: String,
    },
    price: {
      amount: {
        type: Number,
        default: 0,
      },
      capital: {
        type: Number,
        default: 0,
      },
      transactiongiveaway: {
        type: Number,
        default: 0,
      },
      profit: {
        type: Number,
        default: 0,
      },
    },
    specifications: [productSpecificationDataSchema],
  },
  images: [productImageDataSchema],
  videos: [productVideoDataSchema],
  customerfeedback: {
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  system: {
    purchases: {
      total: [],
      pending: [],
      accepted: [],
      rejected: [],
    },
  },
  quantity: {
    type: "number",
    default: 0,
  },
})

const merchandisetransactiondataschemestatusesschememessagesscheme = new Schema({
  message: {
    type: "string",
  },
})

const merchandisetransactiondataschemestatusesscheme = new Schema({
  date: {
    type: "string",
  },
  type: {
    type: "string",
  },
  indication: {
    type: "string",
  },
  messages: [merchandisetransactiondataschemestatusesschememessagesscheme],
})

const merchandisetransactiondatascheme = new Schema({
  id: {
    type: "string",
  },
  _id: {
    type: "string",
  },
  date: {
    type: String,
  },
  intent: {
    type: "string",
  },
  statusesandlogs: {
    status: {
      type: "string",
    },
    indication: {
      type: "string",
    },
    date: {
      type: "string",
    },
    logs: [merchandisetransactiondataschemestatusesscheme],
  },
  details: {
    merchandise: {
      list: [productDataSchema],
    },
    paymentmethod: {
      type: "string",
    },
  },
  system: {
    thistransactionismadeby: {
      id: {
        type: "string",
      },
      name: {
        firstname: {
          type: "string",
        },
        middlename: {
          type: "string",
        },
        lastname: {
          type: "string",
        },
      },
      address: {
        street: {
          type: "string",
        },
        trademark: {
          type: "string",
        },
        baranggay: {
          type: "string",
        },
        city: {
          type: "string",
        },
        province: {
          type: "string",
        },
        postal_zip_code: {
          type: "string",
        },
        country: {
          type: "string",
        },
      },
    },
    thistransactionismainlyintendedto: {
      id: {
        type: "string",
      },
      name: {
        firstname: {
          type: "string",
        },
        middlename: {
          type: "string",
        },
        lastname: {
          type: "string",
        },
      },
      address: {
        street: {
          type: "string",
        },
        trademark: {
          type: "string",
        },
        baranggay: {
          type: "string",
        },
        city: {
          type: "string",
        },
        province: {
          type: "string",
        },
        postal_zip_code: {
          type: "string",
        },
        country: {
          type: "string",
        },
      },
    },
    ordersummary: {
      merchandisetotal: {
        type: "number",
        default: 0,
      },
      shippingtotal: {
        type: "number",
        default: 0,
      },
      processingfee: {
        type: Number,
        default: 0,
      },
      totalcapital: {
        type: "number",
        default: 0,
      },
      totaltransactiongiveaway: {
        type: "number",
        default: 0,
      },
      totalprofit: {
        type: "number",
        default: 0,
      },
      totalitems: {
        type: "number",
        default: 0,
      },
      totalweightgrams: {
        type: "number",
        default: 0,
      },
      totalweightkilos: {
        type: "number",
        default: 0,
      },
    },
    shippinginfo: {
      street: {
        type: "string",
      },
      trademark: {
        type: "string",
      },
      baranggay: {
        type: "string",
      },
      city: {
        type: "string",
      },
      province: {
        type: "string",
      },
      zipcode: {
        type: "string",
      },
      country: {
        type: "string",
      },
    },
  },
})

const currencyexchangetransactiondataschemestatusesschememessagesscheme = new Schema({
  message: {
    type: "string",
  },
})

const currencyexchangetransactiondataschemestatusesscheme = new Schema({
  date: {
    type: "string",
  },
  type: {
    type: "string",
  },
  indication: {
    type: "string",
  },
  messages: [currencyexchangetransactiondataschemestatusesschememessagesscheme],
})

const currencyexchangetransactiondatascheme = new Schema({
  id: {
    type: "string",
  },
  intent: {
    type: "string",
  },
  statusesandlogs: {
    status: {
      type: "string",
    },
    indication: {
      type: "string",
    },
    logs: [currencyexchangetransactiondataschemestatusesscheme],
  },
  details: {
    paymentmethod: {
      type: "string",
    },
    thistransactionismadeby: {
      id: {
        type: "string",
      },
      name: {
        firstname: {
          type: "string",
        },
        middlename: {
          type: "string",
        },
        lastname: {
          type: "string",
        },
        nickname: {
          type: "string",
        },
      },
      contact: {
        phonenumber: {
          type: "string",
        },
        emailaddress: {
          type: "string",
        },
        address: {
          street: {
            type: "string",
          },
          trademark: {
            type: "string",
          },
          baranggay: {
            type: "string",
          },
          city: {
            type: "string",
          },
          province: {
            type: "string",
          },
          postal_zip_code: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
      },
    },
    thistransactionismainlyintendedto: {
      id: {
        type: "string",
      },
      name: {
        firstname: {
          type: "string",
        },
        middlename: {
          type: "string",
        },
        lastname: {
          type: "string",
        },
        nickname: {
          type: "string",
        },
      },
      contact: {
        phonenumber: {
          type: "string",
        },
        emailaddress: {
          type: "string",
        },
        address: {
          street: {
            type: "string",
          },
          trademark: {
            type: "string",
          },
          baranggay: {
            type: "string",
          },
          city: {
            type: "string",
          },
          province: {
            type: "string",
          },
          postal_zip_code: {
            type: "string",
          },
        },
      },
    },
    amounts: {
      intent: {
        type: "number",
        default: 0,
      },
      phppurchaseorexchangeamount: {
        type: "number",
        default: 0,
      },
      deductions: {
        successfulprocessing: {
          amount: {
            type: "number",
            default: 0,
          },
          reasons: {
            type: "string",
          },
        },
        rejectionprocessing: {
          amount: {
            type: "number",
            default: 0,
          },
          reasons: {
            type: "string",
          },
        },
      },
      profit: {
        type: "number",
        default: 0,
      },
      omsiapawasamounttorecieve: {
        type: "number",
        default: 0,
      },
    },
    referrence: {
      number: {
        type: "string",
      },
      gcashtransactionrecieptimage: {
        type: "string",
      },
    },
  },
})

const withdrawaltransactiondataschemestatusesschememessagesscheme = new Schema({
  message: {
    type: "string",
  },
})

const withdrawaltransactiondataschemestatusesscheme = new Schema({
  date: {
    type: "string",
  },
  type: {
    type: "string",
  },
  indication: {
    type: "string",
  },
  messages: [withdrawaltransactiondataschemestatusesschememessagesscheme],
})

const withdrawaltransactiondatascheme = new Schema({
  id: {
    type: "string",
  },
  intent: {
    type: "string",
  },
  statusesandlogs: {
    status: {
      type: "string",
    },
    indication: {
      type: "string",
    },
    logs: [withdrawaltransactiondataschemestatusesscheme],
  },
  details: {
    paymentmethod: {
      type: "string",
    },
    thistransactionismadeby: {
      id: {
        type: "string",
      },
      name: {
        firstname: {
          type: "string",
        },
        middlename: {
          type: "string",
        },
        lastname: {
          type: "string",
        },
        nickname: {
          type: "string",
        },
      },
      contact: {
        phonenumber: {
          type: "string",
        },
        emailaddress: {
          type: "string",
        },
        address: {
          street: {
            type: "string",
          },
          trademark: {
            type: "string",
          },
          baranggay: {
            type: "string",
          },
          city: {
            type: "string",
          },
          province: {
            type: "string",
          },
          postal_zip_code: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
      },
    },
    thistransactionismainlyintendedto: {
      id: {
        type: "string",
      },
      name: {
        firstname: {
          type: "string",
        },
        middlename: {
          type: "string",
        },
        lastname: {
          type: "string",
        },
        nickname: {
          type: "string",
        },
      },
      contact: {
        phonenumber: {
          type: "string",
        },
        emailaddress: {
          type: "string",
        },
        address: {
          street: {
            type: "string",
          },
          trademark: {
            type: "string",
          },
          baranggay: {
            type: "string",
          },
          city: {
            type: "string",
          },
          province: {
            type: "string",
          },
          postal_zip_code: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
      },
    },
    amounts: {
      intent: {
        type: "number",
        default: 0,
      },
      deductions: {
        successfulprocessing: {
          amount: {
            type: "number",
            default: 0,
          },
          reasons: {
            type: "string",
          },
        },
        rejectionprocessing: {
          amount: {
            type: "number",
            default: 0,
          },
          reasons: {
            type: "string",
          },
        },
      },
      profit: {
        type: "number",
        default: 0,
      },
      phpamounttorecieve: {
        type: "number",
        default: 0,
      },
    },
    referrence: {
      number: {
        type: "string",
      },
      gcashtransactionrecieptimage: {
        type: "string",
      },
    },
  },
})

const registrantstatusrequestsmessagesscheme = new Schema({
  message: {
    type: "string",
  },
})

const registrantstatusrequestsscheme = new Schema({
  date: {
    type: "string",
  },
  type: {
    type: "string",
  },
  indication: {
    type: "string",
  },
  messages: [registrantstatusrequestsmessagesscheme],
})

const registrantdatascheme = new Schema({
  id: {
    type: "string",
  },
  registrationstatusesandlogs: {
    type: {
      type: "string",
    },
    indication: {
      type: "string",
    },
    deviceloginstatus: {
      type: "string",
    },
    registrationlog: [registrantstatusrequestsscheme],
  },
  name: {
    firstname: {
      type: "string",
    },
    middlename: {
      type: "string",
    },
    lastname: {
      type: "string",
    },
    nickname: {
      type: "string",
    },
  },
  contact: {
    phonenumber: {
      type: "string",
    },
    telephonenumber: {
      type: "string",
    },
    emailaddress: {
      type: "string",
    },
    address: {
      street: {
        type: "string",
      },
      baranggay: {
        type: "string",
      },
      trademark: {
        type: "string",
      },
      city: {
        type: "string",
      },
      province: {
        type: "string",
      },
      country: {
        type: "string",
      },
    },
  },
  personaldata: {
    age: {
      type: "string",
    },
    sex: {
      type: "string",
    },
    bloodtype: {
      type: "string",
    },
    height: {
      type: "string",
    },
    weight: {
      type: "string",
    },
    deviceprofilepicture: {
      type: "string",
    },
    dob: {
      type: "string",
    },
    citizenship: {
      type: "string",
    },
    civil_status: {
      type: "string",
    },
    government_issued_identification: {
      frontphoto: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        image: {
          type: "string",
        },
        uploaddate: {
          type: "string",
        },
      },
      backphoto: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        image: {
          type: "string",
        },
        uploaddate: {
          type: "string",
        },
      },
    },
    birthcertificate: {
      frontphoto: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        image: {
          type: "string",
        },
        uploaddate: {
          type: "string",
        },
      },
      backphoto: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        image: {
          type: "string",
        },
        uploaddate: {
          type: "string",
        },
      },
      birthcertificatereferencenumber: {
        type: "string",
      },
    },
  },
  passwords: {
    account: {
      password: {
        type: "string",
      },
    },
  },
  credits: {
    omsiapawas: {
      id: {
        type: "string",
      },
      amount: {
        type: "number",
        default: 0,
      },
      transactions: {
        currencyexchange: [currencyexchangetransactiondatascheme],
        widthdrawals: [withdrawaltransactiondatascheme],
        omsiapawastransfer: [],
      },
    },
  },
  transactions: {
    merchandise: [merchandisetransactiondatascheme],
  },
})

const RegistrantDataModel = mongoose.model("Registrant", registrantdatascheme)

module.exports = RegistrantDataModel
