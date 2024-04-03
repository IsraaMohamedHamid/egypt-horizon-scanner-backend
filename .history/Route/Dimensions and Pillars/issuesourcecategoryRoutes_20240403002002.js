///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssueSourceCategory,
  getAllIssueSourceCategorys,
  getIssueSourceCategoryById,
  updateIssueSourceCategory,
  deleteIssueSourceCategory
} = require("../controllers/issuesourcecategoryController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
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
module.exports = router;
