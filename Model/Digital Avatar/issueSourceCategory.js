
const mongoose = require('mongoose');

const issueSourceCategorySchema = new mongoose.Schema({
  SourceCategory: { type: String, required: true },
  Examples: { type: String, required: true }
});

module.exports = mongoose.model('IssueSourceCategory', issueSourceCategorySchema);
