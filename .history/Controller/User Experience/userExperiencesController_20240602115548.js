import {
    userExperiencesSchema,
    UserExperienceshModel
} from '../../Model/User Experience/user_experience_model.js';

// Create a new UserExperience
export async function createUserExperience(req, res) {
    const newUserExperience = new attendantsSchema(req.body);
    try {
        await newUserExperience.save();
        res.status(201).json(newUserExperience);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Get all UserExperiences
export async function getAllUserExperiences(req, res) {
    try {
        const attendants = await UserExperienceshModel.find();
        res.json(attendants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get a single UserExperience by ID
export async function getUserExperienceById(req, res) {
    try {
        const attendants = await UserExperienceshModel.findById(req.params.id);
        if (!attendants) return res.status(404).json({
            message: 'UserExperience not found'
        });
        res.json(attendants);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update a UserExperience by ID
export async function updateUserExperience(req, res) {
    try {
        const updatedUserExperience = await UserExperienceshModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(updatedUserExperience);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Update an UserExperience by Name
export async function updateUserExperienceByName(req, res) {
    try {
        const updatedUserExperience = await UserExperienceshModel.findOneAndUpdate(
            { attendantName: req.params.name }, // Use an object to specify the query criteria
            req.body, // Update document
            { new: true } // Options
        );
        
        if (!updatedUserExperience) {
            return res.status(404).json({ message: "UserExperience not found" });
        }

        res.json(updatedUserExperience);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Delete a UserExperience by ID
export async function deleteUserExperience(req, res) {
    try {
        await UserExperienceshModel.findByIdAndDelete(req.params.id);
        res.json({
            message: 'UserExperience deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update an UserExperience by Name
export async function deleteUserExperienceByName(req, res) {
    try {
        const deletedUserExperience = await UserExperienceshModel.findOneAndDelete(
            { attendantName: req.params.name }, // Use an object to specify the query criteria
        );
        
        if (!deletedUserExperience) {
            return res.status(404).json({ message: "UserExperience not found" });
        }

        res.json(deletedUserExperience);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// export default { createUserExperience, getAllUserExperiences, getUserExperienceById, updateUserExperience, deleteUserExperience };
export default {
    createUserExperience,
    getAllUserExperiences,
    getUserExperienceById,
    updateUserExperience,
    updateUserExperienceByName,
    deleteUserExperience,
    deleteUserExperienceByName
};