
import mongoose from 'mongoose';

const issueSourceCategorySchema = new mongoose.Schema({
  SourceCategory: { type: String, required: true },
  Examples: { type: String, required: true }
});

const issueSourceCategory =  mongoose.model('IssueDefinition', issueDefinitionSchema);

export default {
  issueSourceCategorySchema,
  IssueDefinitionModel
}