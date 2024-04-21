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
router.get('/city/', getCities);

// Add new city to the DB
router.post('/city/', createCity);

// Update a city in the DB
router.put('/city/cityid/:id', updateCityByID);

router.put('/city/citynameen/:cityNameEN', updateCityByCityName);

// Delete a city from the DB
router.delete('/city/cityid/:id', deleteCityByID);

router.delete('/city/citynameen/:cityNameEN', deleteCityByCityName);

// Count projects based on themes and City
router.get('/city/count/theme', countMostInterventionTypePerCity);

module.exports = router;