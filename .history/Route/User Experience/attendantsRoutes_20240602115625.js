///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
    createUserExperience,
    getAllUserExperiences,
    getUserExperienceById,
    updateUserExperience,
    updateUserExperienceByName,
    deleteUserExperience,
    deleteUserExperienceByName
} from "../../Controller/User Experience/attendantsController.js";

///---------------------- LIBRARIES ----------------------///
import {
    Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new UserExperience
router.post('/createUserExperience/', createUserExperience);

// Get all UserExperiences
router.get('/getAllUserExperiences/', getAllUserExperiences);

// Get a UserExperience by ID
router.get('/getUserExperienceById/:id', getUserExperienceById);

// Update a UserExperience by ID
router.put('/updateUserExperience/:id/', updateUserExperience);

// Update a UserExperience by Name
router.put('/updateUserExperienceByName/:name/', updateUserExperienceByName);

// Delete a UserExperience by ID
router.delete('/deleteUserExperience/:id/', deleteUserExperience);

// Delete a UserExperience by Name
router.delete('/deleteUserExperienceByName/:name/', deleteUserExperienceByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;