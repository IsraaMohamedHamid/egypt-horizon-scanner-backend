///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    updateEventByName,
    deleteEvent,
    deleteEventByName
} from "../../Controller/Service Offer/eventsController.js";

///---------------------- LIBRARIES ----------------------///
import {
    Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Event
router.post('/createEvent/', createEvent);

// Get all Events
router.get('/getAllEvents/', getAllEvents);

// Get a Event by ID
router.get('/getEventById/:id', getEventById);

// Update a Event by ID
router.put('/updateEvent/:id', updateEvent);

// Update a Event by Name
router.put('/updateEventByName/:name', updateEventByName);

// Delete a Event by ID
router.delete('/deleteEvent/:id', deleteEvent);

// Delete a Event by Name
router.delete('/deleteEventByName/:name/', deleteEventByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;