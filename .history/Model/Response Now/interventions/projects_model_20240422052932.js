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
    type: {
      type: String
    },
    required: true // Fixed: use true directly for required fields
  },
  projectNo: {
    type: Number
  },
  projectName: {
    type: {
      type: String
    },
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
  Locality_Name_EN: {
    type: String
  },
  Locality_Name_AR: {
    type: String
  },
  Locality_PCODE: {
    type: String
  },
  City_Name_EN: {
    type: String
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
  State_Name_EN: {
    type: String
  },
  State_Name_AR: {
    type: String
  },
  State_PCODE: {
    type: String
  },
  Province_Name_EN: {
    type: String
  },
  Province_Name_AR: {
    type: String
  },
  Province_PCODE: {
    type: String
  },
  Region_Name_EN: {
    type: String
  },
  Region_Name_AR: {
    type: String
  },
  Region_PCODE: {
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