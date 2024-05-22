
import { dimensionDefinitionSchema,
    DimensionDefinitionhModel} from '../../Model/Digital Avatar/dimensionDefinition.js';

// Create a new DimensionDefinition
export async function createDimensionDefinition(req, res) {
    const newDimensionDefinition = new dimensionDefinitionSchema(req.body);
    try {
        await newDimensionDefinition.save();
        res.status(201).json(newDimensionDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all DimensionDefinitions
export async function getAllDimensionDefinitions(req, res) {
    try {
        const dimensiondefinitions = await DimensionDefinitionhModel.find();
        res.json(dimensiondefinitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single DimensionDefinition by ID
export async function getDimensionDefinitionById(req, res) {
    try {
        const dimensiondefinition = await DimensionDefinitionhModel.findById(req.params.id);
        if (!dimensiondefinition) return res.status(404).json({ message: 'DimensionDefinition not found' });
        res.json(dimensiondefinition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a DimensionDefinition by ID
export async function updateDimensionDefinition(req, res) {
    try {
        const updatedDimensionDefinition = await DimensionDefinitionhModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDimensionDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a DimensionDefinition by ID
export async function deleteDimensionDefinition(req, res) {
    try {
        await DimensionDefinitionhModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'DimensionDefinition deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
