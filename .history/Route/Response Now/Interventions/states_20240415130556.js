const  { 
    getStates,
    createState,
    updateStateByID,
    updateStateByStateNameEN,
    deleteStateByID,
    deleteStateByStateNameEN,
    countMostInterventionTypePerState
} from '../../Controller/Interventions/states_api_controller.js')

const express from 'express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/state/', getStates);

// Add new state to the DB
router.post('/state/', createState);

// Update a state in the DB
router.put('/state/stateid/:id', updateStateByID);

router.put('/state/statenameen/:stateNameEN', updateStateByStateNameEN);

// Delete a state from the DB
router.delete('/state/stateid/:id', deleteStateByID);

router.put('/state/statenameen/:stateNameEN', deleteStateByStateNameEN);

// Count projects based on themes and City
router.get('/state/count/theme', countMostInterventionTypePerState);

export default  router;