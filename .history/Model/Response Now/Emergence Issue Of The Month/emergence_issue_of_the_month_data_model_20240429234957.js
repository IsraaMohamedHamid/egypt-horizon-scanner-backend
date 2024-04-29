
// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Event Detail Schema and Model
const EmergenceIssueOfTheMonthDataSchema= new Schema({
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
    description: {
        type: String
    },
    sdgTargeted: {
        type: [String]
    },
    image: {
        type: String
    },
    summary: {
        type: String
    },
    sourceCategory: {
        type: String
    },
  });



const EmergenceIssueOfTheMonthDataModel = mongoose.model('emergence_issue_of_the_month_data', EmergenceIssueOfTheMonthDataSchema, 'emergence_issue_of_the_month_data');
module.exports = {
    EmergenceIssueOfTheMonthDataSchema: EmergenceIssueOfTheMonthDataSchema,
    EmergenceIssueOfTheMonthDataModel: EmergenceIssueOfTheMonthDataModel
};