// Import Schemas
const DonorSchema = require('./donor_model');
const ExecutingAgencySchema = require('./executing_agency_model');
const {
  CitySchema
} = require('./city_model');
const {
  StateSchema
} = require('./governorate_model');
const {
  DistrictSchema
} = require('./district_model');

// Import Mongoose
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  id: {
    type: String,
    required: true // Fixed: use true directly for required fields
  },
  projectNo: {
    type: Number
  },
  projectName: {
    type: String,
    required: true // Fixed: use true directly for required fields
  },
  projectDetail: {
    type: String
  },
  photoURL: {
    type: String
  },
  executingAgency: [ExecutingAgencySchema], // Assuming ExecutingAgencySchema is defined
  status: {
    type: String
  },
  theme: [String], // Corrected syntax for arrays
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
  // Following fields corrected for consistency but kept optional as per the original design
  Locality_Name_EN: String,
  Locality_Name_AR: String,
  Locality_PCODE: String,
  City_Name_EN: String,
  City_Name_AR: String,
  City_PCODE: String,
  District_Name_EN: String,
  District_Name_AR: String,
  District_PCODE: String,
  Governorate_Name_EN: String,
  Governorate_Name_AR: String,
  Governorate_PCODE: String,
  State_Name_EN: String,
  State_Name_AR: String,
  State_PCODE: String,
  Province_Name_EN: String,
  Province_Name_AR: String,
  Province_PCODE: String,
  Region_Name_EN: String,
  Region_Name_AR: String,
  Region_PCODE: String,
  Country_EN: String,
  Country_AR: String,
  Country_PCODE: String,
  donor: [DonorSchema], // Assuming DonorSchema is defined
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