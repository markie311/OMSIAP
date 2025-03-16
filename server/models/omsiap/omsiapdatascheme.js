const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrantdatascheme = require('../../models/people/registrantdatascheme.js');

const omsiapdatascheme = new Schema({
 _id: {
   type: 'string'
 },
 people: [registrantdatascheme],
 pendingfunds: {
  type: 'number',
  default: 0
 }
});

module.exports = omsiapdatascheme;
