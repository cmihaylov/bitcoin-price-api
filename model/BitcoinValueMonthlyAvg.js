const mongoose = require('mongoose');
const bitcoinValueSchema = require('./../schema/BitcoinValue');

// Create a model based on the schema
var BitcoinValue = mongoose.model('BitcoinValueMonthlyAvg', bitcoinValueSchema);

// exports
module.exports = BitcoinValue;
