const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const omsiapawastransfertransactiondataschemestatusesschememessagesscheme = new Schema({
message: {
type: "string"
}
})

const omsiapawastransfertransactiondataschemestatusesscheme = new Schema({
date: {
type: 'string'
},
type: {
type: 'string'
},
indication: {
type: 'string'
},
messages: [omsiapawastransfertransactiondataschemestatusesschememessagesscheme]
})

const omsiapawastransfertransactiondatascheme = new Schema({
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
logs: [omsiapawastransfertransactiondataschemestatusesscheme]
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
}
}
});

const OmsiapawasTransferTransactionDataModel = mongoose.model('OmsiapawasTransfer', omsiapawastransfertransactiondatascheme)

module.exports = OmsiapawasTransferTransactionDataModel