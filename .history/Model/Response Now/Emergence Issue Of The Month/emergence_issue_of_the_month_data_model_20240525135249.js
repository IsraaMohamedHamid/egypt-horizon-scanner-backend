
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
    // Dimension	Pillars	Indicators	Issues title	Issues main source 	Source category	Link	Notes for data acquisition protocol	Column1	Word Dictionary: Word Dictionary 	Word Dictionary: Search Terms
    dimension: {
        type: String
    },
    
  });



  export const EmergenceIssueOfTheMonthDataModel = mongoose.model('emergence_issue_of_the_month_data', EmergenceIssueOfTheMonthDataSchema, 'emergence_issue_of_the_month_data');


export default {
    EmergenceIssueOfTheMonthDataSchema,
    EmergenceIssueOfTheMonthDataModel
};