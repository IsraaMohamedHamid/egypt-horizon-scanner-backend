///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssueDefinition,
  getAllIssueDefinitions,
  getIssueDefinitionById,
  updateIssueDefinition,
  deleteIssueDefinition
} from "../controllers/issuedefinitionController");

///---------------------- LIBRARIES ----------------------///
const express from "express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new IssueDefinition
router.post('/', createIssueDefinition);

// Get all IssueDefinitions
router.get('/', getAllIssueDefinitions);

// Get a IssueDefinition by ID
router.get('/:id', getIssueDefinitionById);

// Update a IssueDefinition by ID
router.put('/:id', updateIssueDefinition);

// Delete a IssueDefinition by ID
router.delete('/:id', deleteIssueDefinition);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
