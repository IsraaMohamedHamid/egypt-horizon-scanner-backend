// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const ProgrammaticSimulationSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  themes: {
    type: [String]
  },
  regions: {
    type: [String]
  },
  municipalDivisions: {
    type: [String]
  },
  governorates: {
    type: [String]
  },
  minAmount: {
    type: Number
  },
  maxAmount: {
    type: Number
  },
  amount: {
    type: Number
  },
  timeline: {
    type: Number
  },
  overheadCost: {
    type: Number
  },
  amountFilter: {
    type: String
  },
  description: {
    type: String
  },
  budget_breakdown: {
    type: mongoose.Schema.Types.Mixed // Use Mixed type for nested objects
  },
  analysis_and_recommendations: {
    type: mongoose.Schema.Types.Mixed
  },
  suggested_intervention: {
    type: mongoose.Schema.Types.Mixed
  },
  summary: {
    type: String
  },
  insights: {
    type: mongoose.Schema.Types.Mixed
  },
  critique: {
    type: mongoose.Schema.Types.Mixed
  }
});

export const ProgrammaticSimulationModel = mongoose.model('ProgrammaticSimulation', ProgrammaticSimulationSchema, 'ProgrammaticSimulation');

// Exporting the schema and model
export default { ProgrammaticSimulationSchema, ProgrammaticSimulationModel };
