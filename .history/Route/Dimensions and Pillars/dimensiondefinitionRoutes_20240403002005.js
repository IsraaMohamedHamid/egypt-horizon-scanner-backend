///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createDimensionDefinition,
  getAllDimensionDefinitions,
  getDimensionDefinitionById,
  updateDimensionDefinition,
  deleteDimensionDefinition
} = require("../controllers/dimensiondefinitionController");

///---------------------- LIBRARIES ----------------------///
const express = require("express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new DimensionDefinition
router.post('/', createDimensionDefinition);

// Get all DimensionDefinitions
router.get('/', getAllDimensionDefinitions);

// Get a DimensionDefinition by ID
router.get('/:id', getDimensionDefinitionById);

// Update a DimensionDefinition by ID
router.put('/:id', updateDimensionDefinition);

// Delete a DimensionDefinition by ID
router.delete('/:id', deleteDimensionDefinition);

///------------------------------------------ EXPORTS ------------------------------------------///
module.exports = router;
