
import mongoose from 'mongoose';

export const dimensionDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

export const DimensionDefinitionhModel =  mongoose.model('DimensionDefinition', dimensionDefinitionSchema);


export default {
  dimensionDefinitionSchema,
  DimensionDefinitionhModel
}
