// Create Governorate Schema and Model
import mongoose from 'mongoose';

const GovernorateSchema = new mongoose.Schema({
  GovernorateID: {
    type: Number,
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
  Governorate_Capital_Name_EN: {
    type: String,
  },
  Governorate_Capital_Name_AR: {
    type: String,
  },
  Governorate_Capital_PCODE: {
    type: String,
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
  Government_Type: {
    type: String,
  },
  Government_Chief_Administrator: {
    type: String,
  },
  Government_Governor: {
    type: String,
  },
  Population: {
    type: Number,
  },
  Type: {
    type: String,
    default: "Polygon",
  },
  Shape_Area: {
    type: Number,
  },
  Coordinates: {
    type: [Number], //[[[Number]]], // 3D array of numbers for the coordinates
    index: '2dsphere',
  },
  Most_Intervention_Type: [String],
  Least_Intervention_Type: [String],
  No_Intervention_Type: [String],
  ThemeCounts: {
    type: Map,
    of: Number,
    default: () => new Map()
  },
});

export const governoratesModel = mongoose.model('interventions_governorate_map', GovernorateSchema, 'interventions_governorate_map');


export default  governoratesModel;