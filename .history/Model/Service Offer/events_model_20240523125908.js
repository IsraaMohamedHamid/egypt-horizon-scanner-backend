import mongoose from 'mongoose';

// String? eventID;
//   String? eventName;
//   String? eventType;
//   List<String>? eventKeyPoints;
//   String? eventThemePortfolio;
//   List<AttendantsModel>? eventAttendants;
//   String? eventLocation;
//   String? eventLinks;
//   String? eventAttachments;
//   String? eventDate;

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
    

})

export const eventsModel= mongoose.model('service_offer_events', EventsSchema, 'service_offer_events');

export default  { EventsSchema, eventsModel };