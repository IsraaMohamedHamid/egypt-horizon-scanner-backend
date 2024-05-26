import mongoose from 'mongoose';

// Create Events Schema and Model
export const EventsSchema = new mongoose.Schema({
    eventID: {
        type: String,
    },
    eventName: {
        type: String,
    },
    eventType: {
        type: String,
    },
    eventKeyPoints: {
        type: Array,
    },
    eventThemePortfolio: {
        type: String,
    },
    eventAttendants: [String],
    eventLocation: {
        type: String,
    },
    eventLinks: {
        type: String,
    },
    eventAttachments: [String],
    eventDate: {
        type: String,
    },

})

export const eventsModel= mongoose.model('service_offer_events', EventsSchema, 'service_offer_events');

export default  { EventsSchema, eventsModel };