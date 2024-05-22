
// Import Mongoose
import mongoose from 'mongoose';

// Create Event Detail Schema and Model
const EmergenceIssueOfTheMonthDataSchema= new mongoose.Schema({
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
    emergenceIssue: {
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
    }
  });



const EmergenceIssueOfTheMonthDataModel = mongoose.model('emergence_issue_of_the_month_data', EmergenceIssueOfTheMonthDataSchema, 'emergence_issue_of_the_month_data');
export default  {
    EmergenceIssueOfTheMonthDataSchema: EmergenceIssueOfTheMonthDataSchema,
    EmergenceIssueOfTheMonthDataModel: EmergenceIssueOfTheMonthDataModel
};