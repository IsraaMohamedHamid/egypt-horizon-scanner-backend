
import mongoose from 'mongoose';

const dimensionDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

dimensionSchema mongoose.model('DimensionDefinition', dimensionDefinitionSchema);
