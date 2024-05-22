
import { dimensionSchema,
    DimensionshModel } from '../../Model/Digital Avatar/dimension.js';

// Create a new Dimension
export async function createDimension(req, res) {
    const newDimension = new Dimension(req.body);
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
        const updatedDimension = await findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDimension);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a Dimension by ID
export async function deleteDimension(req, res) {
    try {
        await findByIdAndDelete(req.params.id);
        res.json({ message: 'Dimension deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export default { createDimension, getAllDimensions, getDimensionById, updateDimension, deleteDimension };
export default { createDimension, getAllDimensions, getDimensionById, updateDimension, deleteDimension };
