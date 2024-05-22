///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import { createDimensionDefinition, getAllDimensionDefinitions, getDimensionDefinitionById, updateDimensionDefinition, deleteDimensionDefinition } from "../../Controller/Digital Avatar/dimensiondefinitionController.js";

///---------------------- LIBRARIES ----------------------///
import { Router } from "express";
const router = Router();

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
export default router;
