///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
const {
  createDimension,
  getAllDimensions,
  getDimensionById,
  updateDimension,
  deleteDimension
} from "../controllers/dimensionController");

///---------------------- LIBRARIES ----------------------///
const express from "express");
const router = express.Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new Dimension
router.post('/createDimension/', createDimension);

// Get all Dimensions
router.get('/getAllDimensions/', getAllDimensions);

// Get a Dimension by ID
router.get('/getDimensionById/:id', getDimensionById);

// Update a Dimension by ID
router.put('/updateDimension/:id', updateDimension);

// Delete a Dimension by ID
router.delete('/deleteDimension/:id', deleteDimension);

///------------------------------------------ EXPORTS ------------------------------------------///
export default  router;
