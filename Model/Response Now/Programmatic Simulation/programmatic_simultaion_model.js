// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const ProgrammaticSimulationSchema = new mongoose.Schema({
    _id: {
        typr: String
    },
    themes:{
        type: [String]
    },
    regions:{
        type: [String]
    },
    municipalDivisions:{
        type: [String]
    },
    governorates:{
        type: [String]
    },
    minAmount:{
        type: Number
    },
    maxAmount:{
        type: Number
    },
    amount:{
        type: Number
    },
    timeline:{
        type: Number
    },
    amountFilter:{
        type: String
    },

    description: {
        type: String
    },
    budget_breakdown: {
        type: String
    },
    analysis_and_recommendations: {
        type: String
    },
    suggested_intervention: {
        type: String
    },
    summary: {
        type: String
    },
});

export const ProgrammaticSimulationModel = mongoose.model('ProgrammaticSimulation', ProgrammaticSimulationSchema, 'ProgrammaticSimultaio');

// Exporting the schema and model
export default  { ProgrammaticSimulationSchema, ProgrammaticSimulationModel };