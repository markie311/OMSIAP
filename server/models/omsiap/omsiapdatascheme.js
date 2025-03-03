const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const omsiapdatascheme = new Schema({
 _id: {
   type: 'string'
 },
 people: []
});

module.exports = omsiapdatascheme;
