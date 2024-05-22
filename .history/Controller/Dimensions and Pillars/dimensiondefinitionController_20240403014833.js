
const DimensionDefinition from '../../Model/dimensionDefinition');

// Create a new DimensionDefinition
exports.createDimensionDefinition = async (req, res) => {
    const newDimensionDefinition = new DimensionDefinition(req.body);
    try {
        await newDimensionDefinition.save();
        res.status(201).json(newDimensionDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all DimensionDefinitions
exports.getAllDimensionDefinitions = async (req, res) => {
    try {
        const dimensiondefinitions = await DimensionDefinition.find();
        res.json(dimensiondefinitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single DimensionDefinition by ID
exports.getDimensionDefinitionById = async (req, res) => {
    try {
        const dimensiondefinition = await DimensionDefinition.findById(req.params.id);
        if (!dimensiondefinition) return res.status(404).json({ message: 'DimensionDefinition not found' });
        res.json(dimensiondefinition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a DimensionDefinition by ID
exports.updateDimensionDefinition = async (req, res) => {
    try {
        const updatedDimensionDefinition = await DimensionDefinition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDimensionDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a DimensionDefinition by ID
exports.deleteDimensionDefinition = async (req, res) => {
    try {
        await DimensionDefinition.findByIdAndDelete(req.params.id);
        res.json({ message: 'DimensionDefinition deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
