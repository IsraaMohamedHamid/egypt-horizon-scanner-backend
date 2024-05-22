
import mongoose from 'mongoose';

const issueDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});


const IssuesModel =  mongoose.model('IssueDefinition', issueDefinitionSchema);
export default {
  issueSchema,
  IssuesModel
}