const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrantdatascheme = require('../../models/people/registrantdatascheme.js')
const productdatascheme = require('../../models/products/productsdatascheme.js')
const merchandisetransactiondatascheme = require('../../models/transactions/merchandisetransactiondatascheme.js')
const currencyexchangetransactiondatascheme = require('../../models/transactions/currencyexchangetransactiondatascheme.js')
const withdrawaltransactiondatascheme = require('../../models/transactions/withdrawaltransactiondatascheme.js');

const omsiapdatascheme = new Schema({
 _id: {
   type: 'string'
 },
 people: [registrantdatascheme],
 products: [productdatascheme],
 transactions: {
   merchandise: {
    total: [merchandisetransactiondatascheme],
    pending: [merchandisetransactiondatascheme],
    accepted: [merchandisetransactiondatascheme],
    rejected: [merchandisetransactiondatascheme]
   },
   currencyexchange: {
    total: [currencyexchangetransactiondatascheme],
    pending: [currencyexchangetransactiondatascheme],
    successful: [currencyexchangetransactiondatascheme],
    rejected: [currencyexchangetransactiondatascheme]
   },
   withdrawals: {
    total: [withdrawaltransactiondatascheme],
    pending: [withdrawaltransactiondatascheme],
    successful: [withdrawaltransactiondatascheme],
    rejected: [withdrawaltransactiondatascheme]
   }
 },
 pendingfunds: {
  type: 'number',
  default: 0
 }
});

module.exports = omsiapdatascheme;
