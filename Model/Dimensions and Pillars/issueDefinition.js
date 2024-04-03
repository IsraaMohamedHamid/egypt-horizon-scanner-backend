
const mongoose = require('mongoose');

const issueDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

module.exports = mongoose.model('IssueDefinition', issueDefinitionSchema);
