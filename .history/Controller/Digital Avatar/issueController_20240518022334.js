
import {   issueSchema,
    IssuesModel} from '../../Model/Digital Avatar/issue.js';

// Create a new Issue
export async function createIssue(req, res) {
    const newIssue = new issueSchema(req.body);
    try {
        await newIssue.save();
        res.status(201).json(newIssue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get all Issues
export async function getAllIssues(req, res) {
    try {
        const issues = await IssuesModel.find();
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single Issue by ID
export async function getIssueById(req, res) {
    try {
        const issue = await IssuesModel.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a Issue by ID
export async function updateIssue(req, res) {
    try {
        const updatedIssue = await IssuesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIssue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a Issue by ID
export async function deleteIssue(req, res) {
    try {
        await IssuesModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Issue deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
