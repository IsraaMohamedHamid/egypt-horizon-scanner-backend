///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
    createPartner,
    getAllPartners,
    getPartnerById,
    updatePartner,
    updatePartnerByName,
    deletePartner,
    deletePartnerByName
} from "../../Controller/Service Offer/partnerController.js";

///---------------------- LIBRARIES ----------------------///
import { Router } from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Partner
router.post('/createPartner/', createPartner);

// Get all Partners
router.get('/getAllPartners/', getAllPartners);

// Get a Partner by ID
router.get('/getPartnerById/:id', getPartnerById);

// Update a Partner by ID
router.put('/updatePartner/:id/', updatePartner);

// Update a Partner by Name
router.put('/updatePartnerByName/:name/', updatePartnerByName);

// Delete a Partner by ID
router.delete('/deletePartner/:id/', deletePartner);

// Delete a Partner by Name
router.delete('/deletePartnerByName/:name/', deletePartnerByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;