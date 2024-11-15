// Import Schemas
import {DonorSchema} from './donor_model.js';
import {ExecutingAgencySchema} from './executing_agency_model.js';

// Import Mongoose
import mongoose from 'mongoose';

// Create Project Schema and Model
export const ProjectSchema = new mongoose.Schema({

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
  Locality_Name_EN: {
    type: String,
  },
  Locality_Name_AR: {
    type: String,
  },
  Locality_PCODE: {
    type: String,
  },
  City_Name_EN: {
    type: String,
  },
  City_Name_AR: {
    type: String,
  },
  City_PCODE: {
    type: String,
  },
  District_Name_EN: {
    type: String,
  },
  District_Name_AR: {
    type: String,
  },
  District_PCODE: {
    type: String,
  },
  Municipal_Division_Type: {
    type: String,
  },
  Municipal_Division_Name_EN: {
    type: String,
  },
  Municipal_Division_Name_AR: {
    type: String,
  },
  Municipal_Division_PCODE: {
    type: String,
  },
  Governorate_Name_EN: {
    type: String,
  },
  Governorate_Name_AR: {
    type: String,
  },
  Governorate_PCODE: {
    type: String,
  },
  State_Name_EN: {
    type: String,
  },
  State_Name_AR: {
    type: String,
  },
  State_PCODE: {
    type: String,
  },
  Province_Name_EN: {
    type: String,
  },
  Province_Name_AR: {
    type: String,
  },
  Province_PCODE: {
    type: String,
  },
  Region_Name_EN: {
    type: String,
  },
  Region_Name_AR: {
    type: String,
  },
  Region_PCODE: {
    type: String,
  },
  Country_EN: {
    type: String,
  },
  Country_AR: {
    type: String,
  },
  Country_PCODE: {
    type: String,
  },
  donor: [DonorSchema],
  contribution: {
    type: String
  },
  dataReliability: {
    type: String
  }

});

export const projectsModel = mongoose.model('project_data', ProjectSchema, 'project_data');

export default { ProjectSchema, projectsModel }; 