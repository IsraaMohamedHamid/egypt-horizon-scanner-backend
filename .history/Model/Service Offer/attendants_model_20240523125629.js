import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const AttendantsSchema = new mongoose.Schema({

})

export const cityModel= mongoose.model('service_offer_attendants', AttendantsSchema, 'service_offer_attendants');

export default  { AttendantsSchema, cityModel };