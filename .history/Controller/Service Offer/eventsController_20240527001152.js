import {
    EventsSchema,
    eventsModel
} from '../../Model/Service Offer/events_model.js';

// Create a new Event
export async function createEvent(req, res) {
    const newEvent = new EventsSchema(req.body);
    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Get all Events
export async function getAllEvents(req, res) {
    try {
        const events = await eventsModel.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get a single Event by ID
export async function getEventById(req, res) {
    try {
        const events = await eventsModel.findById(req.params.id);
        if (!events) return res.status(404).json({
            message: 'Event not found'
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update a Event by ID
export async function updateEvent(req, res) {
    try {
        const updatedEvent = await eventsModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Update an Attendant by Name
export async function updateEventByName(req, res) {
    try {
        const updatedAttendant = await AttendantshModel.findOneAndUpdate(
            { attendantName: req.params.name }, // Use an object to specify the query criteria
            req.body, // Update document
            { new: true } // Options
        );
        
        if (!updatedAttendant) {
            return res.status(404).json({ message: "Attendant not found" });
        }

        res.json(updatedAttendant);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}
    

// Delete a Event by ID
export async function deleteEvent(req, res) {
    try {
        await eventsModel.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Event deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// export default { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
export default {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    updateEventByName,
    deleteEvent,
    deleteEventByName
};