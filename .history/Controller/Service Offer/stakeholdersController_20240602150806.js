import {
    StakeholdershModel,
    stakeholdersSchema
} from '../../Model/Service Offer/stakeholder_model.js';

// Create a new Stakeholder
export async function createStakeholder(req, res) {
    const newStakeholder = new stakeholdersSchema(req.body);
    try {
        await newStakeholder.save();
        res.status(201).json(newStakeholder);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Get all Stakeholders
export async function getAllStakeholders(req, res) {
    try {
        const attendants = await StakeholdershModel.find();
        res.json(attendants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get a single Stakeholder by ID
export async function getStakeholderById(req, res) {
    try {
        const attendants = await StakeholdershModel.findById(req.params.id);
        if (!attendants) return res.status(404).json({
            message: 'Stakeholder not found'
        });
        res.json(attendants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update a Stakeholder by ID
export async function updateStakeholder(req, res) {
    try {
        const updatedStakeholder = await StakeholdershModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedStakeholder);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Update an Stakeholder by Name
export async function updateStakeholderByName(req, res) {
    try {
        const updatedStakeholder = await StakeholdershModel.findOneAndUpdate(
            { attendantName: req.params.name }, // Use an object to specify the query criteria
            req.body, // Update document
            { new: true } // Options
        );
        
        if (!updatedStakeholder) {
            return res.status(404).json({ message: "Stakeholder not found" });
        }

        res.json(updatedStakeholder);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Delete a Stakeholder by ID
export async function deleteStakeholder(req, res) {
    try {
        await StakeholdershModel.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Stakeholder deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update an Stakeholder by Name
export async function deleteStakeholderByName(req, res) {
    try {
        const deletedStakeholder = await StakeholdershModel.findOneAndDelete(
            { attendantName: req.params.name }, // Use an object to specify the query criteria
        );
        
        if (!deletedStakeholder) {
            return res.status(404).json({ message: "Stakeholder not found" });
        }

        res.json(deletedStakeholder);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// export default { createStakeholder, getAllStakeholders, getStakeholderById, updateStakeholder, deleteStakeholder };
export default {
    createStakeholder,
    getAllStakeholders,
    getStakeholderById,
    updateStakeholder,
    updateStakeholderByName,
    deleteStakeholder,
    deleteStakeholderByName
};