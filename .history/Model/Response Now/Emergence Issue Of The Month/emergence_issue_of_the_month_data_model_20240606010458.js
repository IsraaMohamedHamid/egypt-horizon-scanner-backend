
// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const EmergenceIssueOfTheMonthDataSchema= new mongoose.Schema({
    id: {
        type: String
    },
    source: {
        type: String
    },
    sourceCategory: {
        type: String
    },
    issueTitle: {
        type: String
    },
    sentimentAnalysisDictionary:{
        type: Map,  // Using Map for key-value pairs
        of: String,  // Define the type of values in the Map as Number
        default: () => new Map()  // Ensures the default is an empty Map
    },
    sentimentAnalysis: {
        type: String
    },
    repetition: {
        type: Number
    },
    weight: {
        type: Number
    },
    score: {
        type: Number
    },
    emergingIssue: {
        type: String
    },
    language: {
        type: String
    },
    description: {
        type: String
    },
    sdgTargeted: [String],  // This indicates that 'sdgTargeted' is an array of strings
    image: {
        type: String
    },
    summary: {
        type: String
    },
    dimension: {
        type: String
    },
    pillar:{
        type: String
    },
    indicators:{
        type: String
    },
    issuesMainSource:{
        type: String
    },
    sourceCategory:{
        type: String
    },
    link: {
        type: String
    },
    notesForDataAcquisitionProtocol: {
        type: String
    },
    PaidSubscription:{
        type: String
    },
    WordDictionaryWorDDictionary:{
        type: String
    },
    WordDictionarySearcHTerms:{
        type: String
    },
  });



  export const EmergenceIssueOfTheMonthDataModel = mongoose.model('emergence_issue_of_the_month_data', EmergenceIssueOfTheMonthDataSchema, 'emergence_issue_of_the_month_data');


export default {
    EmergenceIssueOfTheMonthDataSchema,
    EmergenceIssueOfTheMonthDataModel
};