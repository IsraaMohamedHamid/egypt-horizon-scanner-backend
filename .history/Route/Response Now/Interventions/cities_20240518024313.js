import {
    getCities,
    createCity,
    updateCityByID,
    updateCityByCityNameEN,
    deleteCityByID,
    deleteCityByCityNameEN
} from '../../../Controller/Response Now/Interventions/cities_api_controller.js';

import {
    Router
} from 'express';
const router = Router();


// Get a list of cities from the DB
router.get('/city/', getCities);

// Add new city to the DB
router.post('/city/', createCity);

// Update a city in the DB
router.put('/city/cityid/:id', updateCityByID);

// Update a city in the DB
router.put('/city/citynameen/:citynameen', updateCityByCityNameEN);

// Delete a city from the DB
router.delete('/city/cityid/:id', deleteCityByID);

// Delete a city from the DB
router.delete('/city/citynameen/:citynameen', deleteCityByCityNameEN);

export default router;