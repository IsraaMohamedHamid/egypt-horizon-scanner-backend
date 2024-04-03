///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssueDefinition,
  getAllIssueDefinitions,
  getIssueDefinitionById,
  updateIssueDefinition,
  deleteIssueDefinition
} = require("../controllers/issuedefinitionController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new IssueDefinition
router.post('/createIssueDefinition/', createIssueDefinition);

// Get all IssueDefinitions
router.get('/', getAllIssueDefinitions);

// Get a IssueDefinition by ID
router.get('/:id', getIssueDefinitionById);

// Update a IssueDefinition by ID
router.put('/:id', updateIssueDefinition);

// Delete a IssueDefinition by ID
router.delete('/:id', deleteIssueDefinition);

///------------------------------------------ EXPORTS ------------------------------------------///
module.exports = router;
