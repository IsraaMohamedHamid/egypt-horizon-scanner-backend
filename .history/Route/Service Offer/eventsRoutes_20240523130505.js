///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../../Controller/Service Offer/eventsController.js";

///---------------------- LIBRARIES ----------------------///
import { Router } from "express";
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

// Delete a Event by ID
router.delete('/deleteEvent/:id', deleteEvent);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;
