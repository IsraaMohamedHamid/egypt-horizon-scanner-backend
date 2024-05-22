
import mongoose from 'mongoose';

const dimensionDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});



 const DimensionDefinitionhModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionDefinitionSchema,
  DimensionDefinitionhModel
}
