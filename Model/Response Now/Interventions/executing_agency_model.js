import mongoose from 'mongoose';

// Create geolocation Schema
export const ExecutingAgencySchema = new mongoose.Schema({
    executingAgencyName: {
        type: String
    },
    executingAgencyDepartment: {
        type: String
    },
    executingAgencyTeam: {
        type: String
    },
    executingAgencyEmail: {
        type: String
    },
    executingAgencyWebsite: {
        type: String
    },
    executingAgencyPhotoUrl: {
        type: String
    },
    executingAgencyrProjectList:{
        type:[String]
    }
})

export const ExecutingAgencyModel = mongoose.model('ExecutingAgency', ExecutingAgencySchema, 'executing_agency');

export default { ExecutingAgencySchema, ExecutingAgencyModel };