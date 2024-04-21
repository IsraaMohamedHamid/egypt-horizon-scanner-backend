const  { 
    getCities,
    createCity,
    updateCityByID,
    updateCityByCityName,
    deleteCityByID,
    deleteCityByCityName,
    countMostInterventionTypePerCity
} = require('../../../Controller/Response Now/Interventions/districts_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of districts from the DB
router.get('/district/', getCities);

// Add new district to the DB
router.post('/district/', createCity);

// Update a district in the DB
router.put('/district/districtid/:id', updateCityByID);

router.put('/district/districtnameen/:districtNameEN', updateCityByCityName);

// Delete a district from the DB
router.delete('/district/districtid/:id', deleteCityByID);

router.delete('/district/districtnameen/:districtNameEN', deleteCityByCityName);

// Count projects based on themes and City
router.get('/district/count/theme', countMostInterventionTypePerCity);

module.exports = router;