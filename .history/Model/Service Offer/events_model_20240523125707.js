import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const EventsSchema = new mongoose.Schema({

})

export const attendantsModel= mongoose.model('service_offer_attendants', AttendantsSchema, 'service_offer_attendants');

export default  { EventsSchema, attendantsModel };