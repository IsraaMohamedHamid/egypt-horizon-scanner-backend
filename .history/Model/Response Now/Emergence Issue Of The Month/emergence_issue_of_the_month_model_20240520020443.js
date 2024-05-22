// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
export const EmergenceIssueOfTheMonthSchema = new mongoose.Schema({
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
        type: Map,  // Using Map for key-value pairs instead of a generic object
        of: String,  // Define the type of values in the Map if required
        default: () => new Map()  // Ensures the default is an empty Map
    },
    summary: {
        type: String
    },
    sources: {
        type: [String]
    }
});

export const EmergenceIssueOfTheMonthModel = mongoose.model('EmergenceIssueOfTheMonth', EmergenceIssueOfTheMonthSchema, 'emergence_issue_of_the_month');

// Exporting the schema and model
export default  { EmergenceIssueOfTheMonthSchema, EmergenceIssueOfTheMonthModel };