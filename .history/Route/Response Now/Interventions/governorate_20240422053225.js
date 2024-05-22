const  { 
    getGovernorates,
    createGovernorate,
    updateGovernorateByID,
    updateGovernorateByGovernorateNameEN,
    deleteGovernorateByID,
    deleteGovernorateByGovernorateNameEN,
    countMostInterventionTypePerGovernorate
} from '../../../Controller/Response Now/Interventions/governorates_api_controller.js')

const express from 'express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/getGovernorates/', getGovernorates);

// Add new governorate to the DB
router.post('/createGovernorate/', createGovernorate);

// Update a governorate in the DB
router.put('/governorate/governorateid/:id', updateGovernorateByID);

router.put('/governorate/governoratenameen/:governorateNameEN', updateGovernorateByGovernorateNameEN);

// Delete a governorate from the DB
router.delete('/governorate/governorateid/:id', deleteGovernorateByID);

router.put('/governorate/governoratenameen/:governorateNameEN', deleteGovernorateByGovernorateNameEN);

// Count projects based on themes and City
router.get('/governorate/count/theme', countMostInterventionTypePerGovernorate);

export default  router;