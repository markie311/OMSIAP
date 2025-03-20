const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrantdatascheme = require('../../models/people/registrantdatascheme.js');
const productdatascheme = require('../../models/products/productsdatascheme.js')

const omsiapdatascheme = new Schema({
 _id: {
   type: 'string'
 },
 people: [registrantdatascheme],
 products: [productdatascheme],
 pendingfunds: {
  type: 'number',
  default: 0
 }
});

module.exports = omsiapdatascheme;
