///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} = require("../Controller/issueController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
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
module.exports = router;
