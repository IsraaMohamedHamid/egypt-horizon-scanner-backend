///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createIssueSourceCategory,
  getAllIssueSourceCategorys,
  getIssueSourceCategoryById,
  updateIssueSourceCategory,
  deleteIssueSourceCategory
} = require("../Controller/Dimensions and Pillars/issuesourcecategoryController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
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
module.exports = router;
