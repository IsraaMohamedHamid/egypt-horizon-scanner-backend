import mongoose from 'mongoose';

// Create Governorate Schema and Model
const GovernorateSchema = new mongoose.Schema({

    GovernorateId: {
        type: Number,
    },
    Governorate_Name_EN: {
        type: String
    },
    Governorate_Name_AR: {
        type: String
    },
    Governorate_Name_PCODE: {
        type: String
    },
    City_Name_EN: {
        type: String
    },
    City_Name_AR: {
        type: String
    },
    Governorate_PCODE:{
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
export default  {
    governoratesModel: governoratesModel, 
    GovernorateSchema: GovernorateSchema
};