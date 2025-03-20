const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productimagedatascheme = new Schema({
  url: { type: String } // Changed from 'type: string' to a proper field definition
});

const productspecificationdatascheme = new Schema({
  name: { type: String } // Changed from 'type: string' to a proper field definition
});

const productfeaturesdatascheme = new Schema({
  name: { type: String } // Changed from 'type: string' to a proper field definition
});

// Main product schema remains mostly the same
const productdatascheme = new Schema({
  id: { type: String },
  name: { type: String },
  price: { type: Number, default: 0 },
  category: { type: String },
  description: { type: String },
  weightingrams: { type: Number, default: 0 },
  images: [productimagedatascheme],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  specifications: [productspecificationdatascheme],
  videoUrl: { type: String },
  features: [productfeaturesdatascheme],
  warranty: { type: String },
  quantity: { type: Number },
  focuseddata: {
    price: {
      price: { type: Number, default: 0 },
      capital: { type: Number, default: 0 },
      transactiongiveaway: { type: Number, default: 0 },
      omsiapprofit: { type: Number, default: 0 }
    }
  },
  orderdetails: {
    quantity: { type: Number, default: 0 },
    product: {
      price: { type: Number, default: 0 },
      capital: { type: Number, default: 0 },
      transactiongiveaway: { type: Number, default: 0 },
      omsiapprofit: { type: Number, default: 0 }
    },
    shipment: {
      totalkilos: { type: Number, default: 0 },
      totalshipmentfee: { type: Number, default: 0 }
    }
  }
});

module.exports = productdatascheme;

