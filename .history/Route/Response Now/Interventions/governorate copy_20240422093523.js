const  { 
    getMunicipalDivisions,
    createMunicipalDivision,
    updateMunicipalDivisionByID,
    updateMunicipalDivisionByMunicipalDivisionNameEN,
    deleteMunicipalDivisionByID,
    deleteMunicipalDivisionByMunicipalDivisionNameEN,
    countMostInterventionTypePerMunicipalDivision
} = require('../../../Controller/Response Now/Interventions/municipal_divisions_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/municipal-division/', getMunicipalDivisions);

// Add new municipal-division to the DB
router.post('/municipal-division/', createMunicipalDivision);

// Update a municipal-division in the DB
router.put('/municipal-division/municipal-divisionid/:id', updateMunicipalDivisionByID);

router.put('/municipal-division/municipal-divisionnameen/:municipal-divisionNameEN', updateMunicipalDivisionByMunicipalDivisionNameEN);

// Delete a municipal-division from the DB
router.delete('/municipal-division/municipal-divisionid/:id', deleteMunicipalDivisionByID);

router.put('/municipal-division/municipal-divisionnameen/:municipal-divisionNameEN', deleteMunicipalDivisionByMunicipalDivisionNameEN);

// Count projects based on themes and City
router.get('/municipal-division/count/theme', countMostInterventionTypePerMunicipalDivision);

module.exports = router;