///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import { createDimension, getAllDimensions, getAllDimensionsWithUpdate, getDimensionById, updateDimension, deleteDimension } from "../../Controller/Digital Avatar/dimensionController.js";

///---------------------- LIBRARIES ----------------------///
import { Router } from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Dimension
router.post('/createDimension/', createDimension);

// Get all Dimensions
router.get('/getAllDimensions/', getAllDimensions);

// U

// Get a Dimension by ID
router.get('/getDimensionById/:id', getDimensionById);

// Update a Dimension by ID
router.put('/updateDimension/:id', updateDimension);

// Delete a Dimension by ID
router.delete('/deleteDimension/:id', deleteDimension);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;
