import mongoose from 'mongoose';

// Create Institutions Schema and Model
export const attendantsSchema = new mongoose.Schema({
    attendantID: {
        type: String,
    },
    attendantName: {
        type: String,
    },
    attendantInstitution: {
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
    attendantBackground: {
        type: String,
    },
})

export const InstitutionshModel = mongoose.model('service_offer_attendants', attendantsSchema, 'service_offer_attendants');

export default {
    attendantsSchema,
    InstitutionshModel
};