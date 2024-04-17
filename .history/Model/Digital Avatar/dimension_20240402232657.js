
const mongoose = require('mongoose');

const dimensionSchema = new mongoose.Schema({
  Dimension: { type: String, required: true },
  Pillars: { type: String, required: true },
  Indicators: { type: String, required: true },
  Type: { type: String, required: true },
  DataVisualization: { type: String, required: true },
  Source: { type: String, required: true }
});

module.exports = mongoose.model('Dimension', dimensionSchema);
