
import mongoose from 'mongoose';

const dimensionDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

 mongoose.model('DimensionDefinition', dimensionDefinitionSchema);

 const DimensionshModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionSchema,
  DimensionshModel
}
