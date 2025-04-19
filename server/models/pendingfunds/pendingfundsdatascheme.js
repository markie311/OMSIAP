const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pendingfundstadascheme = new Schema({
 amount: {
    type: 'number',
    default: 0
 }
})

// Define the pending funds model only once
// Check if the model already exists before creating it
const PendingFundsDataModel =  mongoose.model('pendingFunds', pendingfundstadascheme)

module.exports = PendingFundsDataModel;