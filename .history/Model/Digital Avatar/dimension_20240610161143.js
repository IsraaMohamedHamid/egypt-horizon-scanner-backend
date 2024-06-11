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

  },
  Summary: {
    type: String,

  },
  Themes: {
    type: [String],

  },
  mainObjects: {
    type: [String],

  },
  mainOutcomes: {
    type: [String],

  },
  KPIs: {
    type: [String],

  }
  KPIs: {
    type: [String],

  }
});

export const DimensionsModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionSchema,
  DimensionsModel
};