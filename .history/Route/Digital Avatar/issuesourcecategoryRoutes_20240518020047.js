///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import { createIssueSourceCategory, getAllIssueSourceCategorys, getIssueSourceCategoryById, updateIssueSourceCategory, deleteIssueSourceCategory } from "../../Controller/Digital Avatar/issuesourcecategoryController";

///---------------------- LIBRARIES ----------------------///
import { Router } from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new IssueSourceCategory
router.post('/createIssueSourceCategory/', createIssueSourceCategory);

// Get all IssueSourceCategorys
router.get('/getAllIssueSourceCategorys/', getAllIssueSourceCategorys);

// Get a IssueSourceCategory by ID
router.get('/getIssueSourceCategoryById/:id', getIssueSourceCategoryById);

// Update a IssueSourceCategory by ID
router.put('/updateIssueSourceCategory/:id', updateIssueSourceCategory);

// Delete a IssueSourceCategory by ID
router.delete('/deleteIssueSourceCategory/:id', deleteIssueSourceCategory);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;
