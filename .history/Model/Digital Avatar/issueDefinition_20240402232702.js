
const mongoose from 'mongoose');

const issueDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

export default  mongoose.model('IssueDefinition', issueDefinitionSchema);
