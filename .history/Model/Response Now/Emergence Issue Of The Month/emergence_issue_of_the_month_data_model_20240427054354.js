
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
    issueString: {
        type: String
    },
    sentimentAnalysis: {
        type: String
    },
    repetition: {
        type: Number
    },
    weight
    emergenceIssue: {
        type: String
    },
    double? weight;
    String? emergenceIssue;
    String? description;
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
    }
  });



const EmergenceIssueOfTheMonthDataModel = mongoose.model('emergence_issue_of_the_month_data', EmergenceIssueOfTheMonthDataSchema, 'emergence_issue_of_the_month_data');
export default  {
    EmergenceIssueOfTheMonthDataSchema: EmergenceIssueOfTheMonthDataSchema,
    EmergenceIssueOfTheMonthDataModel: EmergenceIssueOfTheMonthDataModel
};