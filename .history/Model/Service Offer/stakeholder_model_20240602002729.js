import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const stakeholdersSchema = new mongoose.Schema({
    Name: {
      type: String
    },
    Institution: {
      type: String
    },
    JobTitle: {
      type: String
    },
    PriorityAreas: {
      type: [String]
    },
    PledgedFunds: {
      type: Number
    },
    Background: {
      type: [String]
    }
})

export const AttendantshModel = mongoose.model('stakeholders', stakeholdersSchema, 'stakeholders');

export default {
    attendantsSchema,
    AttendantshModel
};