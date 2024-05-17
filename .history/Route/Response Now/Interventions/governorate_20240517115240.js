const  { 
    getGovernorates,
    createGovernorate,
    updateGovernorateByID,
    updateGovernorateByGovernorateNameEN,
    deleteGovernorateByID,
    deleteGovernorateByGovernorateNameEN,
    countMostInterventionTypePerGovernorate
} = require('../../../Controller/Response Now/Interventions/governorates_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/governorate/', getGovernorates);

// Add new governorate to the DB
router.post('/governorate/', createGovernorate);

// Update a governorate in the DB
router.put('/governorate/governorateid/:id', updateGovernorateByID);

router.put('/governorate/governoratenameen/:governorateNameEN', updateGovernorateByGovernorateNameEN);

// Delete a governorate from the DB
router.delete('/governorate/governorateid/:id', deleteGovernorateByID);

router.put('/governorate/governoratenameen/:governorateNameEN', deleteGovernorateByGovernorateNameEN);

module.exports = router;