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
router.get('/municipal_division/', getMunicipalDivisions);

// Add new municipal_division to the DB
router.post('/municipal_division/', createMunicipalDivision);

// Update a municipal_division in the DB
router.put('/municipal_division/municipal_divisionid/:id', updateMunicipalDivisionByID);

router.put('/municipal_division/municipal_divisionnameen/:municipal_divisionNameEN', updateMunicipalDivisionByMunicipalDivisionNameEN);

// Delete a municipal_division from the DB
router.delete('/municipal_division/municipal_divisionid/:id', deleteMunicipalDivisionByID);

router.put('/municipal_division/municipal_divisionnameen/:municipal_divisionNameEN', deleteMunicipalDivisionByMunicipalDivisionNameEN);

// Count projects based on themes and City
router.get('/municipal_division/count/theme', countMostInterventionTypePerMunicipalDivision);

module.exports = router;