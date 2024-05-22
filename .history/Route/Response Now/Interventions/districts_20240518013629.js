const  { 
    getDistricts,
    createDistrict,
    updateDistrictByID,
    deleteDistrictByID,
} from '../../../Controller/Response Now/Interventions/districts_api_controller.js').default

const express from 'express');
const router = express.Router();


// Get a list of districts from the DB
router.get('/district/', getDistricts);

// Add new district to the DB
router.post('/district/', createDistrict);

// Update a district in the DB
router.put('/district/districtid/:id', updateDistrictByID);

// Delete a district from the DB
router.delete('/district/districtid/:id', deleteDistrictByID);

export default  router;