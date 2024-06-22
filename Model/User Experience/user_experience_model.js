import mongoose from 'mongoose';

// Create UserExperiences Schema and Model
export const userExperiencesSchema = new mongoose.Schema({
    userExperienceID: {
        type: String,
    },
    userExperienceName: {
        type: String,
    },
    userExperienceInstitution: {
        type: String,
    },
    userExperienceEmail: {
        type: String,
    },
    userExperiencePhone: {
        type: String,
    },
    userExperienceJobTitle: {
        type: String,
    },
    userExperienceImage: {
        type: String,
    },
    userExperienceBio: {
        type: String,
    },
    userExperienceSource: {
        type: String,
    },
    userExperienceStatus: {
        type: String,
    },
    userExperienceBackground: {
        type: String,
    },
    dataSetName: {
        type: String,
    },
    description: {
        type: String,
    },
    comments: {
        type: String,
    },
    indicators: {
        type: [String],
    },
    emergingIssues: {
        type: [String],
    },
    newEmergingIssue: {
        type: String,
    },
    interventionSuggestion: {
        type: String,
    },
    opportunities: {
        type: String,
    },
    threats: {
        type: String,
    },
    programmaticSimulationLink: {
        type: String,
    },
    interventionFinalStatement: {
        type: String,
    },
    caseSummary: {
        type: String,
    },
    timeStamped: {
        type: String,
    },
    lastSeen: {
        type: String,
    },
    lastUpdated: {
        type: String,
    },

})

export const UserExperienceshModel = mongoose.model('user_experiences', userExperiencesSchema, 'user_experiences');

export default {
    userExperiencesSchema,
    UserExperienceshModel
};