///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createDimensionDefinition,
  getAllDimensionDefinitions,
  getDimensionDefinitionById,
  updateDimensionDefinition,
  deleteDimensionDefinition
} from "../Controller/Digital Avatar/dimensionController");

///---------------------- LIBRARIES ----------------------///
const express from "express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new DimensionDefinition
router.post('/createDimensionDefinition/', createDimensionDefinition);

// Get all DimensionDefinitions
router.get('/getAllDimensionDefinitions/', getAllDimensionDefinitions);

// Get a DimensionDefinition by ID
router.get('/getDimensionDefinitionById/:id', getDimensionDefinitionById);

// Update a DimensionDefinition by ID
router.put('/updateDimensionDefinition/:id', updateDimensionDefinition);

// Delete a DimensionDefinition by ID
router.delete('/deleteDimensionDefinition/:id', deleteDimensionDefinition);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
