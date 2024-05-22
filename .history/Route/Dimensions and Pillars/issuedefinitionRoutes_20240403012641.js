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
router.post('/createIssueDefinition/', createIssueDefinition);

// Get all IssueDefinitions
router.get('/getAllIssueDefinitions/', getAllIssueDefinitions);

// Get a IssueDefinition by ID
router.get('/getIssueDefinitionById/:id', getIssueDefinitionById);

// Update a IssueDefinition by ID
router.put('/updateIssueDefinition/:id', updateIssueDefinition);

// Delete a IssueDefinition by ID
router.delete('/deleteIssueDefinition/:id', deleteIssueDefinition);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
