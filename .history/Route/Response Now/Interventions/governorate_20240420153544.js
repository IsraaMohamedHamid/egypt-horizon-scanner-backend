const  { 
    getGovernorates,
    createGovernorate,
    updateGovernorateByID,
    updateGovernorateByGovernorateNameEN,
    deleteGovernorateByID,
    deleteGovernorateByGovernorateNameEN,
    countMostInterventionTypePerGovernorate
} = require('../../../Controller/Response Now/Interventions/states_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/state/', getGovernorates);

// Add new state to the DB
router.post('/state/', createGovernorate);

// Update a state in the DB
router.put('/state/stateid/:id', updateGovernorateByID);

router.put('/state/statenameen/:stateNameEN', updateGovernorateByGovernorateNameEN);

// Delete a state from the DB
router.delete('/state/stateid/:id', deleteGovernorateByID);

router.put('/state/statenameen/:stateNameEN', deleteGovernorateByGovernorateNameEN);

// Count projects based on themes and City
router.get('/state/count/theme', countMostInterventionTypePerGovernorate);

module.exports = router;