import {
    PartnerSchema,
    PartnerModel
} from '../../Model/Service Offer/partner_model.js';

// Create a new Partner
export async function createPartner(req, res) {
    // Use the model to create a new document
    const newPartner = new PartnerModel(req.body);
    try {
        await newPartner.save();
        res.status(201).json(newPartner);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Get all Partners
export async function getAllPartners(req, res) {
    try {
        const partners = await PartnerModel.find();
        res.json(partners);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get a single Partner by ID
export async function getPartnerById(req, res) {
    try {
        const partner = await PartnerModel.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({
                message: 'Partner not found'
            });
        }
        res.json(partner);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update a Partner by ID
export async function updatePartner(req, res) {
    try {
        const updatedPartner = await PartnerModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );
        if (!updatedPartner) {
            return res.status(404).json({
                message: 'Partner not found'
            });
        }
        res.json(updatedPartner);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Update a Partner by Name
export async function updatePartnerByName(req, res) {
    try {
        const updatedPartner = await PartnerModel.findOneAndUpdate(
            { partnerName: req.params.name }, // Use an object to specify the query criteria
            req.body, // Update document
            { new: true } // Options
        );
        
        if (!updatedPartner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        res.json(updatedPartner);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Delete a Partner by ID
export async function deletePartner(req, res) {
    try {
        const deletedPartner = await PartnerModel.findByIdAndDelete(req.params.id);
        if (!deletedPartner) {
            return res.status(404).json({
                message: 'Partner not found'
            });
        }
        res.json({
            message: 'Partner deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Delete a Partner by Name
export async function deletePartnerByName(req, res) {
    try {
        const deletedPartner = await PartnerModel.findOneAndDelete(
            { partnerName: req.params.name } // Use an object to specify the query criteria
        );
        
        if (!deletedPartner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        res.json({
            message: 'Partner deleted'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Export the functions as a module
export default {
    createPartner,
    getAllPartners,
    getPartnerById,
    updatePartner,
    updatePartnerByName,
    deletePartner,
    deletePartnerByName
};