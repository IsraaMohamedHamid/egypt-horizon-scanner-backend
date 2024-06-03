import {
    institutionsSchema,
    InstitutionshModel
} from '../../Model/Service Offer/institutions_model.js';

// Create a new Institution
export async function createInstitution(req, res) {
    const newInstitution = new institutionsSchema(req.body);
    try {
        await newInstitution.save();
        res.status(201).json(newInstitution);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Get all Institutions
export async function getAllInstitutions(req, res) {
    try {
        const institutions = await InstitutionshModel.find();
        res.json(institutions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get a single Institution by ID
export async function getInstitutionById(req, res) {
    try {
        const institutions = await InstitutionshModel.findById(req.params.id);
        if (!institutions) return res.status(404).json({
            message: 'Institution not found'
        });
        res.json(institutions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update a Institution by ID
export async function updateInstitution(req, res) {
    try {
        const updatedInstitution = await InstitutionshModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedInstitution);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Update an Institution by Name
export async function updateInstitutionByName(req, res) {
    try {
        const updatedInstitution = await InstitutionshModel.findOneAndUpdate(
            { institutionName: req.params.name }, // Use an object to specify the query criteria
            req.body, // Update document
            { new: true } // Options
        );
        
        if (!updatedInstitution) {
            return res.status(404).json({ message: "Institution not found" });
        }

        res.json(updatedInstitution);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Delete a Institution by ID
export async function deleteInstitution(req, res) {
    try {
        await InstitutionshModel.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Institution deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update an Institution by Name
export async function deleteInstitutionByName(req, res) {
    try {
        const deletedInstitution = await InstitutionshModel.findOneAndDelete(
            { institutionName: req.params.name }, // Use an object to specify the query criteria
        );
        
        if (!deletedInstitution) {
            return res.status(404).json({ message: "Institution not found" });
        }

        res.json(deletedInstitution);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// export default { createInstitution, getAllInstitutions, getInstitutionById, updateInstitution, deleteInstitution };
export default {
    createInstitution,
    getAllInstitutions,
    getInstitutionById,
    updateInstitution,
    updateInstitutionByName,
    deleteInstitution,
    deleteInstitutionByName
};