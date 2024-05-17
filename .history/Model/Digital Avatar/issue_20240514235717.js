
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  Dimension	Pillars	IssueCategory	IssuesTitle	IssuesMainSource 	SourceCategory	Link	DataAcquisitionProtocolDocumentFormat	PaidSubscription	WordDictionaryWordDictionary 	WordDictionarySearchTerms		Other sources that could be helpful 													
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
