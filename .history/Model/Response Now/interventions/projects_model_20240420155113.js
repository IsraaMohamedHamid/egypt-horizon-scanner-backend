// Import Schemas
const DonorSchema = require('./donor_model');
const ExecutingAgencySchema = require('./executing_agency_model');
const {
    CitySchema
} = require('./locality_model');
const {
    StateSchema
} = require('./governorate_model');

// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Project Schema and Model
const ProjectSchema = new Schema({

    id: {
        type: String,
        required: [true]
    },
    projectNo: {
        type: Number
    },
    projectName: {
        type: String,
        required: [true]
    },
    projectDetail: {
        type: String
    },
    photoURL: {
        type: String
    },
    executingAgency: [ExecutingAgencySchema],
    status: {
        type: String
    },
    theme: {
        type: [String]
    },
    estimatedCost: {
        type: Number
    },
    budget: {
        type: Number
    },
    totalDonatedAmount: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    Latitude: {
        type: Number
    },
    Longitude: {
        type: Number
    },
    City_Name_EN: {
        type: String,
    },
    City_Name_AR: {
        type: String
    },
    City_PCODE: {
        type: String
    },
    Governorate_Name_EN: {
        type: String
    },
    Governorate_Name_AR: {
        type: String
    },
    Governorate_PCODE: {
        type: String
    },
    

    Country_EN: {
        type: String
    },
    Country_AR: {
        type: String
    },
    Country_PCODE: {
        type: String
    },
    donor: [DonorSchema],
    contribution: {
        type: String
    },
    dataReliability: {
        type: String
    }

});

const projectsModel = mongoose.model('project_data', ProjectSchema, 'project_data');
module.exports = {
    projectsModel: projectsModel,
    ProjectSchema: ProjectSchema
};