var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Governorate Schema and Model
const GovernorateSchema = new Schema({

    GovernorateId: {
        type: Number,
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
    Governorate_Name_EN: {
        type: String
    },
    Governorate_Name_AR: {
        type: String
    },
    Governorate_PCODE:{
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
    Country_EN: {
        type: String
    },
    Country_AR: {
        type: String
    },
    Country_PCODE: {
        type: String
    },
    Government_Type: {
        type: String
    },
    Government_Chief_Administrator:{
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
    Shape_Area: {
        type: Number,
    },
Latitude: {
        type: Number,
    },
    Longitude:{
        type: Number,
    },
    coordinates: { type: [Number], index: '2dsphere'},
    Most_Intervention_Type: {
        type: String
    },
    Least_Intervention_Type: {
            type: String
        },
        No_Intervention_Type: {
            type: String
        }
})

const governoratesModel= mongoose.model('interventions_governorate_map', GovernorateSchema, 'interventions_governorate_map');
module.exports = {
    governoratesModel: governoratesModel, 
    GovernorateSchema: GovernorateSchema
};