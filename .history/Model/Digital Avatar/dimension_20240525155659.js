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
    type: [String],

  },
  DataType: {
    type: [String],

  },
  DataVisualization: {
    type: [String],

  },
  Source: {
    type: String,

  },
  Link: {
    type: String,

  },
  API: {
    type: String,

  },
  Notes: {
    type: String,

  }
  Summary
});

export const DimensionshModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionSchema,
  DimensionshModel
};