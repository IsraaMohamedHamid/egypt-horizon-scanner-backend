import mongoose from 'mongoose';

// Create City Schema and Model
export const CitySchema = new mongoose.Schema({

})

export const cityModel= mongoose.model('interventions_city_map', CitySchema, 'interventions_city_map');

export default  { CitySchema, cityModel };