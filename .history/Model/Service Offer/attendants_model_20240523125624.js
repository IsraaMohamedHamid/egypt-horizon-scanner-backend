import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const AttendantsSchema = new mongoose.Schema({

})

export const cityModel= mongoose.model('service_attendants', AttendantsSchema, 'interventions_city_map');

export default  { AttendantsSchema, cityModel };