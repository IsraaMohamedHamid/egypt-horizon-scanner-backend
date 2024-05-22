import { default as districtsApiController } from '../../../Controller/Response Now/Interventions/districts_api_controller.js';
const {
    getDistricts, createDistrict, updateDistrictByID, deleteDistrictByID,
} = districtsApiController;

import { Router } from 'express';
const router = Router();


// Get a list of districts from the DB
router.get('/district/', getDistricts);

// Add new district to the DB
router.post('/district/', createDistrict);

// Update a district in the DB
router.put('/district/districtid/:id', updateDistrictByID);

// Delete a district from the DB
router.delete('/district/districtid/:id', deleteDistrictByID);

export default router;