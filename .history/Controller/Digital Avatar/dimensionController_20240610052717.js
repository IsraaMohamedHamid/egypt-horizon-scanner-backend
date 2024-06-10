
import { dimensionSchema,
    DimensionshModel } from '../../Model/Digital Avatar/dimension.js';

// Create a new Dimension
export async function createDimension(req, res) {
    const newDimension = new dimensionSchema(req.body);
    try {
        await newDimension.save();
        res.status(201).json(newDimension);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all Dimensions
export async function getAllDimensions(req, res) {
    try {
        const dimensions = await DimensionshModel.find();
        res.json(dimensions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Get a list of all emerging issues from the DB
export const getAllDimensionsWithUpdate = asyncHandler(async (req, res) => {
    console.log('START: Data retrieval and processing.');
  
    // await emergingIssueDataSummary(issues);
    // await emergingIssueDataUpdate();
    // await emergingIssueComponentsCalculation();
    console.log('END: Summary and Sentiment analysis.');
  
    const emergingIssues = await DimensionshModel.find({}).sort(commonSort);
    console.log('Data retrieval and processing completed.');
    res.send(emergingIssues.length ? emergingIssues : 'No emerging issues found.');
  });

// Get a single Dimension by ID
export async function getDimensionById(req, res) {
    try {
        const dimension = await DimensionshModel.findById(req.params.id);
        if (!dimension) return res.status(404).json({ message: 'Dimension not found' });
        res.json(dimension);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a Dimension by ID
export async function updateDimension(req, res) {
    try {
        const updatedDimension = await DimensionshModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDimension);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a Dimension by ID
export async function deleteDimension(req, res) {
    try {
        await DimensionshModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Dimension deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export default { createDimension, getAllDimensions, getDimensionById, updateDimension, deleteDimension };
export default { createDimension, getAllDimensions, getDimensionById, updateDimension, deleteDimension };
