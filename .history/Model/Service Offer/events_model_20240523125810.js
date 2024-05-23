import mongoose from 'mongoose';

// String? attendantID;
// String? attendantName;
// String? attendantEmail;
// String? attendantPhone;
// String? attendantJobTitle;
// String? attendantImage;
// String? attendantBio;
// String? attendantSource;
// String? attendantStatus;

// Create Events Schema and Model
export const EventsSchema = new mongoose.Schema({
    attendantID: {
        type: String,
    },
    attendantName: {
        type: String,
    },
    attendantEmail: {
        type: String,
    },
    attendantPhone: {
        type: String,
    },
    attendantJobTitle: {
        type: String,
    },
    attendantImage: {
        type: String,
    },
    attendantBio: {
        type: String,
    },
    attendantSource: {
        type: String,
    },
    attendantStatus: {
        type: String,
    },
    
})

export const eventsModel= mongoose.model('service_offer_events', EventsSchema, 'service_offer_events');

export default  { EventsSchema, eventsModel };