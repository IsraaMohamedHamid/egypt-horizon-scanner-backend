
// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const EmergenceIssueOfTheMonthDataSchema= new mongoose.Schema({
    source: {
        type: String
    },
    sourceCategory: {
        type: String
    },
    issueTitle: {
        type: String
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
    // notesForDataAcquisitionProtocol	Column1	WordDictionaryWord Dictionary 	Word Dictionary: Search Terms
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
    }
  });



  export const EmergenceIssueOfTheMonthDataModel = mongoose.model('emergence_issue_of_the_month_data', EmergenceIssueOfTheMonthDataSchema, 'emergence_issue_of_the_month_data');


export default {
    EmergenceIssueOfTheMonthDataSchema,
    EmergenceIssueOfTheMonthDataModel
};