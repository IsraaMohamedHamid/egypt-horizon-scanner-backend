
import { issueDefinitionSchema,
    IssueDefinitionModel } from '../../Model/Digital Avatar/issueDefinition.js';

// Create a new IssueDefinition
export async function createIssueDefinition(req, res) {
    const newIssueDefinition = new issueDefinitionSchema(req.body);
    try {
        await newIssueDefinition.save();
        res.status(201).json(newIssueDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all IssueDefinitions
export async function getAllIssueDefinitions(req, res) {
    try {
        const issuedefinitions = await IssueDefinitionModel.find();
        res.json(issuedefinitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single IssueDefinition by ID
export async function getIssueDefinitionById(req, res) {
    try {
        const issuedefinition = await IssueDefinitionModel.findById(req.params.id);
        if (!issuedefinition) return res.status(404).json({ message: 'IssueDefinition not found' });
        res.json(issuedefinition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a IssueDefinition by ID
export async function updateIssueDefinition(req, res) {
    try {
        const updatedIssueDefinition = await IssueDefinitionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIssueDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a IssueDefinition by ID
export async function deleteIssueDefinition(req, res) {
    try {
        await IssueDefinitionModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'IssueDefinition deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
