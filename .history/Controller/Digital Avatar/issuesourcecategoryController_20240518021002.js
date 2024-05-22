
import IssueSourceCategory, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../../Model/Digital Avatar/issueSourceCategory.js';

// Create a new IssueSourceCategory
export async function createIssueSourceCategory(req, res) {
    const newIssueSourceCategory = new IssueSourceCategory(req.body);
    try {
        await newIssueSourceCategory.save();
        res.status(201).json(newIssueSourceCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all IssueSourceCategorys
export async function getAllIssueSourceCategorys(req, res) {
    try {
        const issuesourcecategorys = await find();
        res.json(issuesourcecategorys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single IssueSourceCategory by ID
export async function getIssueSourceCategoryById(req, res) {
    try {
        const issuesourcecategory = await findById(req.params.id);
        if (!issuesourcecategory) return res.status(404).json({ message: 'IssueSourceCategory not found' });
        res.json(issuesourcecategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a IssueSourceCategory by ID
export async function updateIssueSourceCategory(req, res) {
    try {
        const updatedIssueSourceCategory = await findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIssueSourceCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a IssueSourceCategory by ID
export async function deleteIssueSourceCategory(req, res) {
    try {
        await findByIdAndDelete(req.params.id);
        res.json({ message: 'IssueSourceCategory deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
