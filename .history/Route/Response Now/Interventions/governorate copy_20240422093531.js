const  { 
    getMunicipalDivisions,
    createMunicipalDivision,
    updateMunicipalDivisionByID,
    updateMunicipalDivisionByMunicipalDivisionNameEN,
    deleteMunicipalDivisionByID,
    deleteMunicipalDivisionByMunicipalDivisionNameEN,
    countMostInterventionTypePerMunicipalDivision
} from '../../../Controller/Response Now/Interventions/municipal_divisions_api_controller.js')

const express from 'express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/municipal-division/', getMunicipalDivisions);

// Add new municipal-division to the DB
router.post('/municipal-division/', createMunicipalDivision);

// Update a municipal-division in the DB
router.put('/municipal-division/municipal-divisionid/:id', updateMunicipalDivisionByID);

router.put('/municipal-division/municipal-divisionnameen/:municipalDivisionNameEN', updateMunicipalDivisionByMunicipalDivisionNameEN);

// Delete a municipal-division from the DB
router.delete('/municipal-division/municipal-divisionid/:id', deleteMunicipalDivisionByID);

router.put('/municipal-division/municipal-divisionnameen/:municipalDivisionNameEN', deleteMunicipalDivisionByMunicipalDivisionNameEN);

// Count projects based on themes and City
router.get('/municipal-division/count/theme', countMostInterventionTypePerMunicipalDivision);

export default  router;