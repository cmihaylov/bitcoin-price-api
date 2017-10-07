const mongoose = require('mongoose');
const bitcoinValueSchema = require('./../schema/BitcoinValue');

// Create a model based on the schema
var BitcoinValue = mongoose.model('BitcoinValueHourlyAvg', bitcoinValueSchema);

// exports
module.exports = BitcoinValue;
