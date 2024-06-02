///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
    createAttendant,
    getAllAttendants,
    getAttendantById,
    updateAttendant,
    updateAttendantByName,
    deleteAttendant,
    deleteAttendantByName
} from "../../Controller/Service Offer/userExperiencesController.js";

///---------------------- LIBRARIES ----------------------///
import {
    Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Attendant
router.post('/createAttendant/', createAttendant);

// Get all Attendants
router.get('/getAllAttendants/', getAllAttendants);

// Get a Attendant by ID
router.get('/getAttendantById/:id', getAttendantById);

// Update a Attendant by ID
router.put('/updateAttendant/:id/', updateAttendant);

// Update a Attendant by Name
router.put('/updateAttendantByName/:name/', updateAttendantByName);

// Delete a Attendant by ID
router.delete('/deleteAttendant/:id/', deleteAttendant);

// Delete a Attendant by Name
router.delete('/deleteAttendantByName/:name/', deleteAttendantByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;