///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createDimensionDefinition,
  getAllDimensionDefinitions,
  getDimensionDefinitionById,
  updateDimensionDefinition,
  deleteDimensionDefinition
} from "../controllers/dimensiondefinitionController");

///---------------------- LIBRARIES ----------------------///
const express from "express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new DimensionDefinition
router.post('/createDimensionDefinition/', createDimensionDefinition);

// Get all DimensionDefinitions
router.get('/', getAllDimensionDefinitions);

// Get a DimensionDefinition by ID
router.get('/:id', getDimensionDefinitionById);

// Update a DimensionDefinition by ID
router.put('/:id', updateDimensionDefinition);

// Delete a DimensionDefinition by ID
router.delete('/:id', deleteDimensionDefinition);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
