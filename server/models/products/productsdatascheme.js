const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productimagedatascheme = new Schema({
 type: 'string'
})

const productspecificationdatascheme = new Schema({
 name: {
    type: "string"
 },
 value: {
    type: 'string'
 }
})

const productfeaturesdatascheme = new Schema({
type: "string"
})

const productdatascheme = new Schema({
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
 weightingrams: {
  type: 'number',
  default: 0
 },
 images: [productimagedatascheme],
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
 specifications: [productspecificationdatascheme],
 videoUrl: {
  type: 'string'
 }, 
 features: [productfeaturesdatascheme],
 warranty: {
    type: 'string'
 },
 quantity: {
  type: "number"
 },
 focuseddata: {
    price: {
        price: {
            type: 'number',
            default:0
        },
        capital: {
            type: 'number',
            default:0
        },
        transactiongiveaway: {
            type: 'number',
            default:0
        },
        omsiapprofit: {
            type: 'number',
            default:0
        }
    }
 },
 orderdetails: { 
    quantity: {
     type: 'number',
     default: 0
    },
    product: {
      price: {
        type: 'number',
        default: 0,
      },
      capital: {
        type: 'number',
        default: 0,
      },
      transactiongiveaway: {
        type: 'number',
        default: 0,
      },
      omsiapprofit: {
        type: 'number',
        default: 0,
      },
    },
    shipment: {
      totalkilos: {
        type: 'number',
        default: 0,
      },
      totalshipmentfee: {
        type: 'number',
        default: 0
      } 
    }
 }
});

module.exports = productdatascheme;

