///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createDimension,
  getAllDimensions,
  getDimensionById,
  updateDimension,
  deleteDimension
} = require("../controllers/dimensionController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Dimension
router.post('/createDimension/', createDimension);

// Get all Dimensions
router.get('/', getAllDimensions);

// Get a Dimension by ID
router.get('/:id', getDimensionById);

// Update a Dimension by ID
router.put('/:id', updateDimension);

// Delete a Dimension by ID
router.delete('/:id', deleteDimension);

///------------------------------------------ EXPORTS ------------------------------------------///
module.exports = router;
