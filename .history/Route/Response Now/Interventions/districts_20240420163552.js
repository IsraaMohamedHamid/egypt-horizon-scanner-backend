const  { 
    getCities,
    createDistrict,
    updateDistrictByID,
    updateDistrictByDistrictName,
    deleteDistrictByID,
    deleteDistrictByDistrictName,
    countMostInterventionTypePerDistrict
} = require('../../../Controller/Response Now/Interventions/districts_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of districts from the DB
router.get('/district/', getCities);

// Add new district to the DB
router.post('/district/', createDistrict);

// Update a district in the DB
router.put('/district/districtid/:id', updateDistrictByID);

router.put('/district/districtnameen/:districtNameEN', updateDistrictByDistrictName);

// Delete a district from the DB
router.delete('/district/districtid/:id', deleteDistrictByID);

router.delete('/district/districtnameen/:districtNameEN', deleteDistrictByDistrictName);

// Count projects based on themes and District
router.get('/district/count/theme', countMostInterventionTypePerDistrict);

module.exports = router;