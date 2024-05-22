
import mongoose from 'mongoose';

export const issueDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});


export const IssueDefinitionModel =  mongoose.model('IssueDefinition', issueDefinitionSchema);

export default {
  issueDefinitionSchema,
  IssueDefinitionModel
}