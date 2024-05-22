
import mongoose from 'mongoose';

export  const dimensionSchema = new mongoose.Schema({
  Dimension: { type: String, required: true },
  Pillars: { type: String, required: true },
  Indicators: { type: String, required: true },
  Type: { type: String, required: true },
  DataVisualization: { type: [String], required: true },
  Source: { type: String, required: true },
  Notes: { type: String, required: true }
});

export const DimensionshModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionSchema,
  DimensionshModel
};
