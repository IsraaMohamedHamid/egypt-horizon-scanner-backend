///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
    createStakeholder,
    getAllStakeholders,
    getStakeholderById,
    updateStakeholder,
    updateStakeholderByName,
    deleteStakeholder,
    deleteStakeholderByName
} from "../../Controller/Service Offer/stakeholdersController.js";

///---------------------- LIBRARIES ----------------------///
import {
    Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Stakeholder
router.post('/createStakeholder/', createStakeholder);

// Get all Stakeholders
router.get('/getAllStakeholders/', getAllStakeholders);

// Get a Stakeholder by ID
router.get('/getStakeholderById/:id', getStakeholderById);

// Update a Stakeholder by ID
router.put('/updateStakeholder/:id/', updateStakeholder);

// Update a Stakeholder by Name
router.put('/updateStakeholderByName/:name/', updateStakeholderByName);

// Delete a Stakeholder by ID
router.delete('/deleteStakeholder/:id/', deleteStakeholder);

// Delete a Stakeholder by Name
router.delete('/deleteStakeholderByName/:name/', deleteStakeholderByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;