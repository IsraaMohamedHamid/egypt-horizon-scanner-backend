
const Dimension = require('../../Model/Dimensions and Pillars/');

// Create a new Dimension
exports.createDimension = async (req, res) => {
    const newDimension = new Dimension(req.body);
    try {
        await newDimension.save();
        res.status(201).json(newDimension);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Dimensions
exports.getAllDimensions = async (req, res) => {
    try {
        const dimensions = await Dimension.find();
        res.json(dimensions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Dimension by ID
exports.getDimensionById = async (req, res) => {
    try {
        const dimension = await Dimension.findById(req.params.id);
        if (!dimension) return res.status(404).json({ message: 'Dimension not found' });
        res.json(dimension);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Dimension by ID
exports.updateDimension = async (req, res) => {
    try {
        const updatedDimension = await Dimension.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDimension);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Dimension by ID
exports.deleteDimension = async (req, res) => {
    try {
        await Dimension.findByIdAndDelete(req.params.id);
        res.json({ message: 'Dimension deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
