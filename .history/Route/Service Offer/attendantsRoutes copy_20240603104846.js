///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
    createInstitution,
    getAllInstitutions,
    getInstitutionById,
    updateInstitution,
    updateInstitutionByName,
    deleteInstitution,
    deleteInstitutionByName
} from "../../Controller/Service Offer/institutionsController.js";

///---------------------- LIBRARIES ----------------------///
import {
    Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Institution
router.post('/createInstitution/', createInstitution);

// Get all Institutions
router.get('/getAllInstitutions/', getAllInstitutions);

// Get a Institution by ID
router.get('/getInstitutionById/:id', getInstitutionById);

// Update a Institution by ID
router.put('/updateInstitution/:id/', updateInstitution);

// Update a Institution by Name
router.put('/updateInstitutionByName/:name/', updateInstitutionByName);

// Delete a Institution by ID
router.delete('/deleteInstitution/:id/', deleteInstitution);

// Delete a Institution by Name
router.delete('/deleteInstitutionByName/:name/', deleteInstitutionByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;