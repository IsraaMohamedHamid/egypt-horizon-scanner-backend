const  { 
    getCities,
    createCity,
    updateCityByID,
    deleteCityByID
} from '../../../Controller/Response Now/Interventions/cities_api_controller.js').default

const express from 'express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/city/', getCities);

// Add new city to the DB
router.post('/city/', createCity);

// Update a city in the DB
router.put('/city/cityid/:id', updateCityByID);

// Delete a city from the DB
router.delete('/city/cityid/:id', deleteCityByID);

export default  router;