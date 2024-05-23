import mongoose from 'mongoose';

// Create Attendants Schema and Model
export const EventsSchema = new mongoose.Schema({

})

export const eventsModel= mongoose.model('service_offer_events', EventsSchema, 'service_offer_events');

export default  { EventsSchema, attendantsModel };