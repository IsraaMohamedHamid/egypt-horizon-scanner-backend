var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create City Schema and Model
const CitySchema = new Schema({

    CityId: {
        type: Number,
    },
    City_Name_EN: {
        type: String,
        required: [true]
    },
    City_Name_AR: {
        type: String
    },
    City_PCODE: {
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
    Governorate_Name_EN: {
        type: String
    },
    Governorate_Name_AR: {
        type: String
    },
    Governorate_PCODE:{
        type: String
    }, type: String
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
    Shape_Length: {
        type: Number,
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

const cityModel= mongoose.model('interventions_city_map', CitySchema, 'interventions_city_map');
module.exports = {
    cityModel: cityModel, 
    CitySchema: CitySchema
};