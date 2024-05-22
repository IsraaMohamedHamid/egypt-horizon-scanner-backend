///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssueSourceCategory,
  getAllIssueSourceCategorys,
  getIssueSourceCategoryById,
  updateIssueSourceCategory,
  deleteIssueSourceCategory
} from "../controllers/issuesourcecategoryController");

///---------------------- LIBRARIES ----------------------///
const express from "express");
const router = express.Router();

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
export default  router;
