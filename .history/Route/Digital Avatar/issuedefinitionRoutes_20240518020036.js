///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import { createIssueDefinition, getAllIssueDefinitions, getIssueDefinitionById, updateIssueDefinition, deleteIssueDefinition } from "../../Controller/Digital Avatar/issuedefinitionController";

///---------------------- LIBRARIES ----------------------///
import { Router } from "express";
const router = Router();

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
export default router;
