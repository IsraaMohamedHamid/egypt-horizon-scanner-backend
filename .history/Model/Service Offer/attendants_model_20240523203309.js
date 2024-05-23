import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const AttendantsSchema = new mongoose.Schema({
    attendantID: {
        type: String,
    },
    attendantName: {
        type: String,
    },
    attendantEmail: {
        type: String,
    },
    attendantPhone: {
        type: String,
    },
    attendantJobTitle: {
        type: String,
    },
    attendantImage: {
        type: String,
    },
    attendantBio: {
        type: String,
    },
    attendantSource: {
        type: String,
    },
    attendantStatus: {
        type: String,
    },
})

export const attendantsModel= mongoose.model('service_offer_attendants', AttendantsSchema, 'service_offer_attendants');

export default  { attendantsSchema,
    AttendantshModel };