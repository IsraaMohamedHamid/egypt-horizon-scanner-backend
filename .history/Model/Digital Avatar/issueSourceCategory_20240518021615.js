
const mongoose from 'mongoose');

const issueSourceCategorySchema = new mongoose.Schema({
  SourceCategory: { type: String, required: true },
  Examples: { type: String, required: true }
});


const IssueSourceCategoryModel =  export default  mongoose.model('IssueSourceCategory', issueSourceCategorySchema);

export default {
  issueSourceCategorySchema,
  IssueSourceCategoryModel
}