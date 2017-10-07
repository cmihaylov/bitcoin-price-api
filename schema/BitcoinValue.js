const mongoose = require('mongoose');

// Create a schema
var BitcoinValueSchema = new mongoose.Schema({
  value: Number,
  currency: { type: String, default: 'USD' },
  timestamp: Number
});

// exports
module.exports = BitcoinValueSchema;
