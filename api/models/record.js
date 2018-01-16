const mongoose = require('mongoose');

// Define record schema
const RecordSchema = new mongoose.Schema({
  from: String,
  engine: String,
  date: Date,
  duration: Date,
  price: Number,
  status: {
    type: String,
    enum: ['Waiting', 'Accept', 'Cancel'],
    default: 'Waiting'
  },
  },
  {
  timestamps: false
});

// Export Mongoose model
module.exports = mongoose.model('record', RecordSchema);
