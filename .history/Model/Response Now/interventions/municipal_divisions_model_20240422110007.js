import mongoose from 'mongoose';

// Create MunicipalDivision Schema and Model
const MunicipalDivisionSchema = new mongoose.Schema({

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
    
municipal_divisions_type
null
municipal_divisions_name_EN
"A L Labban"
municipal_divisions_name_AR
"قسم اول مدينة العاشر من رمض"
municipal_divisions_name_PCODE
"EG0209"
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

const municipalDivisionsModel= mongoose.model('interventions_municipal_division_map', MunicipalDivisionSchema, 'interventions_municipal_division_map');
export default  {
  municipalDivisionsModel: municipalDivisionsModel, 
    MunicipalDivisionSchema: MunicipalDivisionSchema
};