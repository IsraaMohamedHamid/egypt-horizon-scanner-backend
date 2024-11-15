const  { 
    getCities,
    createDistrict,
    updateDistrictByID,
    updateDistrictByDistrictName,
    deleteDistrictByID,
    deleteDistrictByDistrictName,
    countMostInterventionTypePerDistrict
} from '../../../Controller/Response Now/Interventions/cities_api_controller.js')

const express from 'express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/District/', getCities);

// Add new District to the DB
router.post('/District/', createDistrict);

// Update a District in the DB
router.put('/District/Districtid/:id', updateDistrictByID);

router.put('/District/Districtnameen/:DistrictNameEN', updateDistrictByDistrictName);

// Delete a District from the DB
router.delete('/District/Districtid/:id', deleteDistrictByID);

router.delete('/District/Districtnameen/:DistrictNameEN', deleteDistrictByDistrictName);

// Count projects based on themes and District
router.get('/District/count/theme', countMostInterventionTypePerDistrict);

export default  router;