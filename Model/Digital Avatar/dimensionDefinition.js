
const mongoose = require('mongoose');

const dimensionDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

module.exports = mongoose.model('DimensionDefinition', dimensionDefinitionSchema);
