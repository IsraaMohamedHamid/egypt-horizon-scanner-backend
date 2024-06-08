// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const EmergenceIssueOfTheMonthSchema = new mongoose.Schema({
    _id: {
        typr: String
    },
    emergingIssue: {
        type: String
    },
    description: {
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
    sdgTargeted: [String],  // This indicates that 'sdgTargeted' is an array of strings
    sdgTargetedDictionary: {
        type: Map,  // Using Map for key-value pairs
        of: Number,  // Define the type of values in the Map as Number
        default: () => new Map()  // Ensures the default is an empty Map
    },
    summary: {
        type: String
    },
    language: {
        type: [String]
    },
    sources: {
        type: [String]
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
    sentimentAnalysisDictionary: {
        type: Map,  // Using Map for key-value pairs
        of: Number,  // Define the type of values in the Map as Number
        default: () => new Map()  // Ensures the default is an empty Map
    },
});

export const EmergenceIssueOfTheMonthModel = mongoose.model('EmergenceIssueOfTheMonth', EmergenceIssueOfTheMonthSchema, 'emergence_issue_of_the_month');

// Exporting the schema and model
export default  { EmergenceIssueOfTheMonthSchema, EmergenceIssueOfTheMonthModel };