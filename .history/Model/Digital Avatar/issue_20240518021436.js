
import mongoose from 'mongoose';

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
  WordDictionarySearchTermsSource: { type: [String]},
  WordDictionarySearchTerms: { type: [String]},
  OtherHelpfulSources: { type: String},
});

export default  mongoose.model('Issue', issueSchema);

const DimensionDefinitionhModel =  mongoose.model('DimensionDefinition', dimensionDefinitionSchema);


export default {
  dimensionDefinitionSchema,
  DimensionDefinitionhModel
}