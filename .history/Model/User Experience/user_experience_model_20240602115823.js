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

    // String? dataSetName;
    // String? description;
    // String? comments;
  
    // List<String>? indicators;
    // List<String>? emergingIssues;
    // String? newEmergingIssue;
  
    // String? interventionSuggestion;
    // String? opportunities;
    // String? threats;
    // String? programmaticSimulationLink;
    // String? interventionFinalStatement;
    // String? caseSummary;
})

export const UserExperienceshModel = mongoose.model('user_experiences', userExperiencesSchema, 'user_experiences');

export default {
    userExperiencesSchema,
    UserExperienceshModel
};