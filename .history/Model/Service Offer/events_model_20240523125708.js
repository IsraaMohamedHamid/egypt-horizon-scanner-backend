import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const EventsSchema = new mongoose.Schema({

})

export const attendantsModel= mongoose.model('service_offer_attendants', EventsSchema, 'service_offer_attendants');

export default  { EventsSchema, attendantsModel };