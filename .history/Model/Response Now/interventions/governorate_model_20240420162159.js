import mongoose from 'mongoose';

// Create Governorate Schema and Model
const GovernorateSchema = new mongoose.Schema({
    governorateId: { type: Number, required: false },
    governorateNameEn: { type: String, required: false },
    governorateNameAr: { type: String, required: false },
    governoratePcode: { type: String, required: false },
    governorateCapitalNameEn: { type: String, required: false },
    governorateCapitalNameAr: { type: String, required: false },
    governorateCapitalPcode: { type: String, required: false },
    localityNameEn: { type: String, required: false },
    localityNameAr: { type: String, required: false },
    localityPcode: { type: String, required: false },
    cityNameEn: { type: String, required: false },
    cityNameAr: { type: String, required: false },
    cityPcode: { type: String, required: false },
    districtNameEn: { type: String, required: false },
    districtNameAr: { type: String, required: false },
    districtPcode: { type: String, required: false },
    stateNameEn: { type: String, required: false },
    stateNameAr: { type: String, required: false },
    statePcode: { type: String, required: false },
    provinceNameEn: { type: String, required: false },
    provinceNameAr: { type: String, required: false },
    provincePcode: { type: String, required: false },
    regionNameEn: { type: String, required: false },
    regionNameAr: { type: String, required: false },
    regionPcode: { type: String, required: false },
    countryEn: { type: String, required: false },
    countryAr: { type: String, required: false },
    countryPcode: { type: String, required: false },
    governmentType: { type: String, required: false },
    governmentChiefAdministrator: { type: String, required: false },
    governmentGovernor: { type: String, required: false },
    population: { type: Number, required: false },
    type: { type: String, required: false },
    shapeArea: { type: Number, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    coordinates: [[[Number]]], // Nested array for coordinates
    mostInterventionType: { type: String, required: false },
    leastInterventionType: { type: String, required: false },
    noInterventionType: { type: String, required: false },
  }, { timestamps: true });

const governoratesModel= mongoose.model('interventions_governorate_map', GovernorateSchema, 'interventions_governorate_map');
export default  {
    governoratesModel: governoratesModel, 
    GovernorateSchema: GovernorateSchema
};