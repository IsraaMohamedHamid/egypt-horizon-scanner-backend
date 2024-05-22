// Import Mongoose
import mongoose from 'mongoose';

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
        type: Object
    },
    summary: {
        type: String
    },
    sources: {
        type: [String]
    }
});


const EmergenceIssueOfTheMonthModel = mongoose.model('emergence_issue_of_the_month', EmergenceIssueOfTheMonthSchema, 'emergence_issue_of_the_month');
export default  {
    EmergenceIssueOfTheMonthSchema: EmergenceIssueOfTheMonthSchema,
    EmergenceIssueOfTheMonthModel: EmergenceIssueOfTheMonthModel
};