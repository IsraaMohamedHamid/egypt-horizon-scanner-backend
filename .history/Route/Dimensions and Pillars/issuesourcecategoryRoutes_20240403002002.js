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
router.post('/', createIssueSourceCategory);

// Get all IssueSourceCategorys
router.get('/', getAllIssueSourceCategorys);

// Get a IssueSourceCategory by ID
router.get('/:id', getIssueSourceCategoryById);

// Update a IssueSourceCategory by ID
router.put('/:id', updateIssueSourceCategory);

// Delete a IssueSourceCategory by ID
router.delete('/:id', deleteIssueSourceCategory);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
