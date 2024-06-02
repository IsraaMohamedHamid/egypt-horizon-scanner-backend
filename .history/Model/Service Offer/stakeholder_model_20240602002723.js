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

export const AttendantshModel = mongoose.model('stakeholders', export const stakeholdersSchema = new mongoose.Schema({
    , 'stakeholders');

export default {
    attendantsSchema,
    AttendantshModel
};