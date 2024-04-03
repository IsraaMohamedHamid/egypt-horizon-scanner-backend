///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} = require("../controllers/issueController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Issue
router.post('/createIssue/', createIssue);

// Get all Issues
router.get('/getAllIssues/', getAllIssues);

// Get a Issue by ID
router.get('/:id', getIssueById);

// Update a Issue by ID
router.put('/:id', updateIssue);

// Delete a Issue by ID
router.delete('/:id', deleteIssue);

///------------------------------------------ EXPORTS ------------------------------------------///
module.exports = router;
