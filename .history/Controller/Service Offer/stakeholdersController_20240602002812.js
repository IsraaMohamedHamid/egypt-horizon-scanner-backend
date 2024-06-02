import {
    StakeholdershModel,
    stakeholdersSchema
} from '../../Model/Service Offer/stakeholder_model';

// Create a new Attendant
export async function createAttendant(req, res) {
    const newAttendant = new stakeholdersSchema(req.body);
    try {
        await newAttendant.save();
        res.status(201).json(newAttendant);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Get all Attendants
export async function getAllAttendants(req, res) {
    try {
        const attendants = await StakeholdershModel.find();
        res.json(attendants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get a single Attendant by ID
export async function getAttendantById(req, res) {
    try {
        const attendants = await StakeholdershModel.findById(req.params.id);
        if (!attendants) return res.status(404).json({
            message: 'Attendant not found'
        });
        res.json(attendants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update a Attendant by ID
export async function updateAttendant(req, res) {
    try {
        const updatedAttendant = await StakeholdershModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedAttendant);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Update an Attendant by Name
export async function updateAttendantByName(req, res) {
    try {
        const updatedAttendant = await StakeholdershModel.findOneAndUpdate(
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

// Delete a Attendant by ID
export async function deleteAttendant(req, res) {
    try {
        await StakeholdershModel.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Attendant deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update an Attendant by Name
export async function deleteAttendantByName(req, res) {
    try {
        const deletedAttendant = await StakeholdershModel.findOneAndDelete(
            { attendantName: req.params.name }, // Use an object to specify the query criteria
        );
        
        if (!deletedAttendant) {
            return res.status(404).json({ message: "Attendant not found" });
        }

        res.json(deletedAttendant);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// export default { createAttendant, getAllAttendants, getAttendantById, updateAttendant, deleteAttendant };
export default {
    createAttendant,
    getAllAttendants,
    getAttendantById,
    updateAttendant,
    updateAttendantByName,
    deleteAttendant,
    deleteAttendantByName
};