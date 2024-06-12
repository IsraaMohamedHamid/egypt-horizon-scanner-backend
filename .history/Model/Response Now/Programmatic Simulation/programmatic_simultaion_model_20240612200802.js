// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const ProgrammaticSimulationSchema = new mongoose.Schema({
    _id: {
        typr: String
    },
    description: {
        type: String
    },
});

export const ProgrammaticSimulationModel = mongoose.model('ProgrammaticSimulation', ProgrammaticSimulationSchema, 'ProgrammaticSimultaio');

// Exporting the schema and model
export default  { ProgrammaticSimulationSchema, EmergenceIssueOfTheMonthModel };