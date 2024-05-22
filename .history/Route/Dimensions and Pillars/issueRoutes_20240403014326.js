///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} from "../Controller/issueController");

///---------------------- LIBRARIES ----------------------///
const express from "express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Issue
router.post('/createIssue/', createIssue);

// Get all Issues
router.get('/getAllIssues/', getAllIssues);

// Get a Issue by ID
router.get('/getIssueById/:id', getIssueById);

// Update a Issue by ID
router.put('/updateIssue/:id', updateIssue);

// Delete a Issue by ID
router.delete('/deleteIssue/:id', deleteIssue);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
