
const mongoose from 'mongoose');

export const issueSourceCategorySchema = new mongoose.Schema({
  SourceCategory: { type: String, required: true },
  Examples: { type: String, required: true }
});


export const IssueSourceCategoryModel =  mongoose.model('IssueSourceCategory', issueSourceCategorySchema);

export default {
  issueSourceCategorySchema,
  IssueSourceCategoryModel
}