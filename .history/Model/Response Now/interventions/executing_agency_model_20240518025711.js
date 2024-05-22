import mongoose from 'mongoose';

// Create geolocation Schema
export const ExecutingAgencySchema = new mongoose.Schema({
    executingAgencyName: {
        type: String,
        required: [true]
    },
    executingAgencyDepartment: {
        type: String
    },
    executingAgencyTeam: {
        type: String
    },
    executingAgencyEmail: {
        type: String,
        unique: true
    },
    executingAgencyWebsite: {
        type: String,
        unique: true
    },
    executingAgencyPhotoUrl: {
        type: String
    },
    executingAgencyrProjectList:{
        type:[String]
    }
})

export const ExecutingAgencyModel = mongoose.model('ExecutingAgency', ExecutingAgency, 'executing_agency');

export default { ExecutingAgencySchema, ExecutingAgencyModel };