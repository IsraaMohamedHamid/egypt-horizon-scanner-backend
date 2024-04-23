var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create MunicipalDivision Schema and Model
const MunicipalDivisionSchema = new Schema({

  MunicipalDivisionId: {
    type: Number,
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
  District_Name_EN: {
    type: String,
  },
  District_Name_AR: {
    type: String,
  },
  District_PCODE: {
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
  Government_Type: {
    type: String
  },
  Government_Chief_Administrator: {
    type: String
  },
  Government_Governor: {
    type: String
  },
  Population: {
    type: Number,
  },
  Type: {
    type: String,
    default: "Polygon"
  },
  Shape_Length: {
    type: Number,
  },
  Shape_Area: {
    type: Number,
  },
  Latitude: {
    type: Number,
  },
  Longitude: {
    type: Number,
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  },
  Most_Intervention_Type: [String],
  Least_Intervention_Type: [String],
  No_Intervention_Type: [String],
})

const municipalDivisionsModel = mongoose.model('interventions_municipal_division_map', MunicipalDivisionSchema, 'interventions_municipal_division_map');
module.exports = {
  municipalDivisionsModel: municipalDivisionsModel,
  MunicipalDivisionSchema: MunicipalDivisionSchema
};