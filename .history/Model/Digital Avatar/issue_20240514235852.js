
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  Dimension: { type: String},
  Pillars: { type: String},
  IssueCategory: { type: String},
  IssuesTitle: { type: String},
  IssuesMainSource: { type: String},
  SourceCategory: { type: String},
  Link: { type: String},
  DataAcquisitionProtocolDocumentFormat: { type: String},
  PaidSubscription: { type: String},
  WordDictionaryWordDictionary: { type: String},
  WordDictionarySearchTerms: { type: [String]},
  OtherHelpfulSources: { type: String},										
  Dimension: { type: String},
  Pillars: { type: String},
  IssuesTitle: { type: String},
  IssuesMainSource: { type: String},
  SourceCategory: { type: String},
  Link: { type: String},
  NotesForDataAcquisitionProtocol: { type: String},
  WordDictionarySearchTerms: { type: String},
  OtherSourcesThatCouldBeHelpful: { type: String}
});

module.exports = mongoose.model('Issue', issueSchema);
