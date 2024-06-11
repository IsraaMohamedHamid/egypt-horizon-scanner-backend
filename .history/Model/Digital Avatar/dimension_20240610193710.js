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
  Description
  Themes: {
    type: [String],

  },
  MainObjects: {
    type: [String],

  },
  MainOutcomes: {
    type: [String],

  },
  ProblemStatement: {
    type: [String],

  },
  KPIs: {
    type: [String],

  },
  Language: {
    type: String,

  }
});

export const DimensionsModel = mongoose.model('dimensions', dimensionSchema, 'dimensions');


export default {
  dimensionSchema,
  DimensionsModel
};