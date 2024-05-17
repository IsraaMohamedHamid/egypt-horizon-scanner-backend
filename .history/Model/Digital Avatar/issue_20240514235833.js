
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  Dimension: { type: String, required: true },
  Pillars: { type: String, required: true },
  IssueCategory: { type: String, required: true },
  IssuesTitle: { type: String, required: true },
  IssuesMainSource: { type: String, required: true },
  SourceCategory: { type: String, required: true },
  Link: { type: String, required: true },
  DataAcquisitionProtocolDocumentFormat: { type: String, required: true },
  PaidSubscription: { type: String, required: true },
  WordDictionaryWordDictionary: { type: String, required: true },
  WordDictionarySearchTerms		OtherHelpfulSources												
  Dimension: { type: String, required: true },
  Pillars: { type: String, required: true },
  IssuesTitle: { type: String, required: true },
  IssuesMainSource: { type: String, required: true },
  SourceCategory: { type: String, required: true },
  Link: { type: String, required: true },
  NotesForDataAcquisitionProtocol: { type: String, required: true },
  WordDictionarySearchTerms: { type: String, required: true },
  OtherSourcesThatCouldBeHelpful: { type: String, required: true }
});

module.exports = mongoose.model('Issue', issueSchema);
