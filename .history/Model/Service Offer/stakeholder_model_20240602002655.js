import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const stakeholdersSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true
    },
    Institution: {
      type: String,
      required: true
    },
    JobTitle: {
      type: String,
      required: true
    },
    PriorityAreas: {
      type: [String],
      required: true
    },
    PledgedFunds: {
      type: Number,
      required: true
    },
    Background: {
      type: [String],
      required: true
    }
})

export const AttendantshModel = mongoose.model('service_offer_attendants', attendantsSchema, 'service_offer_attendants');

export default {
    attendantsSchema,
    AttendantshModel
};