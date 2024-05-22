
const IssueDefinition from '../Model/issueDefinition');

// Create a new IssueDefinition
exports.createIssueDefinition = async (req, res) => {
    const newIssueDefinition = new IssueDefinition(req.body);
    try {
        await newIssueDefinition.save();
        res.status(201).json(newIssueDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all IssueDefinitions
exports.getAllIssueDefinitions = async (req, res) => {
    try {
        const issuedefinitions = await IssueDefinition.find();
        res.json(issuedefinitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single IssueDefinition by ID
exports.getIssueDefinitionById = async (req, res) => {
    try {
        const issuedefinition = await IssueDefinition.findById(req.params.id);
        if (!issuedefinition) return res.status(404).json({ message: 'IssueDefinition not found' });
        res.json(issuedefinition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a IssueDefinition by ID
exports.updateIssueDefinition = async (req, res) => {
    try {
        const updatedIssueDefinition = await IssueDefinition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIssueDefinition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a IssueDefinition by ID
exports.deleteIssueDefinition = async (req, res) => {
    try {
        await IssueDefinition.findByIdAndDelete(req.params.id);
        res.json({ message: 'IssueDefinition deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
