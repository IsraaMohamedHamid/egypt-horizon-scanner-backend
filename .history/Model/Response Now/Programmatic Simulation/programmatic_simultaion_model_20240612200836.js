// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const ProgrammaticSimulationSchema = new mongoose.Schema({
    _id: {
        typr: String
    },
    them
    description: {
        type: String
    },
//     List<String>? themes;
//   List<String>? regions;
//   List<String>? municipalDivisions;
//   List<String>? governorates;
//   int? minAmount;
//   int? maxAmount;
//   int? amount;
//   int? timeline;
//   String? amountFilter;
//   String? description;
});

export const ProgrammaticSimulationModel = mongoose.model('ProgrammaticSimulation', ProgrammaticSimulationSchema, 'ProgrammaticSimultaio');

// Exporting the schema and model
export default  { ProgrammaticSimulationSchema, EmergenceIssueOfTheMonthModel };