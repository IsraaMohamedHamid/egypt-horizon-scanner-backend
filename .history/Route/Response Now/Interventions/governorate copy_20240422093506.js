const  { 
    getMunicipalDivisions,
    createMunicipalDivision,
    updateMunicipalDivisionByID,
    updateMunicipalDivisionByMunicipalDivisionNameEN,
    deleteMunicipalDivisionByID,
    deleteMunicipalDivisionByMunicipalDivisionNameEN,
    countMostInterventionTypePerMunicipalDivision
} from '../../../Controller/Response Now/Interventions/')

const express from 'express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/governorate/', getMunicipalDivisions);

// Add new governorate to the DB
router.post('/governorate/', createMunicipalDivision);

// Update a governorate in the DB
router.put('/governorate/governorateid/:id', updateMunicipalDivisionByID);

router.put('/governorate/governoratenameen/:governorateNameEN', updateMunicipalDivisionByMunicipalDivisionNameEN);

// Delete a governorate from the DB
router.delete('/governorate/governorateid/:id', deleteMunicipalDivisionByID);

router.put('/governorate/governoratenameen/:governorateNameEN', deleteMunicipalDivisionByMunicipalDivisionNameEN);

// Count projects based on themes and City
router.get('/governorate/count/theme', countMostInterventionTypePerMunicipalDivision);

export default  router;