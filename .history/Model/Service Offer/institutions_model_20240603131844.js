import mongoose from 'mongoose';

// Create Institutions Schema and Model
export const institutionsSchema = new mongoose.Schema({
    institutionID: {
        type: String,
    },
    institutionName: {
        type: String,
    },
    institutionEmail: {
        type: String,
    },
    institutionPhone: {
        type: String,
    },
    institutionJobTitle: {
        type: String,
    },
    institutionImage: {
        type: String,
    },
    institutionBio: {
        type: String,
    },
    institutionSource: {
        type: String,
    },
    institutionCooperationLevel: {
        type: Number,
    },
    institutionBackground: {
        type: String,
    },
    institutionType: {
        type: String,
    },
    institutionPriorityAreas: {
        type: [String],
    },
})

export const InstitutionshModel = mongoose.model('service_offer_institutions', institutionsSchema, 'service_offer_institutions');

export default {
    institutionsSchema,
    InstitutionshModel
};