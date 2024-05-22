
import mongoose from 'mongoose';

const issueSourceCategorySchema = new mongoose.Schema({
  SourceCategory: { type: String, required: true },
  Examples: { type: String, required: true }
});

export default  mongoose.model('IssueSourceCategory', issueSourceCategorySchema);
