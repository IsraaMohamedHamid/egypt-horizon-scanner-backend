
const Issue from '../../Model/Digital Avatar/issue');

// Create a new Issue
exports.createIssue = async (req, res) => {
    const newIssue = new Issue(req.body);
    try {
        await newIssue.save();
        res.status(201).json(newIssue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Issues
exports.getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Issue by ID
exports.getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Issue by ID
exports.updateIssue = async (req, res) => {
    try {
        const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIssue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Issue by ID
exports.deleteIssue = async (req, res) => {
    try {
        await Issue.findByIdAndDelete(req.params.id);
        res.json({ message: 'Issue deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
