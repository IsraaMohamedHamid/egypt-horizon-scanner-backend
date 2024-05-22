import default from '../../../Controller/Response Now/Interventions/municipal_divisions_api_controller.js';
const {
    getMunicipalDivisions, createMunicipalDivision, updateMunicipalDivisionByID, updateMunicipalDivisionByMunicipalDivisionNameEN, deleteMunicipalDivisionByID, deleteMunicipalDivisionByMunicipalDivisionNameEN
} = ;
import { Router } from 'express';
const router = Router();


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

export default router;