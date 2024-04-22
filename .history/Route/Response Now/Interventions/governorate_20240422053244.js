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
router.get('/getGovernorates/', getGovernorates);

// Add new governorate to the DB
router.post('/createGovernorate/', createGovernorate);

// Update a governorate in the DB
router.put('/updateGovernorateByID/:id', updateGovernorateByID);

router.put('/updateGovernorateByGovernorateNameEN/:governorateNameEN', updateGovernorateByGovernorateNameEN);

// Delete a governorate from the DB
router.delete('/deleteGovernorateByID/:id', deleteGovernorateByID);

router.put('/deleteGovernorateByGovernorateNameEN/:governorateNameEN', deleteGovernorateByGovernorateNameEN);

// Count projects based on themes and City
router.get('/governorate/count/theme', countMostInterventionTypePerGovernorate);

module.exports = router;