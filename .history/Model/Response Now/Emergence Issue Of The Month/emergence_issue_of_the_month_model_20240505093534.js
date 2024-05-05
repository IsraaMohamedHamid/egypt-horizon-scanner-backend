// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Event Detail Schema and Model
const EmergenceIssueOfTheMonthSchema = new Schema({
    emergingIssue: {
        type: String
    },
    repetition: {
        type: Number
    },
    averageWeight: {
        type: Number
    },         
    priority: {
        type: String
    },
    totalDataCount: { 
        type: Number
    },
    positiveSentimentAnalysisDataCount: {
        type: Number
    },
    neutralSentimentAnalysisDataCount: {
        type: Number
    },
    negativeSentimentAnalysisDataCount: {
        type: Number
    },
    time: {
        type: String
    },
    sdgTargeted: {
        type: [String]
    },
    sdgTargetedDictionary: {
        type: Object,  // Here Object means a generic JavaScript object
        default: () => ({})  // Ensures the default is an empty object
    },
    summary: {
        type: String
    },
    sources: {
        type: [String]
    }
});


const EmergenceIssueOfTheMonthModel = mongoose.model('emergence_issue_of_the_month', EmergenceIssueOfTheMonthSchema, 'emergence_issue_of_the_month');
module.exports = {
    EmergenceIssueOfTheMonthSchema: EmergenceIssueOfTheMonthSchema,
    EmergenceIssueOfTheMonthModel: EmergenceIssueOfTheMonthModel
};