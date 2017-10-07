const mongoose = require('mongoose');
const bitcoinValueSchema = require('./../schema/BitcoinValue');

// Create a model based on the schema
var BitcoinValue = mongoose.model('BitcoinValue', bitcoinValueSchema);

// exports
module.exports = BitcoinValue;
