
import { eventsSchema,
    AttendantshModel } from '../../Model/Service Offer/events_model.js';

// Create a new Attendant
export async function createAttendant(req, res) {
    const newAttendant = new eventsSchema(req.body);
    try {
        await newAttendant.save();
        res.status(201).json(newAttendant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all Attendants
export async function getAllAttendants(req, res) {
    try {
        const events = await AttendantshModel.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single Attendant by ID
export async function getAttendantById(req, res) {
    try {
        const events = await AttendantshModel.findById(req.params.id);
        if (!events) return res.status(404).json({ message: 'Attendant not found' });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a Attendant by ID
export async function updateAttendant(req, res) {
    try {
        const updatedAttendant = await AttendantshModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAttendant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a Attendant by ID
export async function deleteAttendant(req, res) {
    try {
        await AttendantshModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Attendant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export default { createAttendant, getAllAttendants, getAttendantById, updateAttendant, deleteAttendant };
export default { createAttendant, getAllAttendants, getAttendantById, updateAttendant, deleteAttendant };
