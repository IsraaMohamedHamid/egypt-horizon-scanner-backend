///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
  createUserHistory,
  getAllUserHistories,
  getUserHistoryById,
  updateUserHistory,
  updateUserHistoryByName,
  deleteUserHistory,
  deleteUserHistoryByName
} from "../../Controller/Users/user_history_api_controller.js";

///---------------------- LIBRARIES ----------------------///
import {
  Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new UserHistory
router.post('/createUserHistory/', createUserHistory);

// Get all UserHistories
router.get('/getAllUserHistories/', getAllUserHistories);

// Get a UserHistory by ID
router.get('/getUserHistoryById/:id', getUserHistoryById);

// Update a UserHistory by ID
router.post('/updateUserHistory/:id/', updateUserHistory);

// Update a UserHistory by Name
router.post('/updateUserHistoryByName/:userHistoryName/:userHistoryEmail', updateUserHistoryByName);

// Delete a UserHistory by ID
router.delete('/deleteUserHistory/:id/', deleteUserHistory);

// Delete a UserHistory by Name
router.delete('/deleteUserHistoryByName/:userHistoryName/:userHistoryEmail', deleteUserHistoryByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;