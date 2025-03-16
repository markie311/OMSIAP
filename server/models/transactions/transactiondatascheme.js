const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productdatascheme = require('../products/productsdatascheme.js');

const transactiondatascheme = new Schema({
 id: {
  type: 'string'
 },
 date: {
    type: 'string'
 },
 type: {
    type: 'string'
 },
 amount: {
  type: 'number',
  default: 0
 },
 status: {
  type: 'string'
 },
 paymentmethod: {
  type: 'string'
 },
 details: {
  products: [productdatascheme],
  shippingInfo: {
    address: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    zipCode: {
      type: 'string'
    },
    country: {
      type: 'string'
    }
  },
  orderSummary: {
    merchandiseTotal: {
      type: 'number',
      default: 0
    },
    shippingTotal:{
      type: 'number',
      default: 0
    },
    totalTransactionGiveaway: {
      type: 'number',
      default: 0
    },
    totalOmsiaProfit: {
      type: 'number',
      default: 0
    },
    totalCapital: {
      type: 'number',
      default: 0
    },
    totalItems: {
      type: 'number',
      default: 0
    },
    totalProducts: {
      type: 'number',
      default: 0
    },
    totalWeightGrams: {
      type: 'number',
      default: 0
    },
    totalWeightKilos: {
      type: 'number',
      default: 0
    },
    total: {
      type: 'number',
      default: 0
    }
  }
 }
});

module.exports = transactiondatascheme;