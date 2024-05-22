// Import Mongoose
import mongoose from 'mongoose';

// Remove the declaration of the variable EmergenceIssueOfTheMonthSchema
// const EmergenceIssueOfTheMonthSchema = new mongoose.Schema({

// Create Event Detail Schema and Model
const EmergenceIssueOfTheMonthSchema = new mongoose.Schema({
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
export const EmergenceIssueOfTheMonthSchema = EmergenceIssueOfTheMonthSchema;
export const EmergenceIssueOfTheMonthModel = EmergenceIssueOfTheMonthModel;