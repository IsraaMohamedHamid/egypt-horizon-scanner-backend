
const IssueSourceCategory = require('../../Model/issueSourceCategory');

// Create a new IssueSourceCategory
exports.createIssueSourceCategory = async (req, res) => {
    const newIssueSourceCategory = new IssueSourceCategory(req.body);
    try {
        await newIssueSourceCategory.save();
        res.status(201).json(newIssueSourceCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all IssueSourceCategorys
exports.getAllIssueSourceCategorys = async (req, res) => {
    try {
        const issuesourcecategorys = await IssueSourceCategory.find();
        res.json(issuesourcecategorys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single IssueSourceCategory by ID
exports.getIssueSourceCategoryById = async (req, res) => {
    try {
        const issuesourcecategory = await IssueSourceCategory.findById(req.params.id);
        if (!issuesourcecategory) return res.status(404).json({ message: 'IssueSourceCategory not found' });
        res.json(issuesourcecategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a IssueSourceCategory by ID
exports.updateIssueSourceCategory = async (req, res) => {
    try {
        const updatedIssueSourceCategory = await IssueSourceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIssueSourceCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a IssueSourceCategory by ID
exports.deleteIssueSourceCategory = async (req, res) => {
    try {
        await IssueSourceCategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'IssueSourceCategory deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
