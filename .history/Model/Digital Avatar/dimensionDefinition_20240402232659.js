
const mongoose from 'mongoose');

const dimensionDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

export default  mongoose.model('DimensionDefinition', dimensionDefinitionSchema);
