import mongoose from 'mongoose';

export const dimensionSchema = new mongoose.Schema({
  Dimension: {
    type: String,
    
  },
  Pillars: {
    type: String,
    
  },
  Indicators: {
    type: String,
    
  },
  Type: {
    type: String,
    
  },
  DataVisualization: {
    type: [String],
    
  },
  Source: {
    type: String,
    
  },
  Notes: {
    type: String,
    
  }
});

export const DimensionshModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionSchema,
  DimensionshModel
};