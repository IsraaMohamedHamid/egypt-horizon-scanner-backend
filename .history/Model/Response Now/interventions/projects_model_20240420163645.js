// Import Schemas
const DonorSchema from './donor_model.js');
const ExecutingAgencySchema from './executing_agency_model.js');
const {
    CitySchema
} from './city_model.js');
const {
    StateSchema
} from './governorate_model.js');
const {
    DistrictSchema
} from './district_model.js');

// Import Mongoose
import mongoose from 'mongoose';


// Create Project Schema and Model
const ProjectSchema = new mongoose.Schema({

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
    District_Name_EN: {
        type: String
    },
    District_Name_AR: {
        type: String
    },
    District_PCODE: {
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
export default  {
    projectsModel: projectsModel,
    ProjectSchema: ProjectSchema
};